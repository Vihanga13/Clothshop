'use client';

import React from 'react';
import { FilterState } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveCategory: () => void;
  onRemoveTag: (tag: string) => void;
  onResetRating: () => void;
  onResetPrice: () => void;
  onResetSearch: () => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveCategory,
  onRemoveTag,
  onResetRating,
  onResetPrice,
  onResetSearch,
  onClearAll,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    filters.tags.length > 0 ||
    filters.minRating > 0 ||
    filters.priceRange[1] < 50000 ||
    filters.inStockOnly;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-black uppercase tracking-wider text-black mr-1">
        ACTIVE:
      </span>

      <AnimatePresence>
        {/* Search query chip */}
        {filters.search && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neo-yellow border-2 border-black rounded-lg shadow-neo-sm text-xs font-black uppercase text-black"
          >
            <span>Query: "{filters.search}"</span>
            <button
              onClick={onResetSearch}
              className="hover:scale-125 transition-transform"
              aria-label="Remove search filter"
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* Category chip */}
        {filters.category && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neo-blue text-white border-2 border-black rounded-lg shadow-neo-sm text-xs font-black uppercase"
          >
            <span>{filters.category}</span>
            <button
              onClick={onRemoveCategory}
              className="hover:scale-125 transition-transform"
              aria-label="Remove category filter"
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* Max price chip */}
        {filters.priceRange[1] < 50000 && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neo-red text-white border-2 border-black rounded-lg shadow-neo-sm text-xs font-black uppercase"
          >
            <span>≤ {formatPrice(filters.priceRange[1])}</span>
            <button
              onClick={onResetPrice}
              className="hover:scale-125 transition-transform"
              aria-label="Reset max price"
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* Rating chip */}
        {filters.minRating > 0 && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neo-green text-white border-2 border-black rounded-lg shadow-neo-sm text-xs font-black uppercase"
          >
            <span>≥ {filters.minRating}★</span>
            <button
              onClick={onResetRating}
              className="hover:scale-125 transition-transform"
              aria-label="Reset rating filter"
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* Tag chips */}
        {filters.tags.map((tag) => (
          <motion.div
            key={tag}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neo-pink text-black border-2 border-black rounded-lg shadow-neo-sm text-xs font-black uppercase"
          >
            <span>{tag}</span>
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:scale-125 transition-transform"
              aria-label={`Remove ${tag} filter`}
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </motion.div>
        ))}

        {/* Clear All button */}
        <motion.button
          layout
          onClick={onClearAll}
          className="px-2.5 py-1 text-xs font-black uppercase underline hover:text-neo-red transition-colors"
        >
          CLEAR ALL
        </motion.button>
      </AnimatePresence>
    </div>
  );
};
