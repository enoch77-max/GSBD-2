import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, SearchX } from "lucide-react";
import { getBrands, getCategories, queryProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { Filters, SortSelect, MobileFilterButton, ActiveChips } from "@/components/product/Filters";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" ? sp.category : undefined;
  if (cat) {
    const cats = await getCategories();
    const c = cats.find((x) => x.slug === cat);
    if (c) return { title: c.name, description: c.tagline };
  }
  return { title: "All Products" };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const brands = typeof sp.brand === "string" ? [sp.brand] : Array.isArray(sp.brand) ? sp.brand : [];
  const query = {
    category: s("category"),
    q: s("q"),
    sort: s("sort") ?? "popular",
    min: s("min") ? Number(s("min")) : undefined,
    max: s("max") ? Number(s("max")) : undefined,
    brand: brands,
    inStock: s("stock") === "1",
    rating: s("rating") ? Number(s("rating")) : undefined,
  };
  const [items, cats, brandRows] = await Promise.all([queryProducts(query), getCategories(), getBrands()]);
  const current = cats.find((c) => c.slug === query.category);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      {/* Breadcrumb + heading */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className={current ? "hover:text-slate-900" : "text-slate-900"}>Products</Link>
        {current && (<><ChevronRight className="h-3 w-3" /><span className="text-slate-900">{current.name}</span></>)}
      </nav>

      {current && (
        <div className="relative mt-4 overflow-hidden rounded-3xl bg-ink-950 text-white">
          <Image src={current.image} alt="" fill sizes="100vw" className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
          <div className="relative flex min-h-[180px] flex-col justify-end p-6 sm:min-h-[220px] sm:p-10">
            <span className="mb-2 block h-1 w-12 rounded-full" style={{ background: current.accent }} />
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{current.name}</h1>
            <p className="mt-2 max-w-md text-sm text-slate-300 sm:text-base">{current.tagline} · {items.length} products, tested before dispatch.</p>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {!current && (
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {query.q ? <>Results for &ldquo;{query.q}&rdquo;</> : "All products"}
            </h1>
          )}
          <p className="mt-1 text-sm text-slate-500">{current ? "Showing" : "Genuine cells, boards and tools — tested before dispatch. ·"} <b className="text-slate-700">{items.length}</b> items</p>
        </div>
        <div className="flex items-center gap-2">
          <Suspense><MobileFilterButton /></Suspense>
          <Suspense><SortSelect /></Suspense>
        </div>
      </div>

      {/* Category pills */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <Pill href="/products" active={!query.category}>All</Pill>
        {cats.map((c) => (
          <Pill key={c.slug} href={`/products?category=${c.slug}`} active={query.category === c.slug}>{c.name}</Pill>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <Suspense>
          <Filters brands={brandRows} categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
        </Suspense>

        <div>
          <Suspense><ActiveChips /></Suspense>
          {items.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 py-20 text-center">
              <SearchX className="h-10 w-10 text-slate-300" />
              <h3 className="font-display mt-4 text-lg font-bold">No products match</h3>
              <p className="mt-1 text-sm text-slate-500">Try clearing a filter or searching for something else.</p>
              <Link href="/products" className="mt-5 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white">Clear all filters</Link>
            </div>
          ) : (
            <div className="stagger grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {items.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 6} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "shrink-0 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white"
          : "shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900"
      }
    >
      {children}
    </Link>
  );
}
