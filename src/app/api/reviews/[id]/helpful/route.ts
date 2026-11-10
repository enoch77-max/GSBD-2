import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.update(reviews).set({ helpful: sql`${reviews.helpful} + 1` }).where(eq(reviews.id, Number(id)));
  return NextResponse.json({ ok: true });
}
