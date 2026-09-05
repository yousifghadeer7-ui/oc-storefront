import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ShopView } from "@/components/ShopView";

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
  const q = (first(sp.q) ?? "").trim();
  const categories = (first(sp.category) ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const sort = first(sp.sort) ?? "featured";

  const all = await db.select().from(products);

  const counts: Record<string, number> = {};
  for (const p of all) counts[p.category] = (counts[p.category] ?? 0) + 1;

  let filtered = all;
  if (categories.length)
    filtered = filtered.filter((p) => categories.includes(p.category));
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.colors.some((c) => c.name.toLowerCase().includes(needle))
    );
  }

  switch (sort) {
    case "new":
      filtered = [...filtered].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      break;
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.priceCents - a.priceCents);
      break;
    default:
      filtered = [...filtered].sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.createdAt.getTime() - a.createdAt.getTime()
      );
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
