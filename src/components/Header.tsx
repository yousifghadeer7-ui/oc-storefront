"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function Header() {
  const { count = 0, openCart } = useCart();
  const { ids = [], items = [] } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const wishlistCount = ids.length || items.length || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-sand">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-display text-2xl font-bold tracking-wider text-ink">
          OC STORE
        </Link>

        <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-ink/80">
          <Link href="/" className={`hover:text-ink transition ${pathname === "/" ? "text-gold" : ""}`}>
            Home
          </Link>
          <Link href="/shop" className={`hover:text-ink transition ${pathname === "/shop" ? "text-gold" : ""}`}>
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {/* Search Icon */}
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="text-ink hover:text-gold transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-gold transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button onClick={openCart} aria-label="Cart" className="relative text-ink hover:text-gold transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-sand bg-paper p-4">
          <form onSubmit={handleSearch} className="mx-auto max-w-xl flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-sand px-4 py-2 text-sm focus:outline-none focus:border-ink"
            />
            <button type="submit" className="bg-ink px-6 py-2 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-gold hover:text-ink transition">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
