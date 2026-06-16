'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type = 'text', icon, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono pl-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-neutral-400 pointer-events-none z-10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full font-sans text-sm h-11 rounded-xl px-4 py-2.5 outline-none transition-all duration-300',
              'glass-input text-white border-white/[0.06] placeholder-neutral-500 bg-white/[0.01]',
              'focus:bg-white/[0.04] focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-brand-magenta/90 pl-1 font-mono">{error}</span>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
export default GlassInput;
