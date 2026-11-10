"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";

const RECENT_ACTIVITIES = [
  {
    location: "Mirpur-10, Dhaka",
    product: "Samsung INR18650-30Q 3000mAh Cell",
    slug: "samsung-inr18650-30q-3000mah",
    qty: "24 pcs",
    time: "3m ago",
    image: "/images/18650.jpg",
  },
  {
    location: "Agrabad, Chattogram",
    product: "JBD Smart BMS 4S 12V 100A LiFePO4",
    slug: "jbd-smart-bms-4s-100a",
    qty: "1 pc",
    time: "8m ago",
    image: "/images/bms.jpg",
  },
  {
    location: "Zindabazar, Sylhet",
    product: "Mini DC UPS 10400mAh for WiFi Router",
    slug: "mini-dc-ups-router-10400mah",
    qty: "2 pcs",
    time: "14m ago",
    image: "/images/ups.jpg",
  },
  {
    location: "Shaheb Bazar, Rajshahi",
    product: "EVE LF105 3.2V 105Ah LiFePO4 Cell",
    slug: "eve-lf105-lifepo4-105ah",
    qty: "4 pcs",
    time: "21m ago",
    image: "/images/lifepo4.jpg",
  },
  {
    location: "Elephant Road, Dhaka",
    product: "Portable Battery Spot Welder 12 kW",
    slug: "portable-spot-welder-sunkko-style",
    qty: "1 pc",
    time: "34m ago",
    image: "/images/welder.jpg",
  },
];

export function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % RECENT_ACTIVITIES.length);
        setVisible(true);
      }, 800);
    }, 12000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const item = RECENT_ACTIVITIES[index];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto fixed bottom-20 left-4 z-30 hidden max-w-xs animate-fade-up rounded-2xl border border-slate-200/90 bg-white/95 p-2.5 pr-3 shadow-lift backdrop-blur-md transition-all sm:bottom-6 sm:left-6 sm:block"
    >
      <div className="flex items-center gap-3">
        <Link
          href={`/products/${item.slug}`}
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
        >
          <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10.5px] text-slate-500">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
            <span className="truncate">Someone in {item.location}</span>
          </p>
          <Link
            href={`/products/${item.slug}`}
            className="block truncate text-xs font-semibold text-slate-900 hover:text-volt-700"
          >
            {item.product}
          </Link>
          <p className="text-[10px] text-slate-400">
            Ordered {item.qty} · {item.time}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-slate-300 hover:text-slate-600"
          aria-label="Dismiss recent activity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
