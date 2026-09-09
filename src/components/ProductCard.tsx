"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { IconHeart } from "@/components/Icons";

export interface Product {
  id: string | number;
  handle?: string;
  slug?: string;
  name: string;
  priceCents: number;
  compareAtCents?: number | null;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
}

const formatPrice = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, removeItem } = useWishlist();
  const productHandle = product.handle || product.slug || String(product.id);
  const isSaved = items.some((i) => String(i.id) === String(product.id));

  const imageUrl =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png");

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeItem(String(product.id));
    } else {
      addItem({
        id: String(product.id),
        name: product.name,
        priceCents: product.priceCents,
        image: imageUrl,
        handle: productHandle,
      });
    }
  };

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/20">
        <Link href={`/product/${productHandle}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur transition hover:bg-paper"
        >
          <IconHeart
            className={`h-4 w-4 ${
              isSaved ? "fill-red-500 text-red-500" : "text-ink"
            }`}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-taupe">
          {product.category || "Collection"}
        </span>
        <Link
          href={`/product/${productHandle}`}
          className="font-display text-base text-ink hover:underline"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span>{formatPrice(product.priceCents)}</span>
          {product.compareAtCents && product.compareAtCents > product.priceCents && (
            <span className="text-taupe line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
