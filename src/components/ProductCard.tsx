"use client";

import Link from "next/link";
import type { Product } from "@/db/schema";
import { money } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import { IconHeart } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const onSale = product.compareAtCents != null;

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden bg-cream"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-ink px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] uppercase text-paper">
                New In
              </span>
            )}
            {onSale && (
              <span className="bg-danger px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] uppercase text-paper">
                Sale
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-paper/60">
              <span className="bg-ink px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-paper">
                Sold out
              </span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggle(product.id, product.name)}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all ${
          saved
            ? "bg-ink text-paper"
            : "bg-paper/80 text-ink hover:bg-paper"
        }`}
      >
        <IconHeart className="h-4 w-4" filled={saved} />
      </button>

      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={`/product/${product.slug}`}
            className="font-display text-base leading-snug hover:underline underline-offset-4"
          >
            {product.name}
          </Link>
          <span className="shrink-0 text-sm">
            {onSale && (
              <span className="mr-2 text-muted line-through">
                {money(product.compareAtCents!)}
              </span>
            )}
            {money(product.priceCents)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.16em] uppercase text-muted">
            {product.category}
          </span>
          <span className="flex gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2.5 w-2.5 rounded-full border border-ink/15"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
