'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3001';

export default function AdminNewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    category: 'Hoodies',
    price: '',
    stock: '50',
    tagline: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    badge: 'NEW',
    badgeColor: 'yellow',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
          tagline: form.tagline || form.name,
          description: form.description,
          images: [form.imageUrl],
          tags: [form.category, 'Atelier Heavyweight'],
          badge: form.badge,
          badgeColor: form.badgeColor,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/products');
      } else {
        setError(data.error || 'Failed to create product in database.');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      setError('Unable to reach Shop API on port 3001.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO INVENTORY</span>
      </Link>

      <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo">
        <div className="flex items-center gap-2 pb-4 border-b-3 border-black mb-6">
          <Plus className="w-6 h-6 text-neo-green" strokeWidth={3} />
          <h1 className="text-2xl font-black uppercase text-black">
            ADD NEW GARMENT TO ATELIER
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-neo-red text-white border-2 border-black rounded font-black text-xs uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ULTRA-HEAVY LOOPBACK CREWNECK"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-black block mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="Tops">Tops</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Jackets">Jackets</option>
                <option value="Pants">Pants</option>
                <option value="Dresses">Dresses</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-black block mb-1">
                Price (LKR) *
              </label>
              <input
                type="number"
                required
                placeholder="16500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-black block mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-black block mb-1">
                Badge
              </label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="LIMITED">LIMITED</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="-30%">-30%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">
              Tagline
            </label>
            <input
              type="text"
              placeholder="500GSM ultra-dense organic cotton drape"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Crafted with architectural heavyweight stitching and premium wash..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 py-3 px-6 bg-neo-yellow text-black border-3 border-black rounded-lg font-black text-sm uppercase shadow-neo hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'SAVING TO DATABASE...' : 'SAVE GARMENT TO DATABASE'}
          </button>
        </form>
      </div>
    </div>
  );
}
