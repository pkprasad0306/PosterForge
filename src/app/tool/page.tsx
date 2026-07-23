'use client';

import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Layers, 
  Grid as GridIcon, 
  Download, 
  Save, 
  History, 
  Sparkles, 
  Scissors,
  Undo2,
  Redo2,
  Eye,
  Settings
} from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import LivePreviewCanvas from '@/components/LivePreviewCanvas';
import ExportModal from '@/components/ExportModal';
import { 
  ImageMetaData, 
  PosterConfig, 
  PaperSizeKey, 
  Orientation, 
  ScalingMode, 
  Unit,
  SavedProject 
} from '@/lib/types';
import { PAPER_PRESETS } from '@/lib/paper-sizes';
import { calculateGrid } from '@/lib/tiling-engine';
import { saveProjectLocally, getSavedProjects } from '@/lib/storage';

export default function ToolPage() {
  const [imageMeta, setImageMeta] = useState<ImageMetaData | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState<SavedProject[]>([]);
  const [activeTab, setActiveTab] = useState<'paper' | 'size' | 'print' | 'ai'>('paper');

  // Default Poster Configuration
  const [config, setConfig] = useState<PosterConfig>({
    paperSize: 'A4',
    customPaperWidth: 210,
    customPaperHeight: 297,
    orientation: 'portrait',
    unit: 'mm',
    sizingMode: 'pages',
    targetWidth: 420,
    targetHeight: 594,
    gridCols: 2,
    gridRows: 2,
    scaling: 'fit',
    marginMm: 5,
    overlapMm: 10,
    showCropMarks: true,
    showPageNumbers: true,
    showBorders: true,
    aiFilters: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpen: false,
      autoEnhance: false,
    },
  });

  // Load pending image from sessionStorage on mount if available
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('poster_forge_pending_image');
      if (stored) {
        const parsed = JSON.parse(stored);
        setImageMeta(parsed);
        sessionStorage.removeItem('poster_forge_pending_image');
      }
    } catch {
      // Ignore
    }
    setRecentProjects(getSavedProjects());
  }, []);

  const [mobileView, setMobileView] = useState<'controls' | 'preview'>('controls');
  const [historyStack, setHistoryStack] = useState<PosterConfig[]>([config]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const handleImageSelected = (meta: ImageMetaData) => {
    setImageMeta(meta);
  };

  const updateConfig = (newConfig: PosterConfig) => {
    setConfig(newConfig);
    const newStack = historyStack.slice(0, historyIndex + 1);
    setHistoryStack([...newStack, newConfig]);
    setHistoryIndex(newStack.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setConfig(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setConfig(next);
    }
  };

  const handleSaveProject = async () => {
    if (!imageMeta) return;
    const updated = await saveProjectLocally(
      imageMeta.name,
      config,
      imageMeta.dataUrl
    );
    setRecentProjects(updated);
    alert('Project saved to local history!');
  };

  const handleLoadProject = (proj: SavedProject) => {
    updateConfig(proj.config);
    if (proj.thumbnailUrl) {
      setImageMeta({
        name: proj.name,
        width: 1920,
        height: 1080,
        aspectRatio: 1.77,
        fileSizeFormatted: 'Saved',
        type: 'PNG',
        dataUrl: proj.thumbnailUrl,
      });
    }
    setHistoryOpen(false);
  };

  return (
    <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-900/03">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <span>Poster Workspace</span>
          </h1>
          <p className="text-xs text-slate-500">Configure layout, paper dimensions, and live preview</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 disabled:opacity-30 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= historyStack.length - 1}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 disabled:opacity-30 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>History ({recentProjects.length})</span>
          </button>

          {imageMeta && (
            <>
              <button
                onClick={handleSaveProject}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
              >
                <Save className="w-4 h-4 text-emerald-600" />
                <span>Save Local</span>
              </button>

              <button
                onClick={() => setExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 transition-all transform active:scale-95 ml-auto sm:ml-0"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF / ZIP</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sticky View Switcher (Visible only on mobile screens) */}
      <div className="flex lg:hidden items-center justify-center p-1 rounded-2xl bg-slate-200/80 border border-slate-300 text-xs font-bold space-x-1">
        <button
          onClick={() => setMobileView('controls')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileView === 'controls' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Edit Controls</span>
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileView === 'preview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Canvas Preview</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls Sidebar (4 cols) */}
        <div className={`lg:col-span-4 space-y-6 ${mobileView === 'controls' ? 'block' : 'hidden lg:block'}`}>
          {/* Dropzone Container */}
          <Dropzone imageMeta={imageMeta} onImageSelected={handleImageSelected} onClearImage={() => setImageMeta(null)} />

          {/* Config Tabs & Controls */}
          {imageMeta && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 overflow-hidden space-y-4 p-5 shadow-lg shadow-slate-900/03">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs">
                {[
                  { id: 'paper', label: 'Paper & Orientation', icon: Layers },
                  { id: 'size', label: 'Poster Dimensions', icon: GridIcon },
                  { id: 'print', label: 'Print Tweaks', icon: Scissors },
                  { id: 'ai', label: 'AI Canvas Filters', icon: Sparkles },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
                        activeTab === t.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Paper Presets & Orientation */}
              {activeTab === 'paper' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div>
                    <label className="text-slate-800 font-bold mb-2 block">Standard Paper Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid', 'Custom'] as PaperSizeKey[]).map((key) => (
                        <button
                          key={key}
                          onClick={() => setConfig({ ...config, paperSize: key })}
                          className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                            config.paperSize === key
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-800 font-bold mb-2 block">Orientation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['portrait', 'landscape'] as Orientation[]).map((o) => (
                        <button
                          key={o}
                          onClick={() => setConfig({ ...config, orientation: o })}
                          className={`p-2.5 rounded-2xl border text-center font-bold capitalize transition-all ${
                            config.orientation === o
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-800 font-bold mb-2 block">Measurement Unit</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['mm', 'cm', 'inch'] as Unit[]).map((u) => (
                        <button
                          key={u}
                          onClick={() => setConfig({ ...config, unit: u })}
                          className={`p-2 rounded-xl border text-center font-bold transition-all ${
                            config.unit === u
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                              : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Poster Dimensions & Grid */}
              {activeTab === 'size' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div>
                    <label className="text-slate-800 font-bold mb-2 block">Sizing Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConfig({ ...config, sizingMode: 'pages' })}
                        className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                          config.sizingMode === 'pages'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Target Page Grid (NxM)
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, sizingMode: 'dimensions' })}
                        className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                          config.sizingMode === 'dimensions'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Target Wall Size ({config.unit})
                      </button>
                    </div>
                  </div>

                  {config.sizingMode === 'pages' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Columns (Horizontal Pages)</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={config.gridCols}
                          onChange={(e) => setConfig({ ...config, gridCols: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-extrabold text-center focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Rows (Vertical Pages)</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={config.gridRows}
                          onChange={(e) => setConfig({ ...config, gridRows: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-extrabold text-center focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Width ({config.unit})</label>
                        <input
                          type="number"
                          value={config.targetWidth}
                          onChange={(e) => setConfig({ ...config, targetWidth: parseFloat(e.target.value) || 100 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-extrabold text-center focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Height ({config.unit})</label>
                        <input
                          type="number"
                          value={config.targetHeight}
                          onChange={(e) => setConfig({ ...config, targetHeight: parseFloat(e.target.value) || 100 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-extrabold text-center focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-800 font-bold mb-2 block">Scaling Mode</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['fit', 'fill', 'stretch', 'original'] as ScalingMode[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setConfig({ ...config, scaling: s })}
                          className={`p-2 rounded-xl border text-center font-bold capitalize transition-all ${
                            config.scaling === s
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                              : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Print Adjustments */}
              {activeTab === 'print' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-800 font-bold">Page Margin & Edge Mode</label>
                      <span className="font-extrabold text-blue-600">
                        {config.marginMm === 0 ? '0 mm (Cut-to-Cut / Borderless)' : `${config.marginMm} mm`}
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        onClick={() => setConfig({ ...config, marginMm: 0 })}
                        className={`p-2.5 rounded-2xl border text-center font-extrabold transition-all ${
                          config.marginMm === 0
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ✂️ Cut-to-Cut (0 mm)
                      </button>

                      <button
                        onClick={() => setConfig({ ...config, marginMm: 5 })}
                        className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                          config.marginMm === 5
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📄 Standard (5 mm)
                      </button>

                      <button
                        onClick={() => setConfig({ ...config, marginMm: 10 })}
                        className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                          config.marginMm === 10
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📏 Wide (10 mm)
                      </button>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={config.marginMm}
                      onChange={(e) => setConfig({ ...config, marginMm: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />

                    {config.marginMm === 0 && (
                      <p className="mt-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        ✨ 100% Full-Bleed Cut-to-Cut Mode: Image prints edge-to-edge across each paper sheet.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold">Glue Tile Overlap (0–20 mm)</label>
                      <span className="font-extrabold text-blue-600">{config.overlapMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={config.overlapMm}
                      onChange={(e) => setConfig({ ...config, overlapMm: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
                      <span className="text-slate-800 font-semibold">Show Crop Mark Crosshairs</span>
                      <input
                        type="checkbox"
                        checked={config.showCropMarks}
                        onChange={(e) => setConfig({ ...config, showCropMarks: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
                      <span className="text-slate-800 font-semibold">Show Alignment Cut Borders</span>
                      <input
                        type="checkbox"
                        checked={config.showBorders}
                        onChange={(e) => setConfig({ ...config, showBorders: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
                      <span className="text-slate-800 font-semibold">Show Page Numbers</span>
                      <input
                        type="checkbox"
                        checked={config.showPageNumbers}
                        onChange={(e) => setConfig({ ...config, showPageNumbers: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 4: AI Filters */}
              {activeTab === 'ai' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold">Brightness</label>
                      <span className="font-extrabold text-slate-800">{config.aiFilters.brightness}</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={config.aiFilters.brightness}
                      onChange={(e) => setConfig({
                        ...config,
                        aiFilters: { ...config.aiFilters, brightness: parseInt(e.target.value) }
                      })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold">Contrast</label>
                      <span className="font-extrabold text-slate-800">{config.aiFilters.contrast}</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={config.aiFilters.contrast}
                      onChange={(e) => setConfig({
                        ...config,
                        aiFilters: { ...config.aiFilters, contrast: parseInt(e.target.value) }
                      })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold">Color Saturation</label>
                      <span className="font-extrabold text-slate-800">{config.aiFilters.saturation}</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={config.aiFilters.saturation}
                      onChange={(e) => setConfig({
                        ...config,
                        aiFilters: { ...config.aiFilters, saturation: parseInt(e.target.value) }
                      })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
                      <span className="text-slate-800 font-semibold">Apply Image Sharpen Filter</span>
                      <input
                        type="checkbox"
                        checked={config.aiFilters.sharpen}
                        onChange={(e) => setConfig({
                          ...config,
                          aiFilters: { ...config.aiFilters, sharpen: e.target.checked }
                        })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
                      <span className="text-slate-800 font-semibold">Auto-Enhance Poster Colors</span>
                      <input
                        type="checkbox"
                        checked={config.aiFilters.autoEnhance}
                        onChange={(e) => setConfig({
                          ...config,
                          aiFilters: { ...config.aiFilters, autoEnhance: e.target.checked }
                        })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Main Live Preview (8 cols) */}
        <div className={`lg:col-span-8 space-y-4 ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <LivePreviewCanvas imageMeta={imageMeta} config={config} onConfigChange={(newCfg) => updateConfig(newCfg)} />
        </div>
      </div>

      {/* Export Modal */}
      {imageMeta && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          imageMeta={imageMeta}
          config={config}
        />
      )}

      {/* Recent Projects History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Recent Projects History</span>
              </h3>
              <button onClick={() => setHistoryOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">No saved projects found in local browser storage.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</h4>
                      <p className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleLoadProject(p)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Load Project
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
