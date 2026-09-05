"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useCart, cartKey } from "@/lib/cart";
import { money } from "@/lib/format";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { useToast } from "@/lib/toast";
import {
  IconBag,
  IconCheck,
  IconLock,
  IconArrow,
} from "@/components/Icons";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Japan",
  "Australia",
  "Canada",
];

interface Fields {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const EMPTY: Fields = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "United States",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-soft">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-danger animate-fade-in">{error}</p>}
    </label>
  );
}

const inputCls = (err?: string) =>
  `w-full border bg-paper px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-ink ${
    err ? "border-danger" : "border-line"
  }`;

function SectionTitle({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-xl">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-sans font-semibold text-paper">
        {n}
      </span>
      {children}
    </h2>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { push } = useToast();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    orderNumber: string;
    totalCents: number;
    email: string;
  } | null>(null);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const set = (k: keyof Fields, v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
    if (!fields.firstName.trim()) e.firstName = "Required";
    if (!fields.lastName.trim()) e.lastName = "Required";
    if (!fields.address.trim()) e.address = "Required";
    if (!fields.city.trim()) e.city = "Required";
    if (!fields.postalCode.trim()) e.postalCode = "Required";
    if (!fields.cardName.trim()) e.cardName = "Required";
    if (fields.cardNumber.replace(/\s/g, "").length !== 16)
      e.cardNumber = "Enter a 16-digit card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.cardExpiry))
      e.cardExpiry = "MM/YY";
    if (!/^\d{3,4}$/.test(fields.cardCvc)) e.cardCvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setBanner(null);
    if (!validate()) {
      push("Please review the highlighted fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email,
          firstName: fields.firstName,
          lastName: fields.lastName,
          address: fields.address,
          city: fields.city,
          postalCode: fields.postalCode,
          country: fields.country,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner(data.error ?? "Something went wrong placing your order.");
        push(data.error ?? "Checkout failed", "error");
        return;
      }
      clear();
      setSuccess(data);
      window.scrollTo({ top: 0 });
    } catch {
      setBanner("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center md:py-32">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-paper animate-fade-up">
          <IconCheck className="h-7 w-7" />
        </div>
        <p className="mt-8 text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
          Order confirmed
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Thank you.
        </h1>
        <p className="mt-4 font-display text-2xl italic">{success.orderNumber}</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Your order of {money(success.totalCents)} is confirmed. A receipt is
          on its way to {success.email}, and your pieces will ship within 48
          hours.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/orders"
            className="bg-ink px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper hover:bg-ink-soft"
          >
            View your orders
          </Link>
          <Link
            href="/shop"
            className="border border-line px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase hover:border-ink"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center md:py-32">
        <IconBag className="mx-auto h-10 w-10 text-muted/50" />
        <h1 className="mt-6 font-display text-3xl italic">Nothing to check out</h1>
        <p className="mt-3 text-sm text-muted">
          Your bag is empty. Add a piece or two and return here when ready.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper hover:bg-ink-soft"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} noValidate className="space-y-12">
          {banner && (
            <div className="border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger animate-fade-in">
              {banner}
            </div>
          )}

          <section className="space-y-5">
            <SectionTitle n="1">Contact</SectionTitle>
            <Field label="Email address" error={errors.email}>
              <input
                type="email"
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={inputCls(errors.email)}
              />
            </Field>
          </section>

          <section className="space-y-5">
            <SectionTitle n="2">Shipping</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <input
                  value={fields.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={inputCls(errors.firstName)}
                />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input
                  value={fields.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={inputCls(errors.lastName)}
                />
              </Field>
            </div>
            <Field label="Address" error={errors.address}>
              <input
                value={fields.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Street and number"
                className={inputCls(errors.address)}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="City" error={errors.city}>
                <input
                  value={fields.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputCls(errors.city)}
                />
              </Field>
              <Field label="Postal code" error={errors.postalCode}>
                <input
                  value={fields.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  className={inputCls(errors.postalCode)}
                />
              </Field>
              <Field label="Country">
                <select
                  value={fields.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={inputCls()}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="space-y-5">
            <SectionTitle n="3">Payment</SectionTitle>
            <p className="flex items-center gap-2 text-xs text-muted">
              <IconLock className="h-4 w-4" /> This is a demonstration checkout —
              no card is charged.
            </p>
            <Field label="Name on card" error={errors.cardName}>
              <input
                value={fields.cardName}
                onChange={(e) => set("cardName", e.target.value)}
                className={inputCls(errors.cardName)}
              />
            </Field>
            <Field label="Card number" error={errors.cardNumber}>
              <input
                inputMode="numeric"
                value={fields.cardNumber}
                onChange={(e) => set("cardNumber", formatCard(e.target.value))}
                placeholder="4242 4242 4242 4242"
                className={inputCls(errors.cardNumber)}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Expiry" error={errors.cardExpiry}>
                <input
                  inputMode="numeric"
                  value={fields.cardExpiry}
                  onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className={inputCls(errors.cardExpiry)}
                />
              </Field>
              <Field label="Security code" error={errors.cardCvc}>
                <input
                  inputMode="numeric"
                  value={fields.cardCvc}
                  onChange={(e) =>
                    set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="CVC"
                  className={inputCls(errors.cardCvc)}
                />
              </Field>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 bg-ink py-4 text-[11px] font-semibold tracking-[0.24em] uppercase text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {submitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border border-paper/40 border-t-paper" />
            ) : (
              <>
                Place order — {money(total)} <IconArrow className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* summary */}
        <aside className="h-fit border border-line bg-cream/40 p-6 lg:sticky lg:top-28">
          <h2 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted">
            Order summary
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {items.map((i) => (
              <li key={cartKey(i)} className="flex gap-4 py-4">
                <div className="relative h-20 w-15 shrink-0 overflow-hidden bg-cream" style={{ width: "3.75rem" }}>
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  <span className="absolute -right-0 -top-0 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-paper">
                    {i.qty}
                  </span>
                </div>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm leading-snug">{i.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {i.color} · {i.size}
                    </p>
                  </div>
                  <span className="text-sm">{money(i.priceCents * i.qty)}</span>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Complimentary" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-display text-lg">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
