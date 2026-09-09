"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";

const EMPTY = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  country: "Saudi Arabia",
  postalCode: "",
};

type Fields = typeof EMPTY;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { push } = useToast();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof Fields]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof Fields, string>> = {};

    Object.keys(fields).forEach((key) => {
      const k = key as keyof Fields;
      if (!fields[k]) newErrors[k] = "Required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      clear();
      push("Order placed successfully!");
      setIsSubmitting(false);
      window.location.href = "/";
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-taupe">Add some items before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-8 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-gold hover:text-ink transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={fields.email}
              onChange={handleChange}
              className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={fields.firstName}
                  onChange={handleChange}
                  className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink"
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={fields.lastName}
                  onChange={handleChange}
                  className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink"
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={fields.address}
              onChange={handleChange}
              className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink mt-4"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={fields.city}
                  onChange={handleChange}
                  className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={fields.postalCode}
                  onChange={handleChange}
                  className="w-full border border-sand p-3 text-sm focus:outline-none focus:border-ink"
                />
                {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-gold hover:text-ink transition disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="lg:col-span-5 bg-sand/20 p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y divide-sand">
            {items.map((item, idx) => (
              <li key={item.id || idx} className="py-4 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="h-16 w-12 object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-xs text-taupe">Qty: {item.quantity || item.qty || 1}</p>
                </div>
                <p className="text-sm font-semibold">${((item.priceCents || 0) / 100).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-sand mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
