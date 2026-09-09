"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { IconCart, IconHeart, IconSearch } from "@/components/Icons";

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
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="text-ink hover:text-gold transition">
            <IconSearch className="h-5 w-5" />
          </button>

          <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-gold transition">
            <IconHeart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button onClick={openCart} aria-label="Cart" className="relative text-ink hover:text-gold transition">
            <IconCart className="h-5 w-5" />
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
