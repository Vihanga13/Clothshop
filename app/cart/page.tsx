'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function FullCartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getTotal,
    getFreeShippingThresholdProgress,
  } = useCartStore();

  const { addToast } = useToastStore();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const tax = getTaxAmount();
  const total = getTotal();
  const { progress, remaining } = getFreeShippingThresholdProgress();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const success = applyPromo(promoCodeInput);
    if (success) {
      addToast({
        title: 'PROMO CODE APPLIED',
        message: `Successfully applied voucher "${promoCodeInput.toUpperCase()}".`,
        type: 'success',
      });
      setPromoCodeInput('');
    } else {
      addToast({
        title: 'INVALID CODE',
        message: 'Please try CLOTH20 (20% off), THREAD1500 (LKR 1,500 off), or FREESHIP.',
        type: 'error',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border-3 border-black rounded-lg p-12 text-center shadow-neo max-w-xl mx-auto flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-neo-yellow border-3 border-black rounded-lg shadow-neo flex items-center justify-center rotate-3">
            <ShoppingBag className="w-12 h-12 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              YOUR CLOTHING CART IS EMPTY
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mt-2">
              Looks like you haven't loaded any heavyweight hoodies, tees, or denim pieces into your wardrobe yet.
            </p>
          </div>
          <Button href="/shop" variant="yellow" size="lg">
            BROWSE CLOTHING ARCHIVE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-neo-yellow border-3 border-black rounded-lg p-6 shadow-neo mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 rounded border border-black shadow-neo-sm inline-block -rotate-1 mb-1">
            CHECKOUT READY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            YOUR VAULT BAG ({items.reduce((a, b) => a + b.quantity, 0)} ITEMS)
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs font-black uppercase underline hover:text-neo-blue"
        >
          ← CONTINUE SHOPPING
        </Link>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo mb-8">
        <div className="flex items-center justify-between text-xs font-black uppercase mb-2">
          <span>
            {remaining > 0
              ? `ADD ${formatPrice(remaining)} MORE TO UNLOCK FREE ISLANDWIDE SHIPPING!`
              : '🎉 CONGRATS! YOU HAVE QUALIFIED FOR FREE ISLANDWIDE SHIPPING!'}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-cream h-3.5 border-2 border-black rounded overflow-hidden">
          <div
            className="bg-neo-green h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Cart Items Table (Left) & Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border-3 border-black rounded-lg p-4 sm:p-5 shadow-neo flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
            >
              {/* Product Info with Image */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-24 h-24 shrink-0 bg-cream border-2 border-black rounded overflow-hidden shadow-neo-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-black">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold bg-[#EAEAEA] px-2 py-0.5 rounded border border-black">
                      {item.color}
                    </span>
                    <span className="text-xs font-bold bg-neo-yellow px-2 py-0.5 rounded border border-black">
                      {item.size}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500 block mt-1">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              </div>

              {/* Stepper + Total + Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-black/15">
                {/* Stepper */}
                <div className="flex items-center border-2 border-black rounded bg-cream shadow-neo-sm">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-black/10 active:bg-black/20"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                  </button>
                  <span className="w-8 text-center font-black text-xs text-black">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-black/10 active:bg-black/20"
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                  </button>
                </div>

                {/* Subtotal for line item */}
                <div className="text-right min-w-[70px]">
                  <span className="font-black text-sm text-black">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-neo-red hover:bg-red-50 rounded border border-transparent hover:border-black transition-all"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo-lg flex flex-col gap-6">
            <h2 className="font-black text-xl uppercase tracking-tight text-black border-b-3 border-black pb-3">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Voucher Input */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
                PROMO / VAULT VOUCHER
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-neo-green/15 border-2 border-black rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-black text-neo-green">
                    <Tag className="w-4 h-4" />
                    <span>{appliedPromo.code} ({appliedPromo.description})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-xs font-black underline hover:text-neo-red"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CLOTH20, THREAD1500, FREESHIP"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-cream text-black font-bold text-xs uppercase placeholder:normal-case border-2 border-black rounded-lg px-3 py-2 shadow-neo-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0.5"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-xs font-bold text-neo-red mt-1">{promoError}</p>
              )}
            </div>

            {/* Price lines */}
            <div className="space-y-2.5 text-xs font-bold pt-2 border-t-2 border-black">
              <div className="flex justify-between">
                <span className="text-gray-600">ITEMS SUBTOTAL</span>
                <span className="font-black text-black">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-neo-green">
                  <span>PROMO DISCOUNT</span>
                  <span className="font-black">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">ESTIMATED SHIPPING</span>
                <span className="font-black text-black">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>

              {tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ESTIMATED TAX</span>
                  <span className="font-black text-black">{formatPrice(tax)}</span>
                </div>
              )}

              <div className="flex justify-between text-base sm:text-lg font-black text-black pt-3 border-t-3 border-black">
                <span>TOTAL AMOUNT</span>
                <span className="text-neo-red">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Button
              href="/checkout"
              variant="red"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" strokeWidth={3} />}
            >
              PROCEED TO CHECKOUT
            </Button>

            <div className="flex flex-col gap-2 pt-2 border-t-2 border-black/10">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <ShieldCheck className="w-4 h-4 text-neo-green shrink-0" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <RotateCcw className="w-4 h-4 text-neo-blue shrink-0" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
