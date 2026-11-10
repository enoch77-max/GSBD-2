"use client";

import { Printer } from "lucide-react";

export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
    >
      <Printer className="h-3.5 w-3.5" /> Print Invoice
    </button>
  );
}
