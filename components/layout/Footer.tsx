'use client';

import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Globe, Shield, CreditCard, Box } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/6 bg-[#020204] px-6 py-16 overflow-hidden mt-auto">
      {/* Visual Ambient Glow backings */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-brand-purple/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-brand-cyan/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Section 1: Logo & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px]">
                <div className="w-full h-full rounded-[7px] bg-[#020204] flex items-center justify-center font-mono font-bold text-sm text-transparent bg-clip-text bg-gradient-to-tr from-purple-600 to-indigo-500">
                  F
                </div>
              </div>
              <span className="font-sans font-extrabold tracking-tighter text-xl bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                FixoraX
              </span>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your trusted destination for premium smartphones, accessories, and mobile repairs situated in Gampaha.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 px-2.5 py-1 rounded">
                Glass Elite Tier
              </span>
            </div>
          </div>

          {/* Section 2: Contact & Founder (Strictly Literal Coordinates) */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Store Location
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-neutral-400">
                  <MapPin size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                  <span>
                    No. 39/2B/1, <br />
                    Ja-Ela Road, <br />
                    Gampaha
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                  <Mail size={14} className="text-neutral-500 shrink-0" />
                  <a href="mailto:fixorax2026@gmail.com" className="hover:text-indigo-400 transition font-mono">
                    fixorax2026@gmail.com
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-xs text-neutral-400">
                  <Phone size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono">+94 915 2005</p>
                    <p className="font-mono">+78 277 2598</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-400">
                  <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">FOUNDER & CEO</p>
                  <p className="font-semibold text-neutral-200 mt-1">Shehan Sandaru</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Safe Protocols */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Secured Escrow
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-neutral-400 leading-relaxed">
                <Shield size={14} className="text-indigo-400 shrink-0" />
                <span>Encrypted checkout validation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 leading-relaxed">
                <Box size={14} className="text-purple-500 shrink-0" />
                <span>Fragile-freight protective crates</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 leading-relaxed">
                <CreditCard size={14} className="text-neutral-500 shrink-0" />
                <span>Card, Bank, and Crypto supported</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/6 my-10" />

        {/* Footer Bottom copyright area with oshajr link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} FixoraX Premium Ltd. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
              Developed by{' '}
              <a
                href="https://oshanjr.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 font-bold tracking-wide hover:underline cursor-pointer inline-flex items-center gap-0.5"
              >
                oshajr <ExternalLink size={10} className="stroke-[2.5]" />
              </a>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-500">Gampaha, Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
