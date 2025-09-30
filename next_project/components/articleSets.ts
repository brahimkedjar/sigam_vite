"use client";
import type { ArticleItem } from "./types";
import PXC5419 from "./permis-5419-pxc.json";

export type ArticleSetMeta = {
  key: string;
  name: string;
  source: "static" | "custom";
};

type ArticleSetData = {
  name: string;
  articles: ArticleItem[];
};

const STATIC_SETS: Record<string, ArticleSetData> = {
  "permis-5419-pxc": { name: "Permis 5419 PXC", articles: (PXC5419 as any).articles || [] },
};

const CUSTOM_KEY = "customArticleSets";

function readCustom(): Record<string, ArticleSetData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return {};
}

function writeCustom(data: Record<string, ArticleSetData>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(data));
  } catch {}
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export function listArticleSets(): ArticleSetMeta[] {
  // synchronous fallback listing (static + local)
  const out: ArticleSetMeta[] = [];
  Object.entries(STATIC_SETS).forEach(([key, v]) => out.push({ key, name: v.name, source: 'static' }));
  const custom = readCustom();
  Object.entries(custom).forEach(([key, v]) => out.push({ key, name: v.name, source: 'custom' }));
  // async server listing can be fetched by UI if needed; here we return fallback + let UI refresh if needed
  return out;
}

export async function listServerArticleSets(): Promise<ArticleSetMeta[]> {
  const res = await fetch(`${apiBase}/api/article-sets`);
  if (!res.ok) throw new Error('Failed to list server article sets');
  const data = await res.json();
  return (data || []).map((x: any) => ({ key: x.key, name: x.name, source: 'custom' as const }));
}

export async function getArticlesForSet(key: string): Promise<ArticleItem[]> {
  if (STATIC_SETS[key]) return (STATIC_SETS[key].articles || []) as ArticleItem[];
  try {
    const res = await fetch(`${apiBase}/api/article-sets/${encodeURIComponent(key)}`);
    if (res.ok) {
      const data = await res.json();
      return (data?.articles || []) as ArticleItem[];
    }
  } catch {}
  const custom = readCustom();
  return (custom[key]?.articles || []) as ArticleItem[];
}

export async function saveArticleSet(key: string, name: string, articles: ArticleItem[]) {
  try {
    const res = await fetch(`${apiBase}/api/article-sets/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, articles })
    });
    if (!res.ok) throw new Error('Failed to save on server');
    return;
  } catch {
    const custom = readCustom();
    custom[key] = { name, articles };
    writeCustom(custom);
  }
}

export function deleteArticleSet(key: string) {
  const custom = readCustom();
  if (custom[key]) {
    delete custom[key];
    writeCustom(custom);
  }
}

export function exportArticleSet(name: string, articles: ArticleItem[]) {
  const blob = new Blob([JSON.stringify({ name, articles }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name.replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importArticleSet(file: File): Promise<{ key: string; name: string } | null> {
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    // Try server first
    try {
      const res = await fetch(`${apiBase}/api/article-sets/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return (await res.json()) as { key: string; name: string };
    } catch {}
    // Fallback to local storage
    const name: string = data.name || data.templateName || file.name.replace(/\.json$/i, "");
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const articles: ArticleItem[] = Array.isArray(data.articles) ? data.articles : [];
    const custom = readCustom();
    custom[key] = { name, articles };
    writeCustom(custom);
    return { key, name };
  } catch (e) {
    console.error('Failed to import article set', e);
    return null;
  }
}

export function inferDefaultArticleSetKey(initialData: any, sets: ArticleSetMeta[]): string {
  const code = String(initialData?.code_demande || "").toLowerCase();
  const type = String(initialData?.typePermis?.lib_type || "").toLowerCase();
  // try direct match on known static key
  if (code.includes("5419") || code.includes("pxc") || type.includes("pxc")) {
    if (sets.some(s => s.key === "permis-5419-pxc")) return "permis-5419-pxc";
  }
  // fallback to first available
  return sets[0]?.key || "permis-5419-pxc";
}
