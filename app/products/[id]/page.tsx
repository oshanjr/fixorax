'use client';

import React, { useState, use, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/lib/products';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ChevronRight,
  ShoppingCart,
  Check,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Package,
  Atom,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  const { addToCart, setIsCartOpen } = useCart();

  // Find the exact product
  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId);
  }, [productId]);

  // Image Gallery selection state (using direct initializer)
  const [activeImage, setActiveImage] = useState<string>(() => {
    return product ? product.image : '';
  });

  // Selected variant configuration states
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product?.variants) {
      product.variants.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  // Quantity to add state
  const [quantity, setQuantity] = useState<number>(1);

  // Micro-animations for add-to-cart
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        <Navbar />
        <main className="flex-grow pt-36 pb-24 z-10 max-w-xl mx-auto px-6 w-full text-center flex flex-col justify-center items-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Consignment Missing</h1>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              The requested product ID ({productId}) could not be located in our inventory.
            </p>
          </div>
          <Link href="/products">
            <GlassButton variant="cyan" className="text-xs">
              Return to Catalog
            </GlassButton>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Stock values check
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const isLowStock = product.stockStatus === 'low-stock';

  const handleSelectVariant = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);

    // Create a beautifully animated high-fidelity transition
    setTimeout(() => {
      // Build selected config string for reference in checkout itemization
      const configStr = Object.entries(selectedVariants)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

      addToCart(product, quantity, configStr || undefined);
      setIsAdding(false);
      setJustAdded(true);

      // Reset feedback tick
      setTimeout(() => {
        setJustAdded(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Glow Ambient Spots */}
      <div className="absolute top-[-100px] left-[-50px] w-[600px] h-[600px] rounded-full glow-spot-purple pointer-events-none blur-[150px] opacity-15" />
      <div className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none blur-[180px] opacity-10" />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Breadcrumb Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={10} className="text-neutral-600" />
            <Link href="/products" className="hover:text-white transition">Catalog</Link>
            <ChevronRight size={10} className="text-neutral-600" />
            <span className="text-indigo-400">{product.name}</span>
          </div>

          <Link
            href="/products"
            className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-400 hover:text-white transition flex items-center gap-1.5"
          >
            <ArrowLeft size={11} /> Back To Catalog
          </Link>
        </div>

        {/* Structural Specs split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column A: Dynamic Gallery (Lg: 5 span) */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard interactive={false} className="p-2 border-white/[0.06] bg-zinc-950/25 rounded-2xl relative group overflow-hidden">
              {/* Highlight badge overlay */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#020204]/90 border border-indigo-500/20 text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-300">
                  {product.badge}
                </span>
              )}

              {/* Main Preview Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transform transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/full/600/600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 block via-transparent pointer-events-none" />
              </div>
            </GlassCard>

            {/* Premium Thumbnails Grid list */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.map((img, idx) => {
                  const isActive = activeImage === img;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        'aspect-square rounded-xl overflow-hidden bg-zinc-900 border cursor-pointer transition-all duration-300 relative',
                        isActive
                          ? 'border-indigo-500 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.3)] scale-[1.03] bg-gradient-to-tr from-indigo-500 to-purple-600'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                      )}
                    >
                      <div className="w-full h-full rounded-[10px] overflow-hidden bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${product.name} gallery ${idx + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/gallery/150/150';
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column B: Interactive Detail specs (Lg: 7 span) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-white-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded border border-indigo-500/10">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-sans font-extrabold tracking-tight text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={cn(
                        i < Math.floor(product.rating)
                          ? 'text-indigo-400 fill-indigo-400'
                          : 'text-neutral-600'
                      )}
                    />
                  ))}
                  <span className="text-xs font-mono font-semibold text-neutral-200 ml-1.5">
                    {product.rating}
                  </span>
                </div>
                <span className="w-[1px] h-3.5 bg-white/10" />
                <span className="text-xs font-mono text-zinc-400">
                  {product.reviews} validated reviews
                </span>
                <span className="w-[1px] h-3.5 bg-white/10" />
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                  <Atom size={12} className="animate-spin text-indigo-400" /> Quality Checked
                </span>
              </div>
            </div>

            {/* Price Description block */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider block">Estimated Value</span>
                <span className="text-3xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                  LKR {product.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Inventory Status indicator */}
            <div className="pb-4 pt-1 flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Inventory status:</span>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold',
                  isOutOfStock ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' :
                  isLowStock ? 'bg-amber-500/10 border border-amber-500/25 text-amber-400' :
                  'bg-emerald-500/10 border border-emerald-500/10 text-emerald-400'
                )}
              >
                {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock - ${product.stockCount} left` : 'In Stock'}
              </span>
            </div>

            {/* Interactive Options Variants Block */}
            {product.variants && product.variants.length > 0 && (
              <GlassCard interactive={false} className="p-5 bg-white/[0.01] border-white/6 space-y-5 rounded-2xl">
                {product.variants.map((v) => {
                  const currentValue = selectedVariants[v.name];
                  return (
                    <div key={v.name} className="space-y-2.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block font-bold">
                        {v.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((option) => {
                          const isSelected = currentValue === option;
                          return (
                            <button
                              key={option}
                              onClick={() => handleSelectVariant(v.name, option)}
                              className={cn(
                                'px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer',
                                isSelected
                                  ? 'bg-indigo-500/15 text-white border border-indigo-500/40 font-bold shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                                  : 'bg-[#020204]/40 text-neutral-400 border border-white/5 hover:border-white/15 hover:text-white'
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </GlassCard>
            )}

            {/* Dispatch details specification table */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block font-bold">Hardware Specifications</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-neutral-300 font-sans">
                {product.specs.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between py-2.5 px-3 rounded-lg bg-white/[0.01] border border-white/[0.03]"
                  >
                    <span className="text-neutral-500 font-mono text-[10px] uppercase">{item.name}</span>
                    <span className="font-semibold text-neutral-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation Quantity & Master Add Action block */}
            <div className="p-6 rounded-2xl bg-[#020204]/30 border border-white/10 flex flex-col sm:flex-row items-center gap-5 justify-between">
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Select Quantity:</span>
                <div className="flex items-center bg-zinc-950 border border-white/10 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold font-mono text-white select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Master Button Action */}
              <div className="w-full sm:w-auto">
                <GlassButton
                  variant="cyan"
                  onClick={handleAddToCartClick}
                  disabled={isOutOfStock || isAdding}
                  className="w-full sm:w-[220px] py-3.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 relative h-12"
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-t-indigo-400 border-r-transparent animate-spin inline-block" />
                      processing...
                    </span>
                  ) : justAdded ? (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Check size={14} className="stroke-[3] animate-bounce" /> Added to Cart!
                    </span>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <ShoppingCart size={13} /> Add to Cart
                    </span>
                  )}
                </GlassButton>
              </div>
            </div>

            {/* Secure Service Guarantee cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { title: 'Gampaha Shop', desc: 'Expert Tech Support', icon: <Award size={14} className="text-indigo-400" /> },
                { title: 'Secure Packaging', desc: 'Free Safe Packaging', icon: <ShieldCheck size={14} className="text-purple-400" /> },
                { title: 'Fast Delivery', desc: 'Islandwide Shipping', icon: <Truck size={14} className="text-pink-400" /> }
              ].map((item, idx) => (
                <div key={idx} className="p-3 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <div className="w-7 h-7 rounded-lg bg-zinc-950/40 border border-white/5 flex items-center justify-center mx-auto mb-2 text-neutral-400">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-300 block uppercase">{item.title}</span>
                  <span className="text-[8px] text-neutral-500 block leading-tight mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
