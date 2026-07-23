import React from 'react';
import { Layers } from 'lucide-react';
import { PAPER_PRESETS } from '@/lib/paper-sizes';

export default function PaperGuidePage() {
  const papers = [
    { key: 'A5', use: 'Small flyers, mini room posters, greeting cards' },
    { key: 'A4', use: 'Standard home printers, office documents, wall posters' },
    { key: 'A3', use: 'Medium wall posters, art prints, architectural sketches' },
    { key: 'Letter', use: 'Standard US home printer paper' },
    { key: 'Legal', use: 'Extended US legal document prints' },
    { key: 'Tabloid', use: 'Large format US 11x17 inch poster prints' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Paper Dimensions Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Paper Size Guide & Comparison</h1>
        <p className="text-slate-600 text-sm">
          Compare standard International ISO (A-series) and North American paper sizes for your poster printing project.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((p) => {
          const info = PAPER_PRESETS[p.key as keyof typeof PAPER_PRESETS];
          return (
            <div key={p.key} className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xl text-slate-900">{info.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {p.key}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.use}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Millimeters:</span>
                  <span className="font-bold text-slate-900">{info.widthMm} × {info.heightMm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inches:</span>
                  <span className="font-bold text-slate-900">
                    {(info.widthMm / 25.4).toFixed(1)} × {(info.heightMm / 25.4).toFixed(1)} in
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Scale Illustration */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 text-center">ISO 216 Paper Proportion Ratio</h2>
        <p className="text-slate-600 text-xs text-center max-w-xl mx-auto">
          In the ISO 216 standard (A-series), folding an A3 sheet in half produces two A4 sheets. Folding an A4 sheet in half produces two A5 sheets.
        </p>

        <div className="grid grid-cols-3 gap-4 text-center max-w-xl mx-auto text-xs">
          <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl">
            <span className="font-extrabold text-blue-700 block text-lg">A3</span>
            <span className="text-slate-500 text-[11px] font-medium">297 × 420 mm</span>
          </div>
          <div className="bg-blue-100/60 border border-blue-300 p-4 rounded-2xl">
            <span className="font-extrabold text-blue-800 block text-lg">A4</span>
            <span className="text-slate-600 text-[11px] font-medium">210 × 297 mm</span>
          </div>
          <div className="bg-blue-200/50 border border-blue-400 p-4 rounded-2xl">
            <span className="font-extrabold text-blue-900 block text-lg">A5</span>
            <span className="text-slate-700 text-[11px] font-medium">148 × 210 mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
