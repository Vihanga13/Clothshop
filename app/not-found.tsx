import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
      {/* 404 Big Neo-Brutalist Block */}
      <div className="relative mb-6">
        <div className="bg-neo-yellow border-4 border-black rounded-lg p-6 sm:p-10 shadow-neo-xl -rotate-2">
          <span className="font-black text-7xl sm:text-9xl tracking-tighter text-black block leading-none">
            404
          </span>
        </div>
        <div className="absolute -bottom-4 -right-4 bg-neo-red text-white text-xs font-black uppercase px-3 py-1.5 border-2 border-black rounded-lg shadow-neo rotate-6 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 fill-white" />
          <span>LOST IN THE VAULT</span>
        </div>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mb-3">
        PAGE MISSING OR ARCHIVED
      </h1>

      <p className="text-sm sm:text-base font-bold text-gray-700 max-w-md mb-8">
        The coordinates you entered do not exist in the active catalog. The item may have sold out or moved to the deep archive.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          href="/"
          variant="yellow"
          size="lg"
          leftIcon={<Home className="w-5 h-5" strokeWidth={2.5} />}
        >
          BACK TO HOME
        </Button>

        <Button
          href="/shop"
          variant="white"
          size="lg"
          leftIcon={<Search className="w-5 h-5" strokeWidth={2.5} />}
        >
          SEARCH CATALOG
        </Button>
      </div>
    </div>
  );
}
