import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <span>Terms of Service</span>
        </h1>
        <p className="text-slate-600 text-sm">Terms and Conditions for PosterForge</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 space-y-6 text-slate-600 text-sm leading-relaxed shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900">1. Free Usage</h2>
        <p>
          PosterForge is provided as a free web utility for personal and commercial poster tiling and PDF generation.
        </p>

        <h2 className="text-xl font-extrabold text-slate-900">2. User Responsibility</h2>
        <p>
          Users are solely responsible for ensuring they hold the necessary rights and permissions for any images they upload and print using PosterForge.
        </p>

        <h2 className="text-xl font-extrabold text-slate-900">3. Disclaimer of Warranty</h2>
        <p>
          PosterForge is provided "as is" without warranty of any kind. All processing occurs locally on user hardware.
        </p>
      </div>
    </div>
  );
}
