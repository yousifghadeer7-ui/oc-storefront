"use client";

import Link from "next/link";
import { LogoLockup } from "./Logo";
import { CATEGORIES } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { IconInstagram, IconPinterest } from "./Icons";

function CareItem({ title, children }: { title: string; children: string }) {
  return (
    <details className="group border-b border-line-dark py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase text-paper/80 hover:text-paper [&::-webkit-details-marker]:hidden">
        {title}
        <span className="transition-transform group-open:rotate-45 text-lg leading-none">
          +
        </span>
      </summary>
      <p className="pt-3 text-sm leading-relaxed text-paper/60">{children}</p>
    </details>
  );
}

export function Footer() {
  const { openCart } = useCart();
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:px-8 md:py-20">
        <div>
          <LogoLockup halo="#101010" subClass="text-paper/50" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/60">
            A house of considered clothing. Quiet silhouettes, honest
            materials, and pieces made to outlast the seasons they were born
            in.
          </p>
          <div className="mt-6 flex gap-4 text-paper/70">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-paper"
            >
              <IconInstagram />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="transition-colors hover:text-paper"
            >
              <IconPinterest />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-paper/50">
            Shop
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-paper/80">
            <li>
              <Link href="/shop" className="hover:text-paper hover:underline underline-offset-4">
                Shop All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/shop?category=${c}`}
                  className="hover:text-paper hover:underline underline-offset-4"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-paper/50">
            Account
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-paper/80">
            <li>
              <Link href="/orders" className="hover:text-paper hover:underline underline-offset-4">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-paper hover:underline underline-offset-4">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-paper hover:underline underline-offset-4">
                Checkout
              </Link>
            </li>
            <li>
              <button onClick={openCart} className="hover:text-paper hover:underline underline-offset-4">
                Shopping Bag
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-paper/50">
            Client Care
          </h3>
          <div className="mt-3">
            <CareItem title="Shipping">
              Complimentary carbon-neutral shipping on orders over $300.
              Standard delivery arrives in 3–5 working days, worldwide.
            </CareItem>
            <CareItem title="Returns & Exchanges">
              Thirty days, no questions. Pieces should be unworn with tags
              attached. Exchanges are shipped the moment your return scans.
            </CareItem>
            <CareItem title="Garment Care">
              Every piece arrives with a care card. When in doubt: cold hand
              wash, dry flat, and let wool rest between wears.
            </CareItem>
          </div>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-[11px] tracking-[0.14em] uppercase text-paper/40 md:flex-row md:px-8">
          <span>© 2026 OC Studio — Considered clothing</span>
          <span>Visa · Mastercard · Amex · Apple Pay</span>
        </div>
      </div>
    </footer>
  );
}
