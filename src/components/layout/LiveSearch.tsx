"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { formatBDT, cn } from "@/lib/utils";

type SearchResult = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  rating: number;
  tags: string[];
};

const POPULAR_TAGS = [
  "18650",
  "LiFePO4",
  "JBD BMS",
  "WiFi UPS",
  "ESP32",
  "Spot Welder",
  "TP4056",
];

export function LiveSearch({
  className,
  inputClassName,
  placeholder = "Search 18650, BMS, ESP32, router UPS…",
  onSelect,
  autoFocus = false,
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onSelect?: () => void;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [q]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    onSelect?.();
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-volt-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10",
            inputClassName,
          )}
        />
        {loading ? (
          <Loader2 className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        ) : q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </form>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift animate-fade-in">
          {q.trim().length >= 2 ? (
            results.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Products ({results.length})
                </p>
                <div className="space-y-1">
                  {results.map((r) => (
                    <Link
                      key={r.id}
                      href={`/products/${r.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onSelect?.();
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={r.image} alt={r.name} fill sizes="44px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-900">{r.name}</p>
                        <p className="text-[11px] text-slate-500">{r.brand}</p>
                      </div>
                      <span className="shrink-0 font-display text-xs font-bold tabular-nums text-slate-900">
                        {formatBDT(r.price)}
                      </span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  See all results for &ldquo;{q}&rdquo; <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : !loading ? (
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-slate-700">No products found for &ldquo;{q}&rdquo;</p>
                <p className="mt-1 text-xs text-slate-400">Try searching for 18650, BMS, IPS, or router</p>
              </div>
            ) : null
          ) : (
            <div className="p-4">
              <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3 w-3 text-volt-500" /> Popular searches
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setQ(t);
                      router.push(`/products?q=${encodeURIComponent(t)}`);
                      setOpen(false);
                      onSelect?.();
                    }}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-volt-500 hover:bg-cyan-50 hover:text-cyan-900"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
