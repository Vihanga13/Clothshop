'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToastStore } from '@/store/useToastStore';
import { ArrowUpRight, Mail, Instagram, Twitter, Disc as Discord, Shield, Truck, RefreshCw, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToastStore();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      addToast({
        title: 'ENTER VALID EMAIL',
        message: 'Please provide a valid email address to join the drop list.',
        type: 'error',
      });
      return;
    }

    addToast({
      title: 'WELCOME TO THE VAULT!',
      message: 'You are on the VIP drop list. Check your inbox for 15% off.',
      type: 'success',
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-neo-black text-white border-t-4 border-black relative overflow-hidden">
      {/* Brand value highlights top bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b-3 border-white/20 divide-y-3 md:divide-y-0 md:divide-x-3 divide-white/20">
        <div className="p-6 flex items-center gap-4 bg-black">
          <div className="w-12 h-12 bg-neo-yellow text-black border-2 border-white rounded-lg flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#FFF]">
            <Truck className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-neo-yellow">
              WORLDWIDE EXPEDITION
            </h4>
            <p className="text-xs text-gray-300 font-medium">Free express shipping over LKR 15,000.</p>
          </div>
        </div>

        <div className="p-6 flex items-center gap-4 bg-black">
          <div className="w-12 h-12 bg-neo-red text-white border-2 border-white rounded-lg flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#FFF]">
            <RefreshCw className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-neo-red">
              30-DAY ZERO BS RETURNS
            </h4>
            <p className="text-xs text-gray-300 font-medium">No hassle, prepaid return labels.</p>
          </div>
        </div>

        <div className="p-6 flex items-center gap-4 bg-black">
          <div className="w-12 h-12 bg-neo-green text-white border-2 border-white rounded-lg flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#FFF]">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-neo-green">
              100% CERTIFIED ATELIER
            </h4>
            <p className="text-xs text-gray-300 font-medium">Heavyweight 500GSM & Okayama Denim.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Big Brand Statement & Newsletter */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-black text-4xl tracking-tighter text-neo-yellow bg-black border-3 border-neo-yellow px-3 py-1 rounded shadow-[4px_4px_0px_#FFD60A]">
                ECOMZ
              </span>
              <span className="bg-neo-red text-white text-xs font-black px-2.5 py-1 border-2 border-white rounded -rotate-3">
                EST. 2026
              </span>
            </div>

            <p className="text-base font-bold text-gray-300 max-w-md leading-relaxed">
              STOP WEARING BORING CLOTHES. Premium neo-brutalist garments, heavyweight organic cotton, and tailored silhouettes crafted for everyday individuality.
            </p>

            {/* Newsletter input */}
            <div className="bg-neo-yellow p-6 border-3 border-white rounded-lg shadow-[6px_6px_0px_#FFF] text-black">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 fill-black" />
                <h4 className="font-black text-lg uppercase tracking-tight">
                  JOIN THE DROP VAULT
                </h4>
              </div>
              <p className="text-xs font-bold text-black/80 mb-4">
                Get notified 15 minutes before limited drops sell out + unlock secret 15% discount.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white text-black border-2 border-black rounded-lg px-3 py-2.5 text-xs font-bold shadow-[2px_2px_0px_#000] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white border-2 border-black rounded-lg font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-neo-red hover:text-white active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
                >
                  GET ACCESS
                </button>
              </form>
            </div>
          </div>

          {/* Right Columns: Navigation & Socials */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Shop */}
            <div>
              <h5 className="font-black text-sm uppercase tracking-wider text-neo-yellow mb-4 border-b-2 border-neo-yellow pb-1 inline-block">
                SHOP CLOTHING
              </h5>
              <ul className="space-y-2.5 text-xs font-bold uppercase">
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    All Garments
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Tops" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Tops & Tees
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Hoodies" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Hoodies & Sweats
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Jackets" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Jackets & Coats
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Pants" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Pants & Denim
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Dresses" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Dresses & Sets
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Accessories" className="text-gray-300 hover:text-neo-yellow transition-colors">
                    Bags & Hats
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Support */}
            <div>
              <h5 className="font-black text-sm uppercase tracking-wider text-neo-green mb-4 border-b-2 border-neo-green pb-1 inline-block">
                ASSISTANCE
              </h5>
              <ul className="space-y-2.5 text-xs font-bold uppercase">
                <li>
                  <Link href="/track-order" className="text-gray-300 hover:text-neo-green transition-colors">
                    Track Order Live
                  </Link>
                </li>
                <li>
                  <span className="text-gray-300 cursor-pointer hover:text-neo-green transition-colors">
                    Shipping Policy
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 cursor-pointer hover:text-neo-green transition-colors">
                    30-Day Free Fit Exchanges
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 cursor-pointer hover:text-neo-green transition-colors">
                    Size & Sizing Guide
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 cursor-pointer hover:text-neo-green transition-colors">
                    Fabric Care & Washing
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Social & Badges */}
            <div className="col-span-2 sm:col-span-1">
              <h5 className="font-black text-sm uppercase tracking-wider text-neo-pink mb-4 border-b-2 border-neo-pink pb-1 inline-block">
                COMMUNITY
              </h5>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white text-black border-2 border-black rounded-lg font-black text-xs uppercase flex items-center justify-between shadow-[2px_2px_0px_#FFF] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>INSTAGRAM</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#5865F2] text-white border-2 border-black rounded-lg font-black text-xs uppercase flex items-center justify-between shadow-[2px_2px_0px_#FFF] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Discord className="w-3.5 h-3.5" />
                    <span>DISCORD</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-black text-white border-2 border-white rounded-lg font-black text-xs uppercase flex items-center justify-between shadow-[2px_2px_0px_#FFF] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5" />
                    <span>TWITTER / X</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Accepted payments & Copyright */}
        <div className="mt-12 pt-8 border-t-2 border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-gray-400 mr-2">PAYMENTS:</span>
            {['VISA', 'MASTERCARD', 'APPLE PAY', 'GOOGLE PAY', 'PAYPAL', 'CRYPTO'].map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 bg-gray-900 border border-white/40 rounded text-[9px] font-black uppercase text-gray-300"
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="text-xs font-bold text-gray-400 text-center md:text-right">
            © 2026 ECOMZ CLOTHING ATELIER INC. ALL RIGHTS RESERVED. PLAYFUL NEO-BRUTALISM.
          </p>
        </div>
      </div>
    </footer>
  );
};
