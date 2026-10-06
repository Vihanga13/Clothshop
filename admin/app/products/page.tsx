'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Search,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3001';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const formatPrice = (val: number) => `LKR ${Number(val).toLocaleString()}`;

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleUpdateStock = async (productId: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nextStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: nextStock } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this garment from the database?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black">
            PRODUCTS & INVENTORY
          </h1>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Live catalog sync with SQLite database on Core Shop ({products.length} garments).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 bg-cream text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>

          <Link
            href="/products/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-neo-green text-white border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>NEW PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search garment name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream border-2 border-black rounded text-xs font-bold text-black focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isLow = product.stock <= 10;
          const isOut = product.stock === 0;

          return (
            <div
              key={product.id}
              className="bg-white border-3 border-black rounded-lg p-4 shadow-neo flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {product.images?.[0] ? (
                  <div className="relative w-20 h-24 border-2 border-black rounded overflow-hidden shrink-0 bg-cream">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-24 border-2 border-black rounded bg-gray-200 flex items-center justify-center text-xs">
                    Garment
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase text-gray-500 block">
                    {product.category}
                  </span>
                  <h4 className="font-black text-xs uppercase text-black line-clamp-2">
                    {product.name}
                  </h4>
                  <span className="font-black text-sm text-neo-red block mt-1">
                    {formatPrice(product.price)}
                  </span>

                  <div className="mt-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                        isOut
                          ? 'bg-neo-red text-white'
                          : isLow
                          ? 'bg-neo-yellow text-black'
                          : 'bg-neo-green text-white'
                      }`}
                    >
                      {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Controls */}
              <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-gray-600">Stock:</span>
                  <div className="flex items-center border-2 border-black rounded bg-cream">
                    <button
                      onClick={() => handleUpdateStock(product.id, product.stock, -1)}
                      className="px-2 py-0.5 font-black hover:bg-black/10"
                      title="Decrease stock"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-mono font-black">{product.stock}</span>
                    <button
                      onClick={() => handleUpdateStock(product.id, product.stock, 1)}
                      className="px-2 py-0.5 font-black hover:bg-black/10"
                      title="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`http://localhost:3001/product/${product.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 border border-black rounded bg-gray-100 hover:bg-gray-200"
                    title="View on store"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1.5 border border-black rounded bg-neo-red/10 text-neo-red hover:bg-neo-red hover:text-white transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
