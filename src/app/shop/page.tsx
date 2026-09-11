// src/app/shop/page.tsx
import { getProducts } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 border-b border-black/10 pb-6">
        <p className="text-xs tracking-widest text-black/40 uppercase mb-1">
          Collection
        </p>
        <h1 className="text-4xl font-light tracking-tight">
          Shop All ({products.length})
        </h1>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-black/40 text-center py-24 text-lg">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-[#f5f5f0] overflow-hidden mb-3">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#ece9e2]" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="text-[11px] tracking-widest text-black/40 uppercase">
                  {p.category}
                </p>
                <p className="text-sm font-medium leading-snug">{p.title}</p>
                <p className="text-sm text-black/70">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
