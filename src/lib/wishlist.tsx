"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  priceCents: number;
  image: string;
  handle: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  ids: string[];
  loading: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  ids: [],
  loading: false,
  addItem: () => {},
  removeItem: () => {},
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("oc-wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("oc-wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => String(i.id) === String(item.id))
        ? prev
        : [...prev, item]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const ids = items.map((i) => String(i.id));

  return (
    <WishlistContext.Provider
      value={{ items, ids, loading: false, addItem, removeItem }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
