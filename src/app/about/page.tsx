import React from 'react';
import { ShieldCheck, Printer } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">About PosterForge</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Building the fastest, most private online poster tiling tool on the web.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 space-y-6 text-slate-600 text-sm leading-relaxed shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Our Privacy-First Philosophy</span>
        </h2>
        <p>
          PosterForge was designed with a simple promise: your images belong to you. Unlike traditional online media tools that upload your private photos to remote cloud servers, PosterForge processes 100% of your images locally within your browser using HTML5 Canvas API and WebAssembly.
        </p>
        <p>
          No server storage. No account creation. No tracking of uploaded files. Pure, lightning-fast client-side performance.
        </p>

        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 pt-4">
          <Printer className="w-5 h-5 text-blue-600" />
          <span>Why We Built PosterForge</span>
        </h2>
        <p>
          Printing giant wall posters shouldn’t require expensive specialized print shops or clunky paid software. Whether you’re a teacher printing classroom charts, an event organizer making concert banners, or a fan creating custom bedroom decor, PosterForge empowers anyone to split large images into normal home printable A4/Letter sheets effortlessly.
        </p>
      </div>
    </div>
  );
}
