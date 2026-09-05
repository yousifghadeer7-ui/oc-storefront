"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { money } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import {
  IconHeart,
  IconMinus,
  IconPlus,
  IconBag,
  IconTruck,
  IconLock,
} from "./Icons";

interface Props {
  product: Product;
}

export function ProductView({ product }: Props) {
  const { add, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const { push } = useToast();

  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const soldOut = product.stock === 0;
  const saved = has(product.id);

  const addToBag = () => {
    if (soldOut) return;
    if (!size) {
      setSizeError(true);
      push("Please select a size first", "error");
      return;
    }
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.images[0],
        size,
        color,
      },
      qty
    );
    push(`${product.name} added to your bag`);
    openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* gallery */}
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-cream">
            <img
              key={imgIdx}
              src={product.images[imgIdx]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover animate-fade-in"
            />
            {product.isNew && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[9px] font-semibold tracking-[0.22em] uppercase text-paper">
                New In
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImgIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-24 w-18 overflow-hidden border transition-all ${
                    i === imgIdx
                      ? "border-ink"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  style={{ width: "4.5rem" }}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="lg:pt-4">
          <p className="text-[10px] font-semibold tracking-[0.34em] uppercase text-muted">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl">
              {money(product.priceCents)}
            </span>
            {product.compareAtCents != null && (
              <span className="text-muted line-through">
                {money(product.compareAtCents)}
              </span>
            )}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          {/* colour */}
          <div className="mt-8">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">
              Colour — <span className="text-muted">{color}</span>
            </p>
            <div className="mt-3 flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c.name
                      ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                      : "border-line hover:border-muted"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* size */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">
                Size
              </p>
              <span className="text-[11px] tracking-wide text-muted">
                True to size
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={size === s}
                  className={`min-w-12 border px-4 py-2.5 text-sm transition-colors ${
                    size === s
                      ? "border-ink bg-ink text-paper"
                      : sizeError
                        ? "border-danger/60 hover:border-ink"
                        : "border-line hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-2 text-xs text-danger animate-fade-in">
                Please select a size to continue.
              </p>
            )}
          </div>

          {/* qty + add */}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                aria-label="Decrease quantity"
                className="px-3.5 py-3.5 hover:bg-cream"
              >
                <IconMinus />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((n) => Math.min(product.stock || 9, n + 1))}
                aria-label="Increase quantity"
                className="px-3.5 py-3.5 hover:bg-cream"
              >
                <IconPlus />
              </button>
            </div>
            <button
              onClick={addToBag}
              disabled={soldOut}
              className="flex flex-1 items-center justify-center gap-3 bg-ink py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-muted"
            >
              <IconBag className="h-4 w-4" />
              {soldOut ? "Sold out" : "Add to bag"}
            </button>
          </div>

          <button
            onClick={() => toggle(product.id, product.name)}
            aria-pressed={saved}
            className={`mt-3 flex w-full items-center justify-center gap-2.5 border py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors ${
              saved
                ? "border-ink bg-cream"
                : "border-line hover:border-ink"
            }`}
          >
            <IconHeart className="h-4 w-4" filled={saved} />
            {saved ? "Saved to wishlist" : "Save to wishlist"}
          </button>

          {product.stock > 0 && product.stock < 8 && (
            <p className="mt-3 text-xs font-medium text-bronze">
              Low stock — only {product.stock} left in this piece.
            </p>
          )}

          {/* accordions */}
          <div className="mt-10 divide-y divide-line border-y border-line">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase [&::-webkit-details-marker]:hidden">
                Materials &amp; Care
                <span className="text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2.5">
                    <span className="mt-2 h-px w-4 shrink-0 bg-muted/60" />
                    {d}
                  </li>
                ))}
              </ul>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase [&::-webkit-details-marker]:hidden">
                Shipping &amp; Returns
                <span className="text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Complimentary carbon-neutral shipping over $300. Delivered in
                3–5 working days. Thirty-day returns, unworn with tags —
                exchanges ship the moment your return scans.
              </p>
            </details>
          </div>

          <div className="mt-6 flex items-center gap-6 text-[11px] tracking-[0.14em] uppercase text-muted">
            <span className="flex items-center gap-2">
              <IconTruck className="h-4 w-4" /> Ships in 48h
            </span>
            <span className="flex items-center gap-2">
              <IconLock className="h-4 w-4" /> Secure checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
