'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'glass' | 'cyan' | 'purple' | 'magenta' | 'outline';
  fullWidth?: boolean;
}

export default function GlassButton({
  children,
  className,
  variant = 'glass',
  fullWidth = false,
  ...props
}: GlassButtonProps) {
  const variantClasses = {
    glass: 'glass-button hover:bg-white/[0.08] hover:border-white/[0.2] text-white',
    cyan: 'bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 hover:text-white shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    purple: 'bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(147,51,234,0.1)] hover:shadow-[0_0_25px_rgba(147,51,234,0.3)]',
    magenta: 'bg-pink-600/10 hover:bg-pink-600/25 border border-pink-500/30 text-white shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]',
    outline: 'border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white hover:bg-white/[0.02]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center font-sans font-medium px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-sm outline-none shrink-0 overflow-hidden',
        fullWidth ? 'w-full' : '',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Glossy top line light highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Hover glow sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
