'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

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
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
}

const STEPS = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Payment authorized & order logged at the atelier',
    icon: CheckCircle2,
  },
  {
    key: 'processing',
    label: 'Atelier Processing',
    description: 'Heavyweight fabric cut, inspected, & steam pressed',
    icon: Clock,
  },
  {
    key: 'shipped',
    label: 'Expedition Dispatched',
    description: 'In transit with DHL Express Priority Air tracking',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Safely handed over to destination address',
    icon: Package,
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('orderId') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch order function
  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || 'No order found with this tracking number. Please verify your order ID.');
      }
    } catch (err: any) {
      console.error('Track order error:', err);
      setError('Unable to reach the tracking server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/track-order?orderId=${encodeURIComponent(searchInput.trim())}`);
    fetchOrder(searchInput);
  };

  const handleCopyTracking = (trackingCode: string) => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine current timeline progress index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  // Estimated delivery calculation (3-5 business days from creation)
  const getDeliveryDate = (dateString: string) => {
    const created = new Date(dateString);
    const start = new Date(created);
    start.setDate(created.getDate() + 3);
    const end = new Date(created);
    end.setDate(created.getDate() + 5);

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-yellow text-black border-2 border-black rounded-md font-black text-xs uppercase mb-3 shadow-neo-sm">
            <Truck className="w-4 h-4 fill-black" />
            <span>REAL-TIME EXPEDITION DISPATCH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            TRACK YOUR ORDER
          </h1>

          <p className="text-sm sm:text-base font-bold text-gray-700 mt-2 max-w-lg mx-auto">
            Enter your order reference number (e.g. <span className="font-mono text-black font-black">ORD-M8KJ9L</span>) to follow your garments from the atelier floor to your door.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter order ID (e.g. ORD-982341)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-cream border-3 border-black rounded-lg font-mono font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 bg-neo-yellow text-black border-3 border-black rounded-lg font-black text-sm uppercase shadow-neo hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>SEARCHING...</span>
                </>
              ) : (
                <>
                  <span>TRACK ORDER</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="bg-neo-red text-white border-3 border-black rounded-lg p-5 shadow-neo flex items-start gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-sm uppercase">Order Lookup Failed</h4>
              <p className="text-xs font-bold mt-1 text-white/90">{error}</p>
            </div>
          </div>
        )}

        {/* Order Found Display */}
        {order && (
          <div className="flex flex-col gap-8">
            {/* 1. Order Status Summary Banner */}
            <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase text-gray-500 block mb-1">
                  ORDER REFERENCE
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-black">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 border-2 border-black rounded-md ${
                      order.status === 'delivered'
                        ? 'bg-neo-green text-white'
                        : order.status === 'shipped'
                        ? 'bg-neo-blue text-white'
                        : order.status === 'processing'
                        ? 'bg-neo-yellow text-black'
                        : order.status === 'cancelled'
                        ? 'bg-neo-red text-white'
                        : 'bg-neo-yellow text-black'
                    }`}
                  >
                    ● {order.status}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-600 block mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-cream hover:bg-white text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT SLIP</span>
                </button>
              </div>
            </div>

            {/* 2. Visual Step Timeline */}
            {order.status !== 'cancelled' ? (
              <div className="bg-white border-3 border-black rounded-lg p-6 sm:p-8 shadow-neo">
                <h3 className="font-black text-lg uppercase tracking-tight text-black mb-8">
                  EXPEDITION PROGRESS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {STEPS.map((step, idx) => {
                    const isCompleted = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex md:flex-col items-start gap-4 relative">
                        {/* Circle Badge */}
                        <div
                          className={`w-12 h-12 rounded-lg border-3 border-black flex items-center justify-center shrink-0 shadow-neo-sm transition-all ${
                            isCompleted
                              ? 'bg-neo-green text-white'
                              : isCurrent
                              ? 'bg-neo-yellow text-black scale-110'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <StepIcon className="w-6 h-6" strokeWidth={2.5} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-gray-500">
                              0{idx + 1}
                            </span>
                            <h4
                              className={`font-black text-sm uppercase ${
                                isCurrent
                                  ? 'text-black underline underline-offset-4 decoration-2 decoration-neo-red'
                                  : isCompleted
                                  ? 'text-black'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </h4>
                          </div>
                          <p className="text-xs font-bold text-gray-600 mt-1">
                            {step.description}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-2 text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded">
                              CURRENT STAGE
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-neo-red/10 border-3 border-neo-red rounded-lg p-6 text-center">
                <AlertCircle className="w-10 h-10 text-neo-red mx-auto mb-2" />
                <h3 className="text-xl font-black uppercase text-neo-red">ORDER CANCELLED</h3>
                <p className="text-xs font-bold text-gray-700 mt-1">
                  This order was cancelled. Any authorized amounts will be refunded to your original payment method.
                </p>
              </div>
            )}

            {/* 3. Shipping & Courier Box */}
            <div className="bg-neo-yellow border-3 border-black rounded-lg p-6 shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neo-blue text-white rounded-lg border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-black block">
                    EXPEDITION AIR TRACKING CODE
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-black">
                    ECMZ-{order.orderNumber.replace('ORD-', '')}-US-EXP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyTracking(`ECMZ-${order.orderNumber.replace('ORD-', '')}-US-EXP`)
                  }
                  className="px-3 py-1.5 bg-white text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-neo-green" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
                </button>
              </div>
            </div>

            {/* 4. Details Grid: Shipping Address & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Destination Address Card */}
              <div className="md:col-span-5 bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-black/10 mb-4">
                    <MapPin className="w-5 h-5 text-neo-red" />
                    <h4 className="font-black text-sm uppercase text-black">
                      DELIVERY DESTINATION
                    </h4>
                  </div>

                  <span className="text-base font-black text-black block mb-1">
                    {order.customerName}
                  </span>
                  <p className="text-xs font-bold text-gray-700 leading-relaxed">
                    {order.addressLine1}
                    {order.addressLine2 && <>, {order.addressLine2}</>}
                    <br />
                    {order.city}, {order.state} {order.postalCode}
                    <br />
                    <span className="font-black text-black">{order.country}</span>
                  </p>
                  <p className="font-mono text-xs text-gray-600 mt-2">{order.customerEmail}</p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Calendar className="w-4 h-4 text-neo-blue" />
                    <span>Est. Window: {getDeliveryDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="md:col-span-7 bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-black/10 mb-4">
                    <ShoppingBag className="w-5 h-5 text-neo-green" />
                    <h4 className="font-black text-sm uppercase text-black">
                      GARMENTS IN THIS SHIPMENT ({order.items.length})
                    </h4>
                  </div>

                  <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 bg-cream border-2 border-black rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <div className="relative w-12 h-14 border border-black rounded overflow-hidden shrink-0 bg-white">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-14 bg-gray-200 border border-black rounded flex items-center justify-center text-[10px]">
                              Garment
                            </div>
                          )}

                          <div>
                            <span className="font-black text-xs uppercase text-black block line-clamp-1">
                              {item.name}
                            </span>
                            <span className="text-[11px] font-bold text-gray-600 block mt-0.5">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-black text-xs text-black shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-500">
                    TOTAL PAID ({order.paymentMethod.toUpperCase()})
                  </span>
                  <span className="font-mono text-xl font-black text-black">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <Button href="/shop" variant="yellow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={3} />}>
                CONTINUE SHOPPING
              </Button>
              <Button href="/" variant="outline" size="lg">
                BACK TO ATELIER
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">INITIALIZING TRACKING...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
