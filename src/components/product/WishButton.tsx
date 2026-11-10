"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

export function WishButton({ id, name, className }: { id: number; name: string; className?: string }) {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const on = mounted && ids.includes(id);
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(id); toast({ title: on ? "Removed from wishlist" : "Saved to wishlist", description: name, type: "info" }); }}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 active:scale-90", on ? "text-rose-500" : "text-slate-500 hover:text-rose-500", className)}
      aria-label="Save to wishlist"
      aria-pressed={on}
    >
      <Heart className={cn("h-4 w-4 transition", on && "animate-pop")} fill={on ? "currentColor" : "none"} />
    </button>
  );
}
