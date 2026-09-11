// src/app/shop/page.tsx
import { getProducts } from "@/lib/catalog";
import { ShopView } from "@/components/ShopView";

export const dynamic = "force-dynamic";

function buildCounts(
  products: any[],
  categories: string[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat] = products.filter((p) => {
      if (cat === "All") return true;
      return (
        p.category?.toLowerCase() === cat.toLowerCase() ||
        p.tags?.some((t: string) => t.toLowerCase() === cat.toLowerCase())
      );
    }).length;
  }
  return counts;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;

  const q = (sp.q || "").toLowerCase().trim();
  const categoryParam = sp.category || "";
  const sort = sp.sort || "featured";
  const selectedCategories = categoryParam
    ? categoryParam.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const allProducts = await getProducts();

  // فلترة حسب البحث والتصنيف
  let filtered = allProducts.filter((p: any) => {
    const matchQ = q
      ? p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      : true;

    const matchCat =
      selectedCategories.length === 0
        ? true
        : selectedCategories.some(
            (c) =>
              p.category?.toLowerCase() === c.toLowerCase() ||
              p.tags?.some((t: string) => t.toLowerCase() === c.toLowerCase())
          );

    return matchQ && matchCat;
  });

  // ترتيب
  if (sort === "new") {
    // اتركهم كما هم (Shopify يرجعهم من الأحدث للأقدم)
  } else if (sort === "price-asc") {
    filtered = filtered.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = filtered.sort((a: any, b: any) => b.price - a.price);
  }

  const CATS = [
    "All",
    "New Arrivals",
    "Outerwear",
    "Tailoring",
    "Knitwear",
    "Dresses",
  ];

  const counts = buildCounts(allProducts, CATS);

  return (
    <ShopView
      products={filtered as any}
      counts={counts}
      q={sp.q || ""}
      categories={selectedCategories}
      sort={sort}
      total={allProducts.length}
    />
  );
}
