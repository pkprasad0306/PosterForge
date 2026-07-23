import React from 'react';
import Link from 'next/link';
import { Printer, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.svg" alt="PosterForge Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-slate-900">Poster<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Forge</span></span>
            </Link>
            <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">
              The modern, privacy-first online poster tiler. Convert any image into a multi-page printable PDF with zero server upload.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Client-Side WebAssembly & Canvas Engine</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Tools & Features</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/tool" className="hover:text-blue-600 transition-colors">Poster Tiler Workspace</Link></li>
              <li><Link href="/templates" className="hover:text-blue-600 transition-colors">Poster Template Library</Link></li>
              <li><Link href="/calculator" className="hover:text-blue-600 transition-colors">Interactive Poster Calculator</Link></li>
              <li><Link href="/paper-guide" className="hover:text-blue-600 transition-colors">Paper Size Guide & Comparison</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Printing Guides</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/guides" className="hover:text-blue-600 transition-colors">How to Print Posters at Home</Link></li>
              <li><Link href="/guides" className="hover:text-blue-600 transition-colors">Image Resolution & DPI Guide</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About PosterForge</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Privacy */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Privacy & Terms</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy (Zero Uploads)</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PosterForge. All rights reserved. 100% Free & Open-Access.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with privacy in mind for creators everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
