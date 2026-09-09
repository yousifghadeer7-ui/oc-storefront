"use client";

import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { IconClose, IconMinus, IconPlus, IconTrash, IconBag } from "./Icons";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!isOpen) return null;

  const checkoutUrl = items.length > 0
    ? `https://kw8nk1-ix.myshopify.com/cart/${items.map(i => `${i.id}:${i.quantity}`).join(",")}`
    : "#";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-paper text-ink shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-sand flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBag className="h-5 w-5 text-ink" />
              <h2 className="font-display text-xl">Shopping Bag ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button onClick={closeCart} className="p-2 hover:text-gold transition">
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="bg-sand/30 p-4 border-b border-sand text-xs text-center">
            {remainingForFreeShipping > 0 ? (
              <p>
                Add <span className="font-semibold text-gold">${(remainingForFreeShipping / 100).toFixed(2)}</span> more for <span className="font-semibold">Free Express Shipping</span>
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold">🎉 You unlocked Free Express Shipping!</p>
            )}
            <div className="mt-2 h-1.5 w-full bg-sand rounded-full overflow-hidden">
              <div className="h-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <IconBag className="h-12 w-12 text-taupe mx-auto opacity-40" />
                <p className="text-sm text-taupe">Your shopping bag is empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-sand/50 pb-4">
                  <img src={item.image} alt={item.name} className="h-20 w-16 object-cover bg-sand/30" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm text-ink">{item.name}</h4>
                      <p className="text-xs font-semibold text-gold mt-1">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-sand">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-sand transition">
                          <IconMinus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-sand transition">
                          <IconPlus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-taupe hover:text-red-600 transition">
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-sand bg-sand/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-taupe uppercase tracking-wider text-xs">Subtotal</span>
                <span className="font-semibold text-ink">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <a
                href={checkoutUrl}
                className="block w-full text-center bg-ink text-paper py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition"
              >
                Proceed to Checkout &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
