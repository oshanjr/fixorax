'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  glow?: 'cyan' | 'purple' | 'magenta' | 'none';
  interactive?: boolean;
}

export default function GlassCard({
  children,
  className,
  glow = 'none',
  interactive = true,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    cyan: 'shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:shadow-[0_0_40px_rgba(99,102,241,0.12)] border-indigo-500/20',
    purple: 'shadow-[0_0_30px_rgba(147,51,234,0.05)] hover:shadow-[0_0_40px_rgba(147,51,234,0.12)] border-purple-500/20',
    magenta: 'shadow-[0_0_30px_rgba(236,72,153,0.05)] hover:shadow-[0_0_40px_rgba(236,72,153,0.12)] border-pink-500/20',
    none: '',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300',
        interactive && 'hover:bg-white/[0.04] hover:border-white/[0.18]',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {/* Decorative premium glass sheen gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] pointer-events-none" />
      
      {/* Highlight glow ring at top corner */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
