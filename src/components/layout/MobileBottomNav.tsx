"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Wrench, Heart, ShoppingBag } from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const openCart = useCart((s) => s.open);
  const wishIds = useWishlist((s) => s.ids);

  const cCount = hydrated ? cartCount(items) : 0;
  const wCount = wishIds.length;

  const isHome = pathname === "/";
  const isCatalog = pathname.startsWith("/products") && pathname !== "/products/custom-battery-pack-builder";
  const isBuilder = pathname === "/pack-builder" || pathname === "/products/custom-battery-pack-builder";
  const isWish = pathname === "/wishlist";

  // On transactional pages we show dedicated bottom bars (buy bar / checkout / builder) instead
  const isSingleProductPage = /^\/products\/[a-zA-Z0-9_-]+$/.test(pathname);
  if (isSingleProductPage || pathname === "/checkout" || pathname === "/pack-builder") {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 py-1.5 backdrop-blur-lg lg:hidden supports-[backdrop-filter]:bg-white/90"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto grid grid-cols-5 items-center">
        {/* Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95",
            isHome ? "text-volt-600 font-semibold" : "text-slate-500 hover:text-slate-900",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1">Home</span>
        </Link>

        {/* Shop */}
        <Link
          href="/products"
          className={cn(
            "flex flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95",
            isCatalog ? "text-volt-600 font-semibold" : "text-slate-500 hover:text-slate-900",
          )}
        >
          <Grid className="h-5 w-5" />
          <span className="mt-1">Shop</span>
        </Link>

        {/* Builder */}
        <Link
          href="/pack-builder"
          className={cn(
            "relative flex flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95",
            isBuilder ? "text-volt-600 font-semibold" : "text-slate-500 hover:text-slate-900",
          )}
        >
          <span className="absolute -top-1 right-3 h-2 w-2 rounded-full bg-volt-400 animate-pulse-ring" />
          <Wrench className="h-5 w-5" />
          <span className="mt-1">Builder</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={cn(
            "relative flex flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95",
            isWish ? "text-volt-600 font-semibold" : "text-slate-500 hover:text-slate-900",
          )}
        >
          {wCount > 0 && (
            <span className="absolute top-0 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {wCount}
            </span>
          )}
          <Heart className="h-5 w-5" />
          <span className="mt-1">Saved</span>
        </Link>

        {/* Cart */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 text-[11px] font-medium text-slate-700 transition active:scale-95"
        >
          {cCount > 0 && (
            <span className="absolute top-0 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-950 px-1 text-[10px] font-bold text-white">
              {cCount}
            </span>
          )}
          <ShoppingBag className="h-5 w-5" />
          <span className="mt-1">Cart</span>
        </button>
      </div>
    </nav>
  );
}
