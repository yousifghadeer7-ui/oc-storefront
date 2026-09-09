"use client";

import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  // استخدام المعرف المحلي لمنع التحويل الخارجي لـ Shopify
  const productIdentifier =
    product.slug ||
    product.handle ||
    product.id ||
    "";

  const imageUrl =
    product.image ||
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
    product.featuredImage?.url ||
    "";

  // استخراج السعر المباشر
  const rawPrice = product.price ?? product.price_amount ?? product.variants?.[0]?.price;
  const parsedPrice = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice);
  const displayPrice = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;

  return (
    <Link
      href={`/product/${encodeURIComponent(String(productIdentifier))}`}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/20 mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title || product.name || "Product Image"}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-sand/10 flex items-center justify-center text-xs text-taupe">
            No Image
          </div>
        )}
      </div>
      <div className="text-[10px] tracking-widest uppercase text-taupe mb-1">
        {product.category || product.productType || "COLLECTION"}
      </div>
      <h3 className="text-sm font-medium text-ink mb-1 line-clamp-1">
        {product.title || product.name}
      </h3>
      {displayPrice !== null && (
        <p className="text-sm font-semibold text-ink">
          ${displayPrice.toFixed(2)}
        </p>
      )}
    </Link>
  );
}
