import { NextResponse } from "next/server";
import { getBestSellers } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exclude = (searchParams.get("exclude") || "").split(",").map(Number).filter(Boolean);
  const all = await getBestSellers(14);
  const available = all.filter((p) => !exclude.includes(p.id));
  const cheapFirst = [...available].sort((a, b) => a.price - b.price);
  const picks = cheapFirst.filter((p) => p.price <= 1200).slice(0, 4);
  const final = picks.length >= 2 ? picks : available.slice(0, 4);
  return NextResponse.json(final.map((p) => ({ id: p.id, slug: p.slug, name: p.name, brand: p.brand, price: p.price, compareAtPrice: p.compareAtPrice, image: p.images[0], stock: p.stock })));
}
