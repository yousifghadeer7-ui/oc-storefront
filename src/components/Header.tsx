"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogoLockup } from "./Logo";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import {
  IconBag,
  IconHeart,
  IconSearch,
  IconMenu,
  IconClose,
} from "./Icons";

const NAV = [
  { label: "New In", href: "/shop?sort=new" },
  { label: "Shop All", href: "/shop" },
  { label: "Outerwear", href: "/shop?category=Outerwear" },
  { label: "Tailoring", href: "/shop?category=Tailoring" },
  { label: "Knitwear", href: "/shop?category=Knitwear" },
  { label: "Dresses", href: "/shop?category=Dresses" },
];

const MARQUEE = [
  "Complimentary carbon-neutral shipping over $300",
  "Autumn / Winter 2026 — now in stores",
  "Considered clothing, made to outlast seasons",
  "OC — Since 2026",
];

export function Header() {
  const { count, openCart } = useCart();
  const { ids } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setQuery("");
  };

  return (
    <>
      {/* announcement marquee */}
      <div className="overflow-hidden border-b border-line-dark bg-ink text-paper">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {MARQUEE.map((m) => (
                <span
                  key={m}
                  className="flex items-center gap-3 whitespace-nowrap px-8 py-2 text-[10px] font-medium tracking-[0.28em] uppercase"
                >
                  {m}
                  <span className="inline-block h-1 w-1 rounded-full bg-paper/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
          {/* left */}
          <div className="flex items-center gap-6">
            <button
              className="p-1 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-soft transition-colors hover:text-ink hover:underline underline-offset-4"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* center */}
          <Link href="/" className="justify-self-center" aria-label="OC home">
            <LogoLockup />
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-4 md:gap-5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className="p-1 transition-colors hover:text-muted"
            >
              <IconSearch />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-1 transition-colors hover:text-muted"
            >
              <IconHeart />
              {ids.size > 0 && (
                <span className="absolute -top-1 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper">
                  {ids.size}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              aria-label="Open bag"
              className="relative p-1 transition-colors hover:text-muted"
            >
              <IconBag />
              {count > 0 && (
                <span className="absolute -top-1 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* search row */}
        {searchOpen && (
          <div className="border-t border-line bg-paper animate-fade-in">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 md:px-8"
            >
              <IconSearch className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces, fabrics, categories…"
                className="w-full bg-transparent font-display text-lg italic outline-none placeholder:text-muted/70"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-1 text-muted hover:text-ink"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper animate-fade-in">
          <div className="flex h-16 items-center justify-between px-4 border-b border-line">
            <LogoLockup />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-auto px-6 py-8">
            {NAV.map((n, i) => (
              <Link
                key={n.label}
                href={n.href}
                className="border-b border-line py-4 font-display text-3xl italic animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted">
              <Link href="/orders" className="hover:text-ink">
                Orders
              </Link>
              <Link href="/wishlist" className="hover:text-ink">
                Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
