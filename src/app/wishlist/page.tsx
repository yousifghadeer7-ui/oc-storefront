"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";
import { IconHeart } from "@/components/Icons";

export default function WishlistPage() {
  const { items, loading } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
        Saved for later
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Wishlist</h1>

      {loading && (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-cream" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 border border-line py-24 text-center">
          <IconHeart className="h-10 w-10 text-muted/50" />
          <p className="font-display text-2xl italic">Nothing saved yet</p>
          <p className="max-w-xs text-sm text-muted">
            Tap the heart on any piece to keep it here while you decide.
          </p>
          <Link
            href="/shop"
            className="mt-2 bg-ink px-8 py-3.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper hover:bg-ink-soft"
          >
            Browse the collection
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
