"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function Header() {
  const { count = 0, openCart } = useCart();
  const { ids = [], items = [] } = useWishlist();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const wishlistCount = ids.length || items.length || 0;

  return (
    <header className="w-full bg-paper sticky top-0 z-50">
      {/* Top Ticker Bar */}
      <div className="bg-ink text-paper text-[10px] tracking-widest uppercase py-1.5 px-4 overflow-hidden border-b border-sand/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto opacity-80 whitespace-nowrap gap-4">
          <span>NOW IN STORES</span>
          <span>•</span>
          <span>CONSIDERED CLOTHING, MADE TO OUTLAST SEASONS</span>
          <span>•</span>
          <span>OC — SINCE 2026</span>
          <span>•</span>
          <span>COMPLIMENTARY CARBON-NEUTRAL SHIPPING OVER $300</span>
          <span>•</span>
          <span>AUTUMN / WINTER 2026</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-sand/30">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-medium tracking-widest uppercase text-ink/80">
            <Link href="/shop?cat=new" className="hover:text-gold transition">New In</Link>
            <Link href="/shop" className="hover:text-gold transition">Shop All</Link>
            <Link href="/shop?cat=outerwear" className="hover:text-gold transition">Outerwear</Link>
            <Link href="/shop?cat=tailoring" className="hover:text-gold transition">Tailoring</Link>
            <Link href="/shop?cat=knitwear" className="hover:text-gold transition">Knitwear</Link>
            <Link href="/shop?cat=dresses" className="hover:text-gold transition">Dresses</Link>
          </nav>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="inline-flex flex-col items-center">
              <span className="font-serif text-3xl tracking-tight text-ink">OC</span>
              <span className="text-[8px] tracking-[0.3em] text-taupe uppercase -mt-1">SINCE 2026</span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              aria-label="Search" 
              className="text-ink hover:text-gold transition p-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-gold transition p-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={openCart} aria-label="Cart" className="relative text-ink hover:text-gold transition p-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
