// =============================================================
// File: data/articleLoader.ts
// Loads predefined Arabic articles for a permit and converts
// them into positioned canvas elements
// =============================================================
import { v4 as uuidv4 } from 'uuid';
import type { ArticleItem, PermisElement } from './types';
// NOTE: adjust this import path to wherever you place the JSON file(s)
import PXC5419 from './permis-5419-pxc.json';

export async function loadArticlesForPermit(initialData: any): Promise<ArticleItem[]> {
  // You can branch by typePermis, code_demande, or other fields
  // Here we return the 5419 PXC set if code matches, else empty
  try {
    if (
      String(initialData?.code_demande || '').toLowerCase().includes('5419') ||
      String(initialData?.code_demande || '').toLowerCase().includes('pxc')
    ) {
      return (PXC5419.articles || []) as ArticleItem[];
    }
  } catch (e) {
    // ignore
  }
  return (PXC5419.articles || []) as ArticleItem[]; // fallback: provide something
}
// File: data/articleLoader.ts
// In articleLoader.ts - update the toArticleElements function
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
    
    // Calculate text height more accurately
    const titleHeight = calculateTextHeight(
      article.title || '',
      options.width,
      options.fontSize + 2,
      options.lineHeight
    );
    
    const contentHeight = calculateTextHeight(
      article.content || '',
      options.width,
      options.fontSize,
      options.lineHeight
    );
    
    // Article title - reduced spacing
    const titleElement: PermisElement = {
      id: uuidv4(),
      type: 'text',
      x: options.x,
      y: currentY,
      width: options.width,
      text: article.title || 'عنوان المادة',
      language: 'ar',
      direction: 'rtl',
      fontSize: options.fontSize + 2,
      fontFamily: options.fontFamily,
      color: '#1a5276',
      draggable: true,
      textAlign: 'right',
      opacity: 1,
      rotation: 0,
      wrap: 'word',
      lineHeight: options.lineHeight,
      fontWeight: 'bold'
    };
    elements.push(titleElement);
    
    // Reduced spacing between title and content
    currentY += titleHeight + (options.spacing / 2); // Reduced from full spacing
    
    // Article content
    const contentElement: PermisElement = {
      id: uuidv4(),
      type: 'text',
      x: options.x,
      y: currentY,
      width: options.width,
      text: article.content || 'محتوى المادة',
      language: 'ar',
      direction: 'rtl',
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      color: '#000000',
      draggable: true,
      textAlign: 'right',
      opacity: 1,
      rotation: 0,
      wrap: 'word',
      lineHeight: options.lineHeight
    };
    elements.push(contentElement);
    
    // Reduced spacing after article
    currentY += contentHeight + (options.spacing / 2); // Reduced from spacing * 2
  });
  
  return elements;
};

// Update the calculateTextHeight function to be more precise
const calculateTextHeight = (
  text: string, 
  width: number, 
  fontSize: number, 
  lineHeight: number
): number => {
  // For Arabic text, estimate lines more accurately
  const avgCharWidth = fontSize * 0.55;
  const charsPerLine = Math.floor(width / avgCharWidth);
  const lines = Math.ceil(text.length / Math.max(1, charsPerLine));
  
  // Return exact height without extra spacing
  return lines * fontSize * lineHeight;
};

