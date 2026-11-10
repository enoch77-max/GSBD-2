"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/db/schema";
import { useCart } from "@/store/cart";
import { formatBDT, cn } from "@/lib/utils";

export function StickyBuyBar({ product }: { product: Product }) {
  const [show, setShow] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (product.stock === 0) return null;

  const toItem = () => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.images[0],
    stock: product.stock,
  });

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden shadow-lift",
        show ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        {/* Product thumb & price */}
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-900">{product.name}</p>
          <p className="font-display text-sm font-bold tabular-nums text-slate-900">
            {formatBDT(product.price)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addItem(toItem(), 1);
              openCart();
            }}
            className="flex h-10 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-900 shadow-sm transition active:scale-95 hover:border-slate-900"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={() => {
              addItem(toItem(), 1);
              router.push("/checkout");
            }}
            className="flex h-10 items-center gap-1.5 rounded-full bg-volt-400 px-4 text-xs font-bold text-ink-950 shadow transition active:scale-95 hover:bg-volt-300"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
