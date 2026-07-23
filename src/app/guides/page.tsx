import React from 'react';
import { BookOpen } from 'lucide-react';

export default function GuidesPage() {
  const articles = [
    {
      title: 'How to Print & Assemble Multi-Page Posters at Home',
      category: 'Printing Tutorial',
      readTime: '4 min read',
      summary: 'Learn how to split your favorite image into a grid of A4 sheets, apply 10mm glue overlaps, and assemble a seamless wall poster.',
      content: [
        '1. Upload your high-resolution image to PosterForge.',
        '2. Choose your home paper size (A4 or US Letter).',
        '3. Enable Cut-to-Cut (0mm) or Glue Overlap (recommended 10mm) and Crop Mark Crosshairs.',
        '4. Download the 300 DPI PDF.',
        '5. Set your printer scaling to "100% / Actual Size" (do not select "Fit to Printable Area" in Adobe Acrobat or browser print dialog).',
        '6. Trim off the border margin on ONE side of each overlapping page.',
        '7. Apply glue stick or double-sided tape along the shaded overlap tab and align the crop mark crosshairs.',
      ]
    },
    {
      title: 'Image Resolution & DPI Guide for Giant Posters',
      category: 'DPI Guide',
      readTime: '3 min read',
      summary: 'Understanding pixels, DPI (Dots Per Inch), and viewing distances for large format wall prints.',
      content: [
        '• 300 DPI: Ideal for close-up viewing (photo albums and small prints).',
        '• 150 DPI: Excellent for medium posters viewed from 1–2 meters away.',
        '• 72–100 DPI: Sufficient for giant wall murals viewed from 3+ meters away.',
        '• Tip: A 3840 x 2160 (4K) image produces a crisp 4 x 3 page A4 poster without noticeable pixelation.',
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Poster Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Poster Printing Guides & Tutorials</h1>
        <p className="text-slate-600 text-sm">
          Everything you need to know about paper selection, alignment margins, and home printer setup.
        </p>
      </div>

      <div className="space-y-8">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {art.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">{art.readTime}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">{art.title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{art.summary}</p>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-blue-600 mb-2">Step-by-Step Instructions:</h4>
              {art.content.map((item, i) => (
                <p key={i} className="text-slate-700 leading-relaxed font-medium">{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
