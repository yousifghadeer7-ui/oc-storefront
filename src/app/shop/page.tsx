"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify"; 

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("cat")?.toLowerCase() || "all";
  const queryParam = searchParams.get("q")?.toLowerCase() || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (categoryParam !== "all" && categoryParam !== "new") {
      const pCat = (product.category || product.productType || "").toLowerCase();
      if (!pCat.includes(categoryParam)) return false;
    }
    if (queryParam) {
      const title = (product.title || "").toLowerCase();
      if (!title.includes(queryParam)) return false;
    }
    return true;
  });

  const titleMap: Record<string, string> = {
    all: "All Products",
    new: "New Arrivals",
    outerwear: "Outerwear",
    tailoring: "Tailoring",
    knitwear: "Knitwear",
    dresses: "Dresses",
  };

  const pageTitle = titleMap[categoryParam] || "Collection";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="border-b border-sand/40 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-taupe font-semibold">
            COLLECTION
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-ink mt-1">
            {pageTitle} ({filteredProducts.length})
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-taupe">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-sm text-taupe">
          No products found in this collection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs tracking-widest uppercase">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
