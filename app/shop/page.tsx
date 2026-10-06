'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { FilterState } from '@/types';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();

  // Initial State from URL params if present
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialBadge = searchParams.get('badge') || '';

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    priceRange: [3000, 50000],
    minRating: 0,
    inStockOnly: false,
    tags: [],
    sortBy: 'featured',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if query params change
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
    if (initialSearch) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialCategory, initialSearch]);

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: [3000, 50000],
      minRating: 0,
      inStockOnly: false,
      tags: [],
      sortBy: 'featured',
    });
  };

  // Filtered & Sorted Products calculation
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category && filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // In Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Tags
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags.every((tag) => p.tags.includes(tag))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Header */}
      <div className="bg-neo-yellow border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 rounded border border-black shadow-neo-sm inline-block -rotate-1 mb-2">
            CATALOG 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            THE CLOTHING ARCHIVE
          </h1>
          <p className="text-xs sm:text-sm font-bold text-black/80 mt-1 max-w-lg">
            Heavyweight loopback hoodies, boxy organic tees, Okayama raw denim, and architectural garments. Filter and sort by silhouette.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-black rounded-lg px-4 py-2 font-mono font-black text-sm shadow-neo-sm">
            {filteredProducts.length} ITEMS FOUND
          </div>
        </div>
      </div>

      {/* Search Bar & Sort Dropdown Control Bar */}
      <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="SEARCH HOODIES, TEES, DENIM, COATS..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full bg-cream text-black font-bold text-xs uppercase placeholder:normal-case border-2 border-black rounded-lg py-2.5 pl-3 pr-10 shadow-neo-sm focus:outline-none focus:bg-white"
          />
          {filters.search ? (
            <button
              onClick={() => handleFilterChange({ search: '' })}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-black pointer-events-none" />
          )}
        </div>

        {/* Right side controls: Mobile Filter Trigger & Sort dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 bg-neo-yellow border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>FILTERS</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-black hidden sm:block" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="bg-cream text-black font-black text-xs uppercase border-2 border-black rounded-lg px-3 py-2.5 shadow-neo-sm focus:outline-none cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="rating">HIGHEST RATED</option>
              <option value="newest">NEWEST DROPS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Animated Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        onRemoveCategory={() => handleFilterChange({ category: '' })}
        onRemoveTag={(tag) =>
          handleFilterChange({ tags: filters.tags.filter((t) => t !== tag) })
        }
        onResetRating={() => handleFilterChange({ minRating: 0 })}
        onResetPrice={() => handleFilterChange({ priceRange: [40, 300] })}
        onResetSearch={() => handleFilterChange({ search: '' })}
        onClearAll={handleResetFilters}
      />

      {/* Main Layout: Sidebar & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            productCount={filteredProducts.length}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border-3 border-black rounded-lg p-12 text-center shadow-neo flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-neo-yellow border-3 border-black rounded-lg shadow-neo flex items-center justify-center -rotate-6">
                <Search className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                  NO VAULT PIECES FOUND
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1 max-w-sm mx-auto">
                  No items matched your current active filters or search terms. Try clearing some filters.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-neo-red text-white border-3 border-black rounded-lg shadow-neo font-black text-xs uppercase hover:-translate-y-0.5 active:translate-y-0.5"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod, index) => (
                <ProductCard key={prod.id} product={prod} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xs bg-cream border-l-3 border-black shadow-neo-xl h-full flex flex-col z-10 ml-auto"
            >
              <div className="flex items-center justify-between p-4 bg-neo-yellow border-b-3 border-black">
                <span className="font-black text-lg text-black uppercase">
                  FILTER PRODUCTS
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 bg-white border-2 border-black rounded shadow-neo-sm"
                >
                  <X className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  productCount={filteredProducts.length}
                />
              </div>

              <div className="p-4 bg-white border-t-3 border-black">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-neo-red text-white border-3 border-black rounded-lg font-black text-xs uppercase shadow-neo"
                >
                  VIEW {filteredProducts.length} RESULTS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center font-black">
          LOADING VAULT...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
