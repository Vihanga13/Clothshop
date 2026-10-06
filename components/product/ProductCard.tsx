'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, Plus, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';

export interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeColorMap = {
  yellow: 'bg-neo-yellow text-black',
  red: 'bg-neo-red text-white',
  blue: 'bg-neo-blue text-white',
  green: 'bg-neo-green text-white',
  pink: 'bg-neo-pink text-black',
  orange: 'bg-neo-orange text-black',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, product.colors[0]?.name, product.sizes[0], 1);
    addToast({
      title: 'ADDED TO CART!',
      message: `${product.name} (Qty: 1) added.`,
      type: 'success',
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist(product);
    addToast({
      title: added ? 'SAVED TO WISHLIST' : 'REMOVED FROM WISHLIST',
      message: `${product.name} ${added ? 'added to your favorites' : 'removed'}.`,
      type: added ? 'info' : 'warning',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative flex flex-col bg-white border-3 border-black rounded-lg shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-150 overflow-hidden"
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-[#F4EEDC] overflow-hidden border-b-3 border-black">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Sticker/Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`
                inline-block px-2.5 py-1 text-xs font-black uppercase
                border-2 border-black rounded-lg shadow-neo-sm
                -rotate-3 group-hover:rotate-0 transition-transform
                ${badgeColorMap[product.badgeColor || 'yellow']}
              `}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`
            absolute top-3 right-3 z-10 p-2 rounded-lg border-2 border-black shadow-neo-sm
            transition-all duration-100
            ${
              isFavorited
                ? 'bg-neo-red text-white'
                : 'bg-white text-black hover:bg-cream'
            }
            active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
          `}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
            strokeWidth={2.5}
          />
        </button>

        {/* Category Pill Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase border border-white rounded shadow-neo-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Star rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-neo-yellow">
              <Star className="w-3.5 h-3.5 fill-neo-yellow text-black" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-black text-black">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] font-bold text-gray-500">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-black text-sm uppercase tracking-tight text-black line-clamp-1 group-hover:text-neo-blue transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short tagline */}
          <p className="text-xs font-semibold text-gray-600 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-base sm:text-lg text-black">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] font-bold text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="
              px-3 py-1.5 bg-neo-yellow text-black font-black text-xs uppercase
              border-2 border-black rounded-lg shadow-neo-sm
              hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo
              active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
              transition-all flex items-center gap-1 shrink-0
            "
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
