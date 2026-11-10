import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("ids") || "";
  const ids = raw.split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);

  if (!ids.length) {
    return NextResponse.json({ products: [] });
  }

  const items = await getProductsByIds(ids);
  return NextResponse.json({ products: items });
}
