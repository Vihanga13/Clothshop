'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
  badgeColor?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  badge,
  badgeColor = 'yellow',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const badgeColorClass =
    badgeColor === 'red'
      ? 'bg-neo-red text-white'
      : badgeColor === 'blue'
      ? 'bg-neo-blue text-white'
      : badgeColor === 'green'
      ? 'bg-neo-green text-white'
      : 'bg-neo-yellow text-black';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Frame */}
      <div className="relative aspect-square w-full bg-white border-3 border-black rounded-lg shadow-neo-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[selectedIndex] || images[0]}
              alt={`${productName} view ${selectedIndex + 1}`}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating badge if available */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`
                px-3 py-1.5 text-xs font-black uppercase
                border-2 border-black rounded-lg shadow-neo-sm
                -rotate-3 inline-block
                ${badgeColorClass}
              `}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Image index indicator */}
        <div className="absolute bottom-4 right-4 z-10">
          <span className="px-2.5 py-1 bg-black/90 text-white font-mono text-xs font-black border-2 border-white rounded shadow-neo-sm">
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`
                  relative w-20 h-20 shrink-0 border-3 border-black rounded-lg overflow-hidden bg-white
                  transition-all duration-100
                  ${
                    isSelected
                      ? 'ring-3 ring-neo-yellow shadow-neo -translate-y-1'
                      : 'opacity-70 hover:opacity-100 hover:shadow-neo-sm'
                  }
                `}
                aria-label={`Select image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
