import { AIFilters } from './types';

export function applyFiltersToCanvas(
  sourceCanvas: HTMLCanvasElement | HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  filters: AIFilters
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;

  // Build CSS filter string for high-speed hardware acceleration where supported
  let brightnessVal = 100 + filters.brightness;
  let contrastVal = 100 + filters.contrast;
  let saturationVal = 100 + filters.saturation;

  if (filters.autoEnhance) {
    brightnessVal += 5;
    contrastVal += 12;
    saturationVal += 10;
  }

  const filterString = `brightness(${Math.max(0, brightnessVal)}%) contrast(${Math.max(0, contrastVal)}%) saturate(${Math.max(0, saturationVal)}%)`;
  
  ctx.save();
  ctx.filter = filterString;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.restore();

  // Apply Sharpen filter kernel if enabled
  if (filters.sharpen) {
    const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    const sharpened = applySharpenKernel(imageData);
    ctx.putImageData(sharpened, 0, 0);
  }
}

function applySharpenKernel(imageData: ImageData): ImageData {
  const w = imageData.width;
  const h = imageData.height;
  const src = imageData.data;
  const output = new ImageData(w, h);
  const dst = output.data;

  // Simple 3x3 Sharpen Kernel:
  //  0  -1   0
  // -1   5  -1
  //  0  -1   0

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      for (let c = 0; c < 3; c++) {
        const center = src[idx + c];
        const top = src[((y - 1) * w + x) * 4 + c];
        const bottom = src[((y + 1) * w + x) * 4 + c];
        const left = src[(y * w + (x - 1)) * 4 + c];
        const right = src[(y * w + (x + 1)) * 4 + c];

        const val = 5 * center - top - bottom - left - right;
        dst[idx + c] = Math.min(255, Math.max(0, val));
      }
      dst[idx + 3] = src[idx + 3]; // Alpha channel
    }
  }

  return output;
}
