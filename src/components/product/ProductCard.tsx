import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatBDT, discountPct, formatCompact } from "@/lib/utils";
import { Stars } from "@/components/ui/Stars";
import { QuickAdd } from "@/components/product/AddToCart";
import { WishButton } from "@/components/product/WishButton";
import { Flame, Sparkles } from "lucide-react";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const pct = discountPct(product.price, product.compareAtPrice);
  const low = product.stock > 0 && product.stock <= 20;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lift">
      {/* Image container */}
      <div className="relative block aspect-square w-full overflow-hidden bg-slate-50">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="card-img object-cover"
          />
        </Link>

        {/* Top-left: Discount Tag */}
        {pct > 0 && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-md bg-rose-500 px-2 py-0.5 text-[10.5px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[11px]">
            -{pct}%
          </span>
        )}

        {/* Top-right: Wishlist Heart */}
        <div className="absolute right-2.5 top-2.5 z-10 sm:right-3 sm:top-3">
          <WishButton id={product.id} name={product.name} />
        </div>

        {/* Bottom-left image badge: Best seller or New */}
        <div className="pointer-events-none absolute bottom-2 left-2 flex gap-1 sm:bottom-2.5 sm:left-2.5">
          {product.isNew ? (
            <span className="flex items-center gap-1 rounded-md bg-volt-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm sm:text-[11px]">
              <Sparkles className="h-3 w-3" /> New
            </span>
          ) : product.tags.includes("best-seller") ? (
            <span className="flex items-center gap-1 rounded-md bg-amber-400/95 px-2 py-0.5 text-[10px] font-bold text-amber-950 backdrop-blur-sm shadow-sm sm:text-[11px]">
              <Flame className="h-3 w-3" /> Best seller
            </span>
          ) : null}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/75 backdrop-blur-[2px]">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Brand */}
        <p className="truncate text-[10.5px] font-semibold tracking-wide text-slate-400">
          {product.brand}
        </p>

        {/* Title with uniform 2-line height */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13.5px] font-semibold leading-snug text-slate-900 transition group-hover:text-volt-700 sm:text-[14px]"
        >
          {product.name}
        </Link>

        {/* Rating and Sold Count */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Stars value={product.rating} size={11} />
            <span className="text-[11.5px] font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
          <span className="hidden text-[11px] font-medium text-slate-400 min-[430px]:inline">
            · {formatCompact(product.soldCount)} sold
          </span>
        </div>

        {/* Bottom row: Price and Quick Add */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-display text-base font-bold leading-none tabular-nums text-slate-900 sm:text-lg">
                {formatBDT(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-[11px] text-slate-400 line-through tabular-nums sm:text-xs">
                  {formatBDT(product.compareAtPrice)}
                </span>
              )}
            </div>
            {low ? (
              <p className="mt-1 text-[10.5px] font-medium text-amber-600 truncate">
                Only {product.stock} left
              </p>
            ) : null}
          </div>

          <QuickAdd product={product} />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="skeleton aspect-square" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton mt-3 h-6 w-24 rounded" />
      </div>
    </div>
  );
}
