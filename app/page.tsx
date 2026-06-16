'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Zap,
  Star,
  Sliders,
  CheckCircle,
  Clock,
  ArrowRight,
  Award
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

import { PRODUCTS } from '@/lib/products';

export default function Home() {
  // Navigation & Tabs state
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Use global Cart systems
  const { cart, addToCart, isCartOpen, setIsCartOpen } = useCart();

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notifications for items added to cart
  const [feedbackNotification, setFeedbackNotification] = useState<string | null>(null);

  // Order Tracking Simulation State
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [activeTrackResult, setActiveTrackResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState('');

  // Premium Circle Membership Email List State
  const [circleEmail, setCircleEmail] = useState('');
  const [circleJoined, setCircleJoined] = useState(false);

  // Sample Shipment Pipelines for simulated track code queries
  const SHIPMENT_RECORDS: Record<string, any> = {
    'FX-100200': {
      id: 'FX-100200',
      status: 'In Transit',
      customer: 'Guest Elite',
      dispatchDate: '2026-06-12',
      eta: '2026-06-17',
      origin: 'FixoraX Gampaha Vault',
      destination: 'Colombo Residential Complex',
      stages: [
        { title: 'Allocation Locked', desc: 'Secure packaging and metal casing certified.', time: 'June 12, 10:00 AM', done: true },
        { title: 'Dispatched from ja-Ela Road Hub', desc: 'Handed over to priority fragile carrier.', time: 'June 13, 02:30 PM', done: true },
        { title: 'In Transit Colombo North', desc: 'Arrived at distribution cluster center.', time: 'June 15, 08:15 AM', done: true },
        { title: 'Out for Handover', desc: 'Ja-Ela Express vehicle route initialized.', time: 'Expected June 17', done: false }
      ]
    },
    'FX-2026': {
      id: 'FX-2026',
      status: 'Shipped',
      customer: 'Shehan Sandaru',
      dispatchDate: '2026-06-14',
      eta: '2026-06-16',
      origin: 'FixoraX Gampaha Vault',
      destination: 'Ja-Ela Elite Offices',
      stages: [
        { title: 'Allocation Locked', desc: 'Precision CNC custom weight calibrated.', time: 'June 14, 09:00 AM', done: true },
        { title: 'Express Freight Initiated', desc: 'Transit route assigned via VIP courier.', time: 'June 15, 05:00 AM', done: true },
        { title: 'Out for Local Dispatch', desc: 'Dispatched via dedicated bike link.', time: 'Out today', done: false }
      ]
    }
  };

  // Categories derived dynamically from dataset
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  }, []);

  // Filter products based on search term & category selection
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle adding product to cart
  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(product, 1);

    setFeedbackNotification(`Dispatched "${product.name}" to your glass-cart successfully.`);
    setTimeout(() => {
      setFeedbackNotification(null);
    }, 4000);
  };

  // Run simulated tracking ID execution
  const executeTrackingLookup = (idToSearch?: string) => {
    const query = idToSearch || searchTrackingId;
    setTrackingError('');
    if (!query) {
      setTrackingError('Kindly supply a valid consignment Tracking Reference.');
      return;
    }
    const sanitized = query.trim().toUpperCase();
    const match = SHIPMENT_RECORDS[sanitized];
    if (match) {
      setActiveTrackResult(match);
      setActiveTab('track');
    } else {
      setTrackingError('Unknown tracking designator. Try: FX-100200 or FX-2026');
    }
  };

  // Setup initial search context if trigger from Nav order tracker
  const handleOpenTrackingFromNav = (id: string) => {
    setSearchTrackingId(id);
    executeTrackingLookup(id);
  };

  // Join premium circle
  const handleSubscribeCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleEmail || !circleEmail.includes('@')) {
      alert('Kindly record a valid email coordinates.');
      return;
    }
    setCircleJoined(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      
      {/* Absolute Ambient Graphic Backdrops for Glassmorphic Glow depth */}
      <div className="absolute top-[-100px] right-[-50px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[35%] left-[-150px] w-[600px] h-[600px] rounded-full glow-spot-purple pointer-events-none animate-pulse duration-[12s]" />
      <div className="absolute bottom-[10%] right-[-100px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none blur-[150px]" />

      {/* Global Toast HUD Notification */}
      <AnimatePresence>
        {feedbackNotification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-card bg-[#020204]/90 border border-indigo-500/40 p-4 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Consignment Added</p>
                  <p className="text-[11px] text-zinc-300 mt-0.5 truncate max-w-[240px]">{feedbackNotification}</p>
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

      {/* Navbar segment */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTracking={handleOpenTrackingFromNav}
      />

      {/* Primary Layout Wrapper */}
      <main className="flex-grow pt-28 pb-16 z-10">
        
        {/* TAB 1: Main Catalog Experience */}
        {activeTab === 'catalog' && (
          <div>
            
            {/* HERO MODULE */}
            <section className="relative px-6 max-w-7xl mx-auto mb-16 select-none">
              <div className="text-center space-y-6 max-w-3xl mx-auto pt-8">
                
                {/* Visual Glass Pill indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/6 backdrop-blur-md shadow-inner"
                >
                  <Sparkles size={11} className="text-indigo-400 animate-pulse" />
                    Quality Mobile Devices & Gear
                </motion.div>

                {/* Main branding typography paired elegantly */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h1 className="font-sans font-extrabold tracking-tight text-white text-4xl sm:text-6xl max-w-2xl mx-auto leading-none">
                    Premium Mobile Phones & Accessories
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-xl mx-auto">
                    Welcome to <span className="text-white font-semibold">FixoraX</span>. Your trusted mobile phone and accessories shop situated in Gampaha. We offer the latest smartphones, premium cases, fast chargers, and smart wearables.
                  </p>
                </motion.div>

                {/* Hero CTA glass layout buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap items-center justify-center gap-4 pt-2"
                >
                  <GlassButton
                    variant="cyan"
                    onClick={() => {
                      const searchEl = document.getElementById('catalog-search-target');
                      if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Browse Shop
                  </GlassButton>
                </motion.div>
                
              </div>

              {/* Bento-style ambient feature callout panels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                
                <GlassCard interactive={false} className="p-5 select-text bg-[#0c0c12]/40">
                  <div className="flex flex-col items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                      <Sliders size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-100">Expert Repairs & Service</h3>
                      <p className="text-[11px] leading-relaxed text-neutral-400">Get your devices fixed by our expert technicians. Screen replacements, battery upgrades, and diagnostic services.</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard interactive={false} className="p-5 select-text bg-[#0c0c12]/40">
                  <div className="flex flex-col items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                      <Truck size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-100">Gampaha Delivery Hub</h3>
                      <p className="text-[11px] leading-relaxed text-neutral-400">Fast and secure delivery across Gampaha and surrounding areas within 24 hours.</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard interactive={false} className="p-5 select-text bg-[#0c0c12]/40">
                  <div className="flex flex-col items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white/4 border border-white/10 text-white shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="space-y-1 font-sans">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-100">1-Year Warranty</h3>
                      <p className="text-[11px] leading-relaxed text-neutral-400">Every device and accessory comes with a comprehensive warranty for your peace of mind.</p>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </section>

            {/* CATALOG SEARCH AND FILTER PANELS */}
            <section id="catalog-search-target" className="px-6 max-w-7xl mx-auto mb-12 scroll-mt-28">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-white/6">
                
                {/* Visual section header */}
                <div>
                  <h2 className="text-sm uppercase font-bold tracking-widest font-mono text-neutral-400 flex items-center gap-2">
                    <Zap size={13} className="text-indigo-400" /> Our Inventory
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">Latest mobile devices and premium accessories ready for dispatch</p>
                </div>
 
                {/* Filter and search utilities */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:max-w-2xl">
                  
                  {/* Category Pill Filters */}
                  <div className="flex flex-wrap gap-1.5 flex-grow pr-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer',
                          selectedCategory === cat
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-white/[0.01] hover:bg-white/[0.05] border border-white/6 text-neutral-400 hover:text-white'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Glass search input */}
                  <div className="w-full sm:w-64 shrink-0">
                    <GlassInput
                      icon={<Search size={15} />}
                      placeholder="Search enclosures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* PRODUCT CARD GRID */}
            <section className="px-6 max-w-7xl mx-auto">
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center space-y-4 max-w-md mx-auto glass-card border-dashed">
                  <p className="text-xs font-mono text-zinc-500">CORRELATION FAULT</p>
                  <p className="text-sm font-semibold text-white">No products found for configuration</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We could not isolate items correlating with selection. Try searching another premium keyword.
                  </p>
                  <GlassButton
                    variant="outline"
                    className="text-xs px-4"
                    onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                    }}
                  >
                    Reset Inventory Filter
                  </GlassButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <GlassCard 
                      key={product.id}
                      glow="none"
                      className="flex flex-col h-full bg-[#0a0a0a]/30"
                    >
                      {/* Product display capsule */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shrink-0 group">
                        
                        {/* Upper tag indicators */}
                        {product.badge && (
                          <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded bg-zinc-950/80 border border-white/10 text-[9px] font-extrabold uppercase font-mono tracking-widest text-white">
                            {product.badge}
                          </span>
                        )}

                        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-zinc-950/80 border border-white/10 text-[9px] font-mono tracking-wider font-semibold text-neutral-300 flex items-center gap-1">
                          <Star size={9} className="text-indigo-400 fill-indigo-400" /> {product.rating}
                        </div>

                        {/* Hover Sheen Image Zoom */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/smartphone/400/300';
                          }}
                        />

                        {/* Top glass highlights overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-white/5 opacity-80 pointer-events-none" />
                      </div>

                      {/* Info & Description card-body */}
                      <div className="flex-1 flex flex-col justify-between pt-5 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-indigo-300 border border-indigo-550/20 bg-indigo-500/5 px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                          </div>

                          <h3 className="font-sans font-bold text-neutral-100 text-sm truncate leading-snug">
                            {product.name}
                          </h3>
                          
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed h-8">
                            {product.description}
                          </p>
                        </div>

                        {/* Specifications list */}
                        <div className="py-2.5 px-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-1 font-mono">
                          {product.specs.slice(0, 3).map((spec: any, idx) => {
                            const specName = typeof spec === 'string' ? (idx === 0 ? 'Plating' : idx === 1 ? 'Spec' : 'Valuation') : spec.name;
                            const specValue = typeof spec === 'string' ? spec : spec.value;
                            return (
                              <div key={idx} className="flex justify-between text-[9px] text-neutral-400">
                                <span className="font-semibold">{specName}</span>
                                <span className="text-neutral-200 truncate max-w-[120px]">{specValue}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer Action of Card */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/6">
                          <div>
                            <span className="text-[9px] text-neutral-400 font-mono block uppercase tracking-wider">Estimated LKR</span>
                            <span className="font-mono font-bold text-sm text-indigo-400">
                              LKR {product.price.toLocaleString()}
                            </span>
                          </div>

                          <GlassButton
                            variant="glass"
                            onClick={() => handleAddToCart(product)}
                            className="px-3.5 py-1.5 text-[11px] border border-white/10"
                          >
                            <ShoppingCart size={11} /> Allocate
                          </GlassButton>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            {/* SPECIAL METADATA BANNER DESIGN */}
            <section className="px-6 max-w-5xl mx-auto my-24 select-none">
              <GlassCard
                glow="purple"
                interactive={false}
                className="p-10 relative overflow-hidden bg-[#0c0c12]/60 border border-purple-500/20 shadow-xl rounded-2xl"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/[0.04] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full">
                  <div className="space-y-4 max-w-lg">
                    <h2 className="font-sans font-extrabold text-white text-2xl sm:text-3xl leading-snug">
                      FixoraX Mobile Hub
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Every order is carefully inspected and securely packaged at our Gampaha shop. We ensure your mobile devices and accessories reach you in perfect condition with express local dispatch.
                    </p>
                  </div>
  
                  <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 font-mono">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-lg font-bold text-white tracking-tight">15k+</p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">Devices Fixed</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-lg font-bold text-indigo-400 tracking-tight">100%</p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">Original Parts</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center col-span-2">
                      <p className="text-xs font-semibold text-neutral-300 font-sans">Premium Mobile Accessories</p>
                      <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">Top Brands Available</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

          </div>
        )}

        {/* TAB 2: Order Tracker Console */}
        {activeTab === 'track' && (
          <section className="px-6 max-w-3xl mx-auto py-12 select-text">
            
            <div className="space-y-8">
              
              {/* Headline */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 mx-auto flex items-center justify-center mb-4">
                  <Truck size={22} />
                </div>
                <h1 className="font-sans font-extrabold text-white tracking-tight text-3xl">
                  Consignment Tracking Center
                </h1>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Provide your FixoraX verification routing code (e.g. <span className="text-indigo-400 font-mono font-semibold">FX-100200</span> or <span className="text-indigo-400 font-mono font-semibold">FX-2026</span>) to verify real-time alignment and assembly status.
                </p>
              </div>

              {/* Query container */}
              <GlassCard glow="cyan" interactive={false} className="p-6 bg-[#020204]/40">
                <form 
                  onSubmit={(e) => { e.preventDefault(); executeTrackingLookup(); }} 
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="flex-grow">
                      <GlassInput
                        label="Consignment ID"
                        placeholder="FX-100200"
                        value={searchTrackingId}
                        onChange={(e) => setSearchTrackingId(e.target.value)}
                        className="h-11 font-mono uppercase tracking-wider"
                      />
                    </div>
                    <div className="sm:pt-6">
                      <GlassButton type="submit" variant="cyan" className="h-11 w-full sm:w-auto">
                        Verify Pipeline
                      </GlassButton>
                    </div>
                  </div>

                  {trackingError && (
                    <p className="text-xs font-mono text-brand-magenta/90 bg-brand-magenta/5 border border-brand-magenta/10 p-3 rounded-lg">
                      {trackingError}
                    </p>
                  )}
                </form>
              </GlassCard>

              {/* Tracker result block */}
              <AnimatePresence mode="wait">
                {activeTrackResult ? (
                  <motion.div
                    key={activeTrackResult.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-6"
                  >
                    <GlassCard interactive={false} className="p-6 space-y-4 bg-[#0a0a0a]/50">
                      
                      {/* Summary indices */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/6 font-mono text-xs">
                        <div>
                          <p className="text-neutral-500 uppercase tracking-wider text-[10px]">Registry ID</p>
                          <p className="text-white font-bold">{activeTrackResult.id}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 uppercase tracking-wider text-[10px]">Client Privilege</p>
                          <p className="text-indigo-400 font-bold">{activeTrackResult.customer}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 uppercase tracking-wider text-[10px]">Dispatched Origin</p>
                          <p className="text-neutral-200 truncate max-w-[150px]">{activeTrackResult.origin}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 uppercase tracking-wider text-[10px]">Expected Date</p>
                          <p className="text-neutral-200">{activeTrackResult.eta}</p>
                        </div>
                      </div>

                      {/* Visual Milestone Progress */}
                      <div className="space-y-6 pt-2">
                        {activeTrackResult.stages.map((stage: any, index: number) => (
                          <div key={index} className="flex gap-4 relative">
                            {/* Connector line */}
                            {index < activeTrackResult.stages.length - 1 && (
                              <div 
                                className={cn(
                                  'absolute left-[13px] top-7 bottom-0 w-[2px] z-0',
                                  stage.done ? 'bg-indigo-500' : 'bg-white/10'
                                )} 
                              />
                            )}

                            {/* Milestone Marker */}
                            <div 
                              className={cn(
                                'w-7 h-7 rounded-full z-10 flex items-center justify-center shrink-0 border mt-1',
                                stage.done 
                                  ? 'bg-indigo-550/20 border-indigo-500 text-indigo-400' 
                                  : 'bg-zinc-900 border-white/10 text-neutral-500'
                              )}
                            >
                              {stage.done ? (
                                <CheckCircle size={12} className="stroke-[2.5]" />
                              ) : (
                                <Clock size={11} />
                              )}
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-1">
                              <h4 className={cn('text-xs font-bold leading-tight uppercase tracking-wider font-sans', stage.done ? 'text-white' : 'text-neutral-500')}>
                                {stage.title}
                              </h4>
                              <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">{stage.desc}</p>
                              {stage.time && (
                                <span className="block font-mono text-[9px] text-neutral-500">{stage.time}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </GlassCard>

                    {/* Return Action */}
                    <div className="text-center pt-2">
                      <button
                        onClick={() => { setActiveTab('catalog'); setActiveTrackResult(null); }}
                        className="text-xs font-bold text-neutral-400 hover:text-indigo-400 transition hover:underline cursor-pointer"
                      >
                        &larr; Return to Catalog Vault
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <div className="text-center py-10 text-neutral-500 font-mono text-xs">
                    awaiting verification lookup query...
                  </div>
                )}
              </AnimatePresence>

            </div>

          </section>
        )}

        {/* TAB 3: Premium Circle Loyalty Tab */}
        {activeTab === 'profile' && (
          <section className="px-6 max-w-4xl mx-auto py-12 select-text">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Member tier details */}
              <div className="md:col-span-2 space-y-6">
                
                <GlassCard interactive={false} className="p-6 bg-gradient-to-tr from-[#0c0c12]/90 to-purple-600/10 border-purple-500/20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto select-none shadow-[0_0_20px_rgba(147,51,234,0.2)]">
                    <Award size={30} />
                  </div>
                  
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-purple-600/20 border border-purple-500/30 text-[9px] font-mono tracking-widest uppercase font-bold text-purple-300">
                      Premium Customer
                    </span>
                    <h3 className="font-sans font-bold text-neutral-100 text-base mt-2">User Profile</h3>
                    <p className="text-xs text-neutral-400 mt-1">Status: Active Member</p>
                  </div>

                  <div className="pt-2 border-t border-white/6 font-mono text-[9px] text-neutral-500 text-left space-y-2">
                    <div className="flex justify-between">
                      <span>PREF. DELIVERY:</span>
                      <span className="text-neutral-300 font-bold">STANDARD PACKAGING</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PRIMARY STORE:</span>
                      <span className="text-neutral-300 font-bold">GAMPAHA MOBILE SHOP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WARRANTY STATUS:</span>
                      <span className="text-indigo-400 font-bold">ACTIVE</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Secure storage note */}
                <div className="p-4 rounded-xl border border-white/6 bg-white/[0.01] text-xs space-y-2 text-neutral-400">
                  <p className="font-bold text-neutral-200">Account Security</p>
                  <p className="text-[11px] leading-relaxed">
                    Your personal details and order history are kept strictly confidential and securely stored.
                  </p>
                </div>

              </div>

              {/* Privilege forms & signup */}
              <div className="md:col-span-3 space-y-6">
                
                <GlassCard interactive={false} className="p-6 space-y-6 bg-zinc-950/40">
                  <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-neutral-100 font-sans uppercase tracking-tight">Latest Offers & Updates</h2>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Subscribe to receive notifications about new smartphone arrivals, exclusive discounts, and accessory restocks.
                    </p>
                  </div>

                  {circleJoined ? (
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3 animate-fade-in">
                      <p className="text-xs text-indigo-400 font-bold font-mono uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle size={14} /> Vault Access Sealed
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        We have successfully registered your verification coordinates. Your premium invitation token has been securely generated via cryptographic algorithms.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribeCircle} className="space-y-4">
                      
                      <GlassInput
                        label="Your Correspondence Email"
                        type="email"
                        placeholder="e.g. guest@fixorax.com"
                        value={circleEmail}
                        onChange={(e) => setCircleEmail(e.target.value)}
                        required
                      />

                      <div className="space-y-3 py-2">
                        <label className="text-[10px] font-bold tracking-wider uppercase font-mono text-neutral-400">Select Desired Priority</label>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-white/6 hover:border-white/12 bg-white/[0.01] hover:bg-white/[0.04] transition cursor-pointer">
                            <input type="checkbox" defaultChecked className="accent-indigo-500" />
                            <span className="font-sans">Frame Drops</span>
                          </label>
                          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-white/6 hover:border-white/12 bg-white/[0.01] hover:bg-white/[0.04] transition cursor-pointer">
                            <input type="checkbox" defaultChecked className="accent-indigo-500" />
                            <span className="font-sans">Artisan Caps</span>
                          </label>
                        </div>
                      </div>

                      <GlassButton type="submit" variant="cyan" fullWidth>
                        Lock Allocation Notice
                      </GlassButton>

                    </form>
                  )}
                </GlassCard>

                {/* Contact information reminder */}
                <div className="p-6 rounded-xl border border-white/6 bg-[#0a0a0a]/30 space-y-3 font-sans">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-300 font-sans">Direct Contact</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    Have any questions or need support? Coordinate directly with us by phone at <span className="font-mono text-white">+94 77 123 4567</span> or write to us at <span className="font-mono text-white font-mono">support@fixorax.com</span>.
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* Footer segment */}
      <Footer />
    </div>
  );
}
