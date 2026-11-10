import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { TrackForm } from "@/components/order/TrackForm";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-950 text-volt-400 shadow-glow"><PackageSearch className="h-8 w-8" /></span>
      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight">Track your order</h1>
      <p className="mt-2 text-sm text-slate-500">Enter the order number from your confirmation SMS (e.g. GSABC12345).</p>
      <TrackForm />
    </div>
  );
}
