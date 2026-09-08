import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = (await getProducts()) || [];

  return (
    <div className="bg-paper min-h-screen py-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-sand pb-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">Collection</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">All Products</h1>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
