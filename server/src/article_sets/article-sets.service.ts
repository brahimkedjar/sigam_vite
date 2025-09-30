import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ArticleItem { id: string; title: string; content: string; preselected?: boolean }
export interface ArticleSet { name: string; articles: ArticleItem[] }

@Injectable()
export class ArticleSetsService {
  private baseDir: string;

  constructor() {
    // Prefer repo path server/article_sets; fall back to ./article_sets when running from server/
    const cwd = process.cwd();
    const candidates = [
      path.resolve(cwd, 'server', 'article_sets'),
      path.resolve(cwd, 'article_sets'),
    ];
    const found = candidates.find(p => fs.existsSync(p));
    this.baseDir = found || candidates[0];
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
  }

  private filePath(key: string) {
    const safe = key.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '');
    return path.join(this.baseDir, `${safe}.json`);
  }

  list(): { key: string; name: string }[] {
    const files = fs.readdirSync(this.baseDir).filter(f => f.endsWith('.json'));
    return files.map(f => {
      const key = path.basename(f, '.json');
      try {
        const raw = fs.readFileSync(path.join(this.baseDir, f), 'utf8');
        const data = JSON.parse(raw);
        const name: string = data.name || data.templateName || key;
        return { key, name };
      } catch {
        return { key, name: key };
      }
    });
  }

  get(key: string): ArticleSet {
    const file = this.filePath(key);
    if (!fs.existsSync(file)) throw new NotFoundException('Set not found');
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    const name: string = data.name || data.templateName || key;
    const articles: ArticleItem[] = Array.isArray(data.articles) ? data.articles : [];
    return { name, articles };
  }

  upsert(key: string, set: ArticleSet) {
    if (!set?.name) throw new BadRequestException('name required');
    if (!Array.isArray(set?.articles)) throw new BadRequestException('articles must be array');
    const file = this.filePath(key);
    fs.writeFileSync(file, JSON.stringify({ name: set.name, articles: set.articles }, null, 2), 'utf8');
    return { key, name: set.name };
  }

  importFromBody(payload: any) {
    const name: string = payload?.name || payload?.templateName;
    if (!name) throw new BadRequestException('name or templateName required');
    const key = name.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '');
    const articles: ArticleItem[] = Array.isArray(payload?.articles) ? payload.articles : [];
    return this.upsert(key, { name, articles });
  }

  remove(key: string) {
    const file = this.filePath(key);
    if (!fs.existsSync(file)) throw new NotFoundException('Set not found');
    fs.unlinkSync(file);
    return { key };
  }
}
