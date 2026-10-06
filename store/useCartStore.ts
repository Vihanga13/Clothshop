import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { PROMO_CODES } from '@/data/products';

interface AppliedPromo {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: AppliedPromo | null;
  promoError: string | null;

  // Actions
  addItem: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  // Computed helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingCost: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getFreeShippingThresholdProgress: () => { progress: number; remaining: number };
}

const FREE_SHIPPING_THRESHOLD = 15000;
const STANDARD_SHIPPING_FLAT = 850;
const TAX_RATE = 0; // Included in price

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,
      promoError: null,

      addItem: (product, color, size, quantity = 1) => {
        const selectedColor = color || (product.colors[0]?.name ?? 'Standard');
        const selectedSize = size || (product.sizes[0] ?? 'Standard');
        const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);
          if (existingIndex > -1) {
            const nextItems = [...state.items];
            const currentItem = nextItems[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, product.stock);
            nextItems[existingIndex] = { ...currentItem, quantity: newQty };
            return { items: nextItems, isOpen: true };
          }

          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              return { ...item, quantity: Math.min(quantity, item.stock) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedPromo: null, promoError: null });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyPromo: (rawCode) => {
        const code = rawCode.trim().toUpperCase();
        if (!code) {
          set({ promoError: 'Please enter a valid discount code' });
          return false;
        }

        const promo = PROMO_CODES[code];
        if (!promo) {
          set({ promoError: 'Invalid promo code. Try NEO20, DROP10, or FREESHIP' });
          return false;
        }

        set({
          appliedPromo: { code, ...promo },
          promoError: null,
        });
        return true;
      },

      removePromo: () => {
        set({ appliedPromo: null, promoError: null });
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo || subtotal === 0) return 0;

        if (promo.discountPercent) {
          return Math.round((subtotal * promo.discountPercent) / 100);
        }
        if (promo.discountAmount) {
          return Math.min(promo.discountAmount, subtotal);
        }
        return 0;
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const promo = get().appliedPromo;
        if (promo?.code === 'FREESHIP' || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return STANDARD_SHIPPING_FLAT;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * TAX_RATE * 100) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        const tax = get().getTaxAmount();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getFreeShippingThresholdProgress: () => {
        const subtotal = get().getSubtotal();
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
        const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        return { progress, remaining };
      },
    }),
    {
      name: 'ecomz_cart_storage_v3',
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    }
  )
);
