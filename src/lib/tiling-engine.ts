import { PosterConfig, ImageMetaData, TileInfo } from './types';
import { PAPER_PRESETS, convertToMm, convertFromMm } from './paper-sizes';

export interface CalculatedGrid {
  cols: number;
  rows: number;
  totalPages: number;
  sheetWidthMm: number;
  sheetHeightMm: number;
  printableWidthMm: number;
  printableHeightMm: number;
  totalPosterWidthMm: number;
  totalPosterHeightMm: number;
  displayPosterWidth: number;
  displayPosterHeight: number;
  tiles: TileInfo[];
}

export function calculateGrid(
  config: PosterConfig,
  imageMeta: ImageMetaData
): CalculatedGrid {
  // 1. Determine base sheet dimensions
  let basePaper = PAPER_PRESETS[config.paperSize] || PAPER_PRESETS.A4;
  let rawSheetW = config.paperSize === 'Custom' 
    ? convertToMm(config.customPaperWidth, config.unit)
    : basePaper.widthMm;
  let rawSheetH = config.paperSize === 'Custom'
    ? convertToMm(config.customPaperHeight, config.unit)
    : basePaper.heightMm;

  let sheetWidthMm = config.orientation === 'portrait' ? Math.min(rawSheetW, rawSheetH) : Math.max(rawSheetW, rawSheetH);
  let sheetHeightMm = config.orientation === 'portrait' ? Math.max(rawSheetW, rawSheetH) : Math.min(rawSheetW, rawSheetH);

  // Printable dimensions inside page margins
  const marginMm = Math.max(0, config.marginMm || 0);
  const overlapMm = Math.max(0, config.overlapMm || 0);

  const printableWidthMm = Math.max(10, sheetWidthMm - 2 * marginMm);
  const printableHeightMm = Math.max(10, sheetHeightMm - 2 * marginMm);

  // Effective stride per tile (width/height added by each tile after subtracting overlap)
  const strideWMm = Math.max(1, printableWidthMm - overlapMm);
  const strideHMm = Math.max(1, printableHeightMm - overlapMm);

  let cols = 1;
  let rows = 1;
  let totalPosterWidthMm = 0;
  let totalPosterHeightMm = 0;

  const imgAspect = imageMeta.aspectRatio || (imageMeta.width / imageMeta.height);

  if (config.sizingMode === 'pages') {
    cols = Math.max(1, config.gridCols);
    rows = Math.max(1, config.gridRows);

    totalPosterWidthMm = printableWidthMm + (cols - 1) * strideWMm;
    totalPosterHeightMm = printableHeightMm + (rows - 1) * strideHMm;
  } else {
    // Sizing by explicit target dimensions
    const targetWMm = convertToMm(config.targetWidth, config.unit);
    const targetHMm = convertToMm(config.targetHeight, config.unit);

    if (targetWMm > 0 && targetHMm > 0) {
      totalPosterWidthMm = targetWMm;
      totalPosterHeightMm = targetHMm;

      // Calculate how many columns & rows needed to cover target dimensions
      cols = Math.max(1, Math.ceil((totalPosterWidthMm - overlapMm) / strideWMm));
      rows = Math.max(1, Math.ceil((totalPosterHeightMm - overlapMm) / strideHMm));
    } else {
      cols = 2;
      rows = 2;
      totalPosterWidthMm = printableWidthMm + (cols - 1) * strideWMm;
      totalPosterHeightMm = printableHeightMm + (rows - 1) * strideHMm;
    }
  }

  // Generate TileInfos
  const tiles: TileInfo[] = [];
  const imgW = imageMeta.width;
  const imgH = imageMeta.height;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Physical top-left of this tile's content relative to whole poster (in mm)
      const tileLeftMm = c * strideWMm;
      const tileTopMm = r * strideHMm;

      // Source image cropping math
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = imgW;
      let sourceHeight = imgH;

      if (config.scaling === 'fit' || config.scaling === 'fill' || config.scaling === 'original') {
        // Compute image bounds inside totalPosterWidthMm x totalPosterHeightMm
        let renderedImgWMm = totalPosterWidthMm;
        let renderedImgHMm = totalPosterHeightMm;
        let imgOffsetXMm = 0;
        let imgOffsetYMm = 0;

        if (config.scaling === 'fit') {
          const posterAspect = totalPosterWidthMm / totalPosterHeightMm;
          if (imgAspect > posterAspect) {
            // Image is wider: constrained by width
            renderedImgWMm = totalPosterWidthMm;
            renderedImgHMm = totalPosterWidthMm / imgAspect;
            imgOffsetYMm = (totalPosterHeightMm - renderedImgHMm) / 2;
          } else {
            // Image is taller: constrained by height
            renderedImgHMm = totalPosterHeightMm;
            renderedImgWMm = totalPosterHeightMm * imgAspect;
            imgOffsetXMm = (totalPosterWidthMm - renderedImgWMm) / 2;
          }
        } else if (config.scaling === 'fill') {
          const posterAspect = totalPosterWidthMm / totalPosterHeightMm;
          if (imgAspect > posterAspect) {
            // Image fills height, overflows width
            renderedImgHMm = totalPosterHeightMm;
            renderedImgWMm = totalPosterHeightMm * imgAspect;
            imgOffsetXMm = (totalPosterWidthMm - renderedImgWMm) / 2;
          } else {
            // Image fills width, overflows height
            renderedImgWMm = totalPosterWidthMm;
            renderedImgHMm = totalPosterWidthMm / imgAspect;
            imgOffsetYMm = (totalPosterHeightMm - renderedImgHMm) / 2;
          }
        }

        // Map tile bounds (tileLeftMm .. tileLeftMm + printableWidthMm) to Image Pixel space
        const normX1 = (tileLeftMm - imgOffsetXMm) / renderedImgWMm;
        const normY1 = (tileTopMm - imgOffsetYMm) / renderedImgHMm;
        const normX2 = (tileLeftMm + printableWidthMm - imgOffsetXMm) / renderedImgWMm;
        const normY2 = (tileTopMm + printableHeightMm - imgOffsetYMm) / renderedImgHMm;

        sourceX = Math.max(0, normX1 * imgW);
        sourceY = Math.max(0, normY1 * imgH);
        const sourceRight = Math.min(imgW, normX2 * imgW);
        const sourceBottom = Math.min(imgH, normY2 * imgH);

        sourceWidth = Math.max(1, sourceRight - sourceX);
        sourceHeight = Math.max(1, sourceBottom - sourceY);
      } else {
        // Stretch
        const normX1 = tileLeftMm / totalPosterWidthMm;
        const normY1 = tileTopMm / totalPosterHeightMm;
        const normX2 = (tileLeftMm + printableWidthMm) / totalPosterWidthMm;
        const normY2 = (tileTopMm + printableHeightMm) / totalPosterHeightMm;

        sourceX = Math.max(0, normX1 * imgW);
        sourceY = Math.max(0, normY1 * imgH);
        sourceWidth = Math.max(1, Math.min(imgW - sourceX, (normX2 - normX1) * imgW));
        sourceHeight = Math.max(1, Math.min(imgH - sourceY, (normY2 - normY1) * imgH));
      }

      tiles.push({
        index: r * cols + c + 1,
        col: c + 1,
        row: r + 1,
        totalCols: cols,
        totalRows: rows,
        sheetWidthMm,
        sheetHeightMm,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        printableX: marginMm,
        printableY: marginMm,
        printableWidth: printableWidthMm,
        printableHeight: printableHeightMm,
      });
    }
  }

  return {
    cols,
    rows,
    totalPages: cols * rows,
    sheetWidthMm,
    sheetHeightMm,
    printableWidthMm,
    printableHeightMm,
    totalPosterWidthMm,
    totalPosterHeightMm,
    displayPosterWidth: convertFromMm(totalPosterWidthMm, config.unit),
    displayPosterHeight: convertFromMm(totalPosterHeightMm, config.unit),
    tiles,
  };
}
