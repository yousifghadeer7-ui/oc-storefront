"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, cartKey } from "@/lib/cart";
import { money } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { IconClose, IconMinus, IconPlus, IconTrash, IconBag, IconTruck } from "./Icons";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, subtotal, count } =
    useCart();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  if (!isOpen) return null;

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink/45 animate-overlay-in"
        onClick={closeCart}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl animate-drawer-in">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl">
            Your Bag{" "}
            <span className="text-muted text-base">({count})</span>
          </h2>
          <button onClick={closeCart} aria-label="Close bag" className="p-1">
            <IconClose />
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-line px-6 py-4">
            {remaining > 0 ? (
              <p className="text-xs tracking-wide text-ink-soft">
                You are{" "}
                <span className="font-semibold">{money(remaining)}</span> away
                from complimentary shipping
              </p>
            ) : (
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-success">
                <IconTruck className="h-4 w-4" /> Complimentary shipping
                unlocked
              </p>
            )}
            <div className="mt-2 h-px w-full bg-line">
              <div
                className="h-px bg-ink transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <IconBag className="h-10 w-10 text-muted/50" />
            <p className="font-display text-2xl italic">Your bag is empty</p>
            <p className="text-sm text-muted">
              Pieces you add will appear here, kept safely for your return.
            </p>
            <button
              onClick={() => {
                closeCart();
                router.push("/shop");
              }}
              className="mt-2 bg-ink px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-paper transition-colors hover:bg-ink-soft"
            >
              Shop the collection
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((i) => (
                <li key={cartKey(i)} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${i.slug}`}
                    onClick={closeCart}
                    className="block h-28 w-21 shrink-0 overflow-hidden bg-cream"
                    style={{ width: "5.25rem" }}
                  >
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/product/${i.slug}`}
                          onClick={closeCart}
                          className="font-display text-base leading-snug hover:underline underline-offset-4"
                        >
                          {i.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {i.color} · Size {i.size}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {money(i.priceCents * i.qty)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => setQty(cartKey(i), i.qty - 1)}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1.5 hover:bg-cream"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(cartKey(i), i.qty + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1.5 hover:bg-cream"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(cartKey(i))}
                        aria-label={`Remove ${i.name}`}
                        className="p-1.5 text-muted transition-colors hover:text-danger"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="tracking-[0.14em] uppercase text-muted">
                  Subtotal
                </span>
                <span className="font-display text-xl">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 block bg-ink py-4 text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-paper transition-colors hover:bg-ink-soft"
              >
                Proceed to checkout
              </Link>
              <button
                onClick={closeCart}
                className="mt-3 w-full text-center text-[11px] font-semibold tracking-[0.18em] uppercase text-muted underline underline-offset-4 hover:text-ink"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
