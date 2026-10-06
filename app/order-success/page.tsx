'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-982341';
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    // Launch celebratory neo-brutalist confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD60A', '#FF3B30', '#2F54EB', '#00B37E', '#FF69B4', '#000000'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Celebration Header Card */}
      <div className="bg-neo-yellow border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo-lg text-center mb-8 relative overflow-hidden">
        <div className="inline-flex p-3 bg-neo-green text-white border-3 border-black rounded-lg shadow-neo -rotate-3 mb-4">
          <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
          ORDER LOCKED IN THE ATELIER!
        </h1>

        <p className="text-sm sm:text-base font-bold text-black/80 mt-2 max-w-lg mx-auto">
          Payment confirmed. Your garments are being inspected, steamed, and packaged for priority tracked dispatch.
        </p>

        {/* Decorative Badge */}
        <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-1.5 bg-neo-red text-white text-xs font-black uppercase px-3 py-1.5 border-2 border-black rounded-lg shadow-neo-sm rotate-6">
          <Sparkles className="w-4 h-4 fill-white" />
          <span>VAULT PRIORITY PASS</span>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo mb-8">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-3 border-black gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-2xl tracking-tight uppercase text-black">
                ECOMZ OFFICIAL RECEIPT
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-gray-600">
              TRANSACTION ID: <span className="text-black font-black">{orderId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-neo-green/20 text-neo-green border-2 border-neo-green px-3 py-1 rounded text-xs font-black uppercase tracking-wider">
              ● STATUS: PAID & CONFIRMED
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b-2 border-black/15">
          <div>
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              ORDER DATE
            </span>
            <span className="font-mono font-bold text-sm text-black">{currentDate}</span>
          </div>

          <div>
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              ESTIMATED DELIVERY
            </span>
            <span className="font-bold text-sm text-black flex items-center gap-1">
              <Truck className="w-4 h-4 text-neo-blue" />
              <span>3-5 Business Days</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              EXPEDITION CARRIER
            </span>
            <span className="font-mono font-bold text-sm text-black">
              DHL EXPRESS AIR (TRACKED)
            </span>
          </div>
        </div>

        {/* Shipment Details Box */}
        <div className="my-6 p-4 bg-cream border-2 border-black rounded-lg flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-blue text-white rounded border-2 border-black flex items-center justify-center font-black">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black block">
                TRACKING NUMBER ASSIGNED
              </span>
              <span className="font-mono text-xs text-gray-700 font-bold">
                ECMZ-{orderId.replace('ORD-', '')}-US-EXP
              </span>
            </div>
          </div>
          <span className="text-xs font-bold bg-white px-2.5 py-1 rounded border border-black shadow-neo-sm">
            Tracking updates will be sent via Email
          </span>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neo-green shrink-0" />
            <span>Backed by 30-Day Zero BS Return Policy & Authenticity Guarantee</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cream hover:bg-white text-black border-2 border-black rounded-lg text-xs font-black shadow-neo-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT RECEIPT</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button href="/shop" variant="yellow" size="lg" rightIcon={<ArrowRight className="w-5 h-5" strokeWidth={3} />}>
          EXPLORE MORE VAULT DROPS
        </Button>
        <Button href="/" variant="outline" size="lg">
          RETURN TO HOME
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">LOADING RECEIPT...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
