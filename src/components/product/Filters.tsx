"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Check, RotateCcw, ChevronDown } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { cn, formatBDT } from "@/lib/utils";

const SORTS = [
  { v: "popular", l: "Most popular" },
  { v: "newest", l: "Newest" },
  { v: "price-asc", l: "Price: Low to high" },
  { v: "price-desc", l: "Price: High to low" },
  { v: "rating", l: "Top rated" },
];

function useParamUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const update = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(sp.toString());
      mutate(p);
      start(() => router.push(`${pathname}?${p.toString()}`, { scroll: false }));
    },
    [router, pathname, sp],
  );

  return { sp, update, pending };
}

export function SortSelect() {
  const { sp, update } = useParamUpdater();
  const v = sp.get("sort") ?? "popular";

  return (
    <label className="relative flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-3 pr-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 sm:text-sm">
      <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      <select
        value={v}
        onChange={(e) =>
          update((p) => (e.target.value === "popular" ? p.delete("sort") : p.set("sort", e.target.value)))
        }
        className="max-w-[130px] cursor-pointer appearance-none bg-transparent pr-5 font-semibold text-slate-900 outline-none sm:max-w-none"
      >
        {SORTS.map((s) => (
          <option key={s.v} value={s.v}>
            {s.l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
    </label>
  );
}

export function MobileFilterButton() {
  const sp = useSearchParams();
  const activeCount = [
    sp.get("category"),
    sp.getAll("brand").length,
    sp.get("min") || sp.get("max"),
    sp.get("stock"),
    sp.get("rating"),
  ].filter(Boolean).length;

  return (
    <button
      onClick={() => document.dispatchEvent(new CustomEvent("open-filters"))}
      className="relative flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 lg:hidden active:scale-95 sm:text-sm"
    >
      <SlidersHorizontal className="h-4 w-4 text-slate-500" />
      <span>Filters</span>
      {activeCount > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-950 text-[10px] font-bold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}

export function ActiveChips() {
  const { sp, update } = useParamUpdater();
  const chips: { k: string; v: string; label: string }[] = [];

  sp.getAll("brand").forEach((b) => chips.push({ k: "brand", v: b, label: b }));
  if (sp.get("min") || sp.get("max")) {
    chips.push({
      k: "price",
      v: "",
      label: `${formatBDT(Number(sp.get("min") || 0))} – ${
        sp.get("max") ? formatBDT(Number(sp.get("max"))) : "40k+"
      }`,
    });
  }
  if (sp.get("stock")) chips.push({ k: "stock", v: "", label: "In stock" });
  if (sp.get("rating")) chips.push({ k: "rating", v: "", label: `${sp.get("rating")}★ & up` });
  if (sp.get("q")) chips.push({ k: "q", v: "", label: `"${sp.get("q")}"` });

  if (!chips.length) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((c, i) => (
        <button
          key={i}
          onClick={() =>
            update((p) => {
              if (c.k === "brand") {
                const rest = p.getAll("brand").filter((x) => x !== c.v);
                p.delete("brand");
                rest.forEach((x) => p.append("brand", x));
              } else if (c.k === "price") {
                p.delete("min");
                p.delete("max");
              } else p.delete(c.k);
            })
          }
          className="flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-950 transition hover:bg-cyan-100"
        >
          <span>{c.label}</span>
          <X className="h-3 w-3 text-cyan-700" />
        </button>
      ))}

      <button
        onClick={() =>
          update((p) => {
            const cat = p.get("category");
            const sort = p.get("sort");
            [...p.keys()].forEach((k) => p.delete(k));
            if (cat) p.set("category", cat);
            if (sort) p.set("sort", sort);
          })
        }
        className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <RotateCcw className="h-3 w-3" /> Reset all
      </button>
    </div>
  );
}

export function Filters({
  brands,
  categories,
}: {
  brands: { brand: string; count: number }[];
  categories: { slug: string; name: string }[];
}) {
  const { sp, update, pending } = useParamUpdater();
  const [open, setOpen] = useState(false);
  const [max, setMax] = useState<number>(Number(sp.get("max") || 40000));
  const selectedBrands = sp.getAll("brand");

  useEffect(() => {
    const h = () => setOpen(true);
    document.addEventListener("open-filters", h);
    return () => document.removeEventListener("open-filters", h);
  }, []);

  useEffect(() => setMax(Number(sp.get("max") || 40000)), [sp]);

  const content = (
    <div className={cn("space-y-6 pb-6", pending && "opacity-60")}>
      {/* Category */}
      <Group title="Category">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => update((p) => p.delete("category"))}
              className={cn(
                "w-full rounded-xl px-2.5 py-1.5 text-left text-xs sm:text-sm transition",
                !sp.get("category")
                  ? "bg-ink-950 font-semibold text-white"
                  : "text-slate-700 hover:bg-slate-100",
              )}
            >
              All products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => update((p) => p.set("category", c.slug))}
                className={cn(
                  "w-full rounded-xl px-2.5 py-1.5 text-left text-xs sm:text-sm transition",
                  sp.get("category") === c.slug
                    ? "bg-ink-950 font-semibold text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </Group>

      {/* Price */}
      <Group title="Price Range (BDT)">
        <input
          type="range"
          min={0}
          max={40000}
          step={200}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          onMouseUp={() =>
            update((p) => (max >= 40000 ? p.delete("max") : p.set("max", String(max))))
          }
          onTouchEnd={() =>
            update((p) => (max >= 40000 ? p.delete("max") : p.set("max", String(max))))
          }
          className="w-full"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>৳0</span>
          <span className="font-semibold text-slate-900">
            up to {max >= 40000 ? "৳40,000+" : formatBDT(max)}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {[
            [0, 500],
            [500, 2000],
            [2000, 10000],
            [10000, 0],
          ].map(([a, b]) => (
            <button
              key={a}
              onClick={() =>
                update((p) => {
                  p.set("min", String(a));
                  b ? p.set("max", String(b)) : p.delete("max");
                })
              }
              className={cn(
                "rounded-lg border px-2 py-1.5 text-[11px] font-medium transition hover:border-slate-900",
                Number(sp.get("min") || -1) === a
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-slate-200 bg-white text-slate-700",
              )}
            >
              {b ? `${formatBDT(a)} – ${formatBDT(b)}` : `${formatBDT(a)}+`}
            </button>
          ))}
        </div>
      </Group>

      {/* Brand */}
      <Group title="Brand">
        <ul className="max-h-48 space-y-1 overflow-y-auto pr-1 thin-scroll">
          {brands.map((b) => {
            const checked = selectedBrands.includes(b.brand);
            return (
              <li key={b.brand}>
                <button
                  onClick={() =>
                    update((p) => {
                      const cur = p.getAll("brand");
                      p.delete("brand");
                      (checked
                        ? cur.filter((x) => x !== b.brand)
                        : [...cur, b.brand]
                      ).forEach((x) => p.append("brand", x));
                    })
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs sm:text-sm hover:bg-slate-50"
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded border transition",
                      checked
                        ? "border-ink-950 bg-ink-950 text-white"
                        : "border-slate-300 bg-white",
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className="flex-1 truncate text-slate-800">{b.brand}</span>
                  <span className="text-[11px] text-slate-400">{b.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      {/* Rating */}
      <Group title="Customer Rating">
        <ul className="space-y-1">
          {[4.5, 4, 3].map((r) => (
            <li key={r}>
              <button
                onClick={() =>
                  update((p) =>
                    p.get("rating") === String(r) ? p.delete("rating") : p.set("rating", String(r)),
                  )
                }
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs sm:text-sm hover:bg-slate-50",
                  sp.get("rating") === String(r) && "bg-slate-100 font-semibold",
                )}
              >
                <Stars value={r} size={13} />
                <span>{r}★ &amp; up</span>
              </button>
            </li>
          ))}
        </ul>
      </Group>

      {/* Stock */}
      <Group title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs sm:text-sm">
          <input
            type="checkbox"
            checked={sp.get("stock") === "1"}
            onChange={(e) => update((p) => (e.target.checked ? p.set("stock", "1") : p.delete("stock")))}
            className="h-4 w-4 accent-ink-950 rounded"
          />
          <span className="font-medium text-slate-800">In stock only</span>
        </label>
      </Group>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-24 hidden self-start lg:block rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="h-4 w-4 text-volt-600" /> Filter Catalog
          </span>
        </div>
        {content}
      </aside>

      {/* Mobile Bottom Sheet Drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl animate-fade-up">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable filters body */}
            <div className="thin-scroll flex-1 overflow-y-auto px-5 pt-4">{content}</div>

            {/* Sticky Sheet Footer */}
            <div className="border-t border-slate-100 bg-white p-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    update((p) => {
                      const cat = p.get("category");
                      [...p.keys()].forEach((k) => p.delete(k));
                      if (cat) p.set("category", cat);
                    });
                  }}
                  className="flex h-12 flex-1 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-white shadow"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h4>
      {children}
    </div>
  );
}
