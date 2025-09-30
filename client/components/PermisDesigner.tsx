'use client';
import QRCode from "qrcode";
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import {
  FiDownload, FiSave, FiEdit2, FiMove, FiType,
  FiTrash2, FiCopy, FiLayers, FiChevronLeft, FiChevronRight, FiGrid,
  FiChevronUp, FiChevronDown, FiRefreshCw, FiCheckCircle, FiAlertCircle,
  FiUpload
} from 'react-icons/fi';
import { BsTextParagraph, BsImage, BsBorderWidth } from 'react-icons/bs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-toastify';
// @ts-ignore - side-effect CSS import has no type declarations in this project
import 'react-toastify/dist/ReactToastify.css';
import { ElementRenderer } from './ElementRenderer';
import type { PermisElement, PermisDesignerProps, TextEditOverlay, ArticleItem } from './types';
import { ArticlesPanel } from './ArticlesPanel';
import { toArticleElements } from './articleLoader';
import { listArticleSets, getArticlesForSet, saveArticleSet, exportArticleSet, importArticleSet, inferDefaultArticleSetKey, type ArticleSetMeta } from './articleSets';
import { FONT_FAMILIES, ARABIC_FONTS, DEFAULT_CANVAS } from './constants';
import { gridBackground, clamp } from './layout';
import { AiOutlineQrcode } from "react-icons/ai";
import styles from './PermisDesigner.module.css';
import jsPDF from 'jspdf';
import { Upload } from "antd";
import { FileUp } from "lucide-react";

const PAGES = {
  PERMIS_DETAILS: 0,
  COORDINATES: 1,
  ARTICLES: 2
} as const;

type TransformerBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface QRCodeData {
  typePermis: string;
  codeDemande: string;
  detenteur: string;
  superficie: number;
  duree: string;
  localisation: string;
  dateCreation: string;
  coordinates?: any[];
}

type PermisPages = PermisElement[][];

const PermisDesigner: React.FC<PermisDesignerProps> = ({
  initialData,
  onSave,
  onGeneratePdf,
  onSavePermis,
  procedureId
}) => {
  const [pages, setPages] = useState<PermisPages>([[], [], []]);
  const [currentPage, setCurrentPage] = useState<number>(PAGES.PERMIS_DETAILS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tool, setTool] = useState<'select' | 'text' | 'rectangle' | 'image' | 'line' | 'qrcode'>('select');
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState<PermisPages[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [articleSets, setArticleSets] = useState<ArticleSetMeta[]>([]);
  const [selectedArticleSet, setSelectedArticleSet] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [textOverlay, setTextOverlay] = useState<TextEditOverlay | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [canvasSizes, setCanvasSizes] = useState<{width: number, height: number}[]>([
    {width: DEFAULT_CANVAS.width, height: DEFAULT_CANVAS.height},
    {width: DEFAULT_CANVAS.width, height: DEFAULT_CANVAS.height},
    {width: DEFAULT_CANVAS.width * 2, height: DEFAULT_CANVAS.height}
  ]);
  const [savedPermisId, setSavedPermisId] = useState<number | null>(null);
  const [savingPermis, setSavingPermis] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [permisCode, setPermisCode] = useState<string | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const currentCanvasSize = canvasSizes[currentPage] || canvasSizes[0] || { width: DEFAULT_CANVAS.width, height: DEFAULT_CANVAS.height };

  const handleRefreshTemplates = useCallback(async () => {
    if (!savedPermisId) {
      toast.error('No permis found to refresh templates');
      return;
    }
    setLoadingTemplates(true);
    try {
      const templatesResponse = await axios.get(`${apiURL}/api/permis/${savedPermisId}/templates`);
      const templatesData = Array.isArray(templatesResponse.data) ? templatesResponse.data : [];
      const parsedTemplates = templatesData.map(template => ({
        ...template,
        elements: typeof template.elements === 'string'
          ? JSON.parse(template.elements)
          : template.elements || []
      }));
      setTemplates(parsedTemplates);
      toast.success('Templates refreshed successfully');
    } catch (error) {
      console.error('Error refreshing templates:', error);
      toast.error('Failed to refresh templates');
    } finally {
      setLoadingTemplates(false);
    }
  }, [savedPermisId, apiURL]);

  // Removed duplicate initialization effect to avoid pages reset during edits

  function createPermisDetailsPage(data: any): PermisElement[] {
    const borderElements = createPageBorder(DEFAULT_CANVAS.width, DEFAULT_CANVAS.height);
    const contentElements = createDefaultGeneralPage(data);
    return [...borderElements, ...contentElements];
  }

  function createCoordinatesPage(data: any): PermisElement[] {
    const borderElements = createPageBorder(DEFAULT_CANVAS.width, DEFAULT_CANVAS.height);
    const contentElements = createCoordsPage(data);
    return [...borderElements, ...contentElements];
  }

  function createArticlesPage(data: any, size?: { width: number; height: number }): PermisElement[] {
    const width = size?.width ?? (DEFAULT_CANVAS.width * 2);
    const height = size?.height ?? DEFAULT_CANVAS.height;
    const borderElements = createPageBorder(width, height);
    const contentElements = createArticlesPageHeader(width, height);
    return [...borderElements, ...contentElements];
  }

  function filterElementsByPage(elements: PermisElement[], pageIndex: number): PermisElement[] {
    if (!elements || !elements.length) return [];
    return elements.filter(el => el.meta?.pageIndex === pageIndex);
  }

    const pushHistory = useCallback((snap: PermisPages) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const next = [...trimmed, JSON.parse(JSON.stringify(snap)) as PermisPages];
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  const handleResizeCanvas = useCallback((direction: 'width' | 'height', amount: number) => {
    setCanvasSizes(prev => {
      const newSizes = [...prev];
      const currentSize = newSizes[currentPage];
      const newSize = {
        width: direction === 'width' ? Math.max(currentSize.width + amount, 300) : currentSize.width,
        height: direction === 'height' ? Math.max(currentSize.height + amount, 300) : currentSize.height
      };
      newSizes[currentPage] = newSize;
      setPages(prevP => {
        let newP = [...prevP] as PermisPages;
        // Clamp elements
        newP[currentPage] = newP[currentPage].map(el => ({
          ...el,
          x: Math.min(el.x, newSize.width - (el.width || 50)),
          y: Math.min(el.y, newSize.height - (el.height || 50))
        }));
        // Update borders
        newP[currentPage] = newP[currentPage].filter(el => !el.meta?.isBorder);
        const newBorders = createPageBorder(newSize.width, newSize.height);
        newP[currentPage] = [...newP[currentPage], ...newBorders];
        pushHistory(newP);
        return newP;
      });
      return newSizes;
    });
  }, [currentPage, pushHistory]);

  const handleResetCanvasSize = useCallback(() => {
    setCanvasSizes(prev => {
      const newSizes = [...prev];
      newSizes[currentPage] = currentPage === PAGES.ARTICLES
        ? {width: DEFAULT_CANVAS.width * 2, height: DEFAULT_CANVAS.height}
        : {width: DEFAULT_CANVAS.width, height: DEFAULT_CANVAS.height};
      setPages(prevP => {
        let newP = [...prevP] as PermisPages;
        newP[currentPage] = newP[currentPage].filter(el => !el.meta?.isBorder);
        const newBorders = createPageBorder(newSizes[currentPage].width, newSizes[currentPage].height);
        newP[currentPage] = [...newP[currentPage], ...newBorders];
        pushHistory(newP);
        return newP;
      });
      return newSizes;
    });
  }, [currentPage, pushHistory]);

  // Fixed createPageBorder function
function createPageBorder(width: number, height: number): PermisElement[] {
  const borderColor = '#1a5276';
  const borderWidth = 2;
  const dashPattern = [0.8, 0.4];
  const borders = [
    {
      id: uuidv4(),
      type: 'rectangle' as const,  // Added 'as const' for literal type inference
      x: 10,
      y: 10,
      width: width - 15,
      height: height - 15,
      stroke: borderColor,
      strokeWidth: borderWidth,
      fill: 'transparent',
      dash: dashPattern,
      draggable: false,
      meta: { isBorder: true }
    },
    {
      id: uuidv4(),
      type: 'rectangle' as const,  // Added 'as const' for literal type inference
      x: 20,
      y: 20,
      width: width - 35,
      height: height - 35,
      stroke: borderColor,
      strokeWidth: 1,
      fill: 'transparent',
      draggable: false,
      opacity: 0.6,
      meta: { isBorder: true }
    },
    ...createCornerDecorations(borderColor, width, height)
  ];
  return borders;
}

// Fixed createCornerDecorations function
function createCornerDecorations(color: string, width: number, height: number): PermisElement[] {
  const size = 30;
  return [
    {
      id: uuidv4(),
      type: 'line' as const,  // Added 'as const' for literal type inference
      x: 40,
      y: 40,
      points: [0, 0, size, size],
      stroke: color,
      strokeWidth: 2,
      dash: [5, 3],
      draggable: false,
      meta: { isBorder: true }
    },
    {
      id: uuidv4(),
      type: 'line' as const,  // Added 'as const' for literal type inference
      x: width - 40,
      y: 40,
      points: [0, 0, -size, size],
      stroke: color,
      strokeWidth: 2,
      dash: [5, 3],
      draggable: false,
      meta: { isBorder: true }
    },
    {
      id: uuidv4(),
      type: 'line' as const,  // Added 'as const' for literal type inference
      x: 40,
      y: height - 40,
      points: [0, 0, size, -size],
      stroke: color,
      strokeWidth: 2,
      dash: [5, 3],
      draggable: false,
      meta: { isBorder: true }
    },
    {
      id: uuidv4(),
      type: 'line' as const,  // Added 'as const' for literal type inference
      x: width - 40,
      y: height - 40,
      points: [0, 0, -size, -size],
      stroke: color,
      strokeWidth: 2,
      dash: [5, 3],
      draggable: false,
      meta: { isBorder: true }
    }
  ];
}

  const handleRenameTemplate = useCallback(async (templateId: number, newName: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;
      await axios.patch(`${apiURL}/api/permis/templates/${templateId}`, {
        name: newName
      });
      if (savedPermisId) {
        const templatesResponse = await axios.get(`${apiURL}/api/permis/${savedPermisId}/templates`);
        setTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
      }
      toast.success('Template renamed successfully');
    } catch (error) {
      console.error('Failed to rename template:', error);
      toast.error('Failed to rename template');
    }
  }, [templates, savedPermisId, apiURL]);

  
 const insertArticlesAsElements = useCallback((articleIds: string[], source: ArticleItem[]) => {
  const gutter = 40;
  const padding = 3;
  const spacing = 0;
  const contentX = 40;
  const startY = 130;

  // Helper to get size for a given absolute page index
  const getSize = (absIndex: number) => canvasSizes[absIndex] || canvasSizes[PAGES.ARTICLES] || { width: DEFAULT_CANVAS.width * 2, height: DEFAULT_CANVAS.height };

  // Collect blocks per article page (relative index 0 => page 2)
  const perPageBlocks: PermisElement[][] = [];
  const columnsByPage: { x: number; width: number; currentY: number; bottom: number }[][] = [];

  const ensurePageArrays = (relPage: number) => {
    if (!perPageBlocks[relPage]) perPageBlocks[relPage] = [];
    if (!columnsByPage[relPage]) {
      const absIndex = PAGES.ARTICLES + relPage;
      const size = getSize(absIndex);
      const contentWidth = size.width - 80;
      const columnWidth = (contentWidth - gutter) / 2;
      const bottom = size.height - 0;
      columnsByPage[relPage] = [
        { x: contentX + columnWidth + gutter, width: columnWidth, currentY: startY, bottom },
        { x: contentX, width: columnWidth, currentY: startY, bottom }
      ];
    }
  };

  let relPage = 0; // 0 => absolute pageIndex 2
  let currentColumn = 0; // 0 => right, 1 => left
  ensurePageArrays(relPage);

  articleIds.forEach((articleId) => {
    const article = source.find(a => a.id === articleId);
    if (!article) return;

    const size = getSize(PAGES.ARTICLES + relPage);
    const contentWidth = size.width - 80;
    const columnWidth = (contentWidth - gutter) / 2;

    const articleElements = toArticleElements({
      articleIds: [articleId],
      articles: source,
      yStart: 0,
      x: 0,
      width: columnWidth - padding * 2,
      fontFamily: ARABIC_FONTS[0],
      textAlign: 'right',
      direction: 'rtl',
      fontSize: 20,
      lineHeight: 1.4,
      padding: padding,
      spacing: spacing,
    });
    if (articleElements.length === 0) return;

    // Estimate article block height
    let articleHeight = 0;
    articleElements.forEach(el => {
      if (el.type === 'text') {
        const fontSize = el.fontSize || 20;
        const lineHeight = el.lineHeight || 1.4;
        const text = el.text || '';
        const avgCharsPerLine = Math.floor((columnWidth - padding * 2) / (fontSize * 0.55));
        const lines = Math.ceil(text.length / Math.max(1, avgCharsPerLine));
        articleHeight += Math.max(25, lines * fontSize * lineHeight + (padding * 2));
      } else {
        articleHeight += el.height || 25;
      }
    });
    articleHeight += spacing;

    let cols = columnsByPage[relPage];
    let col = cols[currentColumn];
    // If it doesn't fit in current column, try the other
    if (col.currentY + articleHeight > col.bottom) {
      if (currentColumn === 0) {
        currentColumn = 1;
        col = cols[currentColumn];
        col.currentY = startY;
      }
    }
    // If still doesn't fit, move to new page
    if (col.currentY + articleHeight > col.bottom) {
      relPage += 1;
      ensurePageArrays(relPage);
      currentColumn = 0;
      cols = columnsByPage[relPage];
      col = cols[currentColumn];
    }

    const positioned = articleElements.map(el => {
      const elWidth = el.width || (columnWidth - padding * 2);
      const elementX = col.x + col.width - elWidth - padding;
      return {
        ...el,
        x: elementX,
        y: col.currentY + (el.y || 0),
        isArticle: true,
        direction: 'rtl',
        textAlign: 'right',
        language: 'ar',
        wrap: 'word',
        padding: padding,
        width: elWidth,
        meta: { ...(el.meta || {}), pageIndex: PAGES.ARTICLES + relPage, isArticle: true }
      } as PermisElement;
    });

    perPageBlocks[relPage].push(...positioned);
    col.currentY += articleHeight;
  });

  const neededArticlePages = Math.max(1, perPageBlocks.length);

  // Commit to state: ensure page arrays and canvas sizes, then place content
  setPages(prev => {
    let next = [...prev] as PermisPages;
    // Ensure enough pages
    while (next.length < PAGES.ARTICLES + neededArticlePages) {
      const base = canvasSizes[PAGES.ARTICLES] || { width: DEFAULT_CANVAS.width * 2, height: DEFAULT_CANVAS.height };
      next.push(createArticlesPage(initialData, base));
    }
    // Trim extra article pages if any
    if (next.length > PAGES.ARTICLES + neededArticlePages) {
      next = next.slice(0, PAGES.ARTICLES + neededArticlePages);
    }
    // For each article page, keep non-article elements and add blocks
    for (let rp = 0; rp < neededArticlePages; rp++) {
      const absIdx = PAGES.ARTICLES + rp;
      const keep = (next[absIdx] || []).filter(el => !el.isArticle && !el.meta?.isArticle);
      next[absIdx] = [...keep, ...(perPageBlocks[rp] || [])];
    }
    pushHistory(JSON.parse(JSON.stringify(next)) as PermisPages);
    return next;
  });

  // Keep canvasSizes in sync
  setCanvasSizes(prev => {
    let sizes = [...prev];
    while (sizes.length < PAGES.ARTICLES + neededArticlePages) {
      const base = prev[PAGES.ARTICLES] || { width: DEFAULT_CANVAS.width * 2, height: DEFAULT_CANVAS.height };
      sizes.push({ width: base.width, height: base.height });
    }
    if (sizes.length > PAGES.ARTICLES + neededArticlePages) {
      sizes = sizes.slice(0, PAGES.ARTICLES + neededArticlePages);
    }
    return sizes;
  });
}, [pushHistory, canvasSizes, initialData]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!initialData) return;
      try {
        const permisResponse = await axios.get(`${apiURL}/api/permis/procedure/${procedureId}/permis`);
        if (permisResponse.data.exists) {
          const { permisId, permisCode } = permisResponse.data;
          if (!mounted) return;
          setSavedPermisId(permisId);
          setPermisCode(permisCode);
          const resp = await axios.get(`${apiURL}/api/permis/${permisId}/templates`);
          const serverTemplates = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
          if (!mounted) return;
          setTemplates(serverTemplates);
          const lastUsedTemplateId = localStorage.getItem(`lastTemplate_${permisCode}`);
          const numericTemplateId = lastUsedTemplateId ? parseInt(lastUsedTemplateId, 10) : null;
          const defaultTemplate = serverTemplates.find((t: { id: number }) => t.id === numericTemplateId) || serverTemplates[0];
          setActiveTemplate(defaultTemplate?.id ?? null);
          const buildPages = (template?: typeof defaultTemplate): PermisPages => {
            if (!template?.elements?.length) {
              return [
                createPermisDetailsPage(initialData),
                createCoordinatesPage(initialData),
                createArticlesPage(initialData)
              ];
            }
            let templateElements: PermisElement[] = [];
            if (typeof template.elements === 'string') {
              templateElements = JSON.parse(template.elements);
            } else if (Array.isArray(template.elements)) {
              templateElements = template.elements;
            }
            return [
              filterElementsByPage(templateElements, 0) || createPermisDetailsPage(initialData),
              filterElementsByPage(templateElements, 1) || createCoordinatesPage(initialData),
              filterElementsByPage(templateElements, 2) || createArticlesPage(initialData)
            ];
          };
          const initialPages = buildPages(defaultTemplate);
          let sets = listArticleSets();
          try {
            const serverSets = await (await import('./articleSets')).listServerArticleSets();
            const merged = [...sets];
            serverSets.forEach(s => { if (!merged.some(m => m.key === s.key)) merged.push(s); });
            sets = merged;
          } catch {}
          setArticleSets(sets);
          const defKey = inferDefaultArticleSetKey(initialData, sets);
          setSelectedArticleSet(defKey);
          const loadedArticles = await getArticlesForSet(defKey);
          if (!mounted) return;
          setArticles(loadedArticles);
          const preselected = loadedArticles.filter(a => (a as any).preselected).map(a => a.id);
          setSelectedArticleIds(preselected);
          if (preselected.length) {
            insertArticlesAsElements(preselected, loadedArticles);
          }
          setPages(JSON.parse(JSON.stringify(initialPages)));
          pushHistory(JSON.parse(JSON.stringify(initialPages)));
        } else {
          if (!mounted) return;
          setTemplates([]);
          setActiveTemplate(null);
          const fallback: PermisPages = [
            createPermisDetailsPage(initialData),
            createCoordinatesPage(initialData),
            createArticlesPage(initialData)
          ];
          setPages(fallback);
          pushHistory(fallback);
          let sets = listArticleSets();
          try { const serverSets = await (await import('./articleSets')).listServerArticleSets();
            const merged = [...sets]; serverSets.forEach(s => { if (!merged.some(m => m.key === s.key)) merged.push(s); }); sets = merged; } catch {}
          setArticleSets(sets);
          const defKey = inferDefaultArticleSetKey(initialData, sets);
          getArticlesForSet(defKey).then(a => {
            if (!mounted) return;
            setArticles(a);
          }).catch(() => {});
        }
      } catch (err) {
        console.error('Init error', err);
        if (!mounted) return;
        setTemplates([]);
        setActiveTemplate(null);
        const fallback: PermisPages = [
          createPermisDetailsPage(initialData),
          createCoordinatesPage(initialData),
          createArticlesPage(initialData)
        ];
        setPages(fallback);
        pushHistory(fallback);
        let sets = listArticleSets();
        try { const serverSets = await (await import('./articleSets')).listServerArticleSets();
          const merged = [...sets]; serverSets.forEach(s => { if (!merged.some(m => m.key === s.key)) merged.push(s); }); sets = merged; } catch {}
        setArticleSets(sets);
        const defKey = inferDefaultArticleSetKey(initialData, sets);
        getArticlesForSet(defKey).then(a => {
          if (!mounted) return;
          setArticles(a);
        }).catch(() => {});
      }
    };
    load();
    return () => { mounted = false; };
  }, [initialData, procedureId, apiURL]);

  const changeArticleSet = useCallback(async (key: string) => {
    setSelectedArticleSet(key);
    try {
      const a = await getArticlesForSet(key);
      setArticles(a);
      const ids = a.filter(x => (x as any).preselected).map(x => x.id);
      setSelectedArticleIds(ids);
      insertArticlesAsElements(ids, a);
    } catch (e) {
      console.error('Failed to load article set', e);
    }
  }, [insertArticlesAsElements]);

  useEffect(() => {
    if (!transformerRef.current) return;
    if (selectedIds.length > 0) {
      const nodes = selectedIds.map(id => stageRef.current?.findOne(`#${id}`)).filter(Boolean);
      transformerRef.current.nodes(nodes);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds, currentPage, pages]);

  useHotkeys('delete', () => handleDeleteSelected(), [pages, currentPage, selectedIds]);
  useHotkeys('ctrl+z, cmd+z', () => undo(), [history, historyIndex]);
  useHotkeys('ctrl+y, cmd+y', () => redo(), [history, historyIndex]);
  useHotkeys('ctrl+c, cmd+c', () => handleCopySelected(), [pages, currentPage, selectedIds]);
  useHotkeys('ctrl+v, cmd+v', () => handlePasteSelected(), [pages, currentPage]);
  useHotkeys('esc', () => setTextOverlay(null), []);

  const undo = useCallback(() => {
    setHistoryIndex(idx => {
      if (idx > 0) {
        setPages(history[idx - 1]);
        setSelectedIds([]);
        return idx - 1;
      }
      return idx;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex(idx => {
      if (idx < history.length - 1) {
        setPages(history[idx + 1]);
        setSelectedIds([]);
        return idx + 1;
      }
      return idx;
    });
  }, [history]);
function createDefaultGeneralPage(data: any): PermisElement[] {
  const contentElements: PermisElement[] = [
    // Vertical line on the right side
    {
      id: uuidv4(), type: 'line', x: 750, y: 30, width: 0, height: 300,
      stroke: '#000000', strokeWidth: 1, dash: [5, 5], draggable: true, opacity: 1, rotation: 0
    },
    
    // Algerian Republic - Arabic (top center)
    {
      id: uuidv4(), type: 'text', x: 200, y: 40, width: 400,
      text: 'الجمهورية الجزائرية الديمقراطية الشعبية',
      language: 'ar', direction: 'rtl',
      fontSize: 20, fontFamily: ARABIC_FONTS[0], color: '#000000', draggable: true,
      textAlign: 'center', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Algerian Republic - French (below Arabic)
    {
      id: uuidv4(), type: 'text', x: 200, y: 70, width: 400, 
      text: 'REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE',
      fontSize: 16, fontFamily: 'Arial', color: '#000000', draggable: true, 
      textAlign: 'center', opacity: 1, rotation: 0, padding: 5
    },
    
    // Separator line under title
    {
      id: uuidv4(), type: 'line', x: 200, y: 110, width: 400, height: 2,
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Ministry - French (left side)
     {
      id: uuidv4(), type: 'text', x: 50, y: 160, width: 300,
      text: 'MINISTERE DE L\'INDUSTRIE',
      language: 'fr', direction: 'ltr',
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', draggable: true,
      textAlign: 'left', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Ministry - French Part 2 (left side, below part 1)
    {
      id: uuidv4(), type: 'text', x: 100, y: 185, width: 300,
      text: 'ET DES MINES',
      language: 'fr', direction: 'ltr',
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', draggable: true,
      textAlign: 'left', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Ministry - Arabic (right side)
    {
      id: uuidv4(), type: 'text', x: 450, y: 160, width: 300,
      text: 'وزارة الصناعة و المناجم',
      language: 'ar', direction: 'rtl',
      fontSize: 22, fontFamily: ARABIC_FONTS[0], color: '#000000', draggable: true,
      textAlign: 'right', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Horizontal separator line
    {
      id: uuidv4(), type: 'line', x: 50, y: 210, width: 700, height: 2,
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Agency - French (left side)
    {
      id: uuidv4(), type: 'text', x: 50, y: 230, width: 300,
      text: 'Agence Nationale des Activités',
      language: 'fr', direction: 'ltr',
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', draggable: true,
      textAlign: 'left', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    {
      id: uuidv4(), type: 'text', x: 120, y: 255, width: 300,
      text: 'Minières',
      language: 'fr', direction: 'ltr',
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', draggable: true,
      textAlign: 'left', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Agency - Arabic (right side)
    {
      id: uuidv4(), type: 'text', x: 450, y: 235, width: 300,
      text: 'الوكالة الوطنية للنشاطات المنجمية',
      language: 'ar', direction: 'rtl',
      fontSize: 22, fontFamily: ARABIC_FONTS[0], color: '#000000', draggable: true,
      textAlign: 'right', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Horizontal separator line
    {
      id: uuidv4(), type: 'line', x: 50, y: 280, width: 700, height: 2,
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Permit Type (centered, larger text) - Moved down to fill space
    {
      id: uuidv4(), type: 'text', x: 200, y: 320, width: 400,
      text: `${data?.typePermis?.lib_type ?? 'التـرخيص لاستغلال مقلع'}`,
      language: 'ar', direction: 'rtl',
      fontSize: 28, fontFamily: ARABIC_FONTS[0], color: '#1a5276', draggable: true,
      textAlign: 'center', opacity: 1, rotation: 0, wrap: 'word', lineHeight: 1.2,
      fontWeight: 'bold'
    },
    
    // Decorative box around permit type - Moved down
    { id: uuidv4(), type: 'line', x: 150, y: 300, width: 500, height: 2, stroke: '#1a5276', strokeWidth: 2, draggable: true, opacity: 1, rotation: 0 },
    { id: uuidv4(), type: 'line', x: 150, y: 370, width: 500, height: 2, stroke: '#1a5276', strokeWidth: 2, draggable: true, opacity: 1, rotation: 0 },
    { id: uuidv4(), type: 'line', x: 150, y: 300, width: 70, height: 2, stroke: '#1a5276', strokeWidth: 2, draggable: true, opacity: 1, rotation: 90 },
    { id: uuidv4(), type: 'line', x: 650, y: 300, width: 70, height: 2, stroke: '#1a5276', strokeWidth: 2, draggable: true, opacity: 1, rotation: 90 },
    
    // Additional decorative elements to fill space
    {
      id: uuidv4(), type: 'line', x: 100, y: 400, width: 600, height: 2,
      stroke: '#1a5276', strokeWidth: 1, dash: [5, 3], draggable: true, opacity: 0.7, rotation: 0
    },
    
    // Official seal/emblem area (centered)
    {
      id: uuidv4(), type: 'rectangle', x: 300, y: 430, width: 190, height: 190,
      stroke: '#1a5276', strokeWidth: 2, fill: 'transparent', draggable: true, opacity: 0.8,
      dash: [5, 5], cornerRadius: 100
    },
    {
      id: uuidv4(), type: 'text', x: 300, y: 480, width: 200,
      text: 'ختم رسمي',
      language: 'ar', direction: 'rtl',
      fontSize: 18, fontFamily: ARABIC_FONTS[0], color: '#1a5276', draggable: true,
      textAlign: 'center', opacity: 0.8, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    {
      id: uuidv4(), type: 'text', x: 300, y: 520, width: 200,
      text: 'Sceau Officiel',
      language: 'fr', direction: 'ltr',
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#1a5276', draggable: true,
      textAlign: 'center', opacity: 0.8, rotation: 0, wrap: 'word', lineHeight: 1.2
    },
    
    // Permit Number section - Moved further down
    {
      id: uuidv4(), type: 'line', x: 50, y: 670, width: 700, height: 2,
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Permit Number label (Arabic, right aligned)
    {
      id: uuidv4(),
      type: 'text',
      x: 250,
      y: 700,
      width: 300,
      text: 'ترخيص منجمي رقم :',
      fontSize: 22,
      fontFamily: ARABIC_FONTS[0],
      color: '#000000',
      draggable: true,
      opacity: 1,
      rotation: 0,
      textAlign: 'right',
      direction: 'rtl',
    },
    
    // Permit Number value (left aligned)
    {
      id: uuidv4(),
      type: 'text',
      x: 250,
      y: 700,
      width: 200,
      text: `${data?.code_demande ?? '5419 PXC'}`,
      fontSize: 22,
      fontFamily: FONT_FAMILIES[0],
      color: '#000000',
      draggable: true,
      opacity: 1,
      rotation: 0,
      textAlign: 'left',
      direction: 'ltr',
      fontWeight: 'bold'
    },
    
    // Bottom separator line
    {
      id: uuidv4(), type: 'line', x: 50, y: 750, width: 700, height: 2,
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Date and location (bottom left)
    {
      id: uuidv4(), type: 'text', x: 50, y: 780, width: 300, 
      text: `Fait à Alger, le ${new Date().toLocaleDateString('fr-FR')}`, 
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', 
      draggable: true, opacity: 1, rotation: 0, textAlign: 'left'
    },
    
    // Minister signature (bottom right)
    {
      id: uuidv4(), type: 'text', x: 330, y: 780, width: 300, 
      text: 'Le Ministre', 
      fontSize: 16, fontFamily: FONT_FAMILIES[0], color: '#000000', 
      draggable: true, opacity: 1, rotation: 0, textAlign: 'right'
    },
    
    // Signature line
    {
      id: uuidv4(), type: 'line', x: 550, y: 810, width: 200, height: 2, 
      stroke: '#000000', strokeWidth: 1, draggable: true, opacity: 1, rotation: 0
    },
    
    // Final decorative element at bottom
    {
      id: uuidv4(), type: 'line', x: 50, y: 850, width: 700, height: 1,
      stroke: '#cccccc', strokeWidth: 1, draggable: true, opacity: 0.5, rotation: 0
    }
  ];
  return [...contentElements];
}

  const generateQRCodeData = (data: any): string => {
    const permisData = {
      type: data?.typePermis?.lib_type || 'N/A',
      code: data?.code_demande || 'N/A',
      detenteur: data?.detenteur?.nom_societeFR || data?.detenteur?.nom_sociétéFR || 'N/A',
      superficie: data?.superficie || 0,
      duree: data?.typePermis?.duree_initiale ? `${data.typePermis.duree_initiale} ans` : 'N/A',
      localisation: `${data?.wilaya?.nom_wilaya || ''}, ${data?.daira?.nom_daira || ''}, ${data?.commune?.nom_commune || ''}`,
      date: new Date().toLocaleDateString('fr-FR'),
    };
    const params = new URLSearchParams({
      type: permisData.type,
      code: permisData.code,
      detenteur: permisData.detenteur,
      superficie: permisData.superficie.toString(),
      duree: permisData.duree,
      localisation: permisData.localisation,
      date: permisData.date,
      source: 'PermisAlgerie'
    });
    return `https://permis.algerie.dz/verify?${params.toString()}`;
  };

  const createQRCodeElement = (data: any, x: number, y: number): PermisElement => {
    return {
      id: uuidv4(),
      type: 'qrcode',
      x,
      y,
      width: 200,
      height: 200,
      qrData: generateQRCodeData(data),
      draggable: true,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1
    };
  };

  function createCoordsPage(data: any): PermisElement[] {
    const borderElements = createPageBorder(DEFAULT_CANVAS.width, DEFAULT_CANVAS.height);
    const contentElements: PermisElement[] = [
      {
        id: uuidv4(),
        type: 'text',
        x: 80,
        y: 40,
        width: 640,
        text: 'إحداثيات حدود الرخصة',
        language: 'ar',
        direction: 'rtl',
        fontSize: 24,
        fontFamily: ARABIC_FONTS[0],
        color: '#1a5276',
        draggable: true,
        textAlign: 'center',
        opacity: 1,
        wrap: 'word',
        lineHeight: 1.3
      },
      {
        id: uuidv4(),
        type: 'line',
        x: 80,
        y: 85,
        width: 640,
        height: 2,
        stroke: '#1a5276',
        strokeWidth: 2,
        draggable: true,
        opacity: 1
      },
    ];
    const coordContainer = data?.procedure?.coordonnees ?? [];
    const coordinates = Array.isArray(coordContainer) ? coordContainer.map((c: any) => c.coordonnee).filter(Boolean) : [];
    let y = 110;
    const spacing = 32;
    if (coordinates.length === 0) {
      contentElements.push({
        id: uuidv4(),
        type: 'text',
        x: 80,
        y,
        width: 640,
        text: 'لا توجد إحداثيات متاحة.',
        language: 'ar',
        direction: 'rtl',
        fontSize: 16,
        fontFamily: ARABIC_FONTS[0],
        color: '#000',
        draggable: true,
        textAlign: 'center',
        lineHeight: 1.4,
        wrap: 'word'
      });
      return [...borderElements, ...contentElements];
    }
    contentElements.push({
      id: uuidv4(),
      type: 'text',
      x: 80,
      y,
      width: 180,
      text: 'X',
      language: 'ar',
      direction: 'rtl',
      fontSize: 16,
      fontFamily: ARABIC_FONTS[0],
      color: '#000',
      draggable: false,
      textAlign: 'left'
    });
    contentElements.push({
      id: uuidv4(),
      type: 'text',
      x: 320,
      y,
      width: 180,
      text: 'Y',
      language: 'ar',
      direction: 'rtl',
      fontSize: 16,
      fontFamily: ARABIC_FONTS[0],
      color: '#000',
      draggable: false,
      textAlign: 'center'
    });
    contentElements.push({
      id: uuidv4(),
      type: 'text',
      x: 560,
      y,
      width: 180,
      text: 'Z',
      language: 'ar',
      direction: 'rtl',
      fontSize: 16,
      fontFamily: ARABIC_FONTS[0],
      color: '#000',
      draggable: false,
      textAlign: 'right'
    });
    y += spacing;
    coordinates.forEach((coord: any) => {
      contentElements.push({
        id: uuidv4(),
        type: 'text',
        x: 80,
        y,
        width: 180,
        text: `${coord.x}`,
        language: 'ar',
        direction: 'rtl',
        fontSize: 20,
        fontFamily: ARABIC_FONTS[0],
        color: '#000',
        draggable: false,
        textAlign: 'left'
      });
      contentElements.push({
        id: uuidv4(),
        type: 'text',
        x: 320,
        y,
        width: 180,
        text: `${coord.y}`,
        language: 'ar',
        direction: 'rtl',
        fontSize: 20,
        fontFamily: ARABIC_FONTS[0],
        color: '#000',
        draggable: false,
        textAlign: 'center'
      });
      contentElements.push({
        id: uuidv4(),
        type: 'text',
        x: 560,
        y,
        width: 180,
        text: `${coord.z || 0}`,
        language: 'ar',
        direction: 'rtl',
        fontSize: 20,
        fontFamily: ARABIC_FONTS[0],
        color: '#000',
        draggable: false,
        textAlign: 'right'
      });
      y += spacing;
    });
    const endOfCoordsY = y + 20;
    contentElements.push({
      id: uuidv4(),
      type: 'line',
      x: 80,
      y: endOfCoordsY,
      width: DEFAULT_CANVAS.width - 160,
      height: 2,
      stroke: '#1a5276',
      strokeWidth: 2,
      draggable: true,
      opacity: 1,
      rotation: 0
    });
    contentElements.push({
      id: uuidv4(),
      type: 'line',
      x: 720,
      y: endOfCoordsY + 30,
      width: Math.sqrt(Math.pow(DEFAULT_CANVAS.width - 80, 2) + Math.pow(DEFAULT_CANVAS.height - endOfCoordsY, 2)) - 80,
      height: 2,
      stroke: '#000000',
      strokeWidth: 2,
      draggable: true,
      opacity: 1,
      rotation: 135
    });
    return [...borderElements, ...contentElements];
  }

  function createArticlesPageHeader(width: number, height: number): PermisElement[] {
    const contentElements: PermisElement[] = [
      {
        id: uuidv4(),
        type: 'text',
        x: width / 2 - 250,
        y: 30,
        width: 500,
        text: 'المواد القانونية المرفقة بالرخصة',
        language: 'ar',
        direction: 'rtl',
        fontSize: 24,
        fontFamily: ARABIC_FONTS[0],
        color: '#1a5276',
        draggable: true,
        textAlign: 'center',
        opacity: 1,
        rotation: 0,
        wrap: 'word',
        lineHeight: 1.3,
        fontWeight: 'bold'
      },
      {
        id: uuidv4(),
        type: 'line',
        x: width / 2 - 250,
        y: 75,
        width: 500,
        height: 2,
        stroke: '#1a5276',
        strokeWidth: 2,
        draggable: true,
        opacity: 1,
        rotation: 0
      },
      {
        id: uuidv4(),
        type: 'text',
        x: width - 100,
        y: height - 50,
        width: 80,
        text: 'الصفحة 3',
        language: 'ar',
        direction: 'rtl',
        fontSize: 12,
        fontFamily: ARABIC_FONTS[0],
        color: '#666',
        draggable: true,
        textAlign: 'center',
        opacity: 0.8
      },
    ];
    return [...contentElements];
  }

  const elements = pages[currentPage];
  const setElementsForCurrent = useCallback((updater: (prev: PermisElement[]) => PermisElement[]) => {
    setPages(prev => {
      const next = [...prev] as PermisPages;
      next[currentPage] = updater(prev[currentPage]);
      pushHistory(next);
      return next;
    });
  }, [currentPage, pushHistory]);

  const handleStageClick = useCallback((e: any) => {
    // Click empty area: clear selection
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
      setTool('select');
      return;
    }
    // Find nearest ancestor with an element id
    let node = e.target;
    let foundId: string | null = null;
    while (node && node !== e.currentTarget) {
      const nid = node.getAttr?.('id');
      if (nid && elements.some(el => el.id === nid)) {
        foundId = nid;
        break;
      }
      node = node.getParent ? node.getParent() : null;
    }
    if (!foundId) return;
    const el = elements.find(x => x.id === foundId);
    // Do not allow selecting decorative borders
    if (el?.meta?.isBorder) return;
    if (e.evt?.shiftKey) setSelectedIds(prev => (prev.includes(foundId!) ? prev : [...prev, foundId!]));
    else setSelectedIds([foundId!]);
  }, [elements]);

  // Direct element click handler (used by element nodes)
  const handleElementClick = useCallback((e: any) => {
    const nid = e?.currentTarget?.getAttr?.('id') || e?.target?.getAttr?.('id');
    if (!nid) return;
    const el = elements.find(x => x.id === nid);
    if (el?.meta?.isBorder) return;
    setSelectedIds([nid]);
  }, [elements]);

  const handleDragEnd = useCallback((e: any) => {
    const id = e.target.getAttr('id');
    if (!id) return;
    const node = e.target;
    const nx = node.x();
    const ny = node.y();
    setElementsForCurrent(prev => prev.map(el => (el.id === id ? { ...el, x: nx, y: ny } : el)));
  }, [setElementsForCurrent]);

  const handleTransformEnd = useCallback(() => {
    const nodes = transformerRef.current?.nodes?.() || [];
    setElementsForCurrent(prev => {
      const updated = [...prev];
      nodes.forEach((node: any) => {
        const id = node.getAttr('id');
        const i = updated.findIndex(el => el.id === id);
        if (i >= 0) {
          updated[i] = {
            ...updated[i],
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            scaleX: 1,
            scaleY: 1,
            rotation: node.rotation(),
          } as PermisElement;
        }
        node.scaleX(1);
        node.scaleY(1);
      });
      return updated;
    });
  }, [setElementsForCurrent]);

  const handleTextChange = useCallback((id: string, newText: string) => {
    setElementsForCurrent(prev => prev.map(el => (el.id === id && el.type === 'text' ? { ...el, text: newText } : el)));
  }, [setElementsForCurrent]);

  const handleAddElement = useCallback((type: 'text' | 'rectangle' | 'image' | 'line') => {
    const newElement: PermisElement = {
      id: uuidv4(),
      pageIndex: currentPage,
      type,
      x: 100 / zoom,
      y: 100 / zoom,
      width: type === 'text' ? 240 : type === 'line' ? 150 : 120,
      height: type === 'text' ? 36 : type === 'line' ? 2 : 60,
      text: type === 'text' ? (currentPage === PAGES.ARTICLES ? 'نص مادة' : 'نص جديد') : undefined,
      language: type === 'text' ? (currentPage === PAGES.ARTICLES ? 'ar' : 'fr') : undefined,
      direction: type === 'text' ? (currentPage === PAGES.ARTICLES ? 'rtl' : 'ltr') : undefined,
      fontSize: 20,
      fontFamily: type === 'text' ? (currentPage === PAGES.ARTICLES ? ARABIC_FONTS[0] : FONT_FAMILIES[0]) : FONT_FAMILIES[0],
      color: '#101822',
      draggable: true,
      fill: type === 'rectangle' ? '#ffffff' : undefined,
      stroke: type === 'rectangle' || type === 'line' ? '#000000' : undefined,
      strokeWidth: type === 'rectangle' || type === 'line' ? 1 : undefined,
      opacity: 1,
      rotation: 0,
      wrap: type === 'text' ? 'word' : undefined,
      lineHeight: type === 'text' ? 1.3 : undefined,
      textAlign: type === 'text' ? (currentPage === PAGES.ARTICLES ? 'right' : 'left') : undefined,
    };
    setElementsForCurrent(prev => [...prev, newElement]);
    setSelectedIds([newElement.id]);
    setTool('select');
  }, [zoom, currentPage, setElementsForCurrent]);

  const handleDeleteSelected = useCallback(() => {
    setElementsForCurrent(prev => prev.filter(el => !selectedIds.includes(el.id)));
    if (selectedIds.length > 0) toast.success('Éléments supprimés');
    setSelectedIds([]);
  }, [selectedIds, setElementsForCurrent]);

  const handleCopySelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    localStorage.setItem('copiedElements', JSON.stringify(selectedElements));
    toast.success('Éléments copiés');
  }, [selectedIds, elements]);

  const handlePasteSelected = useCallback(() => {
    const copied = localStorage.getItem('copiedElements');
    if (!copied) return;
    try {
      const parsed: PermisElement[] = JSON.parse(copied);
      const newElements = parsed.map(el => ({ ...el, id: uuidv4(), x: (el.x + 20) / zoom, y: (el.y + 20) / zoom }));
      setElementsForCurrent(prev => [...prev, ...newElements]);
      setSelectedIds(newElements.map(el => el.id));
      toast.success('Éléments collés');
    } catch (err) {
      console.error('Failed to paste elements', err);
    }
  }, [zoom, setElementsForCurrent]);

  const flattenWithPageIndex = useCallback((ps: PermisPages): PermisElement[] => {
    const out: PermisElement[] = [];
    ps.forEach((arr, pageIndex) => {
      arr.forEach(el => out.push({
        ...el,
        meta: {
          ...(el as any).meta,
          pageIndex
        }
      } as any));
    });
    return out;
  }, []);

  const handleSavePermisOnly = useCallback(async () => {
    if (savedPermisId) {
      toast.info('Permis already exists for this procedure');
      return;
    }
    setSavingPermis(true);
    try {
      const { id, code_permis } = await onSavePermis({
        id_demande: initialData.id_demande
      });
      setSavedPermisId(id);
      setPermisCode(code_permis);
      setLoadingTemplates(true);
      try {
        const templatesResponse = await axios.get(`${apiURL}/api/permis/${id}/templates`);
        setTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
      } catch (templateError) {
        console.error('Error loading templates after permis creation:', templateError);
      } finally {
        setLoadingTemplates(false);
      }
      toast.success('Permis saved successfully');
    } catch (error) {
      console.error('Failed to save permis', error);
      toast.error("Échec de l'enregistrement du permis");
    } finally {
      setSavingPermis(false);
    }
  }, [initialData, onSavePermis, savedPermisId, apiURL]);

  const handleSaveTemplateOnly = useCallback(async () => {
    let targetPermisId = savedPermisId;
    let targetPermisCode = permisCode;
    if (!targetPermisId && procedureId) {
      try {
        const response = await axios.get(`${apiURL}/api/permis/procedure/${procedureId}/permis`);
        if (response.data.exists) {
          targetPermisId = response.data.permisId;
          targetPermisCode = response.data.permisCode;
          setSavedPermisId(targetPermisId);
          setPermisCode(targetPermisCode);
        }
      } catch (error) {
        console.error('Error checking permis:', error);
      }
    }
    if (!targetPermisId) {
      toast.error('Please save the permis first before saving the template');
      return;
    }
    setSavingTemplate(true);
    try {
      const flat = flattenWithPageIndex(pages);
      const templateName = prompt('Enter template name:', `Template for ${targetPermisCode || initialData.code_demande}`);
      if (!templateName) {
        setSavingTemplate(false);
        return;
      }
      await onSave({
        elements: flat,
        permisId: targetPermisId,
        name: templateName
      });
      try {
        const templatesResponse = await axios.get(`${apiURL}/api/permis/${targetPermisId}/templates`);
        setTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
      } catch (refreshError) {
        console.error('Error refreshing templates:', refreshError);
      }
      toast.success('Template saved successfully');
    } catch (error) {
      console.error('Failed to save template', error);
      toast.error("Échec de l'enregistrement du template");
    } finally {
      setSavingTemplate(false);
    }
  }, [savedPermisId, permisCode, procedureId, pages, flattenWithPageIndex, initialData, onSave, apiURL]);

  const handleSaveDesign = useCallback(async () => {
    setIsLoading(true);
    try {
      const name = prompt('Enter template name:',
        templates.find(t => t.id === activeTemplate)?.name || `Template ${new Date().toLocaleDateString()}`);
      if (!name) {
        setIsLoading(false);
        return;
      }
      const flat = flattenWithPageIndex(pages);
      await onSave({
        elements: flat,
        permisId: savedPermisId || initialData.id_demande,
        templateId: activeTemplate,
        name
      });
      toast.success('Design sauvegardé avec succès');
      try {
        if (savedPermisId) {
          const templatesResponse = await axios.get(`${apiURL}/api/permis/${savedPermisId}/templates`);
          setTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
        } else {
          const resp = await axios.get(`${apiURL}/api/permis/templates?permisId=${initialData.code_demande}`);
          setTemplates(Array.isArray(resp.data) ? resp.data : resp.data?.data ?? []);
        }
      } catch (refreshError) {
        console.error('Error refreshing templates:', refreshError);
      }
    } catch (error) {
      console.error('Failed to save design', error);
      toast.error('Échec de la sauvegarde du design');
    } finally {
      setIsLoading(false);
    }
  }, [onSave, pages, flattenWithPageIndex, initialData, activeTemplate, templates, savedPermisId, apiURL]);

  const handleCreateNewTemplate = useCallback(async () => {
    if (!savedPermisId) {
      toast.error('Please save the permis first before creating a template');
      return;
    }
    const templateName = prompt('Enter a name for the new template:');
    if (!templateName) return;
    setSavingTemplate(true);
    try {
      const flat = flattenWithPageIndex(pages);
      await onSave({
        elements: flat,
        permisId: savedPermisId,
        name: templateName
      });
      const templatesResponse = await axios.get(`${apiURL}/api/permis/${savedPermisId}/templates`);
      setTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
      toast.success('New template created successfully');
    } catch (error) {
      console.error('Failed to create template:', error);
      toast.error('Failed to create template');
    } finally {
      setSavingTemplate(false);
    }
  }, [savedPermisId, pages, flattenWithPageIndex, onSave, apiURL]);

  const handleDeleteTemplate = useCallback(async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${apiURL}/api/permis/templates/${templateId}`);
      toast.success('Template deleted');
      const resp = await axios.get(`${apiURL}/api/permis/templates?permisId=${initialData.code_demande}`);
      setTemplates(Array.isArray(resp.data) ? resp.data : resp.data?.data ?? []);
      const numericTemplateId = templateId;
      if (activeTemplate === numericTemplateId) {
        setActiveTemplate(null);
        const defaultPages: PermisPages = [
          createPermisDetailsPage(initialData),
          createCoordinatesPage(initialData),
          createArticlesPage(initialData)
        ];
        setPages(defaultPages);
        pushHistory(defaultPages);
      }
    } catch (error) {
      console.error('Failed to delete template', error);
      toast.error('Failed to delete template');
    }
  }, [initialData.code_demande, activeTemplate, apiURL]);

  const handleGeneratePDF = useCallback(async () => {
    if (!stageRef.current) return;
    setIsLoading(true);
    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      let a4Width = pdf.internal.pageSize.getWidth();
      let a4Height = pdf.internal.pageSize.getHeight();
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        setCurrentPage(pageIndex);
        await new Promise((r) => setTimeout(r, 300));
        const stage = stageRef.current;
        const currentSize = canvasSizes[pageIndex];
        // Export at scale 1 to avoid zoom distortion
        const prevScale = { x: stage.scaleX(), y: stage.scaleY() };
        stage.scale({ x: 1, y: 1 });
        const imgData = stage.toDataURL({ pixelRatio: 2, width: currentSize.width, height: currentSize.height });
        stage.scale(prevScale);
        if (pageIndex > 0) {
          if (pageIndex >= PAGES.ARTICLES) {
            pdf.addPage('a4', 'landscape');
            a4Width = 842;
            a4Height = 595;
          } else {
            pdf.addPage('a4', 'portrait');
            a4Width = 595;
            a4Height = 842;
          }
        }
        const scale = Math.min(a4Width / currentSize.width, a4Height / currentSize.height);
        const imgWidth = currentSize.width * scale;
        const imgHeight = currentSize.height * scale;
        const x = (a4Width - imgWidth) / 2;
        const y = (a4Height - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      }
      pdf.save(`permis-${initialData.code_demande}.pdf`);
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("Échec de la génération du PDF");
    } finally {
      setIsLoading(false);
    }
  }, [pages, initialData, canvasSizes]);

  const handleSavePermis = useCallback(async () => {
    setIsLoading(true);
    try {
      const flat = flattenWithPageIndex(pages);
      const { id } = await onSavePermis({ pages, elements: flat, data: initialData, id_demande: initialData.id_demande });
      await onSave({ pages, elements: flat, permisId: id, name: `Template for ${initialData.code_demande}` });
      toast.success('Permis and template saved successfully');
    } catch (error) {
      console.error('Failed to save permis', error);
      toast.error("Échec de l'enregistrement du permis");
    } finally {
      setIsLoading(false);
    }
  }, [pages, flattenWithPageIndex, initialData, onSavePermis, onSave]);

  const handleApplyTemplate = useCallback(async (templateId: string) => {
    if (loadingTemplates) return;
    try {
      const numericTemplateId = parseInt(templateId, 10);
      const template = templates.find(t => t.id === numericTemplateId);
      if (!template) {
        toast.error('Template not found');
        return;
      }
      let templateElements: PermisElement[] = [];
      if (typeof template.elements === 'string') {
        templateElements = JSON.parse(template.elements);
      } else if (Array.isArray(template.elements)) {
        templateElements = template.elements;
      }
      const elementsWithIds = templateElements.map(el => ({
        ...el,
        id: el.id || uuidv4(),
        meta: {
          ...el.meta,
          pageIndex: el.meta?.pageIndex || 0
        }
      }));
      const page0Elements = elementsWithIds.filter(el => el.meta?.pageIndex === 0);
      const page1Elements = elementsWithIds.filter(el => el.meta?.pageIndex === 1);
      const page2Elements = elementsWithIds.filter(el => el.meta?.pageIndex === 2);
      const newPages: PermisPages = [
        page0Elements.length > 0 ? page0Elements : createPermisDetailsPage(initialData),
        page1Elements.length > 0 ? page1Elements : createCoordinatesPage(initialData),
        page2Elements.length > 0 ? page2Elements : createArticlesPage(initialData)
      ];
      setPages(newPages);
      setActiveTemplate(numericTemplateId);
      setSelectedIds([]);
      pushHistory(newPages);
      toast.success(`Template "${template.name}" applied successfully`);
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    }
  }, [templates, loadingTemplates, initialData, pushHistory]);

  const handlePropertyChange = useCallback((property: keyof PermisElement, value: any) => {
    if (selectedIds.length === 0) return;
    setElementsForCurrent(prev => prev.map(el => (selectedIds.includes(el.id) ? { ...el, [property]: value } : el)));
  }, [selectedIds, setElementsForCurrent]);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
    setZoom(clamp(newZoom, 0.5, 3));
  }, [zoom]);

  const selectedElementsList = useMemo(() => elements.filter(el => selectedIds.includes(el.id)), [elements, selectedIds]);
  const firstSelected = selectedElementsList[0];

  const onToggleArticle = useCallback((id: string, checked: boolean) => {
    setSelectedArticleIds(prev => {
      const next = checked ? Array.from(new Set([...prev, id])) : prev.filter(x => x !== id);
      insertArticlesAsElements(next, articles);
      return next;
    });
  }, [articles, insertArticlesAsElements]);

  const onAddCustomArticle = useCallback((article: ArticleItem) => {
    setArticles(prev => [...prev, article]);
    setSelectedArticleIds(prev => [...prev, article.id]);
    insertArticlesAsElements([...selectedArticleIds, article.id], [...articles, article]);
  }, [articles, selectedArticleIds, insertArticlesAsElements]);

  const onRemoveArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    const filteredIds = selectedArticleIds.filter(x => x !== id);
    setSelectedArticleIds(filteredIds);
    insertArticlesAsElements(filteredIds, articles.filter(a => a.id !== id));
  }, [articles, selectedArticleIds, insertArticlesAsElements]);

  const onUpdateArticle = useCallback((a: ArticleItem) => {
    setArticles(prev => prev.map(x => (x.id === a.id ? a : x)));
    if (selectedArticleIds.includes(a.id)) {
      insertArticlesAsElements(selectedArticleIds, [...articles.filter(x => x.id !== a.id), a]);
    }
  }, [articles, selectedArticleIds, insertArticlesAsElements]);

  const openTextEditor = useCallback((element: PermisElement) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const canvasPad = 20;
    const left = element.x * zoom + containerRect.left + canvasPad;
    const top = element.y * zoom + containerRect.top + canvasPad;
    const width = (element.width || 200) * zoom;
    const height = (element.height || 40) * zoom;
    setTextOverlay({
      id: element.id,
      value: element.text || '',
      left,
      top,
      width,
      height,
      fontSize: (element.fontSize || 20) * zoom,
      fontFamily: element.fontFamily || FONT_FAMILIES[0],
      color: element.color || '#000',
      direction: element.direction || 'ltr',
      textAlign: (element as any).textAlign || 'left',
      lineHeight: (element as any).lineHeight || 1.2
    });
  }, [zoom]);

  const commitTextEditor = useCallback((save: boolean) => {
    if (!textOverlay) return;
    if (save) handleTextChange(textOverlay.id, textOverlay.value);
    setTextOverlay(null);
  }, [textOverlay, handleTextChange]);

  const onTextAreaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitTextEditor(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      commitTextEditor(false);
    }
  }, [commitTextEditor]);

  const canPrev = currentPage > 0;
  const canNext = currentPage < pages.length - 1;

  const gotoPrev = useCallback(() => {
    if (!canPrev) return;
    setSelectedIds([]);
    setCurrentPage(p => p - 1);
  }, [canPrev]);

  const gotoNext = useCallback(() => {
    if (!canNext) return;
    setSelectedIds([]);
    setCurrentPage(p => p + 1);
  }, [canNext]);

const pageLabel = (idx: number) => {
  if (idx === PAGES.PERMIS_DETAILS) return 'Page 1';
  if (idx === PAGES.COORDINATES) return 'Page 2';
  if (idx >= PAGES.ARTICLES) return `Articles ${idx - PAGES.ARTICLES + 1}`;
  return `Page ${idx + 1}`;
};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.toolbar}>
          <div className={styles.tools}>
            <button className={`${styles.toolButton} ${tool === 'text' ? styles.active : ''}`} onClick={() => { setTool('text'); handleAddElement('text'); }} title="Add Text (T)"><FiType /></button>
            <button className={`${styles.toolButton} ${tool === 'rectangle' ? styles.active : ''}`} onClick={() => { setTool('rectangle'); handleAddElement('rectangle'); }} title="Add Rectangle (R)"><BsTextParagraph /></button>
            <button className={`${styles.toolButton} ${tool === 'line' ? styles.active : ''}`} onClick={() => { setTool('line'); handleAddElement('line'); }} title="Add Line (L)"><BsBorderWidth /></button>
          </div>
          <div className={styles.pager}>
            <button className={styles.iconBtn} onClick={gotoPrev} disabled={!canPrev}>
              <FiChevronLeft />
            </button>
            <div className={styles.pageLabel}>
              {pageLabel(currentPage)}
              <span className={styles.pageCount}> ({currentPage + 1}/{pages.length})</span>
            </div>
            <button className={styles.iconBtn} onClick={gotoNext} disabled={!canNext}>
              <FiChevronRight />
            </button>
        </div>
        <div className={styles.rightTools}>
            {/* Articles source selection */}
            <div className={styles.templateSection}>
              <select
                className={styles.templateSelect}
                value={selectedArticleSet || ''}
                onChange={(e) => changeArticleSet(e.target.value)}
              >
                <option value="">Select Articles Set ({articleSets.length})</option>
                {articleSets.map(s => (
                  <option key={s.key} value={s.key}>{s.name} {s.source === 'custom' ? '(custom)' : ''}</option>
                ))}
              </select>
              <button
                className={styles.iconBtn}
                onClick={() => {
                  const key = prompt('Enter set key (e.g., permis-xyz):', selectedArticleSet || 'custom-set');
                  const name = prompt('Enter set name:', articleSets.find(s => s.key === selectedArticleSet!)?.name || 'Custom Set');
                  if (key && name) {
                    saveArticleSet(key, name, articles);
                    setArticleSets(listArticleSets());
                    setSelectedArticleSet(key);
                  }
                }}
                title="Save current articles as set"
              >
                <FiSave />
              </button>
              <button
                className={styles.iconBtn}
                onClick={() => exportArticleSet(articleSets.find(s => s.key === selectedArticleSet!)?.name || 'Articles', articles)}
                title="Export current set"
              >
                <FiDownload />
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const inputEl = importInputRef.current;
                  const f = inputEl?.files?.[0];
                  if (!f) return;
                  const res = await importArticleSet(f);
                  setArticleSets(listArticleSets());
                  if (res) changeArticleSet(res.key);
                  if (inputEl) inputEl.value = '';
                }}
              />
              <button className={styles.iconBtn} onClick={() => importInputRef.current?.click()} title="Import set JSON">
                <FileUp/>
              </button>
            </div>
            <div className={styles.zoomGroup}>
              <button className={styles.iconBtn} onClick={() => handleZoom('out')}>-</button>
              <div className={styles.zoomDisplay}>{Math.round(zoom * 100)}%</div>
              <button className={styles.iconBtn} onClick={() => handleZoom('in')}>+</button>
            </div>
            <div className={styles.resizeGroup}>
              <button className={styles.iconBtn} onClick={() => handleResizeCanvas('width', -50)} title="Decrease Width">
                <FiChevronLeft /> W
              </button>
              <button className={styles.iconBtn} onClick={() => handleResizeCanvas('width', 50)} title="Increase Width">
                <FiChevronRight /> W
              </button>
              <button className={styles.iconBtn} onClick={() => handleResizeCanvas('height', -50)} title="Decrease Height">
                <FiChevronUp /> H
              </button>
              <button className={styles.iconBtn} onClick={() => handleResizeCanvas('height', 50)} title="Increase Height">
                <FiChevronDown /> H
              </button>
              <button className={styles.iconBtn} onClick={handleResetCanvasSize} title="Reset Size">
                <FiRefreshCw />
              </button>
            </div>
            <div className={styles.templateSection}>
              <select
                className={styles.templateSelect}
                value={activeTemplate !== null ? activeTemplate.toString() : ''}
                onChange={(e) => handleApplyTemplate(e.target.value)}
                disabled={loadingTemplates}
              >
                <option value="">Select Template ({templates.length} available)</option>
                {loadingTemplates ? (
                  <option value="">Loading templates...</option>
                ) : (
                  templates.map(t => (
                    <option key={t.id} value={t.id.toString()}>
                      {t.name} (v{t.version})
                    </option>
                  ))
                )}
              </select>
              {activeTemplate && (
                <div className={styles.templateActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => handleDeleteTemplate(activeTemplate)}
                    title="Delete Template"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    className={styles.iconBtn}
                    onClick={() => {
                      const newName = prompt('Rename template:',
                        templates.find(t => t.id === activeTemplate)?.name);
                      if (newName) {
                        handleRenameTemplate(activeTemplate, newName);
                      }
                    }}
                    title="Rename Template"
                  >
                    <FiEdit2 />
                  </button>
                </div>
              )}
            </div>
            <button className={`${styles.actionBtn}`} onClick={handleGeneratePDF} disabled={isLoading}><FiDownload /> <span>PDF</span></button>
            <button
              className={`${styles.actionBtn}`}
              onClick={handleSavePermisOnly}
              disabled={savingPermis || isLoading || !!savedPermisId}
              title={savedPermisId ? 'Permis already exists' : 'Save Permis'}
            >
              {savingPermis ? (
                <FiRefreshCw className={styles.spinner} />
              ) : (
                <FiSave />
              )}
              <span>{savingPermis ? 'Saving...' : 'Save Permis'}</span>
            </button>
            <button
              className={`${styles.actionBtn}`}
              onClick={handleSaveTemplateOnly}
              disabled={savingTemplate || isLoading || !savedPermisId || loadingTemplates}
              title={!savedPermisId ? 'Save the permis first' : 'Save Template'}
            >
              {savingTemplate ? (
                <FiRefreshCw className={styles.spinner} />
              ) : (
                <FiSave />
              )}
              <span>{savingTemplate ? 'Saving...' : 'Save Template'}</span>
            </button>
            <button
              className={`${styles.actionBtn}`}
              onClick={handleCreateNewTemplate}
              disabled={savingTemplate || isLoading || !savedPermisId}
              title={!savedPermisId ? 'Save the permis first' : 'Create New Template'}
            >
              <FiSave />
              <span>{savingTemplate ? 'Creating...' : 'New Template'}</span>
            </button>
            <button
              className={styles.iconBtn}
              onClick={handleRefreshTemplates}
              title="Refresh Templates"
              disabled={loadingTemplates || !savedPermisId}
            >
              <FiRefreshCw className={loadingTemplates ? styles.spinner : ''} />
            </button>
            <button
              className={`${styles.toolButton} ${tool === 'qrcode'}`}
              onClick={() => {
                setTool('qrcode');
                const qrElement = createQRCodeElement(
                  initialData,
                  DEFAULT_CANVAS.width / 2 - 102,
                  DEFAULT_CANVAS.height / 2 - 78
                );
                setElementsForCurrent(prev => [...prev, qrElement]);
                setSelectedIds([qrElement.id]);
              }}
              title="Add QR Code"
            >
              <AiOutlineQrcode size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        {currentPage === PAGES.ARTICLES && (
          <aside className={styles.sidebar}>
            <ArticlesPanel
              articles={articles}
              selectedIds={selectedArticleIds}
              onToggle={onToggleArticle}
              onAddCustom={onAddCustomArticle}
              onRemove={onRemoveArticle}
              onUpdate={onUpdateArticle}
            />
          </aside>
        )}
        <main className={styles.canvasArea} ref={containerRef}>
          <div className={styles.canvasWrap}>
            <Stage
              width={currentCanvasSize.width}
              height={currentCanvasSize.height}
              ref={stageRef}
              scaleX={zoom}
              scaleY={zoom}
              onClick={handleStageClick}
              onTap={handleStageClick}
              style={{
                backgroundImage: showGrid ? gridBackground(zoom) : 'none',
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              }}
            >
              <Layer>
                {elements.map(element => {
                  const isSelected = selectedIds.includes(element.id);
                  return (
                    <ElementRenderer
                      key={element.id}
                      element={element}
                      isSelected={isSelected}
                      zoom={zoom}
                      onClickElement={handleElementClick}
                      onDragEnd={handleDragEnd}
                      onTransformEnd={handleTransformEnd}
                      onDblClickText={() => openTextEditor(element)}
                    />
                  );
                })}
                <Transformer
                  ref={transformerRef}
                  anchorSize={8}
                  anchorStrokeWidth={1}
                  borderStrokeWidth={1}
                  boundBoxFunc={(oldBox, newBox) => {
                    const nodes = transformerRef.current?.nodes?.() || [];
                    const hasLine = nodes.some((n: any) => n.getClassName && n.getClassName() === 'Line');
                    if (hasLine) return newBox;
                    if (newBox.width < 10 || newBox.height < 10) return oldBox;
                    return newBox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
          {textOverlay && (
            <textarea
              autoFocus
              value={textOverlay.value}
              onChange={e =>
                setTextOverlay(prev =>
                  prev ? { ...prev, value: e.target.value } : prev
                )
              }
              onBlur={() => commitTextEditor(true)}
              onKeyDown={onTextAreaKeyDown}
              className={styles.textOverlay}
              style={{
                left: textOverlay.left,
                top: textOverlay.top,
                width: textOverlay.width,
                height: textOverlay.height,
                fontSize: textOverlay.fontSize,
                fontFamily: textOverlay.fontFamily,
                color: textOverlay.color,
                lineHeight: `${textOverlay.lineHeight}`,
                direction: textOverlay.direction === 'rtl' ? 'rtl' : 'ltr',
                textAlign: textOverlay.textAlign as any,
                overflow: 'hidden',
              }}
            />
          )}
        </main>
        <aside className={styles.properties}>
          {selectedIds.length > 0 && firstSelected ? (
            <div className={styles.propsInner}>
              <h3>Properties <span className={styles.small}>({selectedIds.length})</span></h3>

              <div className={styles.propRow}>
                <label>Position</label>
                <div className={styles.inlineInputs}>
                  <input type="number" value={firstSelected.x || 0} onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value || '0'))} />
                  <input type="number" value={firstSelected.y || 0} onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value || '0'))} />
                </div>
              </div>

              <div className={styles.propRow}>
                <label>Size</label>
                <div className={styles.inlineInputs}>
                  <input type="number" value={firstSelected.width || 0} onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value || '0'))} />
                  <input type="number" value={firstSelected.height || 0} onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value || '0'))} />
                </div>
              </div>
{firstSelected.type === 'qrcode' && (
  <div className={styles.propRow}>
    <label>QR Data</label>
    <textarea 
      value={firstSelected.qrData || ''} 
      onChange={(e) => handlePropertyChange('qrData', e.target.value)} 
      rows={4}
      placeholder="Enter data for QR code"
    />
    <div className={styles.small}>
      This data will be encoded in the QR code
    </div>
  </div>
)}
              {firstSelected.type === 'text' && (
                <>
                  <div className={styles.propRow}>
                    <label>Text</label>
                    <textarea value={firstSelected.text || ''} onChange={(e) => handleTextChange(firstSelected.id, e.target.value)} rows={3} />
                  </div>

                  <div className={styles.propRow}>
                    <label>Language</label>
                    <div className={styles.inlineInputs}>
                      <select value={firstSelected.language || 'fr'} onChange={(e) => handlePropertyChange('language', e.target.value as any)}>
                        <option value="ar">Arabic</option>
                        <option value="fr">French</option>
                        <option value="en">English</option>
                      </select>
                      <select value={firstSelected.direction || 'ltr'} onChange={(e) => handlePropertyChange('direction', e.target.value as any)}>
                        <option value="rtl">RTL</option>
                        <option value="ltr">LTR</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.propRow}>
                    <label>Font</label>
                    <select value={firstSelected.fontFamily || (firstSelected.language === 'ar' ? ARABIC_FONTS[0] : FONT_FAMILIES[0])}
                      onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}>
                      {(firstSelected.language === 'ar' ? ARABIC_FONTS : FONT_FAMILIES).map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                  </div>

                  <div className={styles.propRow}>
                    <label>Font Size</label>
                    <input type="number" value={firstSelected.fontSize || 20} onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value || '20'))} />
                  </div>

                  <div className={styles.propRow}>
                    <label>Color</label>
                    <div className={styles.colorRow}>
                      <input type="color" value={firstSelected.color || '#000000'} onChange={(e) => handlePropertyChange('color', e.target.value)} />
                      <div className={styles.colorCode}>{firstSelected.color || '#000000'}</div>
                    </div>
                  </div>

                  <div className={styles.propRow}>
                    <label>Alignment</label>
                    <select value={(firstSelected as any).textAlign || ((firstSelected as any).direction === 'rtl' ? 'right' : 'left')} onChange={(e) => handlePropertyChange('textAlign', e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className={styles.propRow}>
                    <label>Line Height</label>
                    <input type="number" step="0.05" value={(firstSelected as any).lineHeight || 1.3} onChange={(e) => handlePropertyChange('lineHeight', parseFloat(e.target.value || '1.3'))} />
                  </div>
                </>
              )}

              {(firstSelected.type === 'rectangle' || firstSelected.type === 'line') && (
                <>
                  <div className={styles.propRow}>
                    <label>Fill</label>
                    <div className={styles.colorRow}>
                      <input type="color" value={(firstSelected as any).fill || '#ffffff'} onChange={(e) => handlePropertyChange('fill', e.target.value)} />
                      <div className={styles.colorCode}>{(firstSelected as any).fill || '#ffffff'}</div>
                    </div>
                  </div>

                  <div className={styles.propRow}>
                    <label>Border</label>
                    <div className={styles.inlineInputs}>
                      <input type="color" value={(firstSelected as any).stroke || '#000000'} onChange={(e) => handlePropertyChange('stroke', e.target.value)} />
                      <input type="number" value={(firstSelected as any).strokeWidth || 1} onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value || '1'))} />
                    </div>
                  </div>

                  {firstSelected.type === 'rectangle' && (
                    <div className={styles.propRow}>
                      <label>Corner Radius</label>
                      <input type="number" value={(firstSelected as any).cornerRadius || 0} onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value || '0'))} />
                    </div>
                  )}
                </>
              )}

              <div className={styles.propRow}>
                <label>Opacity</label>
                <div className={styles.inlineInputs}>
                  <input type="range" min="0" max="1" step="0.05" value={firstSelected.opacity || 1} onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value || '1'))} />
                  <div className={styles.small}>{Math.round((firstSelected.opacity || 1) * 100)}%</div>
                </div>
              </div>

              <div className={styles.propRow}>
                <label>Rotation</label>
                <input type="number" min={0} max={360} value={firstSelected.rotation || 0} onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value || '0'))} />
              </div>
            </div>
          ) : (
            <div className={styles.emptyProps}>
              <h4>No elements selected</h4>
              <p>Click an element to edit properties</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PermisDesigner;
