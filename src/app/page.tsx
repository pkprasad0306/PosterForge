'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  Scissors, 
  FileText, 
  Layers, 
  Zap, 
  Lock, 
  ArrowRight,
  HelpCircle,
  Calculator
} from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import { ImageMetaData } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();

  const handleImageSelected = (meta: ImageMetaData) => {
    try {
      sessionStorage.setItem('poster_forge_pending_image', JSON.stringify(meta));
    } catch {
      // Ignore
    }
    router.push('/tool');
  };

  const steps = [
    { num: '01', title: 'Upload Image', desc: 'Drag & drop any JPG, PNG, or WEBP image. All processing stays in your browser.' },
    { num: '02', title: 'Choose Paper Size', desc: 'Select from standard A4, A3, Letter, Legal, Tabloid, or specify custom dimensions.' },
    { num: '03', title: 'Set Poster Size & Overlap', desc: 'Define your desired poster width/height or target page grid (e.g. 3x3 pages).' },
    { num: '04', title: 'Live Preview', desc: 'Inspect real-time tiles, alignment borders, crop mark indicators, and glue overlaps.' },
    { num: '05', title: 'Export & Print', desc: 'Download a 300 DPI printable PDF without watermarks or accounts.' },
  ];

  const features = [
    { icon: Lock, title: '100% Privacy Guaranteed', desc: 'Your photos never leave your device. All calculations, slicing, and PDF builds run locally.' },
    { icon: Zap, title: 'Instant Live Engine', desc: 'See immediate visual updates whenever you adjust poster grid, margins, or paper orientation.' },
    { icon: Scissors, title: 'Custom Overlap & Crop Marks', desc: 'Add 0–20mm glue overlap margins and crisp crop mark crosshairs for flawless poster assembly.' },
    { icon: FileText, title: 'Vector-Accurate 300 DPI PDF', desc: 'Export high-resolution PDFs formatted specifically for home or professional printers.' },
    { icon: Sparkles, title: 'AI Canvas Filters', desc: 'Fine-tune brightness, contrast, saturation, and auto-enhance directly in your browser.' },
    { icon: Layers, title: 'Multi-Format Export', desc: 'Download as a printable PDF, a ZIP file of PNG tiles, or individual image slices.' },
  ];

  const faqs = [
    { q: 'Is PosterForge really 100% free?', a: 'Yes! PosterForge is completely free to use with zero limitations, no hidden fees, no subscriptions, and no watermarks on your exported PDFs.' },
    { q: 'Are my uploaded images kept private?', a: 'Absolute privacy. PosterForge uses HTML5 Canvas API and WebAssembly to process images entirely inside your browser. No files are uploaded to any server.' },
    { q: 'How do I assemble the printed poster pages?', a: 'Printed pages include alignment borders and optional glue overlap zones (e.g. 10mm). Trim along the crop marks on one side, apply glue to the overlap margin, and tile the pages together.' },
    { q: 'What paper sizes are supported?', a: 'PosterForge supports standard A5, A4, A3, US Letter, US Legal, US Tabloid, as well as fully custom paper measurements in mm, cm, or inches.' },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto">
        {/* Soft Background Gradient Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-200/50 via-indigo-200/40 to-sky-100/30 blur-[130px] pointer-events-none rounded-full" />

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Browser-Based • Zero Registration • 100% Free</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Turn Any Image Into a Huge Printable <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">Multi-Page Poster</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Split large photos into tiled printable pages right inside your browser. Print at home on standard A4 or Letter paper and assemble your wall poster in minutes.
          </p>
        </div>

        {/* Hero Dropzone Box */}
        <div className="mt-10 max-w-3xl mx-auto relative z-10">
          <div className="p-3 bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/05">
            <Dropzone imageMeta={null} onImageSelected={handleImageSelected} />
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Creators Choose PosterForge
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Built from the ground up for speed, precision, and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1 shadow-md shadow-slate-900/03"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 group-hover:bg-blue-100/60 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-16 rounded-3xl border border-slate-200 shadow-md shadow-slate-900/03">
        <div className="text-center space-y-3 mb-12">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Simple Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How PosterForge Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="relative space-y-3 text-left p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-3xl font-extrabold text-blue-600/30">{step.num}</span>
              <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator Teaser */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              <Calculator className="w-4 h-4" />
              <span>Interactive Poster Calculator</span>
            </div>
            <h2 className="text-3xl font-extrabold">
              Want to calculate how many A4 pages your wall poster needs?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Use our quick calculator tool to input target wall size (in mm, cm, or inches) and immediately discover total pages, rows, and paper count.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-blue-700 bg-white hover:bg-slate-50 shadow-md transition-all text-sm"
              >
                <span>Open Poster Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3 min-w-[260px]">
            <span className="text-xs text-blue-200 uppercase tracking-wider block font-semibold">Example Estimate</span>
            <div className="text-3xl font-extrabold text-white">3 × 3 Grid</div>
            <p className="text-xs text-blue-100 font-medium">9 A4 Pages Total</p>
            <p className="text-[11px] text-blue-200">Poster size: ~63 × 89 cm</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle className="w-7 h-7 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
