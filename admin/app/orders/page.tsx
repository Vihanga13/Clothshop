'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Truck,
  Package,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3001';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatPrice = (val: number) => `LKR ${Number(val).toLocaleString()}`;

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      search === '' ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    confirmed: 'bg-neo-yellow text-black',
    processing: 'bg-neo-blue text-white',
    shipped: 'bg-neo-green text-white',
    delivered: 'bg-neo-green text-white',
    cancelled: 'bg-neo-red text-white',
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black">
            ORDERS MANAGEMENT
          </h1>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Track customer shipments, process garment dispatches, and manage lifecycle.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>REFRESH</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream border-2 border-black rounded text-xs font-bold text-black focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 border-2 border-black rounded text-xs font-black uppercase shrink-0 transition-all ${
                statusFilter === status
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border-3 border-black rounded-lg p-12 text-center shadow-neo">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <h3 className="font-black text-base uppercase text-black">No Orders Found</h3>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Orders placed in the customer shop will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-black/10 gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-base font-black text-black">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 border-2 border-black rounded-md ${
                      statusColors[order.status] || 'bg-gray-200'
                    }`}
                  >
                    ● {order.status}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-gray-600">STAGE:</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="bg-cream border-2 border-black rounded px-2.5 py-1 text-xs font-black uppercase text-black cursor-pointer focus:outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Items breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 bg-cream border-2 border-black rounded p-3.5 text-xs flex flex-col gap-1.5">
                  <span className="font-black uppercase text-gray-600">DELIVERY RECIPIENT</span>
                  <span className="font-black text-black text-sm">{order.customerName}</span>
                  <span className="font-mono text-gray-700">{order.customerEmail}</span>
                  {order.customerPhone && <span className="text-gray-700">{order.customerPhone}</span>}
                  <span className="text-gray-700 mt-1">
                    {order.addressLine1}, {order.city}, {order.state} {order.postalCode}
                  </span>
                  <span className="font-bold text-black">{order.country}</span>
                </div>

                <div className="md:col-span-8 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-cream border border-black/20 rounded text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="relative w-9 h-10 border border-black rounded overflow-hidden shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          )}
                          <div>
                            <span className="font-black text-black block">{item.name}</span>
                            <span className="text-[11px] text-gray-600">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-black text-black">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/10">
                    <span className="text-xs font-bold text-gray-600">
                      Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                    </span>
                    <span className="text-base font-black text-black">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
