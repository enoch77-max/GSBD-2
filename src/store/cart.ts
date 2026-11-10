"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: CartItem | null;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setHydrated: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastAdded: null,
      hydrated: false,
      addItem: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          let items: CartItem[];
          if (existing) {
            items = s.items.map((i) =>
              i.id === item.id ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) } : i,
            );
          } else {
            items = [...s.items, { ...item, quantity: Math.min(qty, item.stock) }];
          }
          return { items, lastAdded: { ...item, quantity: qty } };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i)),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "gsbd-cart-v1",
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
