'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/currency';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTotal,
    getFreeShippingThresholdProgress,
  } = useCartStore();

  const { addToast } = useToastStore();
  const [promoInput, setPromoInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const total = getTotal();
  const { progress, remaining } = getFreeShippingThresholdProgress();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromo(promoInput);
    if (success) {
      addToast({
        title: 'PROMO APPLIED!',
        message: `Discount code "${promoInput.toUpperCase()}" added to cart.`,
        type: 'success',
      });
      setPromoInput('');
    } else {
      addToast({
        title: 'INVALID CODE',
        message: 'Promo code not recognized.',
        type: 'error',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-none"
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-cream border-l-3 border-black shadow-neo-xl h-full flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-neo-yellow border-b-3 border-black">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-black" strokeWidth={2.5} />
                <h2 className="text-xl font-black uppercase tracking-tight text-black">
                  YOUR CART ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 bg-white text-black border-2 border-black rounded-lg shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-none transition-all"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="p-3 bg-white border-b-3 border-black">
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1.5">
                <span>{remaining > 0 ? `ADD ${formatPrice(remaining)} FOR FREE SHIPPING` : '🎉 UNLOCKED FREE SHIPPING!'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#E0D8C3] h-3 border-2 border-black rounded overflow-hidden">
                <div
                  className="bg-neo-green h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-4">
                  <div className="w-20 h-20 bg-neo-yellow border-3 border-black rounded-lg shadow-neo flex items-center justify-center rotate-3">
                    <ShoppingBag className="w-10 h-10 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">
                      YOUR CART IS EMPTY
                    </h3>
                    <p className="text-xs font-bold text-gray-700 mt-1">
                      Nothing in the vault yet. Grab some heavyweight pieces!
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-neo-red text-white border-3 border-black rounded-lg shadow-neo font-black uppercase text-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-neo-none transition-all"
                  >
                    EXPLORE THE VAULT
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border-3 border-black rounded-lg shadow-neo-sm flex gap-3 relative"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 shrink-0 border-2 border-black rounded overflow-hidden bg-cream">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-black text-xs uppercase tracking-tight leading-tight line-clamp-1 text-black">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-neo-red p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold bg-[#EAEAEA] px-1.5 py-0.5 rounded border border-black">
                            {item.color}
                          </span>
                          <span className="text-[10px] font-bold bg-neo-yellow px-1.5 py-0.5 rounded border border-black">
                            {item.size}
                          </span>
                        </div>
                      </div>

                      {/* Stepper + Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/15">
                        <div className="flex items-center border-2 border-black rounded bg-cream shadow-neo-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-black/10 active:bg-black/20"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-black" strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center font-black text-xs text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-black/10 active:bg-black/20"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3 h-3 text-black" strokeWidth={3} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-black">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 bg-white border-t-3 border-black flex flex-col gap-3">
                {/* Promo input */}
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 bg-neo-green/15 border-2 border-black rounded text-xs font-black">
                    <div className="flex items-center gap-1.5 text-neo-green">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} (-{formatPrice(discount)})</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs font-bold underline hover:text-neo-red"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO: CLOTH20, THREAD1500"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-cream border-2 border-black rounded px-3 py-1.5 text-xs font-bold uppercase placeholder:normal-case shadow-neo-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neo-yellow border-2 border-black rounded font-black text-xs uppercase shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[10px] font-bold text-neo-red -mt-1">{promoError}</p>
                )}

                {/* Subtotals */}
                <div className="space-y-1 text-xs font-bold pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SUBTOTAL</span>
                    <span className="font-black">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-neo-green">
                      <span>DISCOUNT</span>
                      <span className="font-black">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">SHIPPING</span>
                    <span className="font-black">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-black pt-2 border-t-2 border-black">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-neo-red">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full py-3.5 bg-neo-red text-white border-3 border-black rounded-lg shadow-neo font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-neo-none transition-all text-center"
                  >
                    <span>CHECKOUT NOW</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </Link>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-2 bg-cream text-black border-2 border-black rounded-lg font-black uppercase text-xs tracking-wider hover:bg-white text-center shadow-neo-sm transition-all"
                  >
                    VIEW DETAILED CART
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-neo-green" />
                  <span>256-BIT ENCRYPTED CHECKOUT • 30-DAY GUARANTEE</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
