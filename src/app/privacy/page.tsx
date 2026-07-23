import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <span>Privacy Policy</span>
        </h1>
        <p className="text-slate-600 text-sm">100% Client-Side Privacy Guarantee</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 space-y-6 text-slate-600 text-sm leading-relaxed shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900">1. Zero File Upload Policy</h2>
        <p>
          PosterForge operates entirely inside your web browser client. When you upload, slice, edit, or convert an image into a printable PDF, all processing is performed locally on your device using HTML5 Canvas API and WebAssembly. Your images are never sent over the network to any server.
        </p>

        <h2 className="text-xl font-extrabold text-slate-900">2. No Account or Personal Data Collection</h2>
        <p>
          We do not require user registration, email addresses, names, or passwords. You can use all features anonymously and freely.
        </p>

        <h2 className="text-xl font-extrabold text-slate-900">3. Local Browser Storage</h2>
        <p>
          Recent project configurations and user settings (e.g., unit preference, default paper size) are stored strictly inside your browser’s LocalStorage. This data stays on your device and can be cleared at any time.
        </p>
      </div>
    </div>
  );
}
