'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Search,
  ShoppingCart,
  Star,
  Zap,
  Filter,
  Check,
  RefreshCw,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Package,
  ArrowUpDown,
  FileCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/lib/products';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProductCatalogPage() {
  const { addToCart, setIsCartOpen } = useCart();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [excludeOutOfStock, setExcludeOutOfStock] = useState<boolean>(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Infinite Scroll / Pagination state
  const [visibleItemsCount, setVisibleItemsCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track filters at render-time to reset pagination limits securely without useEffect cascading loops
  const [prevFilterHash, setPrevFilterHash] = useState('');
  const currentFilterHash = `${selectedCategory}_${searchQuery}_${selectedPriceRanges.join(',')}_${excludeOutOfStock}_${showLowStockOnly}_${sortBy}`;

  if (currentFilterHash !== prevFilterHash) {
    setPrevFilterHash(currentFilterHash);
    setVisibleItemsCount(6);
  }

  // Cart feedback notification per-item
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Derive categories dynamically
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  }, []);

  // Filter & Sort core logic
  const processedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price range filters
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        return selectedPriceRanges.some((range) => {
          if (range === 'under-20') return p.price < 20000;
          if (range === '20-100') return p.price >= 20000 && p.price <= 10000;
          if (range === '20-100k') return p.price >= 20000 && p.price <= 100000; // Correct boundary
          if (range === 'above-100') return p.price > 100000;
          return true;
        });
      });
    }

    // Stock Status filters
    if (excludeOutOfStock) {
      result = result.filter((p) => p.stockStatus !== 'out-of-stock');
    }
    if (showLowStockOnly) {
      result = result.filter((p) => p.stockStatus === 'low-stock');
    }

    // Sort order logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, selectedPriceRanges, excludeOutOfStock, showLowStockOnly, sortBy]);

  const hasMore = visibleItemsCount < processedProducts.length;

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    // Simulate an incredibly polished loading sweep under Gampaha aesthetics
    setTimeout(() => {
      setVisibleItemsCount((prev) => Math.min(prev + 4, processedProducts.length));
      setIsLoadingMore(false);
    }, 1000);
  };

  // Price range toggle helper
  const handleTogglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const executeAddToCart = (product: Product) => {
    setAnimatingItemId(product.id);
    addToCart(product, 1);

    setSuccessToast(`Dispatched "${product.name}" into the glass storage.`);
    setTimeout(() => {
      setAnimatingItemId(null);
    }, 1200);

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRanges([]);
    setExcludeOutOfStock(false);
    setShowLowStockOnly(false);
    setSortBy('default');
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Visual Backdrops of the Gampaha Design System */}
      <div className="absolute top-[-150px] right-[-50px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none blur-[140px] opacity-20" />
      <div className="absolute top-[40%] left-[-150px] w-[600px] h-[600px] rounded-full glow-spot-purple pointer-events-none blur-[200px] opacity-15" />

      {/* Global Success Banner Layer */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-card bg-[#020204]/90 border border-indigo-500/40 p-4 rounded-xl flex items-center justify-between shadow-[0_0_30px_rgba(99,102,241,0.25)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Vault Storage Updated</p>
                  <p className="text-[11px] text-zinc-300 mt-0.5 truncate max-w-[210px]">{successToast}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[11px] font-bold text-indigo-400 hover:underline pl-3 border-l border-white/10 shrink-0 cursor-pointer"
              >
                Inspect Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar activeTab="catalog" />

      {/* Main Container */}
      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Breadcrumb section */}
        <div className="mb-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight size={10} className="text-neutral-600" />
          <span className="text-indigo-400">Examine Vault Catalog</span>
        </div>

        {/* Catalog Banner */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/6 backdrop-blur-md">
            <Sparkles size={11} className="text-indigo-400 animate-pulse" />
            <span className="text-[9px] font-semibold font-mono tracking-widest uppercase text-neutral-300">
              Elite Fitting & Precision Enclosures
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-white leading-none">
            FixoraX Vault Catalog
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Sourced sound dampening kits, anodized solid metallic frames, plate alignments, and bespoke linear systems calibrated in our Ja-Ela workspace. Filter securely to finalize parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Glassmorphic Sidebar Filter Column */}
          <aside className="lg:col-span-1 sticky top-30">
            <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border border-white/[0.06] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-100 flex items-center gap-2">
                  <Sliders size={14} className="text-indigo-400" /> Filters & Parameters
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-mono tracking-wider font-semibold text-neutral-400 hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <RefreshCw size={10} /> Reset All
                </button>
              </div>

              {/* Live Search */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400">Keyword Lookup</span>
                <GlassInput
                  icon={<Search size={14} className="text-neutral-500" />}
                  placeholder="Body, keycap set, POM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 text-xs px-3"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 block">Mechanical Category</span>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex justify-between items-center',
                          isSelected
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 font-bold shadow-inner'
                            : 'bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02] border border-transparent'
                        )}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check size={11} className="text-indigo-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 block">Price Range (LKR)</span>
                <div className="space-y-2 text-xs text-neutral-400 font-sans">
                  {[
                    { id: 'under-20', label: 'Under LKR 20,000' },
                    { id: '20-100k', label: 'LKR 20,000 - 100,000' },
                    { id: 'above-100', label: 'More than LKR 100,000' }
                  ].map((range) => {
                    const isChecked = selectedPriceRanges.includes(range.id);
                    return (
                      <label
                        key={range.id}
                        className="flex items-center gap-2.5 px-1 py-0.5 cursor-pointer select-none text-neutral-300 hover:text-white transition"
                      >
                        <div
                          onClick={() => handleTogglePriceRange(range.id)}
                          className={cn(
                            'w-4.5 h-4.5 rounded border flex items-center justify-center transition-all shrink-0',
                            isChecked
                              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                              : 'border-white/15 bg-[#020204]'
                          )}
                        >
                          {isChecked && <Check size={10} className="stroke-[3]" />}
                        </div>
                        <span className="text-xs">{range.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Stock Status Parameters */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 block">Inventory State</span>
                <div className="space-y-2 text-xs">
                  {/* Exclude Out of Stock */}
                  <label className="flex items-center gap-2.5 cursor-pointer text-neutral-300 hover:text-white transition">
                    <div
                      onClick={() => setExcludeOutOfStock(!excludeOutOfStock)}
                      className={cn(
                        'w-4.5 h-4.5 rounded border flex items-center justify-center transition-all shrink-0',
                        excludeOutOfStock
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                          : 'border-white/15 bg-[#020204]'
                      )}
                    >
                      {excludeOutOfStock && <Check size={10} className="stroke-[3]" />}
                    </div>
                    <span>Exclude Out of Stock</span>
                  </label>

                  {/* Low Stock Only */}
                  <label className="flex items-center gap-2.5 cursor-pointer text-neutral-300 hover:text-white transition">
                    <div
                      onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                      className={cn(
                        'w-4.5 h-4.5 rounded border flex items-center justify-center transition-all shrink-0',
                        showLowStockOnly
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                          : 'border-white/15 bg-[#020204]'
                      )}
                    >
                      {showLowStockOnly && <Check size={10} className="stroke-[3]" />}
                    </div>
                    <span className="flex items-center gap-1.5 font-sans">
                      Low Stock Run <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                    </span>
                  </label>
                </div>
              </div>
            </GlassCard>
          </aside>

          {/* Product Cards and Pagination Display */}
          <section className="lg:col-span-3 space-y-8">
            {/* Toolbar utility bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 px-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <span className="text-xs font-mono text-neutral-400">
                Discovered <span className="text-indigo-400 font-bold">{processedProducts.length}</span> aligned modules
              </span>

              {/* Sorting */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-neutral-500 whitespace-nowrap flex items-center gap-1">
                  <ArrowUpDown size={11} /> ORDER BY:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#020204]/80 border border-white/10 rounded-lg py-1 px-2.5 text-neutral-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 cursor-pointer font-sans leading-none"
                >
                  <option value="default">Default Arrangement</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating: Highest Elite</option>
                </select>
              </div>
            </div>

            {/* Grid Layout of results */}
            {processedProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 max-w-md mx-auto rounded-3xl border border-dashed border-white/10 p-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-neutral-500 mx-auto">
                  <Package size={20} className="opacity-40" />
                </div>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Index Empty</p>
                <h3 className="text-sm font-semibold text-white">No items found for criteria</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  There are no components matching your specified filters. Try relaxing category, price, or search criteria.
                </p>
                <GlassButton variant="outline" className="text-xs px-4" onClick={handleResetFilters}>
                  Clear All Filters
                </GlassButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {processedProducts.slice(0, visibleItemsCount).map((p, index) => {
                    const isLowStock = p.stockStatus === 'low-stock';
                    const isOutOfStock = p.stockStatus === 'out-of-stock';
                    const isAnimating = animatingItemId === p.id;

                    return (
                      <motion.div
                        layout
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <GlassCard glow="none" className="h-full flex flex-col justify-between p-5 bg-[#020204]/20 group">
                          
                          {/* Image Display */}
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                            {p.badge && (
                              <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-zinc-950/80 border border-white/10 text-[9px] font-mono tracking-widest uppercase font-bold text-white">
                                {p.badge}
                              </span>
                            )}
                            
                            {/* Stock status bubble overlay */}
                            <span
                              className={cn(
                                'absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest font-semibold bg-zinc-950/80 border flex items-center gap-1',
                                isOutOfStock && 'border-rose-500/30 text-rose-400',
                                isLowStock && 'border-amber-500/30 text-amber-400',
                                p.stockStatus === 'available' && 'border-emerald-500/30 text-emerald-400'
                              )}
                            >
                              <span className={cn(
                                'w-1 h-1 rounded-full',
                                isOutOfStock && 'bg-rose-500 animate-pulse',
                                isLowStock && 'bg-amber-500 animate-pulse',
                                p.stockStatus === 'available' && 'bg-emerald-500'
                              )} />
                              {isOutOfStock ? 'Sold out' : isLowStock ? `Low stock (${p.stockCount})` : 'In stock'}
                            </span>

                            <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-zinc-950/80 border border-white/10 text-[9px] font-mono tracking-wider font-semibold text-neutral-300 flex items-center gap-1">
                              <Star size={9} className="text-indigo-400 fill-indigo-400" /> {p.rating}
                            </span>

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="object-cover w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/tool/400/250';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 block via-transparent to-white/5 opacity-80 pointer-events-none" />
                          </div>

                          {/* Body Information */}
                          <div className="flex-1 flex flex-col justify-between pt-4 space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-300 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                                  {p.category}
                                </span>
                              </div>

                              <Link href={`/products/${p.id}`} className="block">
                                <h3 className="font-sans font-bold text-neutral-100 text-sm hover:text-indigo-400 transition leading-snug line-clamp-1">
                                  {p.name}
                                </h3>
                              </Link>
                              
                              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed min-h-[32px]">
                                {p.description}
                              </p>
                            </div>

                            {/* Price and Details */}
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-neutral-500 font-mono block uppercase">Estimated Value</span>
                                <span className="font-mono font-bold text-sm text-indigo-400">
                                  LKR {p.price.toLocaleString()}
                                </span>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1.5">
                                <Link href={`/products/${p.id}`}>
                                  <GlassButton variant="outline" className="px-3 py-1.5 text-[10px] h-8">
                                    Detail
                                  </GlassButton>
                                </Link>

                                <GlassButton
                                  variant="cyan"
                                  onClick={() => executeAddToCart(p)}
                                  disabled={isOutOfStock}
                                  className={cn('px-3.5 py-1.5 text-[10px] h-8 border border-white/10 flex items-center gap-1.5 transition-all',
                                    isOutOfStock && 'opacity-40 cursor-not-allowed hover:bg-transparent',
                                    isAnimating && 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                  )}
                                >
                                  {isAnimating ? (
                                    <>
                                      <Check size={11} className="stroke-[3] animate-bounce" /> Done
                                    </>
                                  ) : isOutOfStock ? (
                                    'Empty'
                                  ) : (
                                    <>
                                      <ShoppingCart size={11} /> Allocate
                                    </>
                                  )}
                                </GlassButton>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination / Infinite Scroll Loading Mechanism */}
            {hasMore && processedProducts.length > 0 && (
              <div className="text-center pt-8">
                <GlassButton
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 text-xs font-semibold tracking-wider uppercase font-mono relative overflow-hidden min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2 justify-center">
                      <RefreshCw size={12} className="animate-spin text-indigo-400" />
                      calibrating data...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 justify-center">
                      Examine More Units <ChevronRight size={13} />
                    </span>
                  )}
                </GlassButton>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
