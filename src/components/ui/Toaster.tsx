"use client";

import { create } from "zustand";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import Image from "next/image";

type Toast = {
  id: number;
  title: string;
  description?: string;
  type?: "success" | "info" | "error";
  image?: string;
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 3600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export function toast(t: Omit<Toast, "id">) {
  useToast.getState().push(t);
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <aside
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 bottom-[84px] z-[120] flex flex-col items-center gap-2 sm:bottom-6 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 pr-3.5 shadow-lift backdrop-blur-md"
        >
          {t.image ? (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <Image src={t.image} alt="" fill sizes="44px" className="object-cover" />
            </div>
          ) : t.type === "error" ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : t.type === "info" ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-volt-600">
              <Info className="h-5 w-5" />
            </div>
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{t.title}</p>
            {t.description && <p className="truncate text-xs text-slate-500">{t.description}</p>}
          </div>

          <button
            onClick={() => dismiss(t.id)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </aside>
  );
}
