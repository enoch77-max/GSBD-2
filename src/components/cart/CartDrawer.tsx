"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useCart, cartSubtotal, cartCount, type CartItem } from "@/store/cart";
import { formatBDT, FREE_SHIPPING_THRESHOLD, cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

export function CartDrawer() {
  const { items, isOpen, close, updateQty, removeItem, addItem } = useCart();
  const subtotal = cartSubtotal(items);
  const count = cartCount(items);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const [suggest, setSuggest] = useState<Omit<CartItem, "quantity">[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const ids = items.map((i) => i.id).join(",");
    fetch(`/api/products/suggest?exclude=${ids}`)
      .then((r) => r.json())
      .then(setSuggest)
      .catch(() => {});
  }, [isOpen, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/60 backdrop-blur-sm"
        onClick={close}
      />

      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in-right flex-col bg-white shadow-2xl"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-800" />
            <h2 className="font-display text-lg font-bold">Your cart</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {count}
            </span>
          </div>
          <button
            onClick={close}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping threshold progress bar */}
        {items.length > 0 && (
          <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50/60 to-emerald-50/40 px-5 py-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Truck className="h-3.5 w-3.5 text-volt-600 shrink-0" />
              {remaining > 0 ? (
                <span>
                  Add <b className="text-volt-700">{formatBDT(remaining)}</b> more for free Dhaka delivery
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> You&apos;ve unlocked free delivery inside Dhaka!
                </span>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-volt-500 to-emerald-500 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Items */}
        <div className="thin-scroll flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-5 grid h-20 w-20 place-items-center rounded-full bg-slate-50">
                <ShoppingBag className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="font-display text-lg font-bold">Your cart is empty</h3>
              <p className="mt-1 max-w-[240px] text-xs text-slate-500 sm:text-sm">
                Browse genuine cells, smart BMS boards, and pack-building tools.
              </p>
              <button
                onClick={close}
                className="mt-6 rounded-full bg-ink-950 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-ink-800"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3.5 py-4 animate-fade-in">
                  <Link
                    href={`/products/${it.slug}`}
                    onClick={close}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                  >
                    <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                      {it.brand}
                    </p>
                    <Link
                      href={`/products/${it.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-slate-900 hover:text-volt-700"
                    >
                      {it.name}
                    </Link>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-slate-200">
                        <button
                          type="button"
                          onClick={() => updateQty(it.id, it.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(it.id, it.quantity + 1)}
                          disabled={it.quantity >= it.stock}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm font-bold tabular-nums text-slate-900">
                          {formatBDT(it.price * it.quantity)}
                        </p>
                        {it.quantity > 1 && (
                          <p className="text-[10.5px] text-slate-400">{formatBDT(it.price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="self-start rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Suggested additions */}
          {items.length > 0 && suggest.length > 0 && (
            <div className="mt-2 border-t border-slate-100 pb-4 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Builders Also Add
              </p>
              <ul className="mt-3 space-y-2">
                {suggest.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-300"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100">
                      <Image src={s.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900">{s.name}</p>
                      <p className="font-display text-xs font-bold tabular-nums text-slate-800">
                        {formatBDT(s.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addItem(s, 1);
                        toast({
                          title: "Added to cart",
                          description: s.name,
                          image: s.image,
                        });
                      }}
                      className="flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white active:scale-95"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div
            className="border-t border-slate-100 bg-white p-5 shadow-lift"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-display text-xl font-bold tabular-nums text-slate-900">
                {formatBDT(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Shipping &amp; promo coupons calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={close}
              className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-950 text-sm font-semibold text-white shadow transition hover:bg-ink-800 active:scale-[0.98]"
            >
              Checkout securely{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              onClick={close}
              className="mt-2 h-9 w-full rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Continue shopping
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Cash on Delivery · bKash · Nagad · Cards
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
