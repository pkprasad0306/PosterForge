'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Archive, 
  Download, 
  Loader2, 
  Settings2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageMetaData, PosterConfig, ExportQuality } from '@/lib/types';
import { generatePosterPDF } from '@/lib/pdf-generator';
import { generateTilesZip } from '@/lib/zip-generator';
import { calculateGrid } from '@/lib/tiling-engine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageMeta: ImageMetaData;
  config: PosterConfig;
}

export default function ExportModal({ isOpen, onClose, imageMeta, config }: ExportModalProps) {
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setProgress(5);
    setStatusMsg('Preparing image slices...');

    try {
      const pdfBytes = await generatePosterPDF(imageMeta, config, quality, (p) => {
        setProgress(p);
        setStatusMsg(`Rendering page tiles (${p}%)...`);
      });

      setStatusMsg('Finalizing PDF document...');
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageMeta.name.replace(/\.[^/.]+$/, '')}_poster_${config.paperSize}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerConfetti();
      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('An error occurred while generating PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleDownloadZIP = async () => {
    setIsGenerating(true);
    setProgress(5);
    setStatusMsg('Zipping image tiles...');

    try {
      const zipBlob = await generateTilesZip(imageMeta, config, (p) => {
        setProgress(p);
        setStatusMsg(`Creating PNG tiles (${p}%)...`);
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageMeta.name.replace(/\.[^/.]+$/, '')}_tiles.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerConfetti();
      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
      alert('An error occurred while generating ZIP archive. Please try again.');
      setIsGenerating(false);
    }
  };

  const gridStats = calculateGrid(config, imageMeta);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Export Printable Poster</h3>
              <p className="text-xs text-slate-500">100% Client-Side Free Export</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 block font-medium">Poster Summary</span>
            <span className="font-bold text-slate-900 text-sm">
              {gridStats.totalPages} Pages ({gridStats.rows}x{gridStats.cols})
            </span>
          </div>
          <div className="text-right space-y-1">
            <span className="text-slate-500 block font-medium">Paper Size</span>
            <span className="font-bold text-blue-600">
              {config.paperSize} ({config.orientation})
            </span>
          </div>
        </div>

        {/* Quality Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-blue-600" />
            <span>Select Quality Preset</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'high', label: 'High Quality', desc: '300 DPI Original' },
              { key: 'standard', label: 'Standard', desc: 'Balanced Size' },
              { key: 'compressed', label: 'Compressed', desc: 'Fast & Lightweight' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setQuality(item.key as ExportQuality)}
                disabled={isGenerating}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  quality === item.key
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm font-semibold'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Printer Scale Important Tip */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
          <span className="font-extrabold flex items-center gap-1">
            💡 Important Printing Instructions:
          </span>
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
            When printing the exported PDF, set your printer dialog scaling to <strong className="text-amber-900 font-extrabold">"100% / Actual Size"</strong> (do NOT select "Fit to Printable Area") so crop marks align perfectly.
          </p>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                {statusMsg}
              </span>
              <span className="font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>Download Printable PDF</span>
          </button>

          <button
            onClick={handleDownloadZIP}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Archive className="w-4 h-4 text-indigo-600" />
            <span>Download Tiles as ZIP Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}
