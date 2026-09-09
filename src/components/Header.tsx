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

  const tickerItems = [
    "NOW IN STORES",
    "CONSIDERED CLOTHING, MADE TO OUTLAST SEASONS",
    "OC — SINCE 2026",
    "COMPLIMENTARY CARBON-NEUTRAL SHIPPING OVER $300",
    "AUTUMN / WINTER 2026",
  ];

  return (
    <header className="w-full bg-paper sticky top-0 z-50">
      {/* Top Ticker Bar with Continuous Animation */}
      <div className="bg-ink text-paper text-[11px] tracking-[0.2em] uppercase py-2 overflow-hidden whitespace-nowrap border-b border-sand/20 relative flex">
        <div className="animate-marquee flex gap-8 items-center shrink-0 min-w-full justify-around">
          {tickerItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span className="opacity-90 font-medium">{item}</span>
              <span className="text-gold text-[8px]">•</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex gap-8 items-center shrink-0 min-w-full justify-around" aria-hidden="true">
          {tickerItems.map((item, idx) => (
            <span key={`dup-${idx}`} className="flex items-center gap-8">
              <span className="opacity-90 font-medium">{item}</span>
              <span className="text-gold text-[8px]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Header with Exact 3-Column Grid */}
      <div className="border-b border-sand/30 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto grid grid-cols-3 h-24 max-w-7xl items-center px-4 md:px-8">
          
          {/* Left Column: Navigation Links pushed to Far Left */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-semibold tracking-[0.15em] uppercase text-ink justify-start">
            <Link href="/shop?cat=new" className="hover:text-gold transition whitespace-nowrap">NEW IN</Link>
            <Link href="/shop" className="hover:text-gold transition whitespace-nowrap">SHOP ALL</Link>
            <Link href="/shop?cat=outerwear" className="hover:text-gold transition whitespace-nowrap">OUTERWEAR</Link>
            <Link href="/shop?cat=tailoring" className="hover:text-gold transition whitespace-nowrap">TAILORING</Link>
            <Link href="/shop?cat=knitwear" className="hover:text-gold transition whitespace-nowrap">KNITWEAR</Link>
            <Link href="/shop?cat=dresses" className="hover:text-gold transition whitespace-nowrap">DRESSES</Link>
          </nav>

          {/* Middle Column: Exactly Centered Logo */}
          <div className="flex justify-center items-center">
            <Link href="/" className="inline-flex flex-col items-center group">
              <span className="font-serif text-4xl md:text-5xl tracking-tight text-ink group-hover:opacity-80 transition">OC</span>
              <span className="text-[9px] tracking-[0.35em] text-taupe uppercase mt-0.5 font-sans font-medium">SINCE 2026</span>
            </Link>
          </div>

          {/* Right Column: Icons pushed to Far Right */}
          <div className="flex items-center justify-end gap-6">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              aria-label="Search" 
              className="text-ink hover:text-gold transition p-1.5"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-gold transition p-1.5">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={openCart} aria-label="Cart" className="relative text-ink hover:text-gold transition p-1.5">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">
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
