'use client';

import React, { use, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import { motion } from 'motion/react';
import {
  Package,
  Calendar,
  Layers,
  MapPin,
  ClipboardCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  FileCheck2,
  AlertTriangle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useCart();

  const orderId = params?.orderId as string;

  // Locate the active order logs
  const order = useMemo(() => {
    if (!orderId) return null;
    return orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase()) || null;
  }, [orders, orderId]);

  // Determine stage progress percentage and active step indices
  const statusConfig = useMemo(() => {
    if (!order) return { stepIndex: 0, progress: 0 };
    
    switch (order.fulfillmentStatus) {
      case 'Order Placed':
        return { stepIndex: 1, progress: 12.5 };
      case 'Processing':
        return { stepIndex: 2, progress: 41.6 };
      case 'Shipped':
        return { stepIndex: 3, progress: 70.8 };
      case 'Delivered':
        return { stepIndex: 4, progress: 100 };
      default:
        return { stepIndex: 1, progress: 12.5 };
    }
  }, [order]);

  if (!order) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between bg-[#020204]">
        <Navbar activeTab="track" />
        <main className="flex-grow pt-32 pb-24 z-10 max-w-xl mx-auto px-6 w-full flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-12 h-12 bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center text-amber-500 animate-bounce">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-sans font-extrabold text-white">Consignment Missing</h1>
            <p className="text-xs text-neutral-400">
              The tracking sequence code <span className="font-mono text-indigo-400 font-bold">{orderId}</span> is not registered in the active ledger.
            </p>
          </div>
          <Link href="/track">
            <GlassButton variant="outline" className="text-xs font-mono font-bold">
              ← Return to Lookup Registry
            </GlassButton>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Define steps
  const trackingSteps = [
    {
      index: 1,
      title: 'Order Placed',
      meta: 'Awaiting Payment Verification',
      desc: 'Escrow receipt transmitted and queuing for hotline verification.',
      icon: FileCheck2
    },
    {
      index: 2,
      title: 'Processing',
      meta: 'Payment Approved, Packing',
      desc: 'Receipt calibration successful. Mobile hardware and details verified.',
      icon: Layers
    },
    {
      index: 3,
      title: 'Shipped',
      meta: 'Dispatched via Express Courier',
      desc: 'Cargo handed over to delivery partners in Sri Lanka.',
      icon: Truck
    },
    {
      index: 4,
      title: 'Delivered',
      meta: 'Fulfillment Completed',
      desc: 'Consignment successfully signed for at destination coordinates.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#020204]">
      {/* Background Ambience Glows */}
      <div className="absolute top-[-150px] left-[-50px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none blur-[150px] opacity-10" />
      <div className="absolute bottom-[-150px] right-[-50px] w-[500px] h-[500px] rounded-full glow-spot-purple pointer-events-none blur-[150px] opacity-10" />

      <Navbar activeTab="track" />

      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Navigation / Header details */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#a5b4fc]">
            <Link href="/track" className="hover:text-white text-zinc-400 transition">Locator</Link>
            <ChevronRight size={10} className="text-neutral-600" />
            <span className="text-white font-bold">{order.id} Tracking Trace</span>
          </div>
          
          <button
            onClick={() => router.push('/track')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition font-mono uppercase tracking-widest self-start"
          >
            <ArrowLeft size={14} /> Back to Search
          </button>
        </div>

        {/* Dynamic header summary panel */}
        <div className="mb-10 p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col md:flex-row justify-between gap-6 md:items-center">
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase leading-none">Active Cargo Segment</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tracking: <span className="font-mono text-indigo-300 select-all">{order.id}</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Assigned to recipient <span className="text-white font-semibold font-mono">{order.deliveryDetails.fullName}</span>, dispatched on <span className="text-white font-mono">{order.timestamp}</span>
            </p>
          </div>

          <div className="flex flex-row md:flex-col justify-between md:items-end gap-2 text-right">
            <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 font-bold">Consignment Capital Value</span>
            <span className="font-mono text-xl text-cyan-400 font-bold leading-none">LKR {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Dashboard details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Column A: Live Animated Stage Timeline (Span: 7) */}
          <div className="lg:col-span-7 space-y-8">
            <GlassCard interactive={false} className="p-8 bg-[#020204]/40 border-white/10 rounded-2xl space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[140px] h-[140px] rounded-full bg-cyan-500/5 pointer-events-none blur-[40px]" />
              
              <div className="pb-4 border-b border-white/5">
                <h3 className="font-sans font-bold text-white text-base">Fulfillment Logistics Pipeline</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Real-time trace calibration across Sri Lankan logistics network checkpoints.</p>
              </div>

              {/* Dynamic steps vertical layout */}
              <div className="relative pl-10 space-y-12">
                
                {/* Center visual progress rail */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: statusConfig.progress / 100 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%' }}
                  />
                </div>

                {trackingSteps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = step.index <= statusConfig.stepIndex;
                  const isCurrent = step.index === statusConfig.stepIndex;
                  const parsedTime = isCurrent ? 'Live Status Context' : (step.index < statusConfig.stepIndex ? 'Logged Checkpoint' : 'Pending Allocation');

                  return (
                    <div
                      key={step.index}
                      className={cn(
                        "relative flex flex-col sm:flex-row sm:items-start gap-4 transition-all duration-500",
                        isActive ? "opacity-100" : "opacity-35"
                      )}
                    >
                      {/* Step index icon/node */}
                      <div className="absolute -left-[30px] flex items-center justify-center z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border relative",
                          isActive 
                            ? "bg-indigo-950 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                            : "bg-[#020204] border-white/5 text-neutral-600"
                        )}>
                          {isCurrent && (
                            <span className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-60" />
                          )}
                          <StepIcon size={16} />
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 sm:pt-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                          <h4 className={cn(
                            "font-sans font-bold text-sm",
                            isActive ? "text-white" : "text-neutral-500"
                          )}>
                            {step.title}
                          </h4>
                          <span className={cn(
                            "text-[8px] font-mono tracking-wider font-extrabold uppercase px-1.5 py-0.5 rounded leading-none select-none",
                            isCurrent 
                              ? "bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 animate-pulse" 
                              : (step.index < statusConfig.stepIndex ? "bg-white/[0.02] border border-white/5 text-zinc-500" : "bg-neutral-900 border-transparent text-neutral-600")
                          )}>
                            {step.meta}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans pr-4">{step.desc}</p>
                        
                        <p className={cn(
                          "text-[9px] font-mono font-bold uppercase",
                          isCurrent ? "text-indigo-400" : "text-neutral-600"
                        )}>
                          {parsedTime}
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Sri Lanka logistics carrier metadata */}
              {order.courierName && (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono tracking-widest text-[#949eac] uppercase font-bold">Assigned Dispatch Services (Sri Lanka)</p>
                    <p className="text-xs font-semibold text-white font-sans">{order.courierName}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">AWB Reference: <span className="text-zinc-300 font-bold">{order.trackingNumber}</span></p>
                  </div>

                  <a 
                    href={`https://example.com/track?awb=${order.trackingNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block shrink-0"
                  >
                    <GlassButton 
                      variant="outline" 
                      className="text-[10px] py-1.5 px-3 font-mono tracking-widest uppercase font-bold"
                    >
                      Verify Gateway <ExternalLink size={10} className="ml-1" />
                    </GlassButton>
                  </a>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Column B: Consignment item spec summary sidebar (Span: 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coordinates widget */}
            <GlassCard interactive={false} className="p-6 bg-zinc-950/45 border-white/[0.08] rounded-2xl space-y-5">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-[#a5b4fc] uppercase font-bold leading-none mb-1">Assigned Coordinates</p>
                <h3 className="font-sans font-bold text-white text-base">Recipient Address Spec</h3>
              </div>

              <div className="space-y-3 font-sans text-xs border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                    <User size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-mono uppercase text-zinc-500 leading-none mb-0.5">Contact Name</p>
                    <p className="font-semibold text-white truncate">{order.deliveryDetails.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                    <Phone size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-mono uppercase text-zinc-500 leading-none mb-0.5">Cell Number</p>
                    <p className="font-mono font-bold text-neutral-200">{order.deliveryDetails.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                    <MapPin size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-mono uppercase text-zinc-500 leading-none mb-0.5">Destination Coordinate</p>
                    <p className="font-semibold text-neutral-300 leading-snug truncate max-w-[210px] sm:max-w-xs" title={`${order.deliveryDetails.address}, ${order.deliveryDetails.district}`}>
                      {order.deliveryDetails.address}, {order.deliveryDetails.district}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Consignment Specs */}
            <GlassCard interactive={false} className="p-6 bg-zinc-950/45 border-white/[0.08] rounded-2xl space-y-5">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-[#a5b4fc] uppercase font-bold leading-none mb-1">Cargo Details</p>
                <h3 className="font-sans font-bold text-white text-base">Consignment Specification</h3>
              </div>

              <div className="space-y-3.5 border-t border-white/5 pt-4 max-h-[220px] overflow-y-auto pr-2">
                {order.items.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate text-xs leading-normal">{item.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate max-w-[140px] sm:max-w-xs">
                          {item.quantity} Unit{item.quantity > 1 ? 's' : ''} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-zinc-400 shrink-0 text-xs text-right">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center text-xs text-neutral-400 font-medium">
                  <span>Shipping Cost</span>
                  <span className="font-mono text-white text-[11px] uppercase">Complimentary</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-2.5 border-t border-white/5 text-neutral-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-indigo-400 text-lg">
                    LKR {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 space-y-1">
                <span className="text-[9px] font-mono tracking-wider uppercase text-neutral-400 font-bold flex items-center gap-1.5 leading-none">
                  <Lock size={12} className="text-cyan-400" /> Secure dispatch node
                </span>
                <p className="text-[9px] text-neutral-500 leading-normal font-sans">
                  Checkpoints verified via Gampaha calibration sequences. All units protected against transit leakage.
                </p>
              </div>
            </GlassCard>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
