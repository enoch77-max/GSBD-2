"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Gallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (!light) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLight(false);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [light, images.length]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div
        className="group relative aspect-square flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={`${name} – view ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn("object-cover transition-all duration-500", i === idx ? "opacity-100" : "opacity-0", zoom && i === idx ? "scale-[1.8]" : "scale-100")}
            style={zoom && i === idx ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        ))}
        {badge && <span className="absolute left-4 top-4 rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">{badge}</span>}
        <button onClick={() => setLight(true)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow transition group-hover:opacity-100" aria-label="Expand image"><Expand className="h-4 w-4" /></button>
        {images.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {images.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full bg-white/80 transition-all", i === idx ? "w-5" : "w-1.5")} />)}
            </div>
          </>
        )}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-20 sm:flex-col">
        {images.map((src, i) => (
          <button key={src + i} onMouseEnter={() => setIdx(i)} onClick={() => setIdx(i)} className={cn("relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition", i === idx ? "border-ink-950" : "border-transparent hover:border-slate-300")} aria-label={`View image ${i + 1}`}>
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {light && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/95 p-4 animate-fade-in" onClick={() => setLight(false)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close"><X className="h-6 w-6" /></button>
          <div className="relative h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[idx]} alt={name} fill sizes="100vw" className="object-contain" />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
