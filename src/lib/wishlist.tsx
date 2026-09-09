"use client";

import { create } from "zustand";

export interface WishlistItem {
  id: string;
  name: string;
  priceCents: number;
  image: string;
  handle: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

export const useWishlist = create<WishlistStore>((set) => ({
  items: [],
  loading: false,
  addItem: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
