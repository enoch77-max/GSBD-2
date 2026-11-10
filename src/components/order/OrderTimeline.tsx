"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, PackageCheck, Truck, Home, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { k: "confirmed", l: "Order confirmed", d: "We've received your order", i: ClipboardCheck },
  { k: "packed", l: "Tested & packed", d: "Cells checked, safely boxed", i: PackageCheck },
  { k: "shipped", l: "Out for delivery", d: "Handed to courier", i: Truck },
  { k: "delivered", l: "Delivered", d: "Enjoy your build!", i: Home },
];

export function OrderTimeline({
  status,
  createdAt,
  shippingMethod,
}: {
  status: string;
  createdAt: string;
  shippingMethod: string;
}) {
  // Simulate progress based on time since order (for demo realism)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const mins = (now - new Date(createdAt).getTime()) / 60000;
  const base = STEPS.findIndex((s) => s.k === status);
  const simulated = mins > 2880 ? 3 : mins > 240 ? 2 : mins > 20 ? 1 : 0;
  const current = Math.max(base, simulated);

  // Stagger the checkmark reveal
  const [animated, setAnimated] = useState(-1);
  useEffect(() => {
    let i = -1;
    const t = setInterval(() => {
      i += 1;
      setAnimated(i);
      if (i >= current) clearInterval(t);
    }, 450);
    return () => clearInterval(t);
  }, [current]);

  const p = Math.max(0, animated) / 3;
  const eta =
    shippingMethod === "pickup"
      ? "Ready for pickup today after 2pm"
      : shippingMethod === "dhaka"
      ? "Arriving in 1–2 working days"
      : "Arriving in 2–4 working days";

  return (
    <div>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h2 className="font-display text-lg font-bold">Track your order</h2>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Truck className="h-4 w-4 text-volt-600 animate-truck" /> {eta}
        </p>
      </div>

      {/* Desktop: horizontal */}
      <div className="relative mt-8 hidden sm:block">
        <div className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 -translate-y-1/2 rounded bg-slate-200" />
        <div
          className="absolute left-[12.5%] top-5 h-0.5 -translate-y-1/2 origin-left rounded bg-gradient-to-r from-emerald-500 to-volt-500 transition-transform duration-700 ease-out"
          style={{ width: "75%", transform: `scaleX(${p})` }}
        />
        <ol className="relative grid grid-cols-4">
          {STEPS.map((s, i) => {
            const done = i <= animated;
            const active = i === current && done;
            return (
              <li key={s.k} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "relative grid h-10 w-10 place-items-center rounded-full border-2 bg-white transition-all duration-500",
                    done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 text-slate-400",
                    active && "scale-110 shadow-glow",
                  )}
                >
                  {done && i < current ? <Check className="h-5 w-5 animate-pop" /> : <s.i className="h-5 w-5" />}
                  {active && <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-pulse-ring" />}
                </span>
                <p className={cn("mt-3 text-sm font-semibold", done ? "text-slate-900" : "text-slate-400")}>{s.l}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.d}</p>
                {i === 0 && (
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {new Date(createdAt).toLocaleString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical */}
      <div className="relative mt-6 sm:hidden">
        <div className="absolute bottom-[46px] left-5 top-[18px] w-0.5 -translate-x-1/2 rounded bg-slate-200" />
        <div
          className="absolute left-5 top-[18px] h-[calc(100%-64px)] w-0.5 -translate-x-1/2 origin-top rounded bg-gradient-to-b from-emerald-500 to-volt-500 transition-transform duration-700 ease-out"
          style={{ transform: `scaleY(${p})` }}
        />
        <ol className="relative space-y-6">
          {STEPS.map((s, i) => {
            const done = i <= animated;
            const active = i === current && done;
            return (
              <li key={s.k} className="flex items-start gap-4">
                <span
                  className={cn(
                    "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 bg-white transition-all duration-500",
                    done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 text-slate-400",
                    active && "scale-110 shadow-glow",
                  )}
                >
                  {done && i < current ? <Check className="h-4 w-4 animate-pop" /> : <s.i className="h-4 w-4" />}
                  {active && <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-pulse-ring" />}
                </span>
                <div className="pt-0.5">
                  <p className={cn("text-sm font-semibold", done ? "text-slate-900" : "text-slate-400")}>{s.l}</p>
                  <p className="text-xs text-slate-500">{s.d}</p>
                  {i === 0 && (
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {new Date(createdAt).toLocaleString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function SuccessBurst() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  const colors = ["#22d3ee", "#fbbf24", "#34d399", "#f472b6", "#a78bfa"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" aria-hidden>
      {Array.from({ length: 48 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const dur = 1.8 + Math.random() * 1;
        const size = 6 + Math.random() * 8;
        return (
          <span
            key={i}
            className="absolute top-[-20px] block rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              background: colors[i % colors.length],
              animation: `confetti ${dur}s ease-in ${delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti { to { transform: translateY(110vh) rotate(720deg); opacity: 0.2; } }`}</style>
    </div>
  );
}
