'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Marquee } from '@/components/ui/Marquee';
import { Button } from '@/components/ui/Button';
import { Sticker } from '@/components/ui/Sticker';
import { ArrowRight, Flame, Sparkles, Shield, Compass, ShoppingBag, Zap, Award, Shirt, Scissors, Layers } from 'lucide-react';

export default function HomePage() {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  const featuredDrops = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-black bg-cream">
        <div className="max-w-7xl mx-auto">
          {/* Top Hero Pill Badges */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <Sticker
              text="SPRING / SUMMER 2026 APPAREL DROP"
              variant="yellow"
              rotation={-2}
              icon={<Zap className="w-4 h-4 fill-black" />}
            />
            <Sticker
              text="100% ORGANIC CERTIFIED COTTON"
              variant="pink"
              rotation={3}
              icon={<Sparkles className="w-4 h-4 fill-black" />}
            />
            <div className="hidden sm:inline-block bg-neo-green text-white text-xs font-black uppercase px-3 py-1.5 border-2 border-black rounded-lg shadow-neo-sm">
              FREE SHIPPING OVER LKR 15,000
            </div>
          </motion.div>

          {/* Main Grid: Headline & Interactive Product Collage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Giant Headline & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 flex flex-col gap-6"
            >
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-black leading-[0.95]">
                CONTEMPORARY <span className="bg-neo-yellow px-2 py-0.5 border-3 border-black rounded-lg shadow-neo inline-block -rotate-1">CLOTHING</span> & HEAVY THREADS.
              </h1>

              <p className="text-base sm:text-lg font-bold text-gray-800 max-w-xl leading-relaxed">
                Zero boring basics. Crafted with 500GSM ultra-dense loopback French terry, Okayama Japanese raw selvedge denim, and breathable European flax linen.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  href="/shop"
                  variant="yellow"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" strokeWidth={3} />}
                >
                  SHOP ALL CLOTHING
                </Button>

                <Button
                  href="/shop?badge=LIMITED"
                  variant="white"
                  size="lg"
                  leftIcon={<Flame className="w-5 h-5 text-neo-red" strokeWidth={2.5} />}
                >
                  EXPLORE DROPS
                </Button>
              </div>

              {/* Mini Trust Stats */}
              <div className="pt-6 border-t-3 border-black grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="font-black text-2xl sm:text-3xl text-black block">500+</span>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700">GSM TERRY</span>
                </div>
                <div>
                  <span className="font-black text-2xl sm:text-3xl text-neo-red block">100%</span>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700">PURE ORGANIC</span>
                </div>
                <div>
                  <span className="font-black text-2xl sm:text-3xl text-neo-blue block">30-DAY</span>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700">FIT GUARANTEE</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Color-Blocked Product Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Main Collage Frame */}
              <div className="relative w-full aspect-[4/5] bg-neo-yellow border-3 border-black rounded-lg shadow-neo-xl p-4 flex flex-col justify-between">
                {/* Product Hero Image */}
                <div className="relative w-full h-[75%] border-3 border-black rounded-lg overflow-hidden bg-white shadow-neo">
                  <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
                    alt="Acid-Wash Heavyweight Hoodie featured garment"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute top-3 left-3 bg-neo-red text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black rounded-lg shadow-neo-sm -rotate-3">
                    -30% OFF DROP
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="mt-3 bg-white border-3 border-black rounded-lg p-3 shadow-neo flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">SIGNATURE PIECE</span>
                    <h4 className="font-black text-xs uppercase text-black">ACID HEAVY HOODIE</h4>
                    <span className="font-black text-base text-neo-red">LKR 16,500</span>
                  </div>
                  <Link
                    href="/product/prod-01"
                    className="p-2 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>BUY</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </Link>
                </div>

                {/* Offset Decorative Floating Badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-neo-blue text-white p-3 border-3 border-black rounded-lg shadow-neo rotate-6 hidden sm:block select-none">
                  <span className="font-black text-xs uppercase block text-center">ATELIER</span>
                  <span className="font-black text-lg block text-center">500 GSM</span>
                </div>

                <div className="absolute -bottom-3 -left-3 z-20 bg-neo-green text-white px-3.5 py-1.5 border-3 border-black rounded-lg shadow-neo -rotate-6 select-none">
                  <span className="font-black text-xs uppercase tracking-wide block leading-none">LIMITED CUT</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE TICKER */}
      <Marquee
        items={[
          'FREE ISLANDWIDE EXPRESS SHIPPING OVER LKR 15,000',
          '100% GOTS CERTIFIED ORGANIC COTTON',
          'OKAYAMA JAPANESE RAW SELVEDGE DENIM',
          '30-DAY ZERO-BS FREE SIZE EXCHANGES',
          'NEW SEASON CLOTHING DROPS WEEKLY',
          '500GSM ULTRA-HEAVYWEIGHT APPAREL STANDARD',
        ]}
        speed="normal"
        bgColor="bg-neo-yellow"
        textColor="text-black"
      />

      {/* 3. FEATURED CATEGORIES AS OFFSET COLOR BLOCKS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-neo-red text-white text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-neo-sm">
                SHOP BY SILHOUETTE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              EXPLORE CLOTHING
            </h2>
          </div>
          <p className="text-sm font-bold text-gray-700 max-w-md">
            Cut and stitched with precision. No flimsy fast-fashion fabrics. Pick your daily statement pieces.
          </p>
        </div>

        {/* Dynamic Offset / Staggered Color Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Category 1: Tops & Tees (Sunny Yellow Block - Offset Top) */}
          <Link
            href="/shop?category=Tops"
            className="group relative bg-neo-yellow border-3 border-black rounded-lg p-5 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-200 flex flex-col justify-between h-[360px] lg:-translate-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-2xl uppercase tracking-tighter text-black">
                TOPS & TEES
              </span>
              <span className="bg-black text-white text-xs font-black px-2 py-0.5 border border-white rounded shadow-neo-sm">
                01
              </span>
            </div>

            <div className="relative w-full h-48 border-3 border-black rounded-lg overflow-hidden bg-white shadow-neo-sm my-auto">
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                alt="Tops & Tees Category"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black uppercase">BOXY TEES & POPLIN</span>
              <div className="p-1.5 bg-black text-white rounded border border-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
          </Link>

          {/* Category 2: Hoodies & Sweats (Cherry Red Block - Offset Bottom) */}
          <Link
            href="/shop?category=Hoodies"
            className="group relative bg-neo-red border-3 border-black rounded-lg p-5 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-200 flex flex-col justify-between h-[360px] lg:translate-y-4 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-2xl uppercase tracking-tighter">
                HOODIES
              </span>
              <span className="bg-white text-black text-xs font-black px-2 py-0.5 border border-black rounded shadow-neo-sm">
                02
              </span>
            </div>

            <div className="relative w-full h-48 border-3 border-black rounded-lg overflow-hidden bg-white shadow-neo-sm my-auto">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                alt="Hoodies Category"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black uppercase text-white">500GSM & KNITWEAR</span>
              <div className="p-1.5 bg-white text-black rounded border border-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
          </Link>

          {/* Category 3: Jackets & Outerwear (Cobalt Blue Block - Offset Top) */}
          <Link
            href="/shop?category=Jackets"
            className="group relative bg-neo-blue border-3 border-black rounded-lg p-5 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-200 flex flex-col justify-between h-[360px] lg:-translate-y-2 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-2xl uppercase tracking-tighter">
                JACKETS
              </span>
              <span className="bg-white text-black text-xs font-black px-2 py-0.5 border border-black rounded shadow-neo-sm">
                03
              </span>
            </div>

            <div className="relative w-full h-48 border-3 border-black rounded-lg overflow-hidden bg-white shadow-neo-sm my-auto">
              <Image
                src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"
                alt="Jackets Category"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black uppercase text-white">DENIM & TRENCHES</span>
              <div className="p-1.5 bg-white text-black rounded border border-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
          </Link>

          {/* Category 4: Pants & Denim (Emerald Green Block - Offset Bottom) */}
          <Link
            href="/shop?category=Pants"
            className="group relative bg-neo-green border-3 border-black rounded-lg p-5 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-200 flex flex-col justify-between h-[360px] lg:translate-y-6 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-2xl uppercase tracking-tighter">
                PANTS & DENIM
              </span>
              <span className="bg-white text-black text-xs font-black px-2 py-0.5 border border-black rounded shadow-neo-sm">
                04
              </span>
            </div>

            <div className="relative w-full h-48 border-3 border-black rounded-lg overflow-hidden bg-white shadow-neo-sm my-auto">
              <Image
                src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
                alt="Pants Category"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black uppercase text-white">CARGOS & CARPENTER</span>
              <div className="p-1.5 bg-white text-black rounded border border-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SECOND MARQUEE IN REVERSE */}
      <Marquee
        items={[
          'ETHICAL TEXTILE HARVESTING',
          'ZERO MICROPLASTIC SYNTHETICS',
          'OKAYAMA JAPANESE SHUTTLE WEAVES',
          'PRE-SHRUNK LUXURY DRAPES',
          'ARTICULATED ERGONOMIC TAILORING',
          'HAND-DISTRESSED VINTAGE FINISHES',
        ]}
        reverse
        speed="fast"
        bgColor="bg-black"
        textColor="text-neo-yellow"
      />

      {/* 5. BEST SELLERS SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-neo-yellow text-black text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-neo-sm">
                WARDROBE FAVORITES
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              ATELIER BEST SELLERS
            </h2>
          </div>
          <Button href="/shop" variant="outline" size="md">
            VIEW ALL GARMENTS ({PRODUCTS.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod, index) => (
            <ProductCard key={prod.id} product={prod} index={index} />
          ))}
        </div>
      </section>

      {/* 6. FABRIC & TAILORING STANDARDS BANNER */}
      <section className="bg-neo-yellow border-y-4 border-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-black text-white text-xs font-black uppercase px-3 py-1 rounded border-2 border-black shadow-neo-sm inline-block -rotate-2">
              THE CLOTHING ATELIER STANDARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-3">
              CRAFTED TO LAST. NO COMPROMISE.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all">
              <div className="w-12 h-12 bg-neo-red text-white border-2 border-black rounded-lg flex items-center justify-center font-black text-xl shadow-neo-sm mb-4">
                01
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight text-black mb-2">
                500GSM HEAVYWEIGHT COTTON
              </h3>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                We refuse flimsy, thin garments. Our loopback cotton weighs over half a kilo per piece for an indestructible, architectural drape that never sags.
              </p>
            </div>

            <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all">
              <div className="w-12 h-12 bg-neo-blue text-white border-2 border-black rounded-lg flex items-center justify-center font-black text-xl shadow-neo-sm mb-4">
                02
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight text-black mb-2">
                PRE-SHRUNK & BIO-WASHED
              </h3>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Every garment is pre-washed with volcanic pumice to prevent shrinkage and eliminate synthetic factory stiffness. Holds fit wash after wash.
              </p>
            </div>

            <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all">
              <div className="w-12 h-12 bg-neo-green text-white border-2 border-black rounded-lg flex items-center justify-center font-black text-xl shadow-neo-sm mb-4">
                03
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight text-black mb-2">
                LIMITED ATELIER RUNS
              </h3>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Produced in strictly numbered small batches. Once a colorway, weave, or bespoke embroidery is archived, it will never be mass replicated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ARCHIVE FEATURED DROPS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-neo-red text-white text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-neo-sm">
                LIMITED RUNS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              FEATURED ATELIER DROPS
            </h2>
          </div>
          <Button href="/shop?badge=LIMITED" variant="red" size="md">
            VIEW ALL DROPS
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDrops.map((prod, index) => (
            <ProductCard key={prod.id} product={prod} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
