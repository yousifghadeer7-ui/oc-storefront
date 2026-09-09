"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    priceCents: number;
    images?: string[];
    handle: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      image: product.images?.[0] || "",
      handle: product.handle,
    });
  };

  return (
    <Link href={`/product/${product.handle}`} className="group relative block">
      <div className="aspect-[3/4] w-full overflow-hidden bg-sand/30 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-sand/50 flex items-center justify-center text-xs text-taupe">
            No Image
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-ink text-paper text-[10px] px-3 py-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition hover:bg-gold hover:text-ink z-10"
        >
          Add to Bag
        </button>
      </div>
      <h3 className="mt-4 font-display text-lg text-ink group-hover:text-gold transition">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-gold">
        ${((product.priceCents || 0) / 100).toFixed(2)}
      </p>
    </Link>
  );
}
