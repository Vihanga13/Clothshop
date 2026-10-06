'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';

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
  customerPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'new-product'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
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
  const [formSuccess, setFormSuccess] = useState('');

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
      ]);

      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        setOrders(orderData.orders || []);
      }

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(prodData.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
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

  // Quick Stock Adjustment
  const handleUpdateStock = async (productId: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/products/${productId}`, {
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

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          tagline: newProduct.tagline || newProduct.name,
          description: newProduct.description,
          images: [newProduct.imageUrl],
          tags: [newProduct.category, 'Atelier Heavyweight'],
          badge: newProduct.badge,
          badgeColor: newProduct.badgeColor,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setFormSuccess(`Product "${newProduct.name}" added to database!`);
        setNewProduct({
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
        setActiveTab('products');
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (err) {
      console.error('Create product error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aggregated KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black rounded-lg p-6 shadow-neo">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-neo-black text-neo-yellow text-xs font-black uppercase px-2.5 py-1 rounded">
                CONTROL CENTER
              </span>
              <span className="font-mono text-xs text-gray-500">LIVE ATELIER BACKEND</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              STORE MANAGEMENT
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>REFRESH DATA</span>
            </button>

            <Link
              href="/shop"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:bg-gray-100 transition-all"
            >
              <span>VIEW STORE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neo-yellow border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-black">TOTAL REVENUE</span>
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-black text-black block">
                {formatPrice(totalRevenue)}
              </span>
              <span className="text-[11px] font-bold text-black/70">From live orders in DB</span>
            </div>
          </div>

          <div className="bg-neo-blue text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">TOTAL ORDERS</span>
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-black block">{orders.length}</span>
              <span className="text-[11px] font-bold text-white/80">Incoming customer orders</span>
            </div>
          </div>

          <div className="bg-neo-green text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">TOTAL PRODUCTS</span>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-black block">{products.length}</span>
              <span className="text-[11px] font-bold text-white/80">Active catalog items</span>
            </div>
          </div>

          <div className="bg-neo-red text-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">LOW STOCK ALERTS</span>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-black block">
                {lowStockProducts.length}
              </span>
              <span className="text-[11px] font-bold text-white/80">Items with &le; 10 units left</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 border-b-3 border-black pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 border-3 border-black rounded-lg font-black text-xs sm:text-sm uppercase shadow-neo-sm transition-all ${
              activeTab === 'orders'
                ? 'bg-neo-yellow text-black scale-105'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            ORDERS ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 border-3 border-black rounded-lg font-black text-xs sm:text-sm uppercase shadow-neo-sm transition-all ${
              activeTab === 'products'
                ? 'bg-neo-blue text-white scale-105'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            PRODUCTS & STOCK ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('new-product')}
            className={`px-5 py-2.5 border-3 border-black rounded-lg font-black text-xs sm:text-sm uppercase shadow-neo-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'new-product'
                ? 'bg-neo-green text-white scale-105'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            {/* Filter Bar */}
            <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search order number or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream border-2 border-black rounded text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                  (status) => (
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
                  )
                )}
              </div>
            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border-3 border-black rounded-lg p-12 text-center shadow-neo">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-xl font-black uppercase text-black">No Orders Found</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">
                  Place a test checkout to see orders appear in this live table!
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 px-4 py-2 bg-neo-yellow text-black border-2 border-black rounded font-black text-xs uppercase shadow-neo-sm"
                >
                  Make Test Purchase
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    confirmed: 'bg-neo-yellow text-black',
                    processing: 'bg-neo-blue text-white',
                    shipped: 'bg-neo-green text-white',
                    delivered: 'bg-neo-green text-white',
                    cancelled: 'bg-neo-red text-white',
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white border-3 border-black rounded-lg p-5 shadow-neo flex flex-col gap-4"
                    >
                      {/* Top Bar of Order */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black/10 gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-base font-black text-black">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 border-2 border-black rounded-md ${
                              statusColors[order.status] || 'bg-gray-200 text-black'
                            }`}
                          >
                            {order.status}
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

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase text-gray-600">
                            Change Status:
                          </span>
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

                      {/* Middle: Customer Details & Order Items */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Customer & Shipping Info */}
                        <div className="md:col-span-4 bg-cream border-2 border-black rounded p-3 text-xs flex flex-col gap-1.5">
                          <span className="font-black uppercase text-gray-600 block">
                            CUSTOMER & ADDRESS
                          </span>
                          <span className="font-black text-black text-sm">{order.customerName}</span>
                          <span className="font-mono text-gray-700">{order.customerEmail}</span>
                          {order.customerPhone && (
                            <span className="text-gray-700">{order.customerPhone}</span>
                          )}
                          <span className="text-gray-700 mt-1">
                            {order.addressLine1}, {order.city}, {order.state} {order.postalCode}
                          </span>
                          <span className="font-bold text-black">{order.country}</span>
                        </div>

                        {/* Items Purchased */}
                        <div className="md:col-span-8 flex flex-col gap-2">
                          <span className="text-xs font-black uppercase text-gray-600">
                            ORDER ITEMS ({order.items?.length || 0})
                          </span>
                          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                            {(order.items || []).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between bg-white border border-black/20 rounded p-2 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <div className="relative w-10 h-10 border border-black rounded overflow-hidden shrink-0">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-black text-black block">{item.name}</span>
                                    <span className="text-[11px] text-gray-600">
                                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-black text-black">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-auto">
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
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white border-3 border-black rounded-lg p-4 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-black text-sm uppercase text-black">
                TOTAL LIVE PRODUCTS: {products.length}
              </span>
              <button
                onClick={() => setActiveTab('new-product')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neo-yellow text-black border-2 border-black rounded font-black text-xs uppercase shadow-neo-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
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
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-24 border-2 border-black rounded bg-gray-200 flex items-center justify-center text-xs">
                          No Pic
                        </div>
                      )}

                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase text-gray-500 block">
                          {product.category}
                        </span>
                        <h4 className="font-black text-xs uppercase text-black line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="font-black text-sm text-neo-red block mt-1">
                          {formatPrice(product.price)}
                        </span>

                        <div className="mt-2 flex items-center gap-1.5">
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

                    {/* Stock Control Controls */}
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
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          className="p-1.5 border border-black rounded bg-gray-100 hover:bg-gray-200"
                          title="View on store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
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
        )}

        {/* TAB 3: CREATE NEW PRODUCT */}
        {activeTab === 'new-product' && (
          <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2 pb-4 border-b-3 border-black mb-6">
              <Plus className="w-6 h-6 text-neo-green" strokeWidth={3} />
              <h2 className="text-2xl font-black uppercase text-black">
                ADD NEW ATELIER PRODUCT
              </h2>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 bg-neo-green text-white border-2 border-black rounded font-black text-xs uppercase">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase text-black block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ULTRA-HEAVY VINTAGE BOMBER"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                    placeholder="18500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">
                    Sticker Badge
                  </label>
                  <select
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
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
                  value={newProduct.tagline}
                  onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                  className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-black block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
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
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-cream border-2 border-black rounded font-bold text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 py-3 px-6 bg-neo-yellow text-black border-3 border-black rounded-lg font-black text-sm uppercase shadow-neo hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SAVING TO DATABASE...' : 'SAVE PRODUCT TO DATABASE'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
