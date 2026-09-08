import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";
import { matchesCategory } from "@/lib/catalog";
import { getProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All — OC",
  description: "The full OC collection: outerwear, tailoring, knitwear and more.",
};

interface SearchParams {
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
}

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const q = first(sp.q)?.trim();
  const categories = (first(sp.category) ?? "")
    .split(",")
    .filter(Boolean);
  const sort = first(sp.sort) ?? "featured";

  // جلب كافة المنتجات مباشرة من Shopify
  const all = (await getProducts()) ?? [];

  // حساب أعداد المنتجات بكل فئة
  const counts: Record<string, number> = {};
  for (const p of all) {
    if (p.category) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
  }

  let filtered = all;

  // التصفية باستخدام دالة المطابقة المرنة
  if (categories.length > 0) {
    filtered = filtered.filter((p) =>
      categories.some((cat) => matchesCategory(p.category, p.tags ?? [], cat))
    );
  }

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category?.toLowerCase().includes(needle) ||
        p.description?.toLowerCase().includes(needle) ||
        p.vendor?.name?.toLowerCase().includes(needle)
    );
  }

  switch (sort) {
    case "newest":
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
      break;
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.priceCents - a.priceCents);
      break;
    default:
      filtered = [...filtered];
  }

  return (
    <ShopView
      products={filtered}
      counts={counts}
      q={q}
      categories={categories}
      sort={sort}
      total={all.length}
    />
  );
}
