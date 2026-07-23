'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid as GridIcon, 
  Layers,
  Move
} from 'lucide-react';
import { ImageMetaData, PosterConfig } from '@/lib/types';
import { calculateGrid } from '@/lib/tiling-engine';
import { applyFiltersToCanvas } from '@/lib/canvas-filters';
import { convertFromMm } from '@/lib/paper-sizes';

interface LivePreviewCanvasProps {
  imageMeta: ImageMetaData | null;
  config: PosterConfig;
  onConfigChange?: (newConfig: PosterConfig) => void;
}

type HandleType = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | null;

export default function LivePreviewCanvas({ imageMeta, config, onConfigChange }: LivePreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pan & Zoom interactive state
  const [scale, setScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Dragging states
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Handle resize dragging state
  const [activeHandle, setActiveHandle] = useState<HandleType>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialConfig, setInitialConfig] = useState<{
    targetWidth: number;
    targetHeight: number;
    gridCols: number;
    gridRows: number;
    totalPosterWidthMm: number;
    totalPosterHeightMm: number;
  } | null>(null);

  // Computed positions stored for hit testing
  const posterRectRef = useRef<{
    startX: number;
    startY: number;
    widthPx: number;
    heightPx: number;
    effectiveScale: number;
    sheetWMm: number;
    sheetHMm: number;
  } | null>(null);

  const [cursorStyle, setCursorStyle] = useState<string>('grab');

  // Render trigger
  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const canvasWidth = parent.clientWidth || 800;
    const canvasHeight = parent.clientHeight || 600;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear background (Slate 100 light canvas workspace)
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
    ctx.lineWidth = 1;
    const step = 20 * scale;
    for (let x = (panOffset.x % step); x < canvasWidth; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = (panOffset.y % step); y < canvasHeight; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    if (!imageMeta) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload an image to see live poster tile preview', canvasWidth / 2, canvasHeight / 2);
      return;
    }

    // 1. Calculate Grid Tiling Math
    const grid = calculateGrid(config, imageMeta);

    // 2. Prepare Source Image Canvas (with filters applied)
    const tempSourceCanvas = document.createElement('canvas');
    tempSourceCanvas.width = imageMeta.width;
    tempSourceCanvas.height = imageMeta.height;

    const imgEl = new Image();
    imgEl.src = imageMeta.dataUrl;

    if (!imgEl.complete) {
      imgEl.onload = () => renderPreview();
      return;
    }

    applyFiltersToCanvas(imgEl, tempSourceCanvas, config.aiFilters);

    // 3. Compute scale to fit entire tiled poster into view canvas
    const marginBuffer = 50;
    const availableW = canvasWidth - marginBuffer * 2;
    const availableH = canvasHeight - marginBuffer * 2;

    const totalPosterWidthPx = grid.cols * grid.sheetWidthMm;
    const totalPosterHeightPx = grid.rows * grid.sheetHeightMm;

    const fitScale = Math.min(availableW / totalPosterWidthPx, availableH / totalPosterHeightPx);
    const effectiveScale = fitScale * scale;

    const posterPixelWidth = totalPosterWidthPx * effectiveScale;
    const posterPixelHeight = totalPosterHeightPx * effectiveScale;

    // Center poster in canvas + apply panOffset
    const startX = (canvasWidth - posterPixelWidth) / 2 + panOffset.x;
    const startY = (canvasHeight - posterPixelHeight) / 2 + panOffset.y;

    // Store poster rect metrics for drag handle hit testing
    posterRectRef.current = {
      startX,
      startY,
      widthPx: posterPixelWidth,
      heightPx: posterPixelHeight,
      effectiveScale,
      sheetWMm: grid.sheetWidthMm,
      sheetHMm: grid.sheetHeightMm,
    };

    ctx.save();

    // Draw individual paper tiles
    grid.tiles.forEach((tile) => {
      const sheetLeft = startX + (tile.col - 1) * tile.sheetWidthMm * effectiveScale;
      const sheetTop = startY + (tile.row - 1) * tile.sheetHeightMm * effectiveScale;
      const sheetW = tile.sheetWidthMm * effectiveScale;
      const sheetH = tile.sheetHeightMm * effectiveScale;

      // Draw paper sheet background
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(sheetLeft, sheetTop, sheetW, sheetH);
      ctx.shadowColor = 'transparent';

      // Printable area
      const printLeft = sheetLeft + tile.printableX * effectiveScale;
      const printTop = sheetTop + tile.printableY * effectiveScale;
      const printW = tile.printableWidth * effectiveScale;
      const printH = tile.printableHeight * effectiveScale;

      // Draw Image Slice
      if (tile.sourceWidth > 0 && tile.sourceHeight > 0) {
        ctx.drawImage(
          tempSourceCanvas,
          tile.sourceX,
          tile.sourceY,
          tile.sourceWidth,
          tile.sourceHeight,
          printLeft,
          printTop,
          printW,
          printH
        );
      }

      // Glue / Overlap zone indication
      if (config.overlapMm > 0) {
        const overlapPx = config.overlapMm * effectiveScale;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.fillRect(printLeft + printW - overlapPx, printTop, overlapPx, printH);
        ctx.fillRect(printLeft, printTop + printH - overlapPx, printW, overlapPx);
      }

      // Crop Marks
      if (config.showCropMarks) {
        const markLen = 8;
        const dir = config.marginMm === 0 ? 1 : -1;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;

        // TL
        ctx.beginPath();
        ctx.moveTo(printLeft + dir * markLen, printTop);
        ctx.lineTo(printLeft, printTop);
        ctx.lineTo(printLeft, printTop + dir * markLen);
        ctx.stroke();

        // TR
        ctx.beginPath();
        ctx.moveTo(printLeft + printW - dir * markLen, printTop);
        ctx.lineTo(printLeft + printW, printTop);
        ctx.lineTo(printLeft + printW, printTop + dir * markLen);
        ctx.stroke();

        // BL
        ctx.beginPath();
        ctx.moveTo(printLeft + dir * markLen, printTop + printH);
        ctx.lineTo(printLeft, printTop + printH);
        ctx.lineTo(printLeft, printTop + printH - dir * markLen);
        ctx.stroke();

        // BR
        ctx.beginPath();
        ctx.moveTo(printLeft + printW - dir * markLen, printTop + printH);
        ctx.lineTo(printLeft + printW, printTop + printH);
        ctx.lineTo(printLeft + printW, printTop + printH - dir * markLen);
        ctx.stroke();
      }

      // Alignment Border
      if (config.showBorders) {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(printLeft, printTop, printW, printH);
        ctx.setLineDash([]);
      }

      // Outer Paper Sheet Edge
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(sheetLeft, sheetTop, sheetW, sheetH);

      // Page Badge Label
      if (config.showPageNumbers) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(sheetLeft + 4, sheetTop + 4, 64, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Pg ${tile.index} (${tile.row},${tile.col})`, sheetLeft + 8, sheetTop + 16);
      }
    });

    // 4. Draw Interactive Bounding Box & Drag Resize Handles
    const x0 = startX;
    const y0 = startY;
    const x1 = startX + posterPixelWidth;
    const y1 = startY + posterPixelHeight;

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(x0, y0, posterPixelWidth, posterPixelHeight);

    // Render 8 Resize Handles
    const handlePoints: { type: HandleType; x: number; y: number }[] = [
      { type: 'tl', x: x0, y: y0 },
      { type: 't', x: x0 + posterPixelWidth / 2, y: y0 },
      { type: 'tr', x: x1, y: y0 },
      { type: 'r', x: x1, y: y0 + posterPixelHeight / 2 },
      { type: 'br', x: x1, y: y1 },
      { type: 'b', x: x0 + posterPixelWidth / 2, y: y1 },
      { type: 'bl', x: x0, y: y1 },
      { type: 'l', x: x0, y: y0 + posterPixelHeight / 2 },
    ];

    const hSize = 10;
    handlePoints.forEach((hp) => {
      ctx.fillStyle = activeHandle === hp.type ? '#1d4ed8' : '#ffffff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(hp.x - hSize / 2, hp.y - hSize / 2, hSize, hSize, 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw live drag dimension tooltip overlay if currently resizing
    if (activeHandle) {
      const tooltipText = `↔ ${grid.displayPosterWidth} × ${grid.displayPosterHeight} ${config.unit} (${grid.cols}x${grid.rows} Pages)`;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(canvasWidth / 2 - 120, 20, 240, 30);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(canvasWidth / 2 - 120, 20, 240, 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tooltipText, canvasWidth / 2, 40);
    }

    ctx.restore();
  }, [imageMeta, config, scale, panOffset, activeHandle]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  useEffect(() => {
    const handleResize = () => renderPreview();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderPreview]);

  // Handle Hit Testing
  const getHandleAtPosition = (mx: number, my: number): HandleType => {
    const pr = posterRectRef.current;
    if (!pr) return null;

    const x0 = pr.startX;
    const y0 = pr.startY;
    const x1 = pr.startX + pr.widthPx;
    const y1 = pr.startY + pr.heightPx;

    const handles: { type: HandleType; x: number; y: number }[] = [
      { type: 'tl', x: x0, y: y0 },
      { type: 't', x: x0 + pr.widthPx / 2, y: y0 },
      { type: 'tr', x: x1, y: y0 },
      { type: 'r', x: x1, y: y0 + pr.heightPx / 2 },
      { type: 'br', x: x1, y: y1 },
      { type: 'b', x: x0 + pr.widthPx / 2, y: y1 },
      { type: 'bl', x: x0, y: y1 },
      { type: 'l', x: x0, y: y0 + pr.heightPx / 2 },
    ];

    const hitRadius = 12;
    for (const h of handles) {
      if (Math.abs(mx - h.x) <= hitRadius && Math.abs(my - h.y) <= hitRadius) {
        return h.type;
      }
    }
    return null;
  };

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageMeta) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const clickedHandle = getHandleAtPosition(mx, my);

    if (clickedHandle && onConfigChange) {
      setActiveHandle(clickedHandle);
      setDragStart({ x: e.clientX, y: e.clientY });

      const gridStats = calculateGrid(config, imageMeta);
      setInitialConfig({
        targetWidth: config.targetWidth,
        targetHeight: config.targetHeight,
        gridCols: config.gridCols,
        gridRows: config.gridRows,
        totalPosterWidthMm: gridStats.totalPosterWidthMm,
        totalPosterHeightMm: gridStats.totalPosterHeightMm,
      });
    } else {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageMeta) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (activeHandle && initialConfig && posterRectRef.current && onConfigChange) {
      const dxPx = e.clientX - dragStart.x;
      const dyPx = e.clientY - dragStart.y;

      const effScale = posterRectRef.current.effectiveScale;
      const dxMm = dxPx / effScale;
      const dyMm = dyPx / effScale;

      let deltaWMm = 0;
      let deltaHMm = 0;

      if (activeHandle.includes('r')) deltaWMm = dxMm;
      if (activeHandle.includes('l')) deltaWMm = -dxMm;
      if (activeHandle.includes('b')) deltaHMm = dyMm;
      if (activeHandle.includes('t')) deltaHMm = -dyMm;

      if (config.sizingMode === 'dimensions') {
        const newWMm = Math.max(50, initialConfig.totalPosterWidthMm + deltaWMm);
        const newHMm = Math.max(50, initialConfig.totalPosterHeightMm + deltaHMm);

        onConfigChange({
          ...config,
          targetWidth: convertFromMm(newWMm, config.unit),
          targetHeight: convertFromMm(newHMm, config.unit),
        });
      } else {
        const sheetWMm = posterRectRef.current.sheetWMm;
        const sheetHMm = posterRectRef.current.sheetHMm;

        const newCols = Math.max(1, Math.round(initialConfig.gridCols + deltaWMm / sheetWMm));
        const newRows = Math.max(1, Math.round(initialConfig.gridRows + deltaHMm / sheetHMm));

        if (newCols !== config.gridCols || newRows !== config.gridRows) {
          onConfigChange({
            ...config,
            gridCols: newCols,
            gridRows: newRows,
          });
        }
      }
      return;
    }

    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    const hoverHandle = getHandleAtPosition(mx, my);
    if (hoverHandle) {
      if (hoverHandle === 'tl' || hoverHandle === 'br') setCursorStyle('nwse-resize');
      else if (hoverHandle === 'tr' || hoverHandle === 'bl') setCursorStyle('nesw-resize');
      else if (hoverHandle === 'l' || hoverHandle === 'r') setCursorStyle('ew-resize');
      else if (hoverHandle === 't' || hoverHandle === 'b') setCursorStyle('ns-resize');
    } else {
      setCursorStyle('grab');
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveHandle(null);
    setInitialConfig(null);
    setCursorStyle('grab');
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((prev) => Math.min(4, Math.max(0.4, prev * zoomFactor)));
  };

  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const gridStats = imageMeta ? calculateGrid(config, imageMeta) : null;

  return (
    <div className="relative w-full h-[550px] lg:h-[720px] xl:h-[780px] bg-[#F1F5F9] rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col shadow-lg shadow-slate-900/05">
      {/* Top Banner Stats */}
      {gridStats && (
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 pointer-events-auto shadow-md">
            <GridIcon className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">{gridStats.totalPages} Pages</span>
            <span className="text-slate-300">|</span>
            <span>{gridStats.rows} Rows × {gridStats.cols} Cols</span>
          </div>

          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 pointer-events-auto shadow-md">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Poster Size: <strong className="text-slate-900">{gridStats.displayPosterWidth} × {gridStats.displayPosterHeight} {config.unit}</strong></span>
          </div>
        </div>
      )}

      {/* Floating Canvas Drag Resize Hint */}
      {imageMeta && (
        <div className="absolute top-14 left-3 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-blue-50/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-200 text-xs text-blue-700 font-semibold shadow-xs">
            <Move className="w-3.5 h-3.5 text-blue-600" />
            <span>Drag blue handles to resize poster</span>
          </div>
        </div>
      )}

      {/* Floating Canvas Zoom Toolbar */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
        <button
          onClick={() => setScale((prev) => Math.min(4, prev * 1.2))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((prev) => Math.max(0.4, prev / 1.2))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        <button
          onClick={resetView}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold px-2"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Interactive HTML5 Canvas */}
      <div
        className="w-full h-full flex items-center justify-center select-none"
        style={{ cursor: cursorStyle }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
