"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tighter">CAFlow AI</span>
          </Link>
          <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">
            The intelligent operating system for modern CA firms. Built for speed, scale, and compliance.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-amber-600 transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-600 transition-colors">Terms of Service</Link>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <span>Powered by</span>
            <span className="font-bold text-slate-900">Funkariya</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            © 2025 CAFlow AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
