"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function TrackForm() {
  const [v, setV] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (!v.trim()) return; setBusy(true); router.push(`/orders/${v.trim().replace(/^#/, "").toUpperCase()}`); }}
      className="mx-auto mt-6 flex max-w-md gap-2"
    >
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Order number" className="h-12 flex-1 rounded-full border border-slate-200 px-5 text-sm uppercase outline-none focus:border-volt-500 focus:ring-4 focus:ring-cyan-500/10" />
      <button disabled={busy} className="flex h-12 items-center gap-2 rounded-full bg-ink-950 px-5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-70">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Track <ArrowRight className="h-4 w-4" /></>}</button>
    </form>
  );
}
