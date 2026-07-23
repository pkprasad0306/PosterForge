import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PosterConfig, ImageMetaData, ExportQuality } from './types';
import { calculateGrid } from './tiling-engine';
import { mmToPt } from './paper-sizes';
import { applyFiltersToCanvas } from './canvas-filters';

export async function generatePosterPDF(
  imageMeta: ImageMetaData,
  config: PosterConfig,
  quality: ExportQuality = 'high',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const grid = calculateGrid(config, imageMeta);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Load raw HTMLImageElement
  const imgElement = new Image();
  imgElement.crossOrigin = 'anonymous';
  imgElement.src = imageMeta.dataUrl;

  await new Promise<void>((resolve, reject) => {
    imgElement.onload = () => resolve();
    imgElement.onerror = (e) => reject(e);
  });

  // Prepare filter source canvas if AI filters are applied
  let sourceImageOrCanvas: HTMLCanvasElement | HTMLImageElement = imgElement;

  const hasActiveFilters = 
    config.aiFilters.brightness !== 0 || 
    config.aiFilters.contrast !== 0 || 
    config.aiFilters.saturation !== 0 || 
    config.aiFilters.sharpen || 
    config.aiFilters.autoEnhance;

  if (hasActiveFilters) {
    const filterCanvas = document.createElement('canvas');
    applyFiltersToCanvas(imgElement, filterCanvas, config.aiFilters);
    sourceImageOrCanvas = filterCanvas;
  }

  const totalTiles = grid.tiles.length;
  
  // Set export scaling factor based on Quality Preset
  let exportDpiScale = 1.0;
  if (quality === 'standard') exportDpiScale = 0.75;
  if (quality === 'compressed') exportDpiScale = 0.5;

  for (let i = 0; i < totalTiles; i++) {
    const tile = grid.tiles[i];
    
    // Create page with exact sheet dimensions in PDF points (72 DPI)
    const sheetWPt = mmToPt(tile.sheetWidthMm);
    const sheetHPt = mmToPt(tile.sheetHeightMm);
    const page = pdfDoc.addPage([sheetWPt, sheetHPt]);

    // Offscreen Canvas for tile slice rendering
    const tileCanvas = document.createElement('canvas');
    const tileWidthPx = Math.max(1, Math.round(tile.sourceWidth * exportDpiScale));
    const tileHeightPx = Math.max(1, Math.round(tile.sourceHeight * exportDpiScale));

    tileCanvas.width = tileWidthPx;
    tileCanvas.height = tileHeightPx;
    const tileCtx = tileCanvas.getContext('2d');

    if (tileCtx) {
      tileCtx.imageSmoothingEnabled = true;
      tileCtx.imageSmoothingQuality = quality === 'high' ? 'high' : 'medium';

      tileCtx.drawImage(
        sourceImageOrCanvas,
        tile.sourceX,
        tile.sourceY,
        tile.sourceWidth,
        tile.sourceHeight,
        0,
        0,
        tileWidthPx,
        tileHeightPx
      );
    }

    // Convert tile slice to PNG or JPEG bytes
    const isJpeg = quality === 'compressed';
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const qualityNum = quality === 'compressed' ? 0.75 : 0.95;
    const dataUrl = tileCanvas.toDataURL(mimeType, qualityNum);
    const base64Data = dataUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const embeddedImage = isJpeg 
      ? await pdfDoc.embedJpg(imageBytes) 
      : await pdfDoc.embedPng(imageBytes);

    // Position image slice within printable area on PDF page
    const printableXPt = mmToPt(tile.printableX);
    const printableYPt = mmToPt(tile.printableY);
    const printableWPt = mmToPt(tile.printableWidth);
    const printableHPt = mmToPt(tile.printableHeight);

    // Note: PDF coordinate system (0,0) is BOTTOM-LEFT
    const pdfYPt = sheetHPt - printableYPt - printableHPt;

    page.drawImage(embeddedImage, {
      x: printableXPt,
      y: pdfYPt,
      width: printableWPt,
      height: printableHPt,
    });

    // Draw Crop Marks (Crosshairs / L-marks at margin boundaries)
    if (config.showCropMarks) {
      const markLengthPt = 15; // ~5mm
      const x1 = printableXPt;
      const x2 = printableXPt + printableWPt;
      const y1 = pdfYPt;
      const y2 = pdfYPt + printableHPt;

      const strokeColor = rgb(0.2, 0.2, 0.2);
      const thickness = 0.75;
      const dir = config.marginMm === 0 ? 1 : -1;

      // Top-Left
      page.drawLine({ start: { x: x1 + (dir * markLengthPt), y: y2 }, end: { x: x1, y: y2 }, thickness, color: strokeColor });
      page.drawLine({ start: { x: x1, y: y2 }, end: { x: x1, y: y2 + (dir * markLengthPt) }, thickness, color: strokeColor });

      // Top-Right
      page.drawLine({ start: { x: x2 - (dir * markLengthPt), y: y2 }, end: { x: x2, y: y2 }, thickness, color: strokeColor });
      page.drawLine({ start: { x: x2, y: y2 }, end: { x: x2, y: y2 + (dir * markLengthPt) }, thickness, color: strokeColor });

      // Bottom-Left
      page.drawLine({ start: { x: x1 + (dir * markLengthPt), y: y1 }, end: { x: x1, y: y1 }, thickness, color: strokeColor });
      page.drawLine({ start: { x: x1, y: y1 }, end: { x: x1, y: y1 - (dir * markLengthPt) }, thickness, color: strokeColor });

      // Bottom-Right
      page.drawLine({ start: { x: x2 - (dir * markLengthPt), y: y1 }, end: { x: x2, y: y1 }, thickness, color: strokeColor });
      page.drawLine({ start: { x: x2, y: y1 }, end: { x: x2, y: y1 - (dir * markLengthPt) }, thickness, color: strokeColor });
    }

    // Draw Alignment / Border line
    if (config.showBorders) {
      page.drawRectangle({
        x: printableXPt,
        y: pdfYPt,
        width: printableWPt,
        height: printableHPt,
        borderWidth: 0.5,
        borderColor: rgb(0.7, 0.7, 0.7),
      });
    }

    // Draw Page Index Label
    if (config.showPageNumbers) {
      const pageLabelText = `Page ${tile.index} of ${totalTiles} (Row ${tile.row}, Col ${tile.col})`;
      page.drawText(pageLabelText, {
        x: printableXPt + 5,
        y: Math.max(5, printableYPt > 15 ? mmToPt(config.marginMm / 2) : 10),
        size: 8,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalTiles) * 100));
    }
  }

  return await pdfDoc.save();
}
