"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Truck,
  Store,
  Banknote,
  Smartphone,
  CreditCard,
  Lock,
  Tag,
  ChevronLeft,
  Check,
  Loader2,
  MapPin,
  User,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { formatBDT, SHIPPING, FREE_SHIPPING_THRESHOLD, cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
  "Other District",
];

export function CheckoutClient() {
  const { items, hydrated, updateQty, removeItem, clear } = useCart();
  const router = useRouter();
  const [ship, setShip] = useState<keyof typeof SHIPPING>("dhaka");
  const [pay, setPay] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    city: "Dhaka",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartSubtotal(items);
  const shippingFee = ship === "dhaka" && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING[ship].fee;
  const discount = applied?.discount ?? 0;
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    if (form.city !== "Dhaka" && ship === "dhaka") setShip("outside");
    if (form.city === "Dhaka" && ship === "outside") setShip("dhaka");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.city]);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      e.phone = "Enter a valid 11-digit mobile number (e.g. 01712345678)";
    }
    if (form.address.trim().length < 8) e.address = "Enter full delivery address (Road/House/Area)";
    if (!form.city) e.city = "Select your city or district";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    const r = await fetch(
      `/api/orders?code=${encodeURIComponent(coupon.trim())}&subtotal=${subtotal}`,
    );
    if (r.ok) {
      const d = await r.json();
      setApplied({ code: d.code, discount: d.discount });
      toast({
        title: `Coupon ${d.code} applied!`,
        description: `You save ${formatBDT(d.discount)} on this order`,
      });
    } else {
      setApplied(null);
      toast({
        title: "Invalid coupon code",
        description: "Try GLOW10 for 10% off or MAKER500 for ৳500 off",
        type: "error",
      });
    }
  };

  const placeOrder = async () => {
    if (!validate()) {
      toast({ title: "Please fill in the required fields correctly", type: "error" });
      return;
    }
    setBusy(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: form,
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        shippingMethod: ship,
        paymentMethod: pay,
        coupon: applied?.code,
      }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      toast({ title: d.error || "Could not place order", type: "error" });
      return;
    }
    clear();
    router.push(`/orders/${d.orderNumber}?new=1`);
  };

  const steps = useMemo(
    () => [
      { l: "Cart", done: true },
      { l: "Details", done: Boolean(form.name && form.phone && form.address) },
      { l: "Payment", done: false },
    ],
    [form],
  );

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="skeleton h-96 rounded-3xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-slate-50">
          <ShoppingBag className="h-10 w-10 text-slate-300" />
        </div>
        <h1 className="font-display mt-6 text-2xl font-bold">Nothing to check out yet</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your cart is empty. Add some cells, circuits, or tools first.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-white shadow"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/60 pb-20 pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Navigation & steps */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Continue shopping
          </Link>

          <ol className="flex items-center gap-2 text-xs font-medium">
            {steps.map((s, i) => (
              <li key={s.l} className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                    s.done
                      ? "bg-emerald-500 text-white"
                      : i === 1
                      ? "bg-ink-950 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  {s.done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={cn(i === 1 ? "font-semibold text-slate-900" : "text-slate-500")}>
                  {s.l}
                </span>
                {i < 2 && <span className="h-px w-5 bg-slate-300" />}
              </li>
            ))}
          </ol>
        </div>

        <h1 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Checkout &amp; Delivery
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          {/* Left Form: Steps 1, 2, 3 */}
          <div className="space-y-6 lg:col-span-3">
            {/* Contact & Address */}
            <Card icon={User} title="1. Contact & Delivery Address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Tanvir Ahmed"
                    className={cn(inp, errors.name && err)}
                  />
                </Field>

                <Field label="Mobile number (11 digits)" error={errors.phone}>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    className={cn(inp, errors.phone && err)}
                  />
                </Field>

                <Field label="Email address (optional)" className="sm:col-span-2">
                  <input
                    value={form.email}
                    onChange={set("email")}
                    type="email"
                    placeholder="For invoice and tracking updates"
                    className={inp}
                  />
                </Field>

                <Field label="Detailed delivery address" error={errors.address} className="sm:col-span-2">
                  <input
                    value={form.address}
                    onChange={set("address")}
                    placeholder="House, Road, Block / Village, Post Office"
                    className={cn(inp, errors.address && err)}
                  />
                </Field>

                <Field label="Area / Thana / Sub-district">
                  <input
                    value={form.area}
                    onChange={set("area")}
                    placeholder="e.g. Mirpur-10, Uttara, Agrabad"
                    className={inp}
                  />
                </Field>

                <Field label="City / District" error={errors.city}>
                  <select value={form.city} onChange={set("city")} className={inp}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Order note or instructions (optional)" className="sm:col-span-2">
                  <textarea
                    value={form.note}
                    onChange={set("note")}
                    rows={2}
                    placeholder="e.g. Call before delivery, need batch-matched cell voltages"
                    className={cn(inp, "h-auto resize-none py-2.5")}
                  />
                </Field>
              </div>
            </Card>

            {/* Delivery Method */}
            <Card icon={Truck} title="2. Delivery Method">
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(SHIPPING) as (keyof typeof SHIPPING)[]).map((k) => {
                  const s = SHIPPING[k];
                  const fee = k === "dhaka" && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : s.fee;
                  const disabled =
                    (k === "dhaka" && form.city !== "Dhaka") ||
                    (k === "outside" && form.city === "Dhaka");
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={disabled}
                      onClick={() => setShip(k)}
                      className={cn(
                        "relative rounded-2xl border-2 p-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
                        ship === k
                          ? "border-ink-950 bg-white shadow-soft"
                          : "border-slate-200 bg-white hover:border-slate-400",
                      )}
                    >
                      {k === "pickup" ? (
                        <Store className="h-5 w-5 text-volt-600" />
                      ) : (
                        <Truck className="h-5 w-5 text-volt-600" />
                      )}
                      <p className="mt-2 text-xs font-bold text-slate-900 sm:text-sm">{s.label}</p>
                      <p className="text-[11px] text-slate-500">{s.eta}</p>
                      <p className="mt-2 font-display text-sm font-bold">
                        {fee === 0 ? <span className="text-emerald-600">Free</span> : formatBDT(fee)}
                      </p>
                      {ship === k && (
                        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-ink-950 text-white animate-pop">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Payment Method */}
            <Card icon={CreditCard} title="3. Payment Method">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    k: "cod",
                    l: "Cash on Delivery",
                    d: "Pay in cash upon doorstep delivery",
                    i: Banknote,
                    c: "text-emerald-600",
                  },
                  {
                    k: "bkash",
                    l: "bKash Personal",
                    d: "Send Money to 01700-000000",
                    i: Smartphone,
                    c: "text-[#e2136e]",
                  },
                  {
                    k: "nagad",
                    l: "Nagad Personal",
                    d: "Send Money to 01700-000000",
                    i: Smartphone,
                    c: "text-[#f6921e]",
                  },
                  {
                    k: "card",
                    l: "Online Payment / Card",
                    d: "Visa, Mastercard, Internet Banking",
                    i: CreditCard,
                    c: "text-[#1a1f71]",
                  },
                ].map((p) => (
                  <button
                    key={p.k}
                    type="button"
                    onClick={() => setPay(p.k)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition",
                      pay === p.k
                        ? "border-ink-950 bg-white shadow-soft"
                        : "border-slate-200 bg-white hover:border-slate-400",
                    )}
                  >
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50", p.c)}>
                      <p.i className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 sm:text-sm">{p.l}</p>
                      <p className="text-[11px] text-slate-500 truncate">{p.d}</p>
                    </div>
                    {pay === p.k && (
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink-950 text-white animate-pop">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {(pay === "bkash" || pay === "nagad") && (
                <div className="mt-3 rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-900 animate-fade-in">
                  <p className="font-semibold">How to pay via {pay === "bkash" ? "bKash" : "Nagad"}:</p>
                  <p className="mt-1">
                    Send <b>{formatBDT(total)}</b> to our personal number <b>01700-000000</b>. Use your Order
                    Number as the reference. Our team confirms within 15–30 minutes.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Summary */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <h3 className="font-display text-lg font-bold">Order Summary</h3>

              {/* Items list */}
              <ul className="thin-scroll mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-3 items-center">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                      <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold leading-snug">{it.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQty(it.id, it.quantity - 1)}
                            className="grid h-5 w-5 place-items-center rounded-full hover:bg-slate-100"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(it.id, it.quantity + 1)}
                            className="grid h-5 w-5 place-items-center rounded-full hover:bg-slate-100"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold tabular-nums">
                          {formatBDT(it.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="self-center p-1 text-slate-300 hover:text-rose-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Coupon input */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="GLOW10 or MAKER500"
                    className={cn(inp, "pl-9 uppercase text-xs sm:text-sm")}
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="h-11 rounded-xl border border-slate-900 px-4 text-xs font-bold transition hover:bg-ink-950 hover:text-white"
                >
                  Apply
                </button>
              </div>

              {applied && (
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 animate-fade-in">
                  <Check className="h-3.5 w-3.5" /> Coupon &ldquo;{applied.code}&rdquo; applied — save{" "}
                  {formatBDT(applied.discount)}!
                </p>
              )}

              {/* Totals */}
              <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="tabular-nums font-semibold">{formatBDT(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Delivery Fee</dt>
                  <dd className="tabular-nums font-semibold">
                    {shippingFee === 0 ? (
                      <span className="font-semibold text-emerald-600">Free</span>
                    ) : (
                      formatBDT(shippingFee)
                    )}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <dt>Discount</dt>
                    <dd className="tabular-nums">−{formatBDT(discount)}</dd>
                  </div>
                )}
                <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                  <dt className="font-bold text-base text-slate-900">Total Payable</dt>
                  <dd className="font-display text-2xl font-bold tabular-nums text-slate-900">
                    {formatBDT(total)}
                  </dd>
                </div>
              </dl>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={placeOrder}
                disabled={busy}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-950 py-3 text-sm font-semibold text-white shadow transition hover:bg-ink-800 active:scale-[0.98] disabled:opacity-70"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Confirming order…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Place order · {formatBDT(total)}
                  </>
                )}
              </button>

              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Genuine Cells · 7-Day Replacement Guarantee</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky order bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 shadow-lift backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Total payable</p>
            <p className="font-display text-xl font-bold tabular-nums text-slate-900">{formatBDT(total)}</p>
          </div>
          <button
            type="button"
            onClick={placeOrder}
            disabled={busy}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink-950 px-6 text-sm font-semibold text-white shadow transition active:scale-[0.98] disabled:opacity-70"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" /> Place order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6 animate-fade-up">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink-950 text-volt-400">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600 animate-fade-in">{error}</span>}
    </label>
  );
}

const inp =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base sm:text-sm outline-none transition focus:border-volt-500 focus:ring-4 focus:ring-cyan-500/10";
const err = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10";
