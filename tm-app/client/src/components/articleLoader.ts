// =============================================================/// File: components/articleLoader.ts
// Loads predefined Arabic articles for a permit and converts
// them into positioned canvas elements
// =============================================================
import { v4 as uuidv4 } from 'uuid';
import type { ArticleItem, PermisElement } from './types';
import PXC5419 from './articles-txm.json';

export async function loadArticlesForPermit(initialData: any): Promise<ArticleItem[]> {
  try {
    if (
      String(initialData?.code_demande || '').toLowerCase().includes('5419') ||
      String(initialData?.code_demande || '').toLowerCase().includes('pxc')
    ) {
      return (PXC5419.articles || []) as ArticleItem[];
    }
  } catch {}
  return (PXC5419.articles || []) as ArticleItem[];
}

// Build positioned elements from (title, content) pairs, inline on one line.
export const toArticleElements = (options: {
  articleIds: string[];
  articles: ArticleItem[];
  yStart: number;
  x: number;
  width: number;
  fontFamily: string;
  textAlign: string;
  direction: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  spacing: number;
}): PermisElement[] => {
  const elements: PermisElement[] = [];
  let currentY = options.yStart;

  options.articleIds.forEach(articleId => {
    const article = options.articles.find(a => a.id === articleId);
    if (!article) return;

    const titleRaw = String(article.title || '').trim();
    const contentRaw = String(article.content || '').trim();
    const title = /[:：]$/.test(titleRaw) ? titleRaw : `${titleRaw} :`;
    const gap = 12; // visual spacing between title and content
    const avgChar = options.fontSize * 0.65; // Arabic glyphs are wider
    const estFromLen = Math.max(avgChar * Math.max(1, title.length + 2), 160); const estTitleWidth = Math.min(options.width * 0.35, estFromLen); const titleLeftX = options.x + (options.width - estTitleWidth); const contentRightX = titleLeftX - gap; const contentWidth = Math.max(10, contentRightX - options.x); const contentX = contentRightX - contentWidth;
    
    // Content element: fills remaining width (render first)
    elements.push({
      id: uuidv4(),
      type: 'text',
      x: contentX,
      y: currentY,
      width: contentWidth,
      text: contentRaw,
      language: 'ar',
      direction: 'rtl',
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      color: '#000000',
      draggable: true,
      textAlign: 'right',
      opacity: 1,
      rotation: 0,
      wrap: 'char',
      lineHeight: options.lineHeight,
      meta: { articleGroup: articleId, part: 'content' }
    });

    // Title element: bold + underline (render after content so it stays on top)
    elements.push({
      id: uuidv4(),
      type: 'text',
      x: titleLeftX,
      y: currentY,
      width: estTitleWidth,
      text: title,
      language: 'ar',
      direction: 'rtl',
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      fontStyle: 'bold',
      textDecoration: 'underline',
      color: '#000000',
      draggable: true,
      textAlign: 'right',
      opacity: 1,
      rotation: 0,
      wrap: 'word',
      lineHeight: options.lineHeight,
      meta: { articleGroup: articleId, part: 'title' }
    });

    const hTitle = calculateTextHeight(title, estTitleWidth, options.fontSize, options.lineHeight);
    const hBody = calculateTextHeight(contentRaw, contentWidth, options.fontSize, options.lineHeight);
    currentY += Math.max(hTitle, hBody) + Math.max(2, options.spacing);
  });

  return elements;
};

// Height estimator for simple pagination safety (RTL-friendly)
const calculateTextHeight = (
  text: string,
  width: number,
  fontSize: number,
  lineHeight: number
): number => {
  const avgCharWidth = fontSize * 0.52; // slightly smaller to over-estimate lines
  const charsPerLine = Math.max(1, Math.floor(width / avgCharWidth));
  const lines = Math.ceil(text.length / charsPerLine);
  return Math.ceil(lines * fontSize * lineHeight) + 2; // +2px safety
};





g
th / Math.max(1, charsPerLine));
  
  // Return exact height without extra spacing
  return lines * fontSize * lineHeight;
};
gth / Math.max(1, charsPerLine));
  
  // Return exact height without extra spacing
  return lines * fontSize * lineHeight;
};

