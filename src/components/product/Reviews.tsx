"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, ThumbsUp, Star, PenLine } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { timeAgo, cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

type R = { id: number; author: string; location: string; rating: number; title: string; body: string; verified: boolean; helpful: number; createdAt: string };

export function Reviews({ productId, rating, count, reviews }: { productId: number; rating: number; count: number; reviews: R[] }) {
  const [open, setOpen] = useState(false);
  const [helped, setHelped] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<number | null>(null);
  const router = useRouter();
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: reviews.filter((r) => r.rating === s).length }));
  const shown = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt-600">Verified buyers</p>
          <h2 className="font-display mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">Customer reviews</h2>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="flex h-10 items-center gap-2 rounded-full border border-slate-900 px-4 text-sm font-semibold transition hover:bg-ink-950 hover:text-white"><PenLine className="h-4 w-4" /> Write a review</button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl font-bold leading-none">{rating.toFixed(1)}</span>
            <div className="pb-1">
              <Stars value={rating} size={18} />
              <p className="mt-1 text-sm text-slate-500">{count} reviews</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {dist.map((d) => (
              <button key={d.s} onClick={() => setFilter(filter === d.s ? null : d.s)} className={cn("flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-sm transition hover:bg-slate-50", filter === d.s && "bg-slate-100")}>
                <span className="w-7 text-right tabular-nums">{d.s}★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-amber-400 animate-progress" style={{ ["--progress" as string]: `${reviews.length ? (d.n / reviews.length) * 100 : 0}%` }} />
                </span>
                <span className="w-6 text-right text-xs text-slate-500 tabular-nums">{d.n}</span>
              </button>
            ))}
          </div>
          {filter && <button onClick={() => setFilter(null)} className="mt-3 text-xs font-semibold text-volt-700 hover:underline">Clear filter</button>}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {open && <ReviewForm productId={productId} onDone={() => { setOpen(false); router.refresh(); }} />}
          {shown.length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No reviews yet for this rating. Be the first!</p>}
          {shown.map((r) => (
            <article key={r.id} className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-volt-400 to-cyan-700 text-sm font-bold text-white">{r.author[0]}</span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold">{r.author}{r.verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}</p>
                    <p className="text-xs text-slate-500">{r.location} · {timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <Stars value={r.rating} size={14} />
              </div>
              <h4 className="mt-3 font-semibold">{r.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.body}</p>
              <button
                onClick={() => { if (!helped[r.id]) { setHelped((h) => ({ ...h, [r.id]: true })); fetch(`/api/reviews/${r.id}/helpful`, { method: "POST" }); } }}
                className={cn("mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition", helped[r.id] ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-900")}
              >
                <ThumbsUp className={cn("h-3.5 w-3.5", helped[r.id] && "animate-pop")} /> Helpful ({r.helpful + (helped[r.id] ? 1 : 0)})
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({ productId, onDone }: { productId: number; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, rating, author: fd.get("author"), location: fd.get("location"), title: fd.get("title"), body: fd.get("body") }) });
    setBusy(false);
    if (res.ok) { toast({ title: "Thanks for your review!", description: "It's now live on the product page." }); onDone(); }
    else toast({ title: "Could not submit review", type: "error" });
  };
  return (
    <form onSubmit={submit} className="rounded-2xl border-2 border-ink-950 p-5 animate-fade-up">
      <h4 className="font-semibold">Share your experience</h4>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button type="button" key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110" aria-label={`${s} stars`}>
            <Star className={cn("h-7 w-7", (hover || rating) >= s ? "text-amber-400" : "text-slate-200")} fill="currentColor" strokeWidth={0} />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500">{["", "Poor", "Fair", "Good", "Very good", "Excellent"][hover || rating]}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="author" required placeholder="Your name" className={inp} />
        <input name="location" placeholder="Area, City (e.g. Mirpur, Dhaka)" className={inp} />
        <input name="title" required placeholder="Review title" className={cn(inp, "sm:col-span-2")} />
        <textarea name="body" required rows={4} placeholder="What did you build? How did it perform?" className={cn(inp, "resize-none sm:col-span-2")} />
      </div>
      <button disabled={busy} className="mt-4 h-11 rounded-full bg-ink-950 px-6 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60">{busy ? "Submitting…" : "Submit review"}</button>
    </form>
  );
}

const inp = "h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-volt-500 focus:ring-4 focus:ring-cyan-500/10 [&:is(textarea)]:h-auto [&:is(textarea)]:py-3";
