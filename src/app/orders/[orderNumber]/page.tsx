import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, MapPin, Phone, CreditCard, ArrowRight, MessageCircle, Zap } from "lucide-react";
import { getOrderByNumber } from "@/lib/data";
import { formatBDT, SHIPPING } from "@/lib/utils";
import { OrderTimeline, SuccessBurst } from "@/components/order/OrderTimeline";
import { PrintInvoiceButton } from "@/components/order/PrintInvoiceButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order status" };

const PAY: Record<string, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash Personal",
  nagad: "Nagad Personal",
  card: "Card (SSLCommerz)",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { orderNumber } = await params;
  const { new: isNew } = await searchParams;
  const order = await getOrderByNumber(orderNumber.toUpperCase());
  if (!order) notFound();
  const ship = SHIPPING[order.shippingMethod as keyof typeof SHIPPING] ?? SHIPPING.dhaka;

  const whatsappLink = `https://wa.me/8801700000000?text=${encodeURIComponent(
    `Hello Glowing Space BD! I have a question about my order #${order.orderNumber}. (Total: ৳${order.total})`,
  )}`;

  return (
    <div className="bg-slate-50/60 print:bg-white print:p-0">
      {/* Printable Invoice Header (Visible only in print) */}
      <div className="hidden print:block print:p-6 print:border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Glowing Space BD</h1>
            <p className="text-xs text-slate-600 mt-0.5">Shop 312, Level 3, Multiplan Center, Elephant Road, Dhaka 1205</p>
            <p className="text-xs text-slate-600">Phone: 01700-000000 · Trade License: TRAD/DSCC/012345/2019</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">TAX INVOICE</p>
            <p className="font-mono text-xs">#{order.orderNumber}</p>
            <p className="text-xs text-slate-500">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 print:p-6">
        {isNew && <SuccessBurst />}

        <div className="text-center print:hidden">
          <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg animate-pop">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" strokeDasharray="48" className="animate-check" />
            </svg>
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-pulse-ring" />
          </div>
          <h1 className="font-display mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {isNew ? "Order placed — thank you!" : "Order status"}
          </h1>
          <p className="mt-2 text-slate-600">
            Order{" "}
            <span className="rounded-md bg-ink-950 px-2 py-0.5 font-mono text-sm font-semibold text-volt-300">
              #{order.orderNumber}
            </span>{" "}
            ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            We&apos;ve sent a confirmation SMS to {order.phone}. Expected delivery:{" "}
            <b className="text-slate-800">{ship.eta}</b>.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 print:hidden">
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt.toISOString()}
            shippingMethod={order.shippingMethod}
          />
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-5 print:grid-cols-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:col-span-3 print:border-none print:shadow-none print:p-0">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <Package className="h-5 w-5 text-volt-600 print:hidden" /> Items (
              {order.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 print:h-12 print:w-12">
                    <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${it.slug}`}
                      className="line-clamp-2 text-sm font-semibold hover:text-volt-700 print:text-black"
                    >
                      {it.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {it.quantity} × {formatBDT(it.price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold tabular-nums">{formatBDT(it.price * it.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="tabular-nums font-medium">{formatBDT(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery ({ship.label})</dt>
                <dd className="tabular-nums font-medium">
                  {order.shippingFee === 0 ? "Free" : formatBDT(order.shippingFee)}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount</dt>
                  <dd className="tabular-nums font-medium">−{formatBDT(order.discount)}</dd>
                </div>
              )}
              <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                <dt className="font-bold text-base">Total Amount</dt>
                <dd className="font-display text-2xl font-bold tabular-nums text-slate-900">
                  {formatBDT(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4 lg:col-span-2 print:border-t print:pt-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft print:border-none print:p-0">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-volt-600 print:hidden" /> Delivering to
              </h3>
              <p className="mt-2 text-sm font-semibold">{order.customerName}</p>
              <p className="text-sm text-slate-600">
                {order.address}
                {order.area ? `, ${order.area}` : ""}, {order.city}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <Phone className="h-3.5 w-3.5 print:hidden" /> {order.phone}
              </p>
              {order.note && (
                <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
                  Note: {order.note}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft print:border-none print:p-0">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-volt-600 print:hidden" /> Payment Method
              </h3>
              <p className="mt-2 text-sm font-medium">{PAY[order.paymentMethod] ?? order.paymentMethod}</p>
              {(order.paymentMethod === "bkash" || order.paymentMethod === "nagad") && (
                <p className="mt-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                  Send <b>{formatBDT(order.total)}</b> to <b>01700-000000</b> with reference{" "}
                  <b>{order.orderNumber}</b>.
                </p>
              )}
              {order.paymentMethod === "cod" && (
                <p className="mt-1 text-xs text-slate-500">
                  Keep {formatBDT(order.total)} cash ready upon delivery.
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-ink-950 p-6 text-white print:hidden">
              <p className="text-sm font-semibold">Need help with this order?</p>
              <p className="mt-1 text-xs text-slate-400">
                Our workshop technicians reply within 30 minutes, 10am–9pm.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <PrintInvoiceButton />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
          <Link
            href="/products"
            className="flex h-11 items-center gap-2 rounded-full bg-ink-950 px-6 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/track" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Track another order
          </Link>
        </div>
      </div>
    </div>
  );
}
