'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { formatPrice } from '@/lib/currency';
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Flame,
  ArrowLeft,
  Ruler,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);

  if (!product) {
    notFound();
  }

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'features' | 'shipping'>('details');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, quantity);
    addToast({
      title: 'ADDED TO ATELIER CART!',
      message: `${quantity}x ${product.name} (${selectedColor}, ${selectedSize})`,
      type: 'success',
    });
  };

  const handleBuyNow = () => {
    addItem(product, selectedColor, selectedSize, quantity);
    openCart();
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    addToast({
      title: added ? 'SAVED TO WISHLIST' : 'REMOVED FROM WISHLIST',
      message: `${product.name} ${added ? 'saved' : 'removed'}.`,
      type: added ? 'info' : 'warning',
    });
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);

  // If not enough in same category, pad with top products
  const finalRelated =
    relatedProducts.length >= 3
      ? relatedProducts
      : [
          ...relatedProducts,
          ...PRODUCTS.filter(
            (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
          ).slice(0, 3 - relatedProducts.length),
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-tight mb-8">
        <Link href="/" className="hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>HOME</span>
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:underline">
          CLOTHING
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:underline">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery (Left) & Purchasing Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <ProductGallery
            images={product.images}
            productName={product.name}
            badge={product.badge}
            badgeColor={product.badgeColor}
          />
        </div>

        {/* Right: Product Info & Selectors */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-black text-white text-xs font-black uppercase rounded border border-black shadow-neo-sm">
                {product.category}
              </span>

              {product.fit && (
                <span className="px-2.5 py-1 bg-neo-yellow text-black text-xs font-black uppercase rounded border-2 border-black shadow-neo-sm">
                  {product.fit}
                </span>
              )}

              {product.stock <= 5 && (
                <span className="px-2.5 py-1 bg-neo-red text-white text-xs font-black uppercase rounded border-2 border-black shadow-neo-sm flex items-center gap-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>ONLY {product.stock} LEFT IN BATCH</span>
                </span>
              )}

              <span className="px-2.5 py-1 bg-white text-black text-xs font-black uppercase rounded border-2 border-black shadow-neo-sm">
                {product.rating} ★ ({product.reviewCount} REVIEWS)
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-tight">
              {product.name}
            </h1>

            <p className="text-sm font-bold text-gray-700 mt-2 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-white border-3 border-black rounded-lg shadow-neo flex items-baseline gap-4">
            <span className="font-black text-2xl sm:text-4xl text-black">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-black text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="ml-auto font-black text-xs bg-neo-red text-white px-2.5 py-1 border-2 border-black rounded shadow-neo-sm">
                SAVE {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Fabric Highlight Pill */}
          {product.fabric && (
            <div className="p-3 bg-cream border-2 border-black rounded-lg shadow-neo-sm flex items-center gap-2.5 text-xs font-bold text-black">
              <Scissors className="w-4 h-4 text-neo-blue shrink-0" strokeWidth={2.5} />
              <span>
                <strong className="uppercase">Textile Composition:</strong> {product.fabric}
              </span>
            </div>
          )}

          {/* Color Selector (Chunky Toggle Buttons) */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider block mb-2 text-black">
              SELECT COLORWAY:{' '}
              <span className="text-neo-blue underline">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`
                      px-3.5 py-2 rounded-lg border-2 border-black font-black text-xs uppercase
                      flex items-center gap-2 transition-all duration-100
                      ${
                        isSelected
                          ? 'bg-neo-yellow text-black shadow-neo -translate-y-0.5 ring-2 ring-black'
                          : 'bg-white text-black hover:bg-cream shadow-neo-sm'
                      }
                      active:translate-x-0.5 active:translate-y-0.5
                    `}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector (Chunky Toggle Buttons) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                SELECT SIZE:{' '}
                <span className="text-neo-red underline">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[11px] font-black uppercase underline hover:text-neo-blue flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>INTERACTIVE SIZE GUIDE</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`
                      min-w-[54px] py-2.5 px-3 rounded-lg border-2 border-black font-black text-xs uppercase
                      transition-all duration-100 text-center
                      ${
                        isSelected
                          ? 'bg-black text-white shadow-neo -translate-y-0.5'
                          : 'bg-white text-black hover:bg-cream shadow-neo-sm'
                      }
                      active:translate-x-0.5 active:translate-y-0.5
                    `}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Stepper */}
            <div className="flex items-center border-3 border-black rounded-lg bg-white shadow-neo p-1 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-100 rounded active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-black" strokeWidth={3} />
              </button>
              <span className="w-12 text-center font-black text-base text-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2.5 hover:bg-gray-100 rounded active:translate-x-0.5 active:translate-y-0.5"
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-black" strokeWidth={3} />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="
                flex-1 w-full py-4 px-6 bg-neo-yellow text-black border-3 border-black rounded-lg
                shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md
                active:translate-x-1 active:translate-y-1 active:shadow-neo-none
                font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2
                transition-all
              "
            >
              <ShoppingBag className="w-5 h-5 text-black" strokeWidth={2.5} />
              <span>ADD TO ATELIER CART</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`
                p-4 border-3 border-black rounded-lg shadow-neo transition-all shrink-0
                ${
                  isFavorited
                    ? 'bg-neo-red text-white'
                    : 'bg-white text-black hover:bg-cream'
                }
                active:translate-x-1 active:translate-y-1 active:shadow-none
              `}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Buy Now Direct Button */}
          <button
            onClick={handleBuyNow}
            className="
              w-full py-3.5 bg-neo-red text-white border-3 border-black rounded-lg
              shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md
              active:translate-x-1 active:translate-y-1 active:shadow-neo-none
              font-black text-sm uppercase tracking-wider transition-all
            "
          >
            ⚡ INSTANT CHECKOUT (BUY NOW)
          </button>

          {/* Perks Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white border-2 border-black rounded-lg shadow-neo-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-neo-blue shrink-0" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase">
                FREE SHIP OVER LKR 15,000
              </span>
            </div>
            <div className="p-3 bg-white border-2 border-black rounded-lg shadow-neo-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neo-red shrink-0" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase">
                FREE SIZE EXCHANGES
              </span>
            </div>
            <div className="p-3 bg-white border-2 border-black rounded-lg shadow-neo-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neo-green shrink-0" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase">
                100% GENUINE ATELIER
              </span>
            </div>
          </div>

          {/* Tabbed Info / Accordion */}
          <div className="border-3 border-black rounded-lg bg-white overflow-hidden shadow-neo mt-4">
            <div className="flex border-b-3 border-black bg-cream overflow-x-auto">
              {(['details', 'fabric', 'features', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 min-w-[120px] py-3 font-black text-xs uppercase transition-all whitespace-nowrap px-3
                    ${
                      activeTab === tab
                        ? 'bg-neo-yellow text-black border-b-3 border-black shadow-neo-sm'
                        : 'text-gray-600 hover:text-black'
                    }
                  `}
                >
                  {tab === 'details'
                    ? 'DESCRIPTION'
                    : tab === 'fabric'
                    ? 'FABRIC & CARE'
                    : tab === 'features'
                    ? 'TAILORING SPECS'
                    : 'SHIPPING & EXCHANGES'}
                </button>
              ))}
            </div>

            <div className="p-5 text-xs font-semibold text-gray-800 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  {product.fit && (
                    <div className="p-2.5 bg-cream border border-black rounded">
                      <strong className="text-black uppercase">Fit Profile:</strong> {product.fit}. Order true to size for intended aesthetic drape.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'fabric' && (
                <div className="space-y-3">
                  {product.fabric && (
                    <div>
                      <strong className="text-black uppercase block mb-1">Textile Weight & Origin:</strong>
                      <p>{product.fabric}</p>
                    </div>
                  )}

                  {product.care && product.care.length > 0 && (
                    <div>
                      <strong className="text-black uppercase block mb-1">Garment Care Instructions:</strong>
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.care.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>
                    <strong>Dispatched within 24 hours:</strong> Tracked garment shipping with DHL Express or FedEx Priority.
                  </p>
                  <p>
                    <strong>30-Day Free Sizing Exchanges:</strong> Ordered the wrong size? We provide free return shipping labels to swap for your ideal fit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Size Guide Modal */}
      <Modal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="CLOTHING SIZE & FIT GUIDE"
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-neo-yellow border-2 border-black rounded-lg shadow-neo-sm text-xs font-bold">
            <span className="uppercase font-black block mb-0.5">FIT RECOMMENDATION:</span>
            {product.fit || 'Oversized Boxy Cut'}. For the signature atelier drape, select your regular size. For a slimmer, standard fit, order one size down.
          </div>

          <div className="overflow-x-auto border-2 border-black rounded-lg bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-black text-white uppercase font-black">
                <tr>
                  <th className="p-2.5">SIZE</th>
                  <th className="p-2.5">CHEST (IN)</th>
                  <th className="p-2.5">LENGTH (IN)</th>
                  <th className="p-2.5">SHOULDER (IN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20 font-bold">
                <tr className="hover:bg-cream">
                  <td className="p-2.5 font-black">XS</td>
                  <td className="p-2.5">38 - 40</td>
                  <td className="p-2.5">26.5</td>
                  <td className="p-2.5">19.0</td>
                </tr>
                <tr className="hover:bg-cream">
                  <td className="p-2.5 font-black">S</td>
                  <td className="p-2.5">40 - 42</td>
                  <td className="p-2.5">27.5</td>
                  <td className="p-2.5">20.0</td>
                </tr>
                <tr className="hover:bg-cream bg-neo-yellow/20">
                  <td className="p-2.5 font-black">M (Standard)</td>
                  <td className="p-2.5">42 - 44</td>
                  <td className="p-2.5">28.5</td>
                  <td className="p-2.5">21.0</td>
                </tr>
                <tr className="hover:bg-cream">
                  <td className="p-2.5 font-black">L</td>
                  <td className="p-2.5">44 - 46</td>
                  <td className="p-2.5">29.5</td>
                  <td className="p-2.5">22.0</td>
                </tr>
                <tr className="hover:bg-cream">
                  <td className="p-2.5 font-black">XL</td>
                  <td className="p-2.5">46 - 48</td>
                  <td className="p-2.5">30.5</td>
                  <td className="p-2.5">23.0</td>
                </tr>
                <tr className="hover:bg-cream">
                  <td className="p-2.5 font-black">2XL</td>
                  <td className="p-2.5">48 - 51</td>
                  <td className="p-2.5">31.5</td>
                  <td className="p-2.5">24.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="px-5 py-2 bg-black text-white font-black text-xs uppercase rounded-lg border-2 border-black shadow-neo-sm hover:bg-neo-red transition-all"
            >
              GOT IT, CLOSE GUIDE
            </button>
          </div>
        </div>
      </Modal>

      {/* Customer Reviews Section */}
      <section className="mb-20 pt-8 border-t-4 border-black">
        <ProductReviews
          initialReviews={product.reviews}
          productName={product.name}
          rating={product.rating}
        />
      </section>

      {/* Related Products Grid */}
      <section className="pt-8 border-t-4 border-black">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-neo-yellow text-black text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-neo-sm inline-block mb-1">
              CURATED COMBINATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              PAIR WITH THESE PIECES
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black uppercase underline hover:text-neo-blue"
          >
            VIEW ALL GARMENTS
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalRelated.map((rel, index) => (
            <ProductCard key={rel.id} product={rel} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
