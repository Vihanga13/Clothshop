import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clothshop Atelier Admin | Management Portal',
  description: 'Standalone Store Management & Operations Control Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-black min-h-screen flex flex-col md:flex-row antialiased">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b-3 md:border-b-0 md:border-r-3 border-black p-5 flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 pb-4 border-b-2 border-black">
              <div className="w-10 h-10 bg-neo-yellow text-black border-2 border-black rounded-lg flex items-center justify-center font-black text-xl shadow-neo-sm">
                C
              </div>
              <div>
                <span className="font-black text-base uppercase tracking-tight block">
                  CLOTHSHOP
                </span>
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                  ATELIER OPS • v1.0
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-cream hover:bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm transition-all whitespace-nowrap"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>OVERVIEW</span>
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-cream hover:bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm transition-all whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ORDERS</span>
              </Link>

              <Link
                href="/products"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-cream hover:bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm transition-all whitespace-nowrap"
              >
                <Package className="w-4 h-4" />
                <span>PRODUCTS & STOCK</span>
              </Link>

              <Link
                href="/products/new"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-neo-green text-white border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ADD PRODUCT</span>
              </Link>
            </nav>
          </div>

          {/* Bottom Store Link */}
          <div className="hidden md:flex flex-col gap-3 pt-4 border-t-2 border-black">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-neo-green inline-block animate-pulse" />
              <span>SHOP API: PORT 3001</span>
            </div>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-black text-white rounded-lg font-black text-xs uppercase hover:bg-gray-800 transition-colors"
            >
              <span>OPEN CUSTOMER STORE</span>
              <ExternalLink className="w-3.5 h-3.5 text-neo-yellow" />
            </a>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
