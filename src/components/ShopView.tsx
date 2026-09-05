"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import type { Product } from "@/db/schema";
import { ProductCard } from "./ProductCard";
import { IconClose, IconChevron, IconSearch } from "./Icons";

interface Props {
  products: Product[];
  counts: Record<string, number>;
  q: string;
  categories: string[];
  sort: string;
  total: number;
}

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
];

export function ShopView({ products, counts, q, categories, sort, total }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (next: { q?: string; categories?: string[]; sort?: string }) => {
    const sp = new URLSearchParams();
    const cats = next.categories ?? categories;
    const s = next.sort ?? sort;
    const qq = next.q !== undefined ? next.q : q;
    if (cats.length) sp.set("category", cats.join(","));
    if (s && s !== "featured") sp.set("sort", s);
    if (qq) sp.set("q", qq);
    const str = sp.toString();
    router.replace(str ? `/shop?${str}` : "/shop");
  };

  const toggleCategory = (c: string) =>
    update({
      categories: categories.includes(c)
        ? categories.filter((x) => x !== c)
        : [...categories, c],
    });

  const hasFilters = categories.length > 0 || !!q || sort !== "featured";

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted">
          Category
        </h3>
        <ul className="mt-4 space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-4 w-4 place-items-center border transition-colors ${
                      categories.includes(c)
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper"
                    }`}
                  >
                    {categories.includes(c) && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m2 6 3 3 5-6" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={categories.includes(c)}
                    onChange={() => toggleCategory(c)}
                  />
                  {c}
                </span>
                <span className="text-xs text-muted">{counts[c] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      {hasFilters && (
        <button
          onClick={() => update({ categories: [], q: "", sort: "featured" })}
          className="text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:text-muted"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      {/* heading */}
      <div className="border-b border-line pb-8">
        <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
          The Collection
        </p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display text-4xl md:text-6xl">
            {q ? (
              <>
                Results for <span className="italic">“{q}”</span>
              </>
            ) : categories.length === 1 ? (
              categories[0]
            ) : (
              "Shop All"
            )}
          </h1>
          <p className="text-sm text-muted">
            {products.length} of {total} pieces
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[230px_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          {/* toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 border border-line px-4 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase lg:hidden"
            >
              Filter
              {categories.length > 0 && ` (${categories.length})`}
              <IconChevron className="h-3.5 w-3.5" />
            </button>

            <div className="flex flex-1 flex-wrap items-center gap-2">
              {q && (
                <button
                  onClick={() => update({ q: "" })}
                  className="flex items-center gap-2 border border-line px-3 py-1.5 text-xs"
                >
                  “{q}” <IconClose className="h-3 w-3" />
                </button>
              )}
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className="flex items-center gap-2 border border-ink bg-ink px-3 py-1.5 text-xs text-paper"
                >
                  {c} <IconClose className="h-3 w-3" />
                </button>
              ))}
            </div>

            <label className="relative flex items-center">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="appearance-none border border-line bg-paper py-2.5 pl-4 pr-9 text-[11px] font-semibold tracking-[0.14em] uppercase outline-none focus:border-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <IconChevron className="pointer-events-none absolute right-3 h-3.5 w-3.5" />
            </label>
          </div>

          {/* grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-line py-24 text-center">
              <IconSearch className="h-8 w-8 text-muted/50" />
              <p className="font-display text-2xl italic">Nothing matches</p>
              <p className="max-w-xs text-sm text-muted">
                No pieces fit that combination. Try loosening a filter or two.
              </p>
              <button
                onClick={() => update({ categories: [], q: "", sort: "featured" })}
                className="mt-2 bg-ink px-6 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-paper hover:bg-ink-soft"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              key={`${q}|${categories.join(",")}|${sort}`}
              className="grid grid-cols-2 gap-x-3 gap-y-10 animate-fade-in xl:grid-cols-3"
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/45 animate-overlay-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-paper p-6 animate-drawer-in-left">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-xl">Filter</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <IconClose />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-10 w-full bg-ink py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-paper"
            >
              Show {products.length} pieces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
