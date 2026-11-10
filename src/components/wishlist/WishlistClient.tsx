"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { formatBDT, cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/db/schema";

export function WishlistClient() {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products/by-ids?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ids]);

  const handleAddAll = () => {
    if (!products.length) return;
    let added = 0;
    products.forEach((p) => {
      if (p.stock > 0) {
        addItem(
          {
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            image: p.images[0],
            stock: p.stock,
          },
          1,
        );
        added++;
      }
    });
    toast({
      title: `Added ${added} items to cart`,
      description: "Ready for checkout",
    });
    openCart();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display flex items-center gap-3 text-3xl font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="h-5 w-5 fill-current" />
            </span>
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {ids.length} saved item{ids.length === 1 ? "" : "s"}
          </p>
        </div>

        {products.length > 0 && (
          <button
            onClick={handleAddAll}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink-950 px-6 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            <ShoppingBag className="h-4 w-4" /> Add all to cart
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-3xl border border-dashed border-slate-200 p-12 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-slate-300">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="font-display mt-4 text-xl font-bold">Your wishlist is empty</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Tap the heart icon on any battery, circuit, or tool to save it here for later.
          </p>
          <Link
            href="/products"
            className="mt-6 flex h-11 items-center gap-2 rounded-full bg-ink-950 px-6 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-soft transition hover:border-slate-300 hover:shadow-lift"
            >
              <div className="flex gap-4">
                <Link
                  href={`/products/${p.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50"
                >
                  <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                    {p.brand}
                  </p>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug hover:text-volt-700"
                  >
                    {p.name}
                  </Link>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold tabular-nums text-slate-900">
                      {formatBDT(p.price)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {formatBDT(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggle(p.id);
                    toast({
                      title: "Removed from wishlist",
                      description: p.name,
                      type: "info",
                    });
                  }}
                  className="self-start rounded-lg p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {p.stock > 0 ? "In stock" : "Out of stock"}
                </span>

                <button
                  disabled={p.stock === 0}
                  onClick={() => {
                    addItem(
                      {
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        brand: p.brand,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        image: p.images[0],
                        stock: p.stock,
                      },
                      1,
                    );
                    toast({
                      title: "Added to cart",
                      description: p.name,
                      image: p.images[0],
                    });
                    openCart();
                  }}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white transition active:scale-95 disabled:bg-slate-200 disabled:text-slate-400",
                    p.stock > 0 ? "bg-ink-950 hover:bg-ink-800" : "",
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {p.stock > 0 ? "Add to cart" : "Out of stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
