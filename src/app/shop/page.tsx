import Link from "next/link";
import { getProducts, matchesCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category || "";
  
  let allProducts: any[] = [];
  try {
    allProducts = (await getProducts()) || [];
  } catch (e) {
    allProducts = [];
  }

  const products = selectedCategory
    ? allProducts.filter((p) => matchesCategory(p.category, p.tags, selectedCategory))
    : allProducts;

  return (
    <div className="bg-paper min-h-screen py-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-sand pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">
              Collection
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
              {selectedCategory || "All Products"} ({products.length})
            </h1>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ink/60">No products found in this category.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
