'use client';

import React from 'react';
import { CATEGORIES, ALL_TAGS } from '@/data/products';
import { FilterState } from '@/types';
import { RotateCcw, Star, Check } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  productCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  productCount,
}) => {
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags;
    const exists = currentTags.includes(tag);
    if (exists) {
      onFilterChange({ tags: currentTags.filter((t) => t !== tag) });
    } else {
      onFilterChange({ tags: [...currentTags, tag] });
    }
  };

  return (
    <aside className="w-full bg-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col gap-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <div>
          <h3 className="font-black text-lg uppercase tracking-tight text-black">
            CLOTHING FILTERS
          </h3>
          <span className="text-[11px] font-bold text-gray-500">
            SHOWING {productCount} GARMENTS
          </span>
        </div>
        <button
          onClick={onReset}
          className="p-1.5 bg-cream border-2 border-black rounded-lg shadow-neo-sm hover:bg-neo-yellow active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 text-[11px] font-black uppercase transition-all"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-black uppercase tracking-wider block mb-2.5 text-black">
          CATEGORY
        </label>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected =
              filters.category === cat || (cat === 'All' && !filters.category);

            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat === 'All' ? '' : cat })}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-xs font-black uppercase
                  border-2 border-black transition-all flex items-center justify-between
                  ${
                    isSelected
                      ? 'bg-neo-yellow text-black shadow-neo-sm translate-x-1'
                      : 'bg-cream text-black hover:bg-white hover:translate-x-0.5'
                  }
                `}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase tracking-wider text-black">
            MAX PRICE
          </label>
          <span className="font-black text-xs text-neo-red bg-cream border-2 border-black px-2 py-0.5 rounded shadow-neo-sm">
            {formatPrice(filters.priceRange[1])}
          </span>
        </div>

        <input
          type="range"
          min="3000"
          max="50000"
          step="500"
          value={filters.priceRange[1]}
          onChange={(e) =>
            onFilterChange({
              priceRange: [filters.priceRange[0], Number(e.target.value)],
            })
          }
          className="w-full accent-neo-red cursor-pointer h-3 bg-cream border-2 border-black rounded-lg"
        />

        <div className="flex justify-between text-[11px] font-mono font-bold text-gray-500 mt-1">
          <span>LKR 3,000</span>
          <span>LKR 50,000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-xs font-black uppercase tracking-wider block mb-2.5 text-black">
          MINIMUM RATING
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[4, 4.5, 4.8, 5].map((rate) => {
            const isSelected = filters.minRating === rate;
            return (
              <button
                key={rate}
                onClick={() =>
                  onFilterChange({ minRating: isSelected ? 0 : rate })
                }
                className={`
                  py-2 border-2 border-black rounded-lg text-xs font-black
                  flex items-center justify-center gap-1 transition-all
                  ${
                    isSelected
                      ? 'bg-neo-green text-white shadow-neo-sm'
                      : 'bg-cream text-black hover:bg-white'
                  }
                `}
              >
                <span>{rate}★</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="flex items-center justify-between p-3 bg-cream border-2 border-black rounded-lg shadow-neo-sm">
        <span className="text-xs font-black uppercase text-black">
          IN STOCK ONLY
        </span>
        <button
          onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
          className={`
            w-12 h-6 border-2 border-black rounded-full relative transition-colors duration-150
            ${filters.inStockOnly ? 'bg-neo-green' : 'bg-gray-300'}
          `}
          aria-label="Toggle in stock only"
        >
          <div
            className={`
              w-4 h-4 bg-white border-2 border-black rounded-full absolute top-0.5 transition-transform
              ${filters.inStockOnly ? 'left-6' : 'left-1'}
            `}
          />
        </button>
      </div>

      {/* Tags Chips */}
      <div>
        <label className="text-xs font-black uppercase tracking-wider block mb-2.5 text-black">
          SPECIAL FEATURES
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TAGS.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-2.5 py-1 text-[11px] font-black uppercase rounded-lg border-2 border-black
                  transition-all duration-100
                  ${
                    isSelected
                      ? 'bg-black text-white shadow-neo-sm -translate-y-0.5'
                      : 'bg-white text-black hover:bg-cream'
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
