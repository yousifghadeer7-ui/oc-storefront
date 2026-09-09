"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
// افترض وجود مكون عرض المنتجات ProductCard أو المنتجات المعرفة لديك
import ProductCard from "@/components/ProductCard"; 

// قائمة المنتجات كمثال أو استدعائها من Shopify
interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  handle: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("cat")?.toLowerCase() || "all";
  const queryParam = searchParams.get("q")?.toLowerCase() || "";

  // افترض وجود مصفوفة المنتجات الأساسية لديك (أو القادمة من Shopify)
  // يتم فلترتها هنا بناءً على الرابط
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
      <div className="border-b border-sand/40 pb-6 mb-8">
        <span className="text-[10px] tracking-[0.25em] uppercase text-taupe font-semibold">
          COLLECTION
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mt-1">
          {pageTitle}
        </h1>
      </div>

      {/* هنا يتم عرض قائمة المنتجات المفلترة */}
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
