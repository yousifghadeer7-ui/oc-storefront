"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

export const cartKey = (i: {
  productId: number;
  size: string;
  color: string;
}) => `${i.productId}|${i.size}|${i.color}`;

interface CartCtx {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "oc_cart_v1";

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const key = cartKey(item);
      const found = prev.find((p) => cartKey(p) === key);
      if (found)
        return prev.map((p) =>
          cartKey(p) === key ? { ...p, qty: p.qty + qty } : p
        );
      return [...prev, { ...item, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => cartKey(p) !== key)
        : prev.map((p) => (cartKey(p) === key ? { ...p, qty } : p))
    );
  }, []);

  const remove = useCallback(
    (key: string) => setItems((prev) => prev.filter((p) => cartKey(p) !== key)),
    []
  );

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.priceCents, 0),
    [items]
  );

  return (
    <Ctx.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        add,
        setQty,
        remove,
        clear,
        count,
        subtotal,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
