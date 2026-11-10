"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, Package, Check } from "lucide-react";

export function ProductTabs({ description, specs, highlights }: { description: string; specs: Record<string, string>; highlights: string[] }) {
  const tabs = ["Overview", "Specifications", "Shipping & Warranty"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  return (
    <div className="rounded-3xl border border-slate-200">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-200 px-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative shrink-0 px-4 py-4 text-sm font-semibold transition", tab === t ? "text-slate-900" : "text-slate-500 hover:text-slate-800")}>
            {t}
            {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ink-950" />}
          </button>
        ))}
      </div>
      <div className="p-6 sm:p-8 animate-fade-in" key={tab}>
        {tab === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="prose prose-slate max-w-none lg:col-span-2">
              <p className="text-[15px] leading-7 text-slate-700">{description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h4 className="text-sm font-semibold">Why builders choose it</h4>
              <ul className="mt-3 space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{h}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {tab === "Specifications" && (
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {Object.entries(specs).map(([k, v], i) => (
              <div key={k} className={cn("flex justify-between gap-4 border-b border-slate-100 py-3 text-sm", i < 2 && "sm:border-t")}>
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {tab === "Shipping & Warranty" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 font-semibold"><Package className="h-5 w-5 text-volt-600" /> Delivery</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Inside Dhaka: ৳70, 1–2 working days (free over ৳5,000)</li>
                <li>• Outside Dhaka: ৳130, 2–4 working days via Steadfast / Sundarban</li>
                <li>• Store pickup: Multiplan Center, Elephant Road — same day</li>
                <li>• Cells ship in hard plastic cases with insulated terminals</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-5 w-5 text-amber-500" /> Warranty & safety</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• DOA items replaced free within 7 days</li>
                <li>• Branded cells: capacity guarantee (≥ 95% of rated)</li>
                <li>• Built packs & UPS: 1–3 year local service warranty</li>
                <li>• Lithium cells require a BMS. Never short terminals. Keep away from children.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
