import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    { q: 'Is PosterForge 100% free to use?', a: 'Yes! PosterForge is completely free. There are no subscriptions, no registration forms, no paywalls, and no watermarks on your generated PDFs.' },
    { q: 'Are my images uploaded to a server?', a: 'Never. All image processing, canvas tiling, AI filtering, and PDF generation take place inside your web browser. Your images never leave your computer or phone.' },
    { q: 'How do I assemble the printable poster?', a: 'Print the PDF pages on standard A4 or Letter paper using 100% scale (no fitting/scaling in printer settings). Use the crop mark crosshairs to trim off one side margin, align the overlap tab, and glue the pages together.' },
    { q: 'What image formats can I upload?', a: 'PosterForge supports PNG, JPG, JPEG, and WEBP image formats.' },
    { q: 'Can I export in formats other than PDF?', a: 'Yes! You can export a printable PDF, a ZIP archive containing all individual PNG tile images, or download specific single tile PNGs.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <span>Frequently Asked Questions</span>
        </h1>
        <p className="text-slate-600 text-sm">Everything you need to know about PosterForge.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base">{f.q}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
