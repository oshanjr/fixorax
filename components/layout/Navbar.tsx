'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, X, Plus, Minus, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassButton from '../glass/GlassButton';
import GlassInput from '../glass/GlassInput';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  selectedVariant?: string;
}

interface NavbarProps {
  cart?: CartItem[];
  setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenTracking?: (orderId: string) => void;
}

// Deterministic helper outside of component render scope to respect React purity
const generateSimulatedId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export default function Navbar({
  cart: propCart,
  setCart: propSetCart,
  isCartOpen: propIsCartOpen,
  setIsCartOpen: propSetIsCartOpen,
  activeTab = 'catalog',
  setActiveTab,
  onOpenTracking
}: NavbarProps) {
  const context = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const cart = propCart !== undefined ? propCart : context.cart;
  const isCartOpen = propIsCartOpen !== undefined ? propIsCartOpen : context.isCartOpen;
  const setIsCartOpen = propSetIsCartOpen !== undefined ? propSetIsCartOpen : context.setIsCartOpen;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [trackingIdInput, setTrackingIdInput] = useState('');

  // Handle shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute Cart statistics
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    if (propSetCart !== undefined) {
      propSetCart((prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const nextQty = item.quantity + delta;
              return { ...item, quantity: nextQty };
            }
            return item;
          })
          .filter((item) => item.quantity > 0)
      );
    } else {
      context.updateQuantity(id, delta);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.includes('@') || authPassword.length < 4) {
      setAuthError('Please enter a valid email and minimum 4-character password.');
      return;
    }
    setAuthLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoggedIn(true);
      setAuthLoading(false);
      setIsAuthOpen(false);
    }, 1200);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleLogoClick = () => {
    if (pathname === '/') {
      if (setActiveTab) setActiveTab('catalog');
    } else {
      router.push('/');
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'catalog') {
      router.push('/products');
      return;
    }
    if (tabId === 'track') {
      router.push('/track');
      return;
    }
    if (tabId === 'profile') {
      router.push('/profile');
      return;
    }
    if (pathname === '/') {
      if (setActiveTab) setActiveTab(tabId);
    } else {
      router.push(`/?tab=${tabId}`);
    }
  };

  const executeCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* Primary Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isScrolled
            ? 'py-3 bg-[#020204]/75 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-6 bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] transition-all duration-300">
              <div className="w-full h-full rounded-[11px] bg-[#020204] flex items-center justify-center font-mono font-bold text-lg text-transparent bg-clip-text bg-gradient-to-tr from-purple-600 to-indigo-500">
                F
              </div>
            </div>
            <span className="font-sans font-extrabold tracking-tighter text-2xl bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent transition-all duration-300 hover:from-white hover:to-white/70">
              FixoraX
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full p-1 backdrop-blur-xl">
            {[
              { id: 'catalog', label: 'Catalog' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 pointer',
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 relative">
            
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/15 transition-all text-neutral-300 hover:text-white cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={18} className="stroke-[2]" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth Dropdown Trigger */}
            <button
              onClick={() => setIsAuthOpen(!isAuthOpen)}
              className={cn(
                'p-2.5 rounded-xl border transition-all text-neutral-300 hover:text-white cursor-pointer',
                isAuthOpen 
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.08] hover:border-white/15'
              )}
              aria-label="Authentication"
            >
              <User size={18} className="stroke-[2]" />
            </button>

            {/* User Auth Dropdown Panel */}
            <AnimatePresence>
              {isAuthOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-14 w-80 glass-card p-6 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.04] rounded-full blur-2xl pointer-events-none" />
                  
                  {isLoggedIn ? (
                    <div>
                      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1px]">
                          <div className="w-full h-full rounded-full bg-[#020204] flex items-center justify-center font-mono text-sm font-bold text-white">
                            S
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Guest Elite</p>
                          <p className="text-xs text-neutral-400 truncate">{authEmail || 'guest@fixorax.com'}</p>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <button 
                          onClick={() => { setActiveTab && setActiveTab('profile'); setIsAuthOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/4 transition"
                        >
                          User Profile
                        </button>
                        <button 
                          onClick={() => { setActiveTab && setActiveTab('track'); setIsAuthOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/4 transition"
                        >
                          Track Order
                        </button>
                      </div>

                      <GlassButton 
                        variant="outline" 
                        fullWidth 
                        onClick={handleSignOut}
                        className="py-2 text-xs text-neutral-300 hover:text-brand-magenta"
                      >
                        <LogOut size={13} /> Close Session
                      </GlassButton>
                    </div>
                  ) : (
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Access Account</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Sign in for priority delivery privileges and rewards.</p>
                      </div>

                      {authError && (
                        <p className="text-[10px] text-brand-magenta font-mono bg-brand-magenta/5 p-2 rounded border border-brand-magenta/10">
                          {authError}
                        </p>
                      )}

                      <GlassInput
                        label="Email Address"
                        type="email"
                        placeholder="e.g. guest@fixorax.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                        className="h-10"
                      />

                      <GlassInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        className="h-10"
                      />

                      <GlassButton
                        type="submit"
                        variant="cyan"
                        fullWidth
                        disabled={authLoading}
                      >
                        {authLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-white" /> Authenticating...
                          </>
                        ) : (
                          <>
                            Sign In <ArrowRight size={14} />
                          </>
                        )}
                      </GlassButton>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </header>

      {/* Cart Sheet (Sliding Right-drawer Panel) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Sliding Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md h-full bg-[#020204]/80 border-l border-white/10 backdrop-blur-3xl z-50 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={20} className="text-indigo-400" />
                  <h3 className="font-sans font-bold text-white text-base">Your Cart</h3>
                  {cartItemCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-white/6 text-[10px] font-mono text-neutral-300 font-semibold">
                      {cartItemCount} items
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg border border-white/6 hover:bg-white/4 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Contents list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.01] border border-white/6 flex items-center justify-center text-neutral-500 shadow-inner">
                      <ShoppingBag size={24} className="opacity-40" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Your cart is empty</p>
                      <p className="text-xs text-neutral-400 max-w-[220px] mt-1 leading-relaxed">
                        Add premium mobile phones, accessories, and cases from FixoraX catalog.
                      </p>
                    </div>
                    <GlassButton variant="outline" onClick={() => setIsCartOpen(false)} className="text-xs px-4">
                      Browse Catalog
                    </GlassButton>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/6 flex gap-4 items-center"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-white/5 relative overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // fallback placeholder
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/tool/120/120';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold font-mono tracking-wider uppercase text-indigo-300 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mt-1.5 leading-snug">{item.name}</h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-1">LKR {item.price.toLocaleString()}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/6 rounded-lg p-0.5">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/4 cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-mono font-semibold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/4 cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-zinc-950/90 backdrop-blur-md space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-400 font-medium">
                      <span>Secure Packing</span>
                      <span className="font-mono text-white">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400 font-medium">
                      <span>Islandwide Shipping</span>
                      <span className="font-mono text-white">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-200 font-bold pt-1.5 border-t border-white/5">
                      <span>Subtotal</span>
                      <span className="font-mono text-indigo-400 text-base">LKR {cartSubtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <GlassButton variant="cyan" fullWidth onClick={executeCheckout} className="py-3">
                    Checkout
                  </GlassButton>
                  <p className="text-[9px] text-neutral-500 font-mono text-center">
                    Payment securely integrated with FixoraX protocols.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
