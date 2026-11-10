"use client";

import { useState, useRef } from "react";
import { Plus, Check, ShoppingBag, Minus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/db/schema";
import { useCart } from "@/store/cart";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

function flyToCart(from: HTMLElement | null, image: string) {
  if (!from || typeof document === "undefined") return;
  const target = document.getElementById("cart-button");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const el = document.createElement("img");
  el.src = image;
  el.style.cssText = `position:fixed;left:${a.left + a.width / 2 - 28}px;top:${a.top + a.height / 2 - 28}px;width:56px;height:56px;border-radius:14px;object-fit:cover;z-index:9999;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.25);--fly-x:${b.left + b.width / 2 - (a.left + a.width / 2)}px;--fly-y:${b.top + b.height / 2 - (a.top + a.height / 2)}px;animation:fly-to-cart .8s cubic-bezier(.22,1,.36,1) forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

function toCartItem(p: Product) {
  return { id: p.id, slug: p.slug, name: p.name, brand: p.brand, price: p.price, compareAtPrice: p.compareAtPrice, image: p.images[0], stock: p.stock };
}

export function QuickAdd({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  if (product.stock === 0) return null;
  return (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        addItem(toCartItem(product), 1);
        flyToCart(ref.current, product.images[0]);
        setDone(true);
        toast({ title: "Added to cart", description: product.name, image: product.images[0] });
        setTimeout(() => setDone(false), 1200);
      }}
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 active:scale-90",
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-900 hover:border-ink-950 hover:bg-ink-950 hover:text-white",
      )}
      aria-label="Add to cart"
    >
      {done ? <Check className="h-4 w-4 animate-pop" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}

export function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const out = product.stock === 0;

  const add = () => {
    addItem(toCartItem(product), qty);
    flyToCart(ref.current, product.images[0]);
    setDone(true);
    toast({ title: `Added ${qty} × to cart`, description: product.name, image: product.images[0] });
    setTimeout(() => setDone(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-slate-200 bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
          <input
            value={qty}
            type="number"
            min={1}
            max={product.stock}
            onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
            className="w-12 bg-transparent text-center text-base font-semibold tabular-nums outline-none"
          />
          <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100" aria-label="Increase"><Plus className="h-4 w-4" /></button>
        </div>
        <button
          ref={ref}
          onClick={add}
          disabled={out}
          className={cn(
            "relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300",
            done ? "bg-emerald-500" : "bg-ink-950 hover:bg-ink-800",
          )}
        >
          {done ? (
            <span className="flex items-center gap-2 animate-pop"><Check className="h-5 w-5" /> Added to cart</span>
          ) : (
            <>
              <ShoppingBag className="h-4.5 w-4.5" /> {out ? "Out of stock" : "Add to cart"}
            </>
          )}
        </button>
      </div>
      <button
        onClick={() => {
          if (out) return;
          addItem(toCartItem(product), qty);
          router.push("/checkout");
        }}
        disabled={out}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-volt-500 to-cyan-400 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-volt-400 hover:to-cyan-300 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
      >
        <Zap className="h-4 w-4 fill-current" /> Buy it now
      </button>
      <button onClick={openCart} className="sr-only">Open cart</button>
    </div>
  );
}
