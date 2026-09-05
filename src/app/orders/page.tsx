"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { money, formatDate } from "@/lib/format";
import { IconBag, IconTruck, IconCheck } from "@/components/Icons";

interface OrderItemJSON {
  id: number;
  name: string;
  image: string;
  priceCents: number;
  size: string;
  color: string;
  qty: number;
}

interface OrderJSON {
  id: number;
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: string;
  createdAt: string;
  items: OrderItemJSON[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderJSON[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d: { orders: OrderJSON[] }) => setOrders(d.orders ?? []))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
      <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
        Your Account
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Orders</h1>

      {failed && (
        <div className="mt-10 border border-danger/40 bg-danger/5 px-5 py-4 text-sm text-danger">
          We could not load your orders. Please refresh the page.
        </div>
      )}

      {!orders && !failed && (
        <div className="mt-10 space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse border border-line bg-cream/60"
            />
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 border border-line py-24 text-center">
          <IconBag className="h-10 w-10 text-muted/50" />
          <p className="font-display text-2xl italic">No orders yet</p>
          <p className="max-w-xs text-sm text-muted">
            When you place your first order, it will live here — status,
            pieces and receipt included.
          </p>
          <Link
            href="/shop"
            className="mt-2 bg-ink px-8 py-3.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper hover:bg-ink-soft"
          >
            Start shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-10 space-y-6">
          {orders.map((o) => (
            <li key={o.id} className="border border-line bg-paper animate-fade-up">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                <div>
                  <p className="font-display text-lg">{o.orderNumber}</p>
                  <p className="text-xs text-muted">
                    Placed {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 border border-success/40 bg-success/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-success">
                    {o.status === "confirmed" ? (
                      <IconCheck className="h-3.5 w-3.5" />
                    ) : (
                      <IconTruck className="h-3.5 w-3.5" />
                    )}
                    {o.status}
                  </span>
                  <span className="font-display text-lg">{money(o.totalCents)}</span>
                </div>
              </header>

              <div className="grid gap-6 px-6 py-5 md:grid-cols-[1fr_240px]">
                <ul className="divide-y divide-line">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex items-center gap-4 py-3">
                      <div className="h-16 w-12 shrink-0 overflow-hidden bg-cream">
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-sm">{it.name}</p>
                        <p className="text-xs text-muted">
                          {it.color} · Size {it.size} · Qty {it.qty}
                        </p>
                      </div>
                      <span className="text-sm">{money(it.priceCents * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs leading-relaxed text-muted md:border-l md:border-line md:pl-6">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-soft">
                    Shipping to
                  </p>
                  <p className="mt-2">
                    {o.firstName} {o.lastName}
                    <br />
                    {o.address}
                    <br />
                    {o.city}, {o.postalCode}
                    <br />
                    {o.country}
                  </p>
                  <p className="mt-3">
                    Shipping:{" "}
                    {o.shippingCents === 0 ? "Complimentary" : money(o.shippingCents)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
