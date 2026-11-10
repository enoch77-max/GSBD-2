import { NextResponse } from "next/server";
import { queryProducts } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const matches = await queryProducts({ q });
  const top = matches.slice(0, 6).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.images[0],
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags,
  }));

  return NextResponse.json({ results: top });
}
