'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Mail className="w-8 h-8 text-blue-600" />
          <span>Contact Us</span>
        </h1>
        <p className="text-slate-600 text-sm">Have feedback, suggestions, or feature requests?</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
        {submitted ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
            <p className="text-slate-600 text-xs">Thank you for reaching out. We appreciate your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-bold mb-1 block">Your Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold mb-1 block">Email Address</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold mb-1 block">Message</label>
              <textarea
                required
                rows={4}
                placeholder="How can we help you?"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
