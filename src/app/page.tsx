import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Wrench,
  Zap,
  Battery,
  Cpu,
  Sparkles,
  Quote,
  Calculator,
} from "lucide-react";
import { getCategories, getFeaturedProducts, getBestSellers, getNewArrivals } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import { formatBDT } from "@/lib/utils";

export const dynamic = "force-dynamic";

const BRANDS = [
  "Samsung SDI",
  "LG Chem",
  "Molicel",
  "EVE Energy",
  "JBD",
  "Daly",
  "Espressif",
  "Texas Instruments",
  "KSGER",
  "Lishen",
];

export default async function HomePage() {
  const [cats, featured, best, fresh] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getBestSellers(8),
    getNewArrivals(4),
  ]);
  const hero = featured[0];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-white">
        <Image
          src="/images/hero.jpg"
          alt="Glowing Space BD electronics workbench"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-12 lg:pb-10 sm:pb-12 lg:pt-12">
          <div className="lg:col-span-7">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-volt-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-volt-400" /> 40,000+ makers trust us
            </p>

            <h1
              className="font-display mt-4 animate-fade-up text-[26px] font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
              style={{ animationDelay: "0.08s" }}
            >
              <span className="text-gradient">Genuine cells</span>, honest testing.
            </h1>

            <p
              className="mt-4 max-w-xl animate-fade-up text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-relaxed"
              style={{ animationDelay: "0.16s" }}
            >
              18650/21700 cells, LiFePO4, BMS, router UPS, ESP32 &amp; tools — capacity-tested, shipped nationwide.
            </p>

            {/* Hero CTAs */}
            <div
              className="mt-6 flex animate-fade-up flex-wrap gap-3"
              style={{ animationDelay: "0.24s" }}
            >
              <Link
                href="/products"
                className="group flex h-12 items-center gap-2 rounded-full bg-volt-400 px-6 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-volt-300"
              >
                Shop all products{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/pack-builder"
                className="flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Calculator className="h-4 w-4 text-volt-400" /> Pack Builder
              </Link>
            </div>

            {/* Trust numbers */}
            <dl
              className="mt-6 grid max-w-lg animate-fade-up grid-cols-3 gap-4 border-t border-white/10 pt-4"
              style={{ animationDelay: "0.32s" }}
            >
              {[
                ["100%", "Cells tested"],
                ["24h", "Dhaka delivery"],
                ["4.9★", "4,200+ reviews"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-xl font-bold text-white sm:text-2xl">{v}</dt>
                  <dd className="text-[11px] text-slate-400 sm:text-xs">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero right card (Desktop) */}
          {hero && (
            <div className="hidden lg:col-span-5 lg:block">
              <Link
                href={`/products/${hero.slug}`}
                className="group relative ml-auto block w-[380px] animate-fade-up rounded-3xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl transition hover:border-volt-400/40 hover:shadow-glow"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="absolute -right-3 -top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg">
                  Top Seller
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
                  <Image
                    src={hero.images[0]}
                    alt={hero.name}
                    fill
                    sizes="380px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-volt-300">
                    {hero.brand}
                  </p>
                  <p className="mt-1 font-semibold leading-snug text-white line-clamp-1">{hero.name}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Stars value={hero.rating} size={12} />
                      <span className="text-xs text-slate-300">
                        {hero.rating.toFixed(1)} ({hero.reviewCount})
                      </span>
                    </div>
                    <p className="font-display text-xl font-bold text-white">{formatBDT(hero.price)}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Brand marquee */}
      <section className="overflow-hidden border-b border-white/10 bg-ink-900 py-3.5">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>{b}</span>
              <span className="h-1 w-1 rounded-full bg-volt-400" />
            </span>
          ))}
        </div>
      </section>


      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6">
        <Reveal>
          <SectionHeading title="Shop by category" href="/products" />
        </Reveal>
        <div className="stagger mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width:1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                <span
                  className="mb-1 block h-1 w-8 rounded-full transition-all group-hover:w-14"
                  style={{ background: c.accent }}
                />
                <p className="font-display text-sm font-bold text-white sm:text-lg">{c.name}</p>
                <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1">{c.tagline}</p>
              </div>
              <span className="absolute right-3 top-3 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-white/90 text-slate-900 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50/70 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading title="Featured this week" href="/products?sort=popular" />
          </Reveal>
          <div className="stagger mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* Bento Promo Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Bento 1: LiFePO4 IPS Replacement */}
          <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 p-5 text-white sm:p-6 lg:col-span-2 lg:p-8">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-volt-500/30 blur-3xl" />
            <div className="relative max-w-lg">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-volt-300">
                <Battery className="h-3.5 w-3.5" /> Load-shedding ready
              </p>
              <h3 className="font-display mt-3 text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
                LiFePO4 IPS battery — lasts 10 years.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Grade-A EVE cells + Bluetooth BMS, built in Dhaka. Runs 3 fans + lights for 8 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products/lifepo4-12v-100ah-ips-pack"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs sm:text-sm font-semibold text-ink-950 transition hover:bg-volt-300"
                >
                  View IPS pack <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pack-builder"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <Calculator className="h-4 w-4 text-volt-400" /> Pack calculator
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-10 right-6 hidden h-64 w-64 animate-float lg:block">
              <Image
                src="/images/lifepo4.jpg"
                alt=""
                fill
                className="rounded-2xl object-cover shadow-2xl"
                sizes="256px"
              />
            </div>
          </Reveal>

          {/* Bento 2: Mini DC UPS */}
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-300 via-amber-200 to-orange-200 p-6 text-amber-950 sm:p-8">
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-950/10 px-3 py-1 text-xs font-semibold">
                <Zap className="h-3.5 w-3.5" /> WiFi never drops
              </p>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold leading-tight">
                Mini DC UPS for router &amp; ONU
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                4–8 hrs backup · from ৳2,890.
              </p>
              <Link
                href="/products/mini-dc-ups-router-10400mah"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-amber-950 px-5 text-xs font-semibold text-white transition hover:bg-black"
              >
                View UPS <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image src="/images/ups.jpg" alt="" fill className="object-cover" sizes="400px" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:pb-12 sm:px-6">
        <Reveal>
          <SectionHeading title="Best sellers" href="/products?sort=popular" />
        </Reveal>
        <div className="stagger mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {best.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* For whom: Makers, Technicians, Resellers */}
      <section className="border-y border-slate-100 bg-slate-50/70 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading title="Built for you" />
          </Reveal>
          <div className="stagger mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                i: Cpu,
                t: "DIY makers & students",
                d: "ESP32, Arduino, sensors &amp; cells for projects and theses.",
                href: "/products?category=dev-boards",
              },
              {
                i: Wrench,
                t: "Repair technicians",
                d: "T12 stations, cells, BMS &amp; consumables for repairs.",
                href: "/products?category=tools",
              },
              {
                i: Battery,
                t: "Pack builders & resellers",
                d: "Bulk cells, nickel, welders &amp; wholesale pricing.",
                href: "/pack-builder",
              },
            ].map((x) => (
              <Link
                key={x.t}
                href={x.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-950 text-volt-400 transition group-hover:scale-105">
                  <x.i className="h-6 w-6" />
                </span>
                <h4 className="font-display mt-4 text-base sm:text-lg font-bold">{x.t}</h4>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{x.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-volt-700">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals & Builder Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionHeading title="New arrivals" href="/products?sort=newest" />
            </Reveal>
            <div className="stagger mt-8 grid grid-cols-2 gap-3 sm:gap-5">
              {fresh.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Reveal>
              <SectionHeading title="What builders say" />
            </Reveal>
            <div className="stagger mt-8 space-y-4">
              {[
                {
                  n: "Tanvir Ahmed",
                  l: "Mirpur, Dhaka",
                  t: "Tested 10 cells — all 2980–3020mAh. The only shop I trust for cells.",
                },
                {
                  n: "Farhana Haque",
                  l: "Gulshan, Dhaka",
                  t: "No WiFi drops during load shedding. Router + ONU run 7 hours.",
                },
                {
                  n: "Monir Hossain",
                  l: "Elephant Road",
                  t: "Builds packs for resale. Welder paid for itself in a week.",
                },
              ].map((r) => (
                <div key={r.n} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <Quote className="absolute right-4 top-4 h-6 w-6 text-slate-100" />
                  <Stars value={5} size={13} />
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">&ldquo;{r.t}&rdquo;</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-volt-400 to-cyan-700 text-xs font-bold text-white">
                      {r.n[0]}
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{r.n}</p>
                      <p className="text-[11px] text-slate-400">{r.l} · Verified buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700 hover:text-volt-700 sm:flex"
        >
          View all <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
