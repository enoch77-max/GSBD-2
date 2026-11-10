import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Flame,
  Store,
  MessageCircle,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { getProductBySlug, getProductReviews, getRelatedProducts, getCategoryMap } from "@/lib/data";
import { formatBDT, discountPct, formatCompact } from "@/lib/utils";
import { Stars } from "@/components/ui/Stars";
import { Gallery } from "@/components/product/Gallery";
import { AddToCartPanel } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { Reviews } from "@/components/product/Reviews";
import { ProductTabs } from "@/components/product/ProductTabs";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { WishButton } from "@/components/product/WishButton";
import { ShareButton } from "@/components/product/ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.shortDescription,
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related, catMap] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.categoryId, product.id),
    getCategoryMap(),
  ]);

  const cat = catMap.get(product.categoryId);
  const pct = discountPct(product.price, product.compareAtPrice);
  const low = product.stock > 0 && product.stock <= 20;

  const whatsappInquiryUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(
    `Hello Glowing Space BD! I have a question about "${product.name}" (Price: ৳${product.price}). Is it in stock and can you provide matched cells?`,
  )}`;

  // Bulk discount pricing tiers calculation for cells/packs
  const bulkTiers = [
    { qty: "1–9 pcs", price: product.price, discount: "Regular" },
    { qty: "10–29 pcs", price: Math.round(product.price * 0.95), discount: "5% OFF" },
    { qty: "30+ pcs", price: Math.round(product.price * 0.90), discount: "10% OFF" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:pb-16">
      <StickyBuyBar product={product} />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-slate-900">
          Products
        </Link>
        {cat && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category=${cat.slug}`} className="hover:text-slate-900">
              {cat.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[200px] text-slate-900 sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <Gallery
            images={product.images}
            name={product.name}
            badge={pct > 0 ? `-${pct}%` : product.isNew ? "New" : undefined}
          />
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-5">
          <div className="animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={`/products?brand=${encodeURIComponent(product.brand)}`}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-volt-600 hover:underline"
                >
                  {product.brand}
                </Link>
                {product.tags.includes("best-seller") && (
                  <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                    <Flame className="h-3 w-3" /> Best seller
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ShareButton title={product.name} />
                <WishButton id={product.id} name={product.name} className="border border-slate-200" />
              </div>
            </div>

            <h1 className="font-display mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-slate-900">
              {product.name}
            </h1>

            {/* Ratings, Sold count, SKU */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <a href="#reviews" className="flex items-center gap-1.5 hover:underline">
                <Stars value={product.rating} size={15} />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-slate-500">({product.reviewCount} reviews)</span>
              </a>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{formatCompact(product.soldCount)} sold</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">SKU GS-{String(product.id).padStart(4, "0")}</span>
            </div>

            <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">
              {product.shortDescription}
            </p>

            {/* Price Box */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-4xl">
                  {formatBDT(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through tabular-nums sm:text-lg">
                      {formatBDT(product.compareAtPrice)}
                    </span>
                    <span className="rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                      Save {formatBDT(product.compareAtPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Inclusive of VAT · 100% genuine guaranteed
              </p>

              {product.slug === "custom-battery-pack-builder" && (
                <div className="mb-4 rounded-2xl bg-gradient-to-r from-volt-500/10 via-cyan-500/10 to-transparent border border-volt-400/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-volt-800">
                    <Sparkles className="h-4 w-4 text-volt-600" /> Interactive Pack Calculator Available
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Calculate your exact series/parallel voltage, capacity, weight and cost in real-time.
                  </p>
                  <Link
                    href="/pack-builder"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-ink-800"
                  >
                    Open Interactive Pack Builder →
                  </Link>
                </div>
              )}

              {/* Stock status */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                {product.stock > 0 ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="font-medium text-emerald-700">In stock</span>
                    {low ? (
                      <span className="text-amber-600">
                        · Only {product.stock} left — order soon
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        · {product.stock > 500 ? "500+" : product.stock} units ready
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="font-medium text-rose-700">Out of stock</span>
                  </>
                )}
              </div>

              {/* Add to Cart Panel */}
              <div className="mt-5">
                <AddToCartPanel product={product} />
              </div>
            </div>

            {/* Wholesale Bulk Tier Table */}
            {product.price >= 80 && product.price <= 5000 && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
                  <Layers className="h-3.5 w-3.5 text-volt-600" /> Volume Discount for Builders &amp; Resellers
                </p>
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs">
                  {bulkTiers.map((t) => (
                    <div key={t.qty} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2">
                      <p className="text-[11px] text-slate-500">{t.qty}</p>
                      <p className="font-display font-bold text-slate-900 mt-0.5">{formatBDT(t.price)}</p>
                      <span className="inline-block mt-0.5 rounded bg-emerald-100 px-1 py-0.2 text-[10px] font-bold text-emerald-800">
                        {t.discount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights bullet points */}
            <ul className="mt-5 grid grid-cols-1 gap-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-50 text-volt-600">
                    <Check className="h-3 w-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {/* Trust feature cards */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { i: Truck, t: "Dhaka 1–2 days", d: "2–4 days outside" },
                { i: ShieldCheck, t: "Tested & genuine", d: "IR marked on cell" },
                { i: RotateCcw, t: "7-day returns", d: "Free DOA swap" },
              ].map((x) => (
                <div key={x.t} className="rounded-xl border border-slate-200 p-2.5 text-center sm:p-3">
                  <x.i className="mx-auto h-4.5 w-4.5 text-volt-600 sm:h-5 sm:w-5" />
                  <p className="mt-1.5 text-[10.5px] font-semibold leading-tight text-slate-900 sm:text-xs">{x.t}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-slate-500 sm:text-[11px]">{x.d}</p>
                </div>
              ))}
            </div>

            {/* Elephant road pickup & WhatsApp inquiry */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-ink-950 p-3.5 text-white">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Store className="h-4 w-4 text-volt-400 shrink-0" />
                <span>Pickup available today at Multiplan Center, Elephant Road</span>
              </div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <ProductTabs
          description={product.description}
          specs={product.specs}
          highlights={product.highlights}
        />
      </div>

      {/* Customer Reviews Section */}
      <div id="reviews" className="mt-14 scroll-mt-28">
        <Reviews
          productId={product.id}
          rating={product.rating}
          count={product.reviewCount}
          reviews={reviews.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt-600">
                Complete your build
              </p>
              <h2 className="font-display mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                You may also need
              </h2>
            </div>
            {cat && (
              <Link
                href={`/products?category=${cat.slug}`}
                className="text-sm font-semibold text-slate-700 hover:text-volt-700"
              >
                More in {cat.name} →
              </Link>
            )}
          </div>
          <div className="stagger mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
