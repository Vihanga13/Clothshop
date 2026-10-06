'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ShoppingBag, Heart, Search, Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { items: cartItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = [
    { label: 'ALL CLOTHING', href: '/shop' },
    { label: 'TOPS', href: '/shop?category=Tops' },
    { label: 'HOODIES', href: '/shop?category=Hoodies' },
    { label: 'JACKETS', href: '/shop?category=Jackets' },
    { label: 'PANTS', href: '/shop?category=Pants' },
    { label: 'DRESSES', href: '/shop?category=Dresses' },
    { label: 'DROPS', href: '/shop?badge=LIMITED' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20 gap-4">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 bg-white text-black border-2 border-black rounded-lg shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-neo-yellow border-3 border-black rounded-lg px-2.5 py-1 shadow-neo group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-neo-md transition-all">
                  <span className="font-black text-2xl md:text-3xl tracking-tighter text-black uppercase">
                    ECOMZ
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-neo-red text-white text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black rounded shadow-neo-sm -rotate-3">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>CLOTHING ATELIER</span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`
                      px-3.5 py-2 text-xs lg:text-sm font-black uppercase tracking-tight
                      border-2 rounded-lg transition-all duration-100
                      ${
                        isActive
                          ? 'bg-black text-white border-black shadow-neo-sm'
                          : 'bg-transparent text-black border-transparent hover:border-black hover:bg-white hover:shadow-neo-sm hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Desktop quick search bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex items-center relative w-48 xl:w-64"
              >
                <input
                  type="text"
                  placeholder="SEARCH HOODIES, TEES, PANTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-lg py-1.5 pl-3 pr-8 text-xs font-bold shadow-neo-sm focus:outline-none focus:shadow-neo focus:-translate-y-0.5 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-black hover:scale-110 transition-transform"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </form>

              {/* Mobile Search Icon Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-2 bg-white text-black border-2 border-black rounded-lg shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Toggle search bar"
              >
                <Search className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="relative p-2 sm:px-3 sm:py-2 bg-white text-black border-2 border-black rounded-lg shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-neo-red text-neo-red' : ''}`}
                  strokeWidth={2.5}
                />
                <span className="hidden sm:inline text-xs font-black uppercase">SAVED</span>
                {wishlistCount > 0 && (
                  <span className="bg-neo-red text-white text-[10px] font-black px-1.5 py-0.2 rounded border border-black shadow-neo-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={openCart}
                id="cart-drawer-trigger"
                className="relative p-2 sm:px-3 sm:py-2 bg-neo-yellow text-black border-2 border-black rounded-lg shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-neo-none transition-all flex items-center gap-2"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
                  CART
                </span>
                <AnimatePresence>
                  {totalCartCount > 0 && (
                    <motion.span
                      key={totalCartCount}
                      initial={{ scale: 0.5, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="bg-neo-red text-white text-xs font-black min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded border-2 border-black shadow-neo-sm"
                    >
                      {totalCartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile search bar dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden pb-3 overflow-hidden"
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="SEARCH HOODIES, TEES, PANTS, DRESSES..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-lg py-2 pl-3 pr-10 text-xs font-bold shadow-neo-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 p-1 bg-neo-yellow border-2 border-black rounded shadow-neo-sm"
                  >
                    <Search className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-4/5 max-w-sm bg-cream border-r-3 border-black shadow-neo-xl h-full flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-4 bg-neo-yellow border-b-3 border-black">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-black">ECOMZ MENU</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-white border-2 border-black rounded shadow-neo-sm"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-white border-2 border-black rounded-lg font-black text-sm uppercase shadow-neo-sm hover:bg-neo-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-2 border-t-2 border-black" />

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white border-2 border-black rounded-lg font-black text-sm uppercase shadow-neo-sm flex items-center justify-between"
                >
                  <span>WISHLIST</span>
                  <span className="bg-neo-red text-white text-xs px-2 py-0.5 rounded border border-black">
                    {wishlistCount}
                  </span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-neo-yellow border-2 border-black rounded-lg font-black text-sm uppercase shadow-neo flex items-center justify-between"
                >
                  <span>VIEW FULL CART</span>
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded border border-black">
                    {totalCartCount}
                  </span>
                </Link>
              </div>

              <div className="p-4 bg-neo-green border-t-3 border-black text-white text-xs font-black text-center uppercase tracking-wider">
                ⚡ FREE ISLANDWIDE SHIPPING OVER LKR 15,000
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
