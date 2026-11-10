"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishState = { ids: number[]; toggle: (id: number) => void; has: (id: number) => boolean };

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "gsbd-wishlist-v1" },
  ),
);
