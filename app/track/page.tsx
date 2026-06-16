'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Truck,
  FileSearch2,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Package,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TrackLookupPage() {
  const router = useRouter();
  const { orders } = useCart();
  const [typedId, setTypedId] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const query = typedId.trim().toUpperCase();
    if (!query) {
      setErrorText('Please enter your FixoraX verification sequence code.');
      return;
    }

    // Lookup verification block
    const matched = orders.find((o) => o.id.toUpperCase() === query);
    if (!matched) {
      setErrorText(
        `Consignment ID "${query}" matches no active nodes here. Verify code accuracy or check back later.`
      );
      return;
    }

    // Direct routing checkpoint
    router.push(`/track/${matched.id}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#020204]">
      {/* Background Ambience Glows */}
      <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] rounded-full glow-spot-cyan pointer-events-none blur-[180px] opacity-10" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full glow-spot-purple pointer-events-none blur-[180px] opacity-10" />

      <Navbar activeTab="track" />

      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full flex items-center justify-center">
        <div className="w-full max-w-lg space-y-8">
          
          {/* Header instructions block */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center text-indigo-400">
              <Truck size={22} className="stroke-[1.5]" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white leading-none">
                Track Your Order
              </h1>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Enter your order ID to check the real-time status of your mobile devices and accessories.
              </p>
            </div>
          </div>

          <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border-white/10 rounded-2xl">
            <form onSubmit={handleLookup} className="space-y-5">
              <GlassInput
                label="Escrow Reference Sequence (ID)"
                icon={<Search size={14} className="text-neutral-500" />}
                placeholder="e.g., FX-728104"
                value={typedId}
                error={errorText}
                onChange={(e) => {
                  setTypedId(e.target.value);
                  if (errorText) setErrorText('');
                }}
              />

              <GlassButton type="submit" variant="cyan" className="w-full py-3 text-xs font-mono font-bold tracking-wider uppercase">
                Authorize Verification Scan
              </GlassButton>
            </form>
          </GlassCard>

          {/* Quick guide and seeded lookup codes container */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block text-center font-bold">
              Active Authorized Ledger Nodes
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orders.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  onClick={() => router.push(`/track/${order.id}`)}
                  className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-indigo-500/20 transition duration-300 cursor-pointer space-y-2 select-none group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                      {order.id}
                    </span>
                    <ChevronRight size={12} className="text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-400 font-sans truncate">
                      {order.items.map((i) => i.name).join(', ')}
                    </p>
                    <div className="flex items-center justify-between text-[8px] font-mono">
                      <span className="text-zinc-500 uppercase">{order.fulfillmentStatus}</span>
                      <span className="text-cyan-400">LKR {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {orders.length > 2 && (
              <p className="text-[9px] text-neutral-500 text-center">
                + Visit your <Link href="/profile" className="text-indigo-400 hover:underline">User Profile</Link> to view other newly initiated transaction logs.
              </p>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
