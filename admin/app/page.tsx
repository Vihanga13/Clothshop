'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3001';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    confirmedCount: 0,
    processingCount: 0,
    shippedCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (val: number) => `LKR ${Number(val).toLocaleString()}`;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats`),
        fetch(`${API_BASE}/api/orders`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setRecentOrders((ordersData.orders || []).slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Error fetching admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-neo-black text-neo-yellow text-xs font-black uppercase px-2.5 py-0.5 rounded">
              STANDALONE ADMIN APP
            </span>
            <span className="font-mono text-xs text-gray-500">PORT 3002</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">
            EXECUTIVE DASHBOARD
          </h1>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Real-time analytics & inventory telemetry synced from Clothshop Core.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>SYNC TELEMETRY</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neo-yellow border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-black">TOTAL SALES</span>
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-black block">
              {formatPrice(stats.totalRevenue)}
            </span>
            <span className="text-[11px] font-bold text-black/70">From live store orders</span>
          </div>
        </div>

        <div className="bg-neo-blue text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase">TOTAL ORDERS</span>
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black block">{stats.totalOrders}</span>
            <span className="text-[11px] font-bold text-white/80">Processed by atelier</span>
          </div>
        </div>

        <div className="bg-neo-green text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase">ACTIVE CATALOG</span>
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black block">{stats.totalProducts}</span>
            <span className="text-[11px] font-bold text-white/80">Garments in database</span>
          </div>
        </div>

        <div className="bg-neo-red text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase">LOW STOCK ALERTS</span>
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black block">{stats.lowStockCount}</span>
            <span className="text-[11px] font-bold text-white/80">&le; 10 units remaining</span>
          </div>
        </div>
      </div>

      {/* Quick Recent Orders */}
      <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col gap-4">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/10">
          <div>
            <h3 className="font-black text-lg uppercase text-black">RECENT ORDERS</h3>
            <span className="text-xs font-bold text-gray-500">Last 5 incoming purchases</span>
          </div>

          <Link
            href="/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neo-yellow text-black border-2 border-black rounded font-black text-xs uppercase shadow-neo-sm hover:scale-105 transition-all"
          >
            <span>VIEW ALL ORDERS</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-bold text-xs uppercase">
            No orders placed yet. Place a test order in the customer shop!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-cream border-2 border-black rounded-lg gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-black">{o.orderNumber}</span>
                  <span className="text-xs font-bold text-gray-700">{o.customerName}</span>
                  <span className="font-mono text-xs text-gray-500">{o.customerEmail}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-xs text-black">
                    {formatPrice(o.total)}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-black rounded bg-white">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
