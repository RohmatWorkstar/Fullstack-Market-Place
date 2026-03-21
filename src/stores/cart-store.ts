import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface CartItemData {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItemData[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; itemCount: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.product.id === product.id);
          if (existingItem) {
             const newQty = Math.min(existingItem.quantity + quantity, product.stock);
             return {
               items: state.items.map((i) =>
                 i.product.id === product.id ? { ...i, quantity: newQty } : i
               ),
             };
          }
          return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
           const item = state.items.find(i => i.product.id === productId);
           if (!item) return state;
           
           const newQty = Math.max(1, Math.min(quantity, item.product.stock));
           return {
             items: state.items.map((i) =>
               i.product.id === productId ? { ...i, quantity: newQty } : i
             ),
           };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
        const itemCount = items.reduce((count, item) => count + item.quantity, 0);
        return { subtotal, itemCount };
      },
    }),
    {
      name: 'marketplace-cart',
    }
  )
);
