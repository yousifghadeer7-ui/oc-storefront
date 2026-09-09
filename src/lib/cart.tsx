"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const cartKey = "oc-shopping-cart";

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
  qty?: number;
  size?: string;
  color?: string;
  handle: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  subtotal: 0,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  clear: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(
          parsed.map((item: CartItem) => ({
            ...item,
            productId: item.productId || item.id,
            qty: item.qty || item.quantity,
          }))
        );
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.priceCents || 0) * (item.quantity || item.qty || 1),
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      const q = newItem.quantity || newItem.qty || 1;
      if (existing) {
        return prev.map((i) => {
          if (i.id === newItem.id) {
            const newQty = (i.quantity || 1) + q;
            return { ...i, quantity: newQty, qty: newQty };
          }
          return i;
        });
      }
      return [
        ...prev,
        {
          ...newItem,
          productId: newItem.productId || newItem.id,
          quantity: q,
          qty: q,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = (i.quantity || 1) + delta;
            return newQty > 0
              ? { ...i, quantity: newQty, qty: newQty }
              : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        subtotal,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clear: clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
