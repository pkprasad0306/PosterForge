import JSZip from 'jszip';
import { ImageMetaData, PosterConfig } from './types';
import { calculateGrid } from './tiling-engine';
import { applyFiltersToCanvas } from './canvas-filters';

export async function generateTilesZip(
  imageMeta: ImageMetaData,
  config: PosterConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const grid = calculateGrid(config, imageMeta);
  const zip = new JSZip();

  const imgElement = new Image();
  imgElement.crossOrigin = 'anonymous';
  imgElement.src = imageMeta.dataUrl;

  await new Promise<void>((resolve, reject) => {
    imgElement.onload = () => resolve();
    imgElement.onerror = (e) => reject(e);
  });

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
  const folder = zip.folder('poster-tiles');

  for (let i = 0; i < totalTiles; i++) {
    const tile = grid.tiles[i];
    const tileCanvas = document.createElement('canvas');
    const wPx = Math.max(1, Math.round(tile.sourceWidth));
    const hPx = Math.max(1, Math.round(tile.sourceHeight));

    tileCanvas.width = wPx;
    tileCanvas.height = hPx;
    const ctx = tileCanvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        sourceImageOrCanvas,
        tile.sourceX,
        tile.sourceY,
        tile.sourceWidth,
        tile.sourceHeight,
        0,
        0,
        wPx,
        hPx
      );
    }

    const dataUrl = tileCanvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    const filename = `tile_row${tile.row}_col${tile.col}_page${tile.index}.png`;

    folder?.file(filename, base64Data, { base64: true });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalTiles) * 100));
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}
