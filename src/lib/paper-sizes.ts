import { PaperPreset, PaperSizeKey, Unit } from './types';

export const PAPER_PRESETS: Record<PaperSizeKey, PaperPreset> = {
  A5: {
    key: 'A5',
    name: 'A5',
    widthMm: 148,
    heightMm: 210,
    description: '148 x 210 mm (5.8 x 8.3 in)',
  },
  A4: {
    key: 'A4',
    name: 'A4',
    widthMm: 210,
    heightMm: 297,
    description: '210 x 297 mm (8.3 x 11.7 in)',
  },
  A3: {
    key: 'A3',
    name: 'A3',
    widthMm: 297,
    heightMm: 420,
    description: '297 x 420 mm (11.7 x 16.5 in)',
  },
  Letter: {
    key: 'Letter',
    name: 'US Letter',
    widthMm: 215.9,
    heightMm: 279.4,
    description: '8.5 x 11 in (216 x 279 mm)',
  },
  Legal: {
    key: 'Legal',
    name: 'US Legal',
    widthMm: 215.9,
    heightMm: 355.6,
    description: '8.5 x 14 in (216 x 356 mm)',
  },
  Tabloid: {
    key: 'Tabloid',
    name: 'Tabloid (11x17)',
    widthMm: 279.4,
    heightMm: 431.8,
    description: '11 x 17 in (279 x 432 mm)',
  },
  Custom: {
    key: 'Custom',
    name: 'Custom Size',
    widthMm: 210,
    heightMm: 297,
    description: 'User specified dimensions',
  },
};

// Unit conversions
export function convertToMm(val: number, unit: Unit): number {
  switch (unit) {
    case 'cm':
      return val * 10;
    case 'inch':
      return val * 25.4;
    case 'mm':
    default:
      return val;
  }
}

export function convertFromMm(valMm: number, unit: Unit): number {
  switch (unit) {
    case 'cm':
      return Number((valMm / 10).toFixed(2));
    case 'inch':
      return Number((valMm / 25.4).toFixed(2));
    case 'mm':
    default:
      return Number(valMm.toFixed(1));
  }
}

// Convert MM to PDF points (1 inch = 72 pt, 1 inch = 25.4 mm => 1 mm = 72 / 25.4 pt)
export const MM_TO_PT = 72 / 25.4;

export function mmToPt(mm: number): number {
  return mm * MM_TO_PT;
}

export function ptToMm(pt: number): number {
  return pt / MM_TO_PT;
}
