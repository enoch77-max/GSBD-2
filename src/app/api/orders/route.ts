import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getProductsByIds } from "@/lib/data";
import { SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

const COUPONS: Record<string, { pct?: number; flat?: number }> = { GLOW10: { pct: 10 }, MAKER500: { flat: 500 }, WELCOME: { pct: 5 } };

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { customer, items, shippingMethod, paymentMethod, coupon } = b as {
    customer: { name: string; phone: string; email?: string; address: string; area: string; city: string; note?: string };
    items: { id: number; quantity: number }[];
    shippingMethod: keyof typeof SHIPPING;
    paymentMethod: string;
    coupon?: string;
  };
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
  }
  if (!/^01[3-9]\d{8}$/.test(customer.phone.replace(/[\s-]/g, ""))) {
    return NextResponse.json({ error: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX)" }, { status: 400 });
  }
  const products = await getProductsByIds(items.map((i) => Number(i.id)));
  const lines = items
    .map((i) => {
      const p = products.find((x) => x.id === Number(i.id));
      if (!p) return null;
      const qty = Math.max(1, Math.min(Number(i.quantity) || 1, p.stock));
      return { productId: p.id, name: p.name, slug: p.slug, image: p.images[0], price: p.price, quantity: qty };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  if (!lines.length) return NextResponse.json({ error: "Cart items unavailable" }, { status: 400 });

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const ship = SHIPPING[shippingMethod] ?? SHIPPING.dhaka;
  const shippingFee = shippingMethod === "dhaka" && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : ship.fee;
  const c = coupon ? COUPONS[coupon.toUpperCase()] : undefined;
  const discount = c ? Math.min(subtotal, c.flat ?? Math.round((subtotal * (c.pct ?? 0)) / 100)) : 0;
  const total = subtotal + shippingFee - discount;
  const orderNumber = `GS${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

  const [o] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address,
      area: customer.area || "",
      city: customer.city,
      note: customer.note || null,
      paymentMethod: paymentMethod || "cod",
      shippingMethod: shippingMethod || "dhaka",
      subtotal,
      shippingFee,
      discount,
      total,
      status: "confirmed",
    })
    .returning();
  await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: o.id })));
  return NextResponse.json({ orderNumber: o.orderNumber, total }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.toUpperCase();
  const subtotal = Number(searchParams.get("subtotal") || 0);
  if (!code || !COUPONS[code]) return NextResponse.json({ valid: false }, { status: 404 });
  const c = COUPONS[code];
  const discount = Math.min(subtotal, c.flat ?? Math.round((subtotal * (c.pct ?? 0)) / 100));
  return NextResponse.json({ valid: true, code, discount });
}
