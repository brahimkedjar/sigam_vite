import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store';

type Template = { id: number; name: string; elements: any[] | string; permisId?: string; permisCode?: string };
type TemplatesDb = { byPermisId: Record<string, Template[]>; byPermisCode: Record<string, Template[]>; nextId: number };

@Injectable()
export class TemplatesService {
  private store = new JsonStore<TemplatesDb>('templates.json');

  private getDb(): TemplatesDb {
    const root = this.store.read() as any;
    const db: TemplatesDb = {
      byPermisId: root.byPermisId || {},
      byPermisCode: root.byPermisCode || {},
      nextId: root.nextId || 1
    };
    return db;
  }

  private saveDb(db: TemplatesDb) {
    this.store.write(db as any);
  }

  async listByPermisId(id: string) {
    const db = this.getDb();
    return db.byPermisId[id] || [];
  }

  async listByPermisCode(code: string) {
    const db = this.getDb();
    return db.byPermisCode[code] || [];
  }

  async updateTemplateMeta(templateId: number, meta: Partial<Template>) {
    const db = this.getDb();
    const all: Template[] = [
      ...Object.values(db.byPermisId).flat(),
      ...Object.values(db.byPermisCode).flat()
    ];
    const t = all.find(x => x.id === templateId);
    if (t) {
      Object.assign(t, meta);
      this.saveDb(db);
    }
  }

  async deleteTemplate(templateId: number) {
    const db = this.getDb();
    let changed = false;
    for (const key of Object.keys(db.byPermisId)) {
      const before = db.byPermisId[key] || [];
      const after = before.filter(t => t.id !== templateId);
      if (after.length !== before.length) { db.byPermisId[key] = after; changed = true; }
    }
    for (const key of Object.keys(db.byPermisCode)) {
      const before = db.byPermisCode[key] || [];
      const after = before.filter(t => t.id !== templateId);
      if (after.length !== before.length) { db.byPermisCode[key] = after; changed = true; }
    }
    if (changed) this.saveDb(db);
  }
}

