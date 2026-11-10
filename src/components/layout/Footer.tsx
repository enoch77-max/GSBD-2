"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, MapPin, Phone, Mail, Globe, PlayCircle, MessageCircle, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export function Footer({ categories }: { categories: { slug: string; name: string }[] }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Please enter a valid email", type: "error" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      toast({
        title: "Subscribed successfully!",
        description: "You'll get restock alerts and builder tutorials.",
      });
    }, 600);
  };

  return (
    <footer className="relative mt-20 overflow-hidden bg-ink-950 text-slate-300">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full bg-volt-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        {/* Newsletter Box */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Get restock alerts &amp; builder tips</h3>
            <p className="mt-1 text-sm text-slate-400">
              New cells, price drops and pack-building tutorials. No spam, once a week.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-400">
              <Check className="h-4 w-4" /> You&apos;re subscribed to Glowing Space updates!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-volt-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 items-center justify-center rounded-xl bg-volt-400 px-5 text-sm font-semibold text-ink-950 transition hover:bg-volt-300 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </button>
            </form>
          )}
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: About & Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-volt-400">
                <Zap className="h-5 w-5 fill-current" />
              </span>
              <span className="leading-none">
                <span className="font-display block text-lg font-bold text-white">Glowing Space</span>
                <span className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-volt-400">
                  Bangladesh
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Genuine cells, honest testing and local support for Bangladesh&apos;s makers, repair shops and
              battery pack builders. Since 2019, over 40,000 orders shipped across all 64 districts.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-volt-400 shrink-0" /> Shop 312, Level 3, Multiplan Center, Elephant Road, Dhaka 1205
              </p>
              <a href="tel:01700000000" className="flex items-center gap-2 hover:text-white transition">
                <Phone className="h-4 w-4 text-volt-400 shrink-0" /> 01700-000000 · 10am–9pm (Sat–Thu)
              </a>
              <a href="mailto:hello@glowingspacebd.com" className="flex items-center gap-2 hover:text-white transition">
                <Mail className="h-4 w-4 text-volt-400 shrink-0" /> hello@glowingspacebd.com
              </a>
            </div>

            <div className="mt-5 flex gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-volt-400 hover:text-volt-400"
                aria-label="Facebook Page"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-volt-400 hover:text-volt-400"
                aria-label="YouTube Channel"
              >
                <PlayCircle className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-volt-400 hover:text-volt-400"
                aria-label="WhatsApp Support"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop categories */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className="transition hover:text-volt-400">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/pack-builder" className="text-volt-300 font-semibold hover:text-volt-400">
                  Custom Pack Builder ★
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Help & Guides */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help &amp; Guides</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/track" className="hover:text-volt-400">
                  Track your order
                </Link>
              </li>
              <li>
                <Link href="/pack-builder" className="hover:text-volt-400">
                  Custom pack service
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-volt-400">
                  Shipping &amp; delivery
                </Link>
              </li>
              <li>
                <Link href="/help/warranty" className="hover:text-volt-400">
                  Warranty &amp; returns
                </Link>
              </li>
              <li>
                <Link href="/help/battery-safety" className="hover:text-volt-400">
                  Battery safety guide
                </Link>
              </li>
              <li>
                <Link href="/help/wholesale" className="hover:text-volt-400">
                  Wholesale / reseller
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Delivery */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">We accept</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { n: "bKash", c: "bg-[#e2136e]" },
                { n: "Nagad", c: "bg-[#f6921e]" },
                { n: "Rocket", c: "bg-[#8c3494]" },
                { n: "COD", c: "bg-emerald-600" },
                { n: "VISA", c: "bg-[#1a1f71]" },
                { n: "Mastercard", c: "bg-[#eb001b]" },
              ].map((p) => (
                <span
                  key={p.n}
                  className={`${p.c} rounded-lg px-2 py-1.5 text-center text-[11px] font-bold text-white`}
                >
                  {p.n}
                </span>
              ))}
            </div>

            <h4 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-white">
              Delivery partners
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pathao Express · Steadfast Courier · RedX Logistics · Sundarban Courier Service
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Glowing Space BD. All rights reserved. Trade License: TRAD/DSCC/012345/2019</p>
          <p>Prices in BDT, inclusive of VAT.</p>
        </div>
      </div>
    </footer>
  );
}
