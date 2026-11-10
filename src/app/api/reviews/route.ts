import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { recomputeRatings } from "@/lib/data";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.productId || !b.author || !b.title || !b.body || !b.rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const rating = Math.max(1, Math.min(5, Number(b.rating)));
  const [r] = await db
    .insert(reviews)
    .values({ productId: Number(b.productId), author: String(b.author).slice(0, 80), location: String(b.location || "Bangladesh").slice(0, 80), rating, title: String(b.title).slice(0, 120), body: String(b.body).slice(0, 2000), verified: false })
    .returning();
  await recomputeRatings(Number(b.productId));
  return NextResponse.json(r, { status: 201 });
}
