"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/Toaster";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Product link copied to clipboard",
        type: "info",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-900 active:scale-95"
      aria-label="Share product"
      title="Share or copy link"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
}
