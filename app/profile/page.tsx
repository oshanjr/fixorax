'use client';

import React, { useState, useMemo } from 'react';
import { useCart, Order } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  MapPin,
  Phone,
  Package,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Truck,
  ExternalLink,
  History,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { orders, deliveryDetails, setDeliveryDetails } = useCart();

  // Local state for profile address edits
  const [fullName, setFullName] = useState(deliveryDetails.fullName);
  const [phone, setPhone] = useState(deliveryDetails.phone);
  const [address, setAddress] = useState(deliveryDetails.address);
  const [district, setDistrict] = useState(deliveryDetails.district);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Expanded list of orders for detailed review
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  // Toggle order expansion
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Sri Lanka districts
  const sriLankaDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
    'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
    'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ];

  // Save changes handler
  const handleUpdateAddresses = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full recipient name is required';
    if (!phone.trim()) errors.phone = 'Contact number is required';
    if (!address.trim()) errors.address = 'Detailed shipping address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    setTimeout(() => {
      setDeliveryDetails({
        fullName,
        phone,
        address,
        district
      });
      setIsSaving(false);
      setSaveSuccess('Destination coordinates updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    }, 1000);
  };

  // Calculate high-fidelity stats from user order logs
  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activeConsignments = orders.filter(
      (o) => o.fulfillmentStatus !== 'Delivered'
    ).length;
    const deliveredCount = orders.filter(
      (o) => o.fulfillmentStatus === 'Delivered'
    ).length;

    return { totalSpent, activeConsignments, deliveredCount };
  }, [orders]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#020204]">
      {/* Background Ambience Glows */}
      <div className="absolute top-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full glow-spot-purple pointer-events-none blur-[180px] opacity-10" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[600px] h-[600px] rounded-full glow-spot-cyan pointer-events-none blur-[180px] opacity-10" />

      <Navbar activeTab="profile" />

      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Title */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-white leading-none">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            Manage your delivery addresses, view purchase history, and track your mobile orders.
          </p>
        </div>

        {/* User Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Column A: Settings & Delivery Addresses (Span: 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* User Meta Card */}
            <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border-white/10 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/15 pointer-events-none blur-[30px]" />
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold font-mono shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  OJ
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white leading-none">{fullName || 'Oshan Jayasri'}</h2>
                    <span className="text-[8px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase bg-cyan-950 px-1.5 py-0.5 border border-cyan-500/25 rounded">
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">oshanjayasri@gmail.com</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                    <Calendar size={12} /> Joined June 2026
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Metrics block */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1 text-center">
                <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Total Spent</p>
                <p className="text-xs sm:text-sm font-bold text-white font-mono truncate">LKR {stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1 text-center">
                <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Active Cargo</p>
                <div className="flex items-center justify-center gap-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full inline-block", stats.activeConsignments > 0 ? "bg-indigo-400 animate-pulse" : "bg-neutral-600")} />
                  <p className="text-sm font-bold text-white font-mono">{stats.activeConsignments}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1 text-center">
                <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Delivered</p>
                <p className="text-sm font-bold text-white font-mono text-emerald-400">{stats.deliveredCount}</p>
              </div>
            </div>

            {/* Glass address configuration */}
            <form onSubmit={handleUpdateAddresses} className="space-y-4">
              <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border-white/10 space-y-5 rounded-2xl">
                <div>
                  <h3 className="font-sans font-bold text-white text-base flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-400" /> Dispatch Coordinates
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Customize your island-wide delivery coordinates safely.</p>
                </div>

                <div className="space-y-4">
                  <GlassInput
                    label="Full Name"
                    icon={<User size={14} className="text-neutral-500" />}
                    placeholder="Recipient Name"
                    value={fullName}
                    error={formErrors.fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <GlassInput
                    label="Contact Phone"
                    icon={<Phone size={14} className="text-neutral-500" />}
                    placeholder="Sri Lankan Hotline"
                    value={phone}
                    error={formErrors.phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono pl-1">
                      District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full font-sans text-sm h-11 rounded-xl px-4 text-neutral-200 outline-none transition-all duration-300 bg-[#020204]/80 border border-white/[0.06] focus:border-indigo-500 cursor-pointer"
                    >
                      {sriLankaDistricts.map((d) => (
                        <option key={d} value={d} className="bg-zinc-950 text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono pl-1">
                      Street & Signature Address
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={cn(
                        'w-full font-sans text-xs rounded-xl px-4 py-3 outline-none transition-all duration-300 resize-none',
                        'text-white border border-white/[0.06] bg-white/[0.01] focus:bg-white/[0.04]',
                        'focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]',
                        formErrors.address && 'border-rose-500/40'
                      )}
                      placeholder="No/Street etc."
                    />
                    {formErrors.address && (
                      <span className="text-[10px] text-rose-400 font-mono italic pl-1">{formErrors.address}</span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-md flex items-center gap-2 text-emerald-400 text-xs"
                    >
                      <CheckCircle2 size={14} className="flex-shrink-0" />
                      <span>{saveSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>

              <div className="flex justify-end">
                <GlassButton type="submit" variant="cyan" disabled={isSaving} className="py-2.5 px-6 text-xs font-mono font-bold">
                  {isSaving ? 'Verifying coordinates...' : 'Save Settings Lock'}
                </GlassButton>
              </div>
            </form>
          </div>

          {/* Column B: Order History Component (Span: 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-white">
                <History className="text-indigo-400" size={18} />
                <h3 className="font-sans font-bold text-lg">Order Logs & Ledger</h3>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                {orders.length} orders total
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 p-8 rounded-2xl space-y-4">
                <div className="w-12 h-12 bg-white/[0.01] border border-white/10 rounded-full flex items-center justify-center text-neutral-500 mx-auto">
                  <Package size={20} className="opacity-40" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No Prior Transactions</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Your device history is empty. Finalize an order from our secure checkout platform to start populating your premium logs.
                </p>
                <Link href="/products">
                  <GlassButton variant="cyan" className="text-xs">Browse Products</GlassButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.includes(order.id);
                  const isDelivered = order.fulfillmentStatus === 'Delivered';
                  const isShipped = order.fulfillmentStatus === 'Shipped';
                  
                  return (
                    <GlassCard
                      key={order.id}
                      interactive={false}
                      className={cn(
                        "bg-zinc-950/45 border-white/[0.07] overflow-hidden rounded-xl transition-all duration-300",
                        isExpanded && "border-indigo-500/30 bg-zinc-950/80 shadow-[0_4px_30px_rgba(99,102,241,0.04)]"
                      )}
                    >
                      {/* Main compact order summary line */}
                      <div 
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-indigo-400 text-sm tracking-wider">{order.id}</span>
                            <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1 uppercase">
                              <Calendar size={10} /> {order.timestamp}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 items-center text-[10px]">
                            <span className="text-zinc-400 font-mono">
                              Total: <span className="text-white font-bold">LKR {order.totalAmount.toLocaleString()}</span>
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400 font-sans">
                              {order.items.reduce((sum, i) => sum + i.quantity, 0)} Devices
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          {/* Payment & Fulfillment badges */}
                          <div className="flex gap-2">
                            {/* Fulfillment Status badge */}
                            <span className={cn(
                              "text-[8px] font-mono font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border leading-none self-center",
                              isDelivered && "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
                              isShipped && "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
                              order.fulfillmentStatus === 'Processing' && "bg-violet-500/10 border-violet-500/25 text-violet-400 animate-pulse",
                              order.fulfillmentStatus === 'Order Placed' && "bg-amber-500/10 border-amber-500/25 text-amber-400"
                            )}>
                              {order.fulfillmentStatus}
                            </span>

                            {/* Payment Status badge */}
                            <span className={cn(
                              "text-[8px] font-mono font-semibold uppercase px-2 py-0.5 rounded border leading-none self-center text-zinc-400 border-white/10 bg-white/[0.02]",
                              order.paymentStatus === 'Approved' && "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/80"
                            )}>
                              {order.paymentStatus}
                            </span>
                          </div>

                          <div className="text-neutral-500 hover:text-white transition">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable detailed breakdown under frame */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-white/5 bg-white/[0.01]"
                          >
                            <div className="p-5 space-y-5">
                              {/* Items list */}
                              <div className="space-y-3">
                                <p className="text-[9px] font-mono font-bold tracking-widest text-[#949eac] uppercase">Allocated Items</p>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div 
                                      key={`${item.id}-${idx}`}
                                      className="p-3 bg-zinc-950/45 border border-white/5 rounded-lg flex items-center justify-between gap-4 text-xs"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-bold text-white truncate leading-normal text-xs">{item.name}</p>
                                          {item.selectedVariant && (
                                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate max-w-[250px] sm:max-w-md">
                                              {item.selectedVariant}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="font-mono text-indigo-400">LKR {item.price.toLocaleString()}</p>
                                        <p className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">{item.quantity} Unit{item.quantity > 1 ? 's' : ''}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Footer tracking integrations & details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs text-neutral-300">
                                <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/5">
                                  <p className="text-[9px] font-mono tracking-wider uppercase text-neutral-500 font-bold">Consignment Destination</p>
                                  <div className="font-sans text-[11px] leading-relaxed space-y-0.5">
                                    <p className="text-white font-bold">{order.deliveryDetails.fullName}</p>
                                    <p className="text-zinc-400">{order.deliveryDetails.phone}</p>
                                    <p className="text-zinc-400 mt-0.5 truncate">{order.deliveryDetails.address}, {order.deliveryDetails.district}</p>
                                  </div>
                                </div>

                                <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                                  <div>
                                    <p className="text-[9px] font-mono tracking-wider uppercase text-neutral-500 font-bold">Fulfillment Logistics</p>
                                    {order.courierName ? (
                                      <div className="mt-1 font-sans text-[11px]">
                                        <p className="text-zinc-300">Partner: <span className="text-white font-bold">{order.courierName}</span></p>
                                        <p className="text-zinc-400 mt-0.5">AWB: <span className="text-[#a5b4fc] font-mono">{order.trackingNumber}</span></p>
                                      </div>
                                    ) : (
                                      <p className="text-zinc-500 mt-1 leading-normal text-[11px]">Logistics code pending verification verification...</p>
                                    )}
                                  </div>

                                  <div className="pt-2 flex justify-end">
                                    <Link href={`/track/${order.id}`}>
                                      <GlassButton variant="outline" className="text-[10px] h-7 px-3 py-0 font-mono tracking-widest uppercase">
                                        Track Live <ExternalLink size={10} className="ml-1" />
                                      </GlassButton>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
