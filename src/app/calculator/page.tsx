'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator as CalcIcon, Grid, ArrowRight } from 'lucide-react';
import { PaperSizeKey, Unit } from '@/lib/types';
import { PAPER_PRESETS, convertToMm, convertFromMm } from '@/lib/paper-sizes';

export default function CalculatorPage() {
  const [paperSize, setPaperSize] = useState<PaperSizeKey>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [unit, setUnit] = useState<Unit>('cm');
  const [targetWidth, setTargetWidth] = useState<number>(100);
  const [targetHeight, setTargetHeight] = useState<number>(150);
  const [marginMm, setMarginMm] = useState<number>(5);
  const [overlapMm, setOverlapMm] = useState<number>(10);

  // Calculation Math
  const basePaper = PAPER_PRESETS[paperSize] || PAPER_PRESETS.A4;
  const rawW = basePaper.widthMm;
  const rawH = basePaper.heightMm;
  const sheetW = orientation === 'portrait' ? Math.min(rawW, rawH) : Math.max(rawW, rawH);
  const sheetH = orientation === 'portrait' ? Math.max(rawW, rawH) : Math.min(rawW, rawH);

  const printableW = Math.max(10, sheetW - 2 * marginMm);
  const printableH = Math.max(10, sheetH - 2 * marginMm);

  const strideW = Math.max(1, printableW - overlapMm);
  const strideH = Math.max(1, printableH - overlapMm);

  const targetWMm = convertToMm(targetWidth, unit);
  const targetHMm = convertToMm(targetHeight, unit);

  const cols = Math.max(1, Math.ceil((targetWMm - overlapMm) / strideW));
  const rows = Math.max(1, Math.ceil((targetHMm - overlapMm) / strideH));
  const totalPages = cols * rows;

  const actualPosterWMm = printableW + (cols - 1) * strideW;
  const actualPosterHMm = printableH + (rows - 1) * strideH;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <CalcIcon className="w-4 h-4 text-blue-600" />
          <span>Multi-Page Paper Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Poster Page Calculator</h1>
        <p className="text-slate-600 text-sm">
          Calculate exactly how many paper sheets, columns, and rows you need to print a poster of any custom size.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Inputs (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Poster & Paper Setup</h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-bold mb-1 block">Paper Preset</label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as PaperSizeKey)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              >
                {Object.keys(PAPER_PRESETS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold mb-1 block">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              >
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="inch">inches</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">Desired Width</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => setTargetWidth(parseFloat(e.target.value) || 10)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">Desired Height</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => setTargetHeight(parseFloat(e.target.value) || 10)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Page Margin (mm)</label>
              <input
                type="number"
                value={marginMm}
                onChange={(e) => setMarginMm(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Glue Overlap (mm)</label>
              <input
                type="number"
                value={overlapMm}
                onChange={(e) => setOverlapMm(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Output Summary Card (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-3xl border border-blue-500 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base border-b border-blue-400/40 pb-3 flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-200" />
              <span>Calculation Results</span>
            </h3>

            <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-1">
              <span className="text-xs text-blue-200 uppercase tracking-wider block font-semibold">Total Paper Sheets Needed</span>
              <div className="text-5xl font-extrabold text-white">{totalPages}</div>
              <span className="text-xs text-blue-100 font-semibold block mt-1">
                {cols} Columns × {rows} Rows
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-white/10 border border-white/15">
                <span className="text-blue-100">Sheet Format</span>
                <span className="font-bold text-white">{paperSize} ({orientation})</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-white/10 border border-white/15">
                <span className="text-blue-100">Exact Poster Dimension</span>
                <span className="font-bold text-white">
                  {convertFromMm(actualPosterWMm, unit)} × {convertFromMm(actualPosterHMm, unit)} {unit}
                </span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-white/10 border border-white/15">
                <span className="text-blue-100">Printable Area per Page</span>
                <span className="font-bold text-white">{printableW} × {printableH} mm</span>
              </div>
            </div>
          </div>

          <Link
            href="/tool"
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-blue-700 bg-white hover:bg-slate-50 shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <span>Open Tool Workspace With This Setup</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
