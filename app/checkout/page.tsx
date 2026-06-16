'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  User,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Upload,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowRight,
  ClipboardCheck,
  Clipboard,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  ShoppingBag,
  PackageCheck
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartItemCount, deliveryDetails, setDeliveryDetails, clearCart, addOrder } = useCart();

  // Active step state (1: Delivery details, 2: Payment & Action Phase)
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Receipt upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Editing Bank details mock state
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Hatton National Bank (HNB)',
    accountNumber: '0934-2901-4402-9901',
    branchName: 'Ja-Ela Elite Branch',
    holderName: 'Shehan Sandaru'
  });
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Final Order placement states
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sri Lanka major districts for high accuracy dropdown
  const sriLankaDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
    'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
    'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ];

  // Validate Step 1 before proceeding to Step 2
  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!deliveryDetails.fullName.trim()) {
      errors.fullName = 'Full recipient name is required';
    }
    if (!deliveryDetails.phone.trim()) {
      errors.phone = 'Phone contact is required';
    } else if (!/^[0-9+\s-]{9,15}$/.test(deliveryDetails.phone)) {
      errors.phone = 'Please enter a valid phone number format';
    }
    if (!deliveryDetails.address.trim()) {
      errors.address = 'Destination home/office signature address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setActiveStep(2);
  };

  // Drag and drop events for bank receipt
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Only accept image files or PDF
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Valid transmission format: JPEG, PNG, WEBP images or PDF files.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate high-contrast calibration upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadedFile(file);
          setIsUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const clearReceiptFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleCopyToClipboard = (label: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.warn('Clip action failed, manual replication needed.');
    }
  };

  // Core Order placement and WhatsApp deep link generator
  const handlePlaceOrder = () => {
    if (!uploadedFile) {
      alert('Mandatory protocol checkpoint: Please upload your Bank Receipt screenshot before confirming order dispatch.');
      return;
    }

    setIsSubmittingOrder(true);

    // Unique order ID setup
    const orderIdValue = `FX-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(orderIdValue);

    // Save order details to order history
    const now = new Date();
    const formattedDate = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours() % 12 || 12).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0') + ' ' + 
      (now.getHours() >= 12 ? 'PM' : 'AM');

    addOrder({
      id: orderIdValue,
      timestamp: formattedDate,
      totalAmount: cartSubtotal,
      paymentStatus: 'Awaiting Verification',
      fulfillmentStatus: 'Order Placed',
      items: [...cart],
      deliveryDetails: { ...deliveryDetails }
    });

    // Generate comprehensive beautifully formatted text for Shehan
    const lineItems = cart
      .map((item) => `• ${item.quantity}x ${item.name} ${item.selectedVariant ? `[${item.selectedVariant}]` : ''}`)
      .join('\n');

    const waMessage = `FixoraX Premium Dispatch Request [${orderIdValue}]
=======================================

Consignment Items:
${lineItems}

Financial Summary:
Total Value: LKR ${cartSubtotal.toLocaleString()} (Verified via Bank Deposit)

Recipient Coordinates:
- Full Name: ${deliveryDetails.fullName}
- Phone Contact: ${deliveryDetails.phone}
- Island District: ${deliveryDetails.district}
- Address: ${deliveryDetails.address}

Bank Proof: Receipts Transmitted (${uploadedFile.name})
=======================================
Please authorize verification and trigger the Gampaha packing sequence.`;

    // Hot redirect URL configuration using wa.me with standard codes
    const cleanHotline = '949152005'; // Explicit Gampaha hotline
    const deepLinkUrl = `https://wa.me/${cleanHotline}?text=${encodeURIComponent(waMessage)}`;

    setTimeout(() => {
      setIsSubmittingOrder(false);
      setShowSuccessModal(true);

      // Programmatically open WhatsApp in new tab securely
      window.open(deepLinkUrl, '_blank');
    }, 1500);
  };

  const handleCompleteFlow = () => {
    setShowSuccessModal(false);
    clearCart();
    // Redirect to homepage
    window.location.href = '/';
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic Glow effects */}
      <div className="absolute top-[-100px] left-[-50px] w-[500px] h-[500px] rounded-full glow-spot-cyan pointer-events-none blur-[150px] opacity-15" />
      <div className="absolute bottom-[-100px] right-[-50px] w-[500px] h-[500px] rounded-full glow-spot-purple pointer-events-none blur-[150px] opacity-15" />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Breadcrumb section */}
        <div className="mb-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight size={10} className="text-neutral-600" />
          <Link href="/products" className="hover:text-white transition">Catalog</Link>
          <ChevronRight size={10} className="text-neutral-600" />
          <span className="text-indigo-400">Direct Checkout Desk</span>
        </div>

        {/* Title */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-white leading-none">
            Dispatch Escrow Desk
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            You are finishing your premium hardware allocation. Complete the two-step verification below to authorize shipping.
          </p>
        </div>

        {cartItemCount === 0 && !showSuccessModal ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4 rounded-3xl border border-dashed border-white/10 p-8">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-neutral-500 mx-auto">
              <ShoppingBag size={20} className="opacity-40" />
            </div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">Consignment Manifest Empty</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No items were allocated in the active workspace. Visit our catalog block to choose premium smartphones, high-speed docks, and audio configurations.
            </p>
            <Link href="/products">
              <GlassButton variant="cyan" className="text-xs">
                Inspect Catalog
              </GlassButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Column A: Interactive Step Form Process (Span: 7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Checkout Progress Stepper */}
              <div className="grid grid-cols-2 gap-4">
                {/* Step 1 badge */}
                <div
                  onClick={() => activeStep === 2 && setActiveStep(1)}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-300 select-none flex items-center gap-3',
                    activeStep === 1
                      ? 'bg-indigo-500/10 border-indigo-500/35 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                      : 'bg-white/[0.01] border-white/5 text-neutral-400 hover:text-white cursor-pointer'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold leading-none',
                    activeStep === 1 ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400'
                  )}>
                    01
                  </div>
                  <div>
                    <p className="text-[9px] font-mono tracking-wider uppercase font-bold text-neutral-400">Escrow Block 1</p>
                    <p className="text-xs font-bold font-sans">Recipient Address</p>
                  </div>
                </div>

                {/* Step 2 badge */}
                <div
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-300 select-none flex items-center gap-3',
                    activeStep === 2
                      ? 'bg-indigo-500/10 border-indigo-500/35 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                      : 'bg-white/[0.01] border-white/5 text-neutral-500'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold leading-none',
                    activeStep === 2 ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-500'
                  )}>
                    02
                  </div>
                  <div>
                    <p className="text-[9px] font-mono tracking-wider uppercase font-bold text-neutral-500">Escrow Block 2</p>
                    <p className="text-xs font-bold font-sans">Proof & Verification</p>
                  </div>
                </div>
              </div>

              {/* Form Step Details Panels */}
              <AnimatePresence mode="wait">
                {activeStep === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.35 }}
                  >
                    <form onSubmit={handleValidateStep1} className="space-y-6">
                      <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border-white/10 space-y-6 rounded-2xl">
                        <div className="pb-4 border-b border-white/5">
                          <h3 className="font-sans font-bold text-white text-base flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-400" /> Destination Contact Information
                          </h3>
                          <p className="text-[11px] text-neutral-400 mt-1">Specify full delivery coordinates in Sri Lanka accurately.</p>
                        </div>

                        {/* Recipient Full Name */}
                        <div className="space-y-1.5">
                          <GlassInput
                            label="Recipient Full Name"
                            icon={<User size={14} className="text-neutral-500" />}
                            placeholder="Shehan Sandaru"
                            value={deliveryDetails.fullName}
                            error={formErrors.fullName}
                            onChange={(e) => {
                              setDeliveryDetails((prev) => ({ ...prev, fullName: e.target.value }));
                              if (formErrors.fullName) setFormErrors((err) => ({ ...err, fullName: '' }));
                            }}
                          />
                        </div>

                        {/* Recipient Mobile Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <GlassInput
                              label="Active Mobile Contact"
                              icon={<Phone size={14} className="text-neutral-500" />}
                              placeholder="+94 78 277 2598"
                              value={deliveryDetails.phone}
                              error={formErrors.phone}
                              onChange={(e) => {
                                setDeliveryDetails((prev) => ({ ...prev, phone: e.target.value }));
                                if (formErrors.phone) setFormErrors((err) => ({ ...err, phone: '' }));
                              }}
                            />
                          </div>

                          {/* Island District Selector */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono pl-1">
                              Destination District
                            </label>
                            <div className="relative">
                              <select
                                value={deliveryDetails.district}
                                onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, district: e.target.value }))}
                                className="w-full font-sans text-sm h-11 rounded-xl px-4 text-neutral-200 outline-none transition-all duration-300 bg-white/[0.01] border border-white/[0.06] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 cursor-pointer"
                              >
                                {sriLankaDistricts.map((d) => (
                                  <option key={d} value={d} className="bg-zinc-950 text-white">
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Direct Address Textarea */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono pl-1">
                            Detailed Delivery Address
                          </label>
                          <textarea
                            rows={3}
                            placeholder="No. 39/2B/1, Ja-Ela Road, Gampaha City Center"
                            value={deliveryDetails.address}
                            onChange={(e) => {
                              setDeliveryDetails((prev) => ({ ...prev, address: e.target.value }));
                              if (formErrors.address) setFormErrors((err) => ({ ...err, address: '' }));
                            }}
                            className={cn(
                              'w-full font-sans text-xs rounded-xl px-4 py-3 outline-none transition-all duration-300 resize-none',
                              'text-white border border-white/[0.06] placeholder-neutral-500 bg-white/[0.01]',
                              'focus:bg-white/[0.04] focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]',
                              formErrors.address && 'border-rose-500/40'
                            )}
                          />
                          {formErrors.address && (
                            <span className="text-[11px] text-rose-400 font-mono pl-1">{formErrors.address}</span>
                          )}
                        </div>
                      </GlassCard>

                      <div className="flex justify-end">
                        <GlassButton type="submit" variant="cyan" className="py-3 px-6 text-xs font-mono font-bold">
                          Next Path Checkpoint <ArrowRight size={14} className="ml-1" />
                        </GlassButton>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <GlassCard interactive={false} className="p-6 bg-[#020204]/40 border-white/10 space-y-6 rounded-2xl">
                      <div className="pb-4 border-b border-white/5 flex items-center justify-between">
                        <div>
                          <h3 className="font-sans font-bold text-white text-base flex items-center gap-2">
                            <CreditCard size={16} className="text-indigo-400" /> Step 2: Escrow Bank Coordinates
                          </h3>
                          <p className="text-[11px] text-[neutral-400] mt-1">Cash on Delivery is locked. Deploy to the verified Hatton National Bank node listed below.</p>
                        </div>
                        <span className="text-[8px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
                          Bank Transfer Lock
                        </span>
                      </div>

                      {/* Prominent glass coordinates box */}
                      <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Hatton National Bank Credentials</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingBank(!isEditingBank)}
                            className="text-[9px] font-mono text-indigo-400 uppercase hover:underline cursor-pointer"
                          >
                            {isEditingBank ? 'Lock Editing' : 'Customize Coordinates'}
                          </button>
                        </div>

                        <div className="space-y-3 font-sans text-xs">
                          {/* Bank Name */}
                          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                            <span className="text-neutral-500 text-[10px]">Bank Module:</span>
                            {isEditingBank ? (
                              <input
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                className="bg-neutral-900 border border-white/10 rounded px-2 py-0.5 text-xs text-white outline-none text-right"
                              />
                            ) : (
                              <span className="font-semibold text-neutral-200">{bankDetails.bankName}</span>
                            )}
                          </div>

                          {/* Account number */}
                          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                            <span className="text-neutral-500 text-[10px]">Account No:</span>
                            {isEditingBank ? (
                              <input
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                className="bg-neutral-900 border border-white/10 rounded px-2 py-0.5 text-xs text-white outline-none text-right"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white selection:bg-indigo-500/30">{bankDetails.accountNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyToClipboard('account', bankDetails.accountNumber)}
                                  className="text-neutral-500 hover:text-indigo-400 cursor-pointer"
                                  title="Copy numerical sequence"
                                >
                                  {copiedField === 'account' ? <ClipboardCheck size={12} className="text-emerald-400" /> : <Clipboard size={12} />}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Branch Name */}
                          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                            <span className="text-neutral-500 text-[10px]">Branch:</span>
                            {isEditingBank ? (
                              <input
                                value={bankDetails.branchName}
                                onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                                className="bg-neutral-900 border border-white/10 rounded px-2 py-0.5 text-xs text-white outline-none text-right"
                              />
                            ) : (
                              <span className="font-semibold text-neutral-300">{bankDetails.branchName}</span>
                            )}
                          </div>

                          {/* Account holder name */}
                          <div className="flex items-center justify-between py-2">
                            <span className="text-neutral-500 text-[10px]">Holder Name:</span>
                            {isEditingBank ? (
                              <input
                                value={bankDetails.holderName}
                                onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })}
                                className="bg-neutral-900 border border-white/10 rounded px-2 py-0.5 text-xs text-white outline-none text-right"
                              />
                            ) : (
                              <span className="font-semibold text-indigo-300">{bankDetails.holderName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Drag-and-drop manual receipt dropzone */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block font-bold">Transmit Receipt Screenshot</span>
                        
                        {!uploadedFile ? (
                          <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={cn(
                              'border border-dashed rounded-xl p-8 text-center transition-all duration-300 relative',
                              dragActive
                                ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
                            )}
                          >
                            <input
                              type="file"
                              id="receipt-upload"
                              className="hidden"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={handleFileChange}
                            />
                            <label
                              htmlFor="receipt-upload"
                              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                            >
                              <div className="w-10 h-10 rounded-lg bg-zinc-950/50 border border-white/5 flex items-center justify-center text-neutral-400 shadow-inner">
                                {isUploading ? (
                                  <span className="w-4 h-4 rounded-full border border-t-indigo-400 border-r-transparent animate-spin inline-block" />
                                ) : (
                                  <Upload size={16} />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white">Click or Drag & Drop physical receipt</p>
                                <p className="text-[10px] text-neutral-400 leading-normal">
                                  Supports JPG, PNG, WEBP, or PDF (Limit 10MB)
                                </p>
                              </div>
                            </label>

                            {isUploading && (
                              <div className="absolute inset-x-6 bottom-4 space-y-1.5">
                                <div className="flex justify-between items-center text-[9px] font-mono text-indigo-300 font-bold uppercase">
                                  <span>calibrating alignment</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 transition-all duration-150"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Receipt Upload Successfully Loaded
                          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                                <FileCheck2 size={16} />
                              </div>
                              <div className="max-w-[200px] sm:max-w-[280px]">
                                <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Receipt Calibrated</p>
                                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono">{uploadedFile.name}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={clearReceiptFile}
                              className="p-1.5 rounded bg-zinc-950 text-neutral-400 hover:text-rose-400 transition hover:bg-neutral-900 border border-white/5 cursor-pointer"
                              title="Discard upload"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </GlassCard>

                    {/* Controls Footer */}
                    <div className="flex justify-between items-center">
                      <GlassButton
                        type="button"
                        variant="outline"
                        onClick={() => setActiveStep(1)}
                        className="py-3 px-5 text-xs font-mono font-bold"
                      >
                        ← Back Details
                      </GlassButton>

                      {/* Action trigger button */}
                      <GlassButton
                        type="button"
                        variant="cyan"
                        onClick={handlePlaceOrder}
                        disabled={isSubmittingOrder || !uploadedFile}
                        className={cn(
                          'py-3.5 px-8 text-xs font-mono font-bold uppercase tracking-widest relative',
                          !uploadedFile && 'opacity-40 cursor-not-allowed hover:bg-transparent'
                        )}
                      >
                        {isSubmittingOrder ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-t-indigo-400 border-r-transparent animate-spin inline-block" />
                            calibrating escrow...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-white">
                            Lock & Place Order <ExternalLink size={13} />
                          </span>
                        )}
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column B: Order Summary Consignment Details (Span: 5) */}
            <div className="lg:col-span-5">
              <GlassCard interactive={false} className="p-6 bg-zinc-950/45 border-white/[0.08] rounded-2xl sticky top-30 space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-white text-base">Consignment Specification</h3>
                  <p className="text-[10px] font-mono text-indigo-300 font-bold tracking-widest uppercase mt-1">Escrow Summary</p>
                </div>

                {/* Grid Item Cards inside summary */}
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/tool/60/60';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-xs leading-normal">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {item.quantity} units {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-indigo-400 shrink-0 select-none">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals Calculations Panel */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center text-xs text-neutral-400 font-medium">
                    <span>Premium Packings</span>
                    <span className="font-mono text-white text-[11px] uppercase">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 font-medium">
                    <span>Islandwide Shipping</span>
                    <span className="font-mono text-white text-[11px] uppercase">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-2.5 border-t border-white/5 text-neutral-200">
                    <span>Grand Total Value</span>
                    <span className="font-mono text-indigo-400 text-lg">
                      LKR {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-neutral-400 font-bold flex items-center gap-1.5 leading-none">
                    <Lock size={12} className="text-indigo-400" /> Secure Escrow protocol
                  </span>
                  <p className="text-[9px] text-neutral-500 leading-normal font-sans">
                    FixoraX verified escrow prevents leakage. Consignments undergo high-fidelity calibrations before couriers trigger packing in Gampaha.
                  </p>
                </div>
              </GlassCard>
            </div>

          </div>
        )}
      </main>

      <Footer />

      {/* Success Modal Backdrop Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg bg-[#020204]/90 border border-indigo-500/40 p-8 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                  <PackageCheck size={32} />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-400">
                    verification authorization locked
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-white">
                    Order Dispatched!
                  </h2>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    Account specifications have been verified under ID <span className="font-mono text-indigo-400 font-bold">{generatedOrderId}</span>.
                  </p>
                </div>

                {/* Help Box for WhatsApp redirect */}
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-neutral-400 leading-relaxed text-left space-y-3 font-sans">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono text-[10px] uppercase">
                    <MessageSquare size={14} className="text-indigo-400" /> backup system validation
                  </div>
                  <p>
                    A WhatsApp dialog has been initiated automatically with Shehan Sandaru under hotline <span className="text-white">+949152005</span>. 
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    If pop-ups are blocked, copy your receipt image and notify Shehan with your simulation reference code: <span className="text-white font-mono">{generatedOrderId}</span>.
                  </p>
                </div>

                {/* Final button */}
                <div className="flex justify-center pt-2">
                  <GlassButton
                    variant="cyan"
                    onClick={handleCompleteFlow}
                    className="w-full py-3.5 text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Complete Escrow Session
                  </GlassButton>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
