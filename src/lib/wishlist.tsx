"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/db/schema";
import { useToast } from "./toast";

interface WishlistCtx {
  ids: Set<number>;
  items: Product[];
  loading: boolean;
  has: (id: number) => boolean;
  toggle: (id: number, name?: string) => void;
}

const Ctx = createContext<WishlistCtx | null>(null);

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist outside provider");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    let alive = true;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data: { items: Product[] }) => {
        if (alive) setItems(data.items ?? []);
      })
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const has = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback(
    (id: number, name?: string) => {
      const currently = items.some((i) => i.id === id);
      const snapshot = items;
      // optimistic update
      setItems((prev) =>
        currently ? prev.filter((p) => p.id !== id) : prev
      );
      fetch(`/api/wishlist?productId=${id}`, {
        method: currently ? "DELETE" : "POST",
      })
        .then((r) => {
          if (!r.ok) throw new Error("failed");
          if (!currently) {
            // re-fetch full product so the wishlist page has data
            fetch("/api/wishlist")
              .then((rr) => rr.json())
              .then((data: { items: Product[] }) => setItems(data.items ?? []))
              .catch(() => undefined);
          }
          push(
            currently
              ? `Removed ${name ?? "piece"} from wishlist`
              : `Saved ${name ?? "piece"} to wishlist`,
            "info"
          );
        })
        .catch(() => {
          setItems(snapshot); // rollback
          push("Could not update wishlist", "error");
        });
    },
    [items, push]
  );

  const ids = new Set(items.map((i) => i.id));

  return (
    <Ctx.Provider value={{ ids, items, loading, has, toggle }}>
      {children}
    </Ctx.Provider>
  );
}
