import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const current = get().items;
        const exists = current.some((item) => item.id === product.id);

        if (exists) {
          set({ items: current.filter((item) => item.id !== product.id) });
          return false;
        } else {
          set({ items: [...current, product] });
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'ecomz_wishlist_storage_v2',
    }
  )
);
