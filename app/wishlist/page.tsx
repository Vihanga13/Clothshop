'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;

    items.forEach((product) => {
      addItem(product, product.colors[0]?.name, product.sizes[0], 1);
    });

    addToast({
      title: 'ALL ITEMS MOVED TO CART',
      message: `${items.length} garments transferred to your cart.`,
      type: 'success',
    });
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-neo-red text-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 rounded border border-white shadow-neo-sm inline-block -rotate-1 mb-2">
            WARDROBE WISHLIST
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            SAVED WISHLIST ({items.length})
          </h1>
          <p className="text-xs sm:text-sm font-bold text-white/90 mt-1 max-w-lg">
            Keep track of your favorite tailored garments, limited clothing drops, and wardrobe essentials.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleMoveAllToCart}
              variant="yellow"
              size="md"
              leftIcon={<ShoppingBag className="w-4 h-4 text-black" strokeWidth={2.5} />}
            >
              MOVE ALL TO CART
            </Button>
            <button
              onClick={clearWishlist}
              className="p-2.5 bg-white text-black border-2 border-black rounded-lg shadow-neo-sm hover:bg-cream active:translate-y-0.5 transition-all"
              title="Clear all saved items"
              aria-label="Clear wishlist"
            >
              <Trash2 className="w-4 h-4 text-neo-red" />
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Content Grid or Empty State */}
      {items.length === 0 ? (
        <div className="bg-white border-3 border-black rounded-lg p-12 text-center shadow-neo max-w-md mx-auto flex flex-col items-center gap-4 my-8">
          <div className="w-20 h-20 bg-neo-yellow border-3 border-black rounded-lg shadow-neo flex items-center justify-center -rotate-3">
            <Heart className="w-10 h-10 text-black fill-neo-red" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              NO SAVED ITEMS YET
            </h2>
            <p className="text-xs font-bold text-gray-600 mt-1">
              Tap the heart icon on any product in the shop to save it to your wishlist.
            </p>
          </div>
          <Button href="/shop" variant="yellow" size="md" rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={3} />}>
            START EXPLORING
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
