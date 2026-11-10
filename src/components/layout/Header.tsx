"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Zap,
  ChevronDown,
  Truck,
  ShieldCheck,
  Phone,
  PackageSearch,
  Heart,
  Wrench,
  Search,
} from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { LiveSearch } from "@/components/layout/LiveSearch";

type Cat = { slug: string; name: string; image: string; tagline: string };

export function Header({ categories }: { categories: Cat[] }) {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const openCart = useCart((s) => s.open);
  const wishIds = useWishlist((s) => s.ids);

  const count = hydrated ? cartCount(items) : 0;
  const wishCount = wishIds.length;

  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const pathname = usePathname();
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  return (
    <>
      {/* Announcement bar */}
      <div className="relative overflow-hidden bg-ink-950 text-[11.5px] text-slate-300 sm:text-[12.5px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-1.5 sm:px-6 sm:py-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Truck className="h-3.5 w-3.5 text-volt-400 shrink-0" />
            <span>
              Free delivery inside Dhaka on orders over <b className="text-white">৳5,000</b>
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Every cell capacity-tested
            </span>
            <a
              href="tel:01700000000"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Phone className="h-3.5 w-3.5 text-amber-glow" /> 01700-000000 (10am–9pm)
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-200",
          scrolled
            ? "border-slate-200 bg-white shadow-soft"
            : "border-slate-100 bg-white",
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2.5 px-4 sm:h-[68px] sm:gap-6 sm:px-6">
          {/* Hamburger on mobile */}
          <button
            className="-ml-1 rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5">
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-950 text-volt-400 shadow-glow transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <span className="hidden leading-none min-[380px]:block">
              <span className="font-display block text-[15px] font-bold tracking-tight text-slate-900 sm:text-[17px]">
                Glowing Space
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-volt-600 sm:text-[10px]">
                Bangladesh
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  megaOpen && "bg-slate-100",
                )}
              >
                Shop <ChevronDown className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
              </button>
              {megaOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-[720px] animate-fade-in rounded-2xl border border-slate-200 bg-white p-4 shadow-lift">
                    <div className="grid grid-cols-4 gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/products?category=${c.slug}`}
                          className="group/i flex flex-col gap-2 rounded-xl p-2 transition hover:bg-slate-50"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={c.image}
                              alt={c.name}
                              fill
                              sizes="200px"
                              className="object-cover transition duration-500 group-hover/i:scale-105"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{c.name}</p>
                            <p className="text-[11.5px] text-slate-500 line-clamp-1">{c.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-950 px-4 py-3 text-white">
                      <p className="text-xs sm:text-sm">
                        <span className="text-volt-400 font-semibold">Custom Pack Builder</span> — design,
                        calculate voltage &amp; order custom welds.
                      </p>
                      <Link
                        href="/pack-builder"
                        className="rounded-lg bg-volt-400 px-3 py-1.5 text-xs font-bold text-ink-950 hover:bg-volt-300"
                      >
                        Open Builder →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/products" active={pathname === "/products"}>
              All Products
            </NavLink>
            <NavLink href="/pack-builder" active={pathname === "/pack-builder"}>
              <span className="flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-volt-600" /> Pack Builder
              </span>
            </NavLink>
            <NavLink href="/products?category=battery-packs">Packs</NavLink>
            <NavLink href="/products?category=ups-power">UPS</NavLink>
            <NavLink href="/products?sort=newest">New</NavLink>
          </nav>

          {/* Live Search Bar for Desktop */}
          <div className="ml-auto hidden flex-1 md:block md:max-w-md">
            <LiveSearch />
          </div>

          {/* Right Action Icons */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearch((v) => !v)}
              className={cn(
                "rounded-xl p-2.5 hover:bg-slate-100 md:hidden",
                mobileSearch && "bg-slate-100 text-volt-700",
              )}
              aria-label="Toggle mobile search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative rounded-xl p-2.5 text-slate-700 hover:bg-slate-100"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Track order */}
            <Link
              href="/track"
              className="hidden rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 sm:block"
              aria-label="Track order"
              title="Track order"
            >
              <PackageSearch className="h-5 w-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              id="cart-button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-white transition hover:bg-ink-800 active:scale-95 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:py-2 sm:pl-3 sm:pr-4"
              aria-label="Open cart"
            >
              <ShoppingBag className={cn("h-5 w-5", bump && "animate-cart-bump text-volt-400")} />
              <span className="hidden text-sm font-semibold tabular-nums sm:inline">{count}</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-volt-400 px-1 text-[10px] font-bold text-ink-950 sm:hidden">
                  {count > 99 ? "99+" : count}
                </span>
              )}
              {bump && (
                <span className="absolute inset-0 rounded-xl border-2 border-volt-400 animate-pulse-ring sm:rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row (Collapsible) */}
        <div
          className={cn(
            "overflow-hidden border-t border-slate-100 px-4 transition-all duration-300 md:hidden bg-white",
            scrolled && !mobileSearch ? "max-h-0 border-transparent py-0" : "max-h-16 py-2",
          )}
        >
          <LiveSearch onSelect={() => setMobileSearch(false)} autoFocus={mobileSearch} inputClassName="h-10" />
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl animate-fade-in"
            role="dialog"
            aria-label="Main menu"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="font-display text-lg font-bold">Glowing Space BD</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <span>All Products</span>
              </Link>
              <Link
                href="/pack-builder"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl bg-cyan-50/70 px-3 py-3 text-sm font-semibold text-volt-800 hover:bg-cyan-100"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-volt-600" /> Custom Pack Builder
                </span>
                <span className="rounded-full bg-volt-400 px-2 py-0.5 text-[10px] font-bold text-ink-950">
                  Tool
                </span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" /> Saved Wishlist
                </span>
                {wishCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link
                href="/track"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <PackageSearch className="h-4 w-4 text-slate-600" /> Track Order
                </span>
              </Link>

              <p className="mt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Product Categories
              </p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image src={c.image} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500 truncate">{c.tagline}</p>
                  </div>
                </Link>
              ))}

              <div className="mt-6 border-t border-slate-100 pt-4 px-3 space-y-2 text-xs text-slate-600">
                <a
                  href="tel:01700000000"
                  className="flex items-center gap-2 font-semibold text-slate-900"
                >
                  <Phone className="h-4 w-4 text-volt-600" /> 01700-000000 (10am–9pm)
                </a>
                <p>Shop 312, Level 3, Multiplan Center, Dhaka</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900",
        active ? "text-slate-900 font-semibold" : "text-slate-700",
      )}
    >
      {children}
    </Link>
  );
}
