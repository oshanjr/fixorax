import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'FixoraX - Premium Glassmorphic E-Commerce',
  description: 'Premium glassmorphic e-commerce layout and design system built with Next.js, Tailwind v4, and Framer Motion.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body suppressHydrationWarning className="bg-[#020204] text-neutral-100 min-h-screen selection:bg-indigo-500/20 selection:text-indigo-400 antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

