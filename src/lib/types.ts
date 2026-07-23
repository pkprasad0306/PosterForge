export type Unit = 'mm' | 'cm' | 'inch';

export type PaperSizeKey = 'A5' | 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid' | 'Custom';

export type Orientation = 'portrait' | 'landscape';

export type ScalingMode = 'fit' | 'fill' | 'stretch' | 'original';

export interface Dimensions {
  width: number; // in mm
  height: number; // in mm
}

export interface PaperPreset {
  key: PaperSizeKey;
  name: string;
  widthMm: number;
  heightMm: number;
  description?: string;
}

export interface AIFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpen: boolean;
  autoEnhance: boolean;
}

export interface PosterConfig {
  paperSize: PaperSizeKey;
  customPaperWidth: number; // in unit
  customPaperHeight: number; // in unit
  orientation: Orientation;
  unit: Unit;
  
  // Sizing mode: either explicit dimensions OR grid columns/rows
  sizingMode: 'dimensions' | 'pages';
  targetWidth: number; // in selected unit
  targetHeight: number; // in selected unit
  gridCols: number;
  gridRows: number;

  scaling: ScalingMode;
  marginMm: number; // Page printable margin
  overlapMm: number; // Tile glue overlap (0-20mm)
  
  // Toggles
  showCropMarks: boolean;
  showPageNumbers: boolean;
  showBorders: boolean;
  
  // AI Filters
  aiFilters: AIFilters;
}

export interface ImageMetaData {
  name: string;
  width: number; // px
  height: number; // px
  aspectRatio: number;
  fileSizeFormatted: string;
  type: string;
  dataUrl: string;
  dpi?: number;
}

export interface TileInfo {
  index: number;
  col: number;
  row: number;
  totalCols: number;
  totalRows: number;
  sheetWidthMm: number;
  sheetHeightMm: number;
  
  // Source cropping rect in original image pixel space
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;

  // Printable bounds in sheet space (mm)
  printableX: number;
  printableY: number;
  printableWidth: number;
  printableHeight: number;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  config: PosterConfig;
  thumbnailUrl: string;
}

export type ExportQuality = 'high' | 'standard' | 'compressed';
