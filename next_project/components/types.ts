// =============================================================
// File: components/elements/types.ts
// =============================================================
export interface PermisSaveResponse { id: number; [key: string]: any; }

export type LanguageCode = 'ar' | 'fr' | 'en' | string;
export interface PermisElement {
  id: string;
  type: 'text' | 'rectangle' | 'image' | 'line' | 'qrcode';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  draggable?: boolean;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  cornerRadius?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'bevel' | 'round' | 'miter';
  textAlign?: 'left' | 'center' | 'right' | string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  padding?: number;
  letterSpacing?: number;
  lineHeight?: number;
  wrap?: 'word' | 'char' | 'none' | string;
  ellipsis?: boolean;
  qrData?: string;
  // RTL / language support
  language?: LanguageCode;
  direction?: 'rtl' | 'ltr' | string;
  scaleX?: any;
  scaleY?: any;
  // Articles linkage
  isArticle?: boolean;
  articleId?: string;
  className?: string;
  dash?: number[];
  points?: number[];  // Fixed: use lowercase 'number[]'
  pageIndex?: any;
  meta?: any;
  align?: 'left' | 'center' | 'right';
  fontWeight?: string;
}

export interface PermisDesignerProps {
  procedureId?: number | null;
  initialData: any;
  onSaveTemplate?: (design: any) => Promise<void>;
  permisSaved?: boolean;
  permisId?: number | null;
  onSave: (design: any) => Promise<void>;
  onGeneratePdf: (design: any) => Promise<Blob>;
  onSavePermis: (permisData: any) => Promise<PermisSaveResponse>;
}

export type CommonKonvaProps = {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  draggable?: boolean;
  onClick?: (e: any) => void;
  onTap?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onTransformEnd?: (e: any) => void;
  stroke?: string;
  strokeWidth?: number;
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  cornerRadius?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'bevel' | 'round' | 'miter';
  opacity?: number;
};

export interface TextEditOverlay {
  id: string;
  value: string;
  left: number;
  top: number;
  width: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  direction?: 'rtl' | 'ltr' | string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  height?: number;
}

export interface ArticleItem {
  id: string;
  title: string;       // e.g., "المادة 1"
  content: string;     // Arabic text
  preselected?: boolean;
}

export interface QRCodeData {
  typePermis: string;
  codeDemande: string;
  detenteur: string;
  superficie: number;
  duree: string;
  localisation: string;
  dateCreation: string;
  coordinates?: any[];
}