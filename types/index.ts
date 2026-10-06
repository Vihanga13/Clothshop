export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export type ClothingCategory =
  | 'Tops'
  | 'Hoodies'
  | 'Jackets'
  | 'Pants'
  | 'Dresses'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: ClothingCategory;
  tags: string[];
  badge?: 'NEW' | 'HOT' | '-30%' | '-50%' | 'LIMITED' | 'BESTSELLER';
  badgeColor?: 'yellow' | 'red' | 'blue' | 'green' | 'pink' | 'orange';
  rating: number;
  reviewCount: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  features: string[];
  fabric?: string;
  fit?: string;
  care?: string[];
  stock: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  reviews: Review[];
}

export interface CartItem {
  id: string; // unique cart item id (e.g. `${product.id}-${selectedColor}-${selectedSize}`)
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  method: 'card' | 'apple-pay' | 'paypal';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  status: 'confirmed' | 'processing' | 'shipped';
  estimatedDelivery: string;
}

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  tags: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
