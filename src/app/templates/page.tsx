'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Sparkles } from 'lucide-react';
import { ImageMetaData } from '@/lib/types';

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  bgGradient: string;
  dataUrl: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-edu-1',
    title: 'Periodic Table Science Chart',
    category: 'Education',
    description: 'High contrast science infographic layout for classroom wall display.',
    bgGradient: 'from-blue-600 via-indigo-700 to-purple-800',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%230f172a"/><text x="600" y="300" font-family="sans-serif" font-size="64" font-weight="bold" fill="%2338bdf8" text-anchor="middle">PERIODIC TABLE</text><rect x="200" y="400" width="800" height="900" fill="%231e293b" rx="20"/><text x="600" y="850" font-family="sans-serif" font-size="40" fill="%2394a3b8" text-anchor="middle">EDUCATIONAL POSTER TEMPLATE</text></svg>',
  },
  {
    id: 'tmpl-biz-1',
    title: 'Corporate Q3 Strategy Map',
    category: 'Business',
    description: 'Sleek dark executive timeline for office conference rooms.',
    bgGradient: 'from-slate-800 via-gray-900 to-black',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%23090d16"/><text x="600" y="300" font-family="sans-serif" font-size="64" font-weight="bold" fill="%2360a5fa" text-anchor="middle">STRATEGY ROADMAP</text><rect x="150" y="450" width="900" height="800" fill="%231e293b" rx="20"/><text x="600" y="850" font-family="sans-serif" font-size="36" fill="%23cbd5e1" text-anchor="middle">BUSINESS TIMELINE</text></svg>',
  },
  {
    id: 'tmpl-bday-1',
    title: 'Neon Birthday Celebration Banner',
    category: 'Birthday',
    description: 'Vibrant party banner poster template for giant wall decorations.',
    bgGradient: 'from-pink-500 via-purple-600 to-indigo-600',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%2331103f"/><text x="600" y="400" font-family="sans-serif" font-size="72" font-weight="bold" fill="%23f472b6" text-anchor="middle">HAPPY BIRTHDAY!</text><text x="600" y="900" font-family="sans-serif" font-size="40" fill="%23f0abfc" text-anchor="middle">GIANT WALL BANNER</text></svg>',
  },
  {
    id: 'tmpl-event-1',
    title: 'Music Festival Concert Poster',
    category: 'Events',
    description: 'Bold typography poster template designed for event promo.',
    bgGradient: 'from-amber-500 via-orange-600 to-red-700',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%231c100b"/><text x="600" y="350" font-family="sans-serif" font-size="80" font-weight="extrabold" fill="%23fbbf24" text-anchor="middle">SUMMER FESTIVAL</text><text x="600" y="850" font-family="sans-serif" font-size="44" fill="%23f97316" text-anchor="middle">LIVE CONCERT STAGE</text></svg>',
  },
  {
    id: 'tmpl-sport-1',
    title: 'Championship Match Poster',
    category: 'Sports',
    description: 'Dynamic sports tournament announcement grid.',
    bgGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%23062e24"/><text x="600" y="350" font-family="sans-serif" font-size="72" font-weight="bold" fill="%2334d399" text-anchor="middle">CHAMPIONSHIP MATCH</text><text x="600" y="850" font-family="sans-serif" font-size="40" fill="%23a7f3d0" text-anchor="middle">SPORTS LEAGUE 2026</text></svg>',
  },
  {
    id: 'tmpl-moti-1',
    title: 'Minimalist Quote Poster',
    category: 'Motivational',
    description: 'Clean typographic wall quote for modern studio rooms.',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="%23111827"/><text x="600" y="700" font-family="serif" font-size="56" font-style="italic" fill="%23f3f4f6" text-anchor="middle">"DREAM BIG. WORK HARD."</text><text x="600" y="1000" font-family="sans-serif" font-size="28" fill="%239ca3af" text-anchor="middle">MOTIVATIONAL STUDIO SERIES</text></svg>',
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Education', 'Business', 'Birthday', 'Events', 'Sports', 'Motivational'];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (tmpl: TemplateItem) => {
    const meta: ImageMetaData = {
      name: `${tmpl.title}.png`,
      width: 1200,
      height: 1600,
      aspectRatio: 1200 / 1600,
      fileSizeFormatted: 'Template',
      type: 'PNG',
      dataUrl: tmpl.dataUrl,
    };

    try {
      sessionStorage.setItem('poster_forge_pending_image', JSON.stringify(meta));
    } catch {
      // Ignore
    }
    router.push('/tool');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Layout className="w-4 h-4 text-blue-600" />
          <span>Starter Poster Templates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Poster Template Library</h1>
        <p className="text-slate-600 text-sm">
          Select a pre-designed poster preset below to immediately load it into your tiling workspace.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col group hover:border-blue-400 transition-all duration-300 shadow-md shadow-slate-900/03"
          >
            {/* SVG Cover */}
            <div className={`w-full h-56 bg-gradient-to-tr ${t.bgGradient} p-4 flex items-center justify-center relative overflow-hidden`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.dataUrl} alt={t.title} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-extrabold border border-blue-200">
                {t.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{t.title}</h3>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{t.description}</p>
              </div>

              <button
                onClick={() => handleUseTemplate(t)}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use This Template in Workspace</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
