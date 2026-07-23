'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Printer, 
  Grid, 
  Layout, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/tool', label: 'Poster Workspace', icon: Grid },
    { href: '/templates', label: 'Templates', icon: Layout },
    { href: '/calculator', label: 'Calculator', icon: Calculator },
    { href: '/paper-guide', label: 'Paper Guide', icon: Layers },
    { href: '/guides', label: 'Printing Guides', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="PosterForge Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              Poster<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">Forge</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">FREE</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Privacy Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">100% Client-Side Privacy</span>
          </div>
          <Link
            href="/tool"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-blue-100" />
            Start Printing
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-blue-600" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/tool"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
            >
              <Sparkles className="w-5 h-5" />
              Launch Poster Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
