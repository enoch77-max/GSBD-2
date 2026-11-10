import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  Building2,
  ChevronRight,
  Phone,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

type TopicKey = "shipping" | "warranty" | "battery-safety" | "wholesale";

const TOPICS: Record<
  TopicKey,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    content: React.ReactNode;
  }
> = {
  shipping: {
    title: "Shipping & Delivery Information",
    subtitle: "Nationwide delivery across all 64 districts in Bangladesh.",
    icon: Truck,
    content: (
      <div className="space-y-6 text-sm text-slate-700">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="font-semibold text-base text-slate-900">Delivery Rates &amp; Timelines</h3>
          <ul className="mt-3 space-y-2">
            <li>
              • <b>Inside Dhaka City:</b> ৳70 flat rate. Standard delivery within 24 to 48 hours.{" "}
              <span className="text-emerald-700 font-semibold">Free on orders above ৳5,000!</span>
            </li>
            <li>
              • <b>Outside Dhaka (All Districts):</b> ৳130 flat rate. Delivery within 2 to 4 working days via
              Steadfast Courier, RedX, or Sundarban Courier.
            </li>
            <li>
              • <b>Store Pickup (Elephant Road):</b> Free. Collect from Shop 312, Level 3, Multiplan Center,
              Elephant Road, Dhaka 1205 (10:00 AM – 8:30 PM, Saturday to Thursday).
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-base text-slate-900">Cell Packaging &amp; Safety Protocol</h3>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Lithium cells are sensitive hazmat products. Every cell order is packed in heavy-duty hard plastic
            battery cases with terminal insulator caps to prevent short-circuits in transit. Prismatic LiFePO4 cells
            are individually cocooned in custom high-density EPE foam.
          </p>
        </section>
      </div>
    ),
  },
  warranty: {
    title: "Warranty & Return Policy",
    subtitle: "Transparent guarantees and local warranty service in Dhaka.",
    icon: ShieldCheck,
    content: (
      <div className="space-y-6 text-sm text-slate-700">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="font-semibold text-base text-slate-900">Warranty Coverage Summary</h3>
          <ul className="mt-3 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>7-Day Dead-On-Arrival (DOA) Replacement:</b> If any cell, circuit board, or sensor arrives defective, we replace it immediately free of charge.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Cell Capacity Guarantee:</b> Genuine cells (Samsung, LG, Molicel, EVE) are guaranteed to test within ±5% of manufacturer factory ratings on professional analyzers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Custom Packs &amp; Router UPS:</b> 1-Year to 3-Year local service warranty on spot welds and BMS boards at our Elephant Road workshop.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-base text-slate-900">What is NOT covered?</h3>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Damage caused by short-circuiting terminals, reverse-polarity wiring, discharging below 2.0V, charging
            without a proper CC-CV lithium charger or BMS, or soldering directly on cell terminals with a high-heat
            iron (which damages internal safety vents).
          </p>
        </section>
      </div>
    ),
  },
  "battery-safety": {
    title: "Battery Safety & Handling Guide",
    subtitle: "Essential DIY safety rules for lithium-ion and LiFePO4 pack builders.",
    icon: AlertTriangle,
    content: (
      <div className="space-y-6 text-sm text-slate-700">
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-amber-950">
          <h3 className="font-semibold text-base text-amber-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" /> Never Solder Directly to 18650 / 21700 Cells
          </h3>
          <p className="mt-2 leading-relaxed">
            Soldering directly on cell terminals heats the internal chemical jelly roll and destroys the CID (current
            interrupt device) safety seal. Always use a spot welder with pure nickel strip or pre-soldered cell holders.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-base text-slate-900">Golden Rules for Safe Builds</h3>
          <ol className="mt-3 space-y-2 list-decimal list-inside text-slate-600 leading-relaxed">
            <li><b>Always install a matching BMS:</b> Never run or charge series cells without a battery management system to prevent over-charge, over-discharge, and thermal runaway.</li>
            <li><b>Check cell voltages before parallel connection:</b> All cells must be within 0.05V of each other before welding in parallel to prevent massive equalizing inrush currents.</li>
            <li><b>Use Barley Paper (Fish Paper) Insulator Rings:</b> The positive terminal collar on 18650s is very close to the negative outer can. Always add an adhesive insulator ring before spot-welding nickel.</li>
            <li><b>Use the correct charger:</b> LiFePO4 cells need 3.65V per cell (14.6V for 4S). Li-ion cells need 4.20V per cell (12.6V for 3S). Never use a lead-acid charger without lithium profile.</li>
          </ol>
        </section>
      </div>
    ),
  },
  wholesale: {
    title: "Wholesale & Reseller Program",
    subtitle: "Tiered pricing for battery builders, repair shops, and university lab projects.",
    icon: Building2,
    content: (
      <div className="space-y-6 text-sm text-slate-700">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="font-semibold text-base text-slate-900">Who Qualifies?</h3>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• Electronics repair workshops and phone/laptop service centers</li>
            <li>• E-bike, easy-bike and solar power conversion builders</li>
            <li>• University robotics teams, IEEE student branches and lab projects</li>
            <li>• Retail component shops across district towns in Bangladesh</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-base text-slate-900">Volume Discount Tiers</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="font-bold text-slate-900">20–49 Pcs</p>
              <p className="mt-1 text-emerald-600 font-semibold">5% OFF</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="font-bold text-slate-900">50–199 Pcs</p>
              <p className="mt-1 text-emerald-600 font-semibold">10% OFF</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="font-bold text-slate-900">200+ Pcs</p>
              <p className="mt-1 text-emerald-600 font-semibold">Wholesale Rate</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://wa.me/8801700000000?text=Hi%20Glowing%20Space%20BD,%20I%20am%20interested%20in%20wholesale%20reseller%20pricing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" /> Message Wholesale Desk
            </a>
            <a
              href="tel:01700000000"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Phone className="h-4 w-4" /> Call 01700-000000
            </a>
          </div>
        </section>
      </div>
    ),
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = TOPICS[topic as TopicKey];
  if (!t) return { title: "Help Center" };
  return { title: `${t.title} · Help Center` };
}

export default async function HelpTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const current = TOPICS[topic as TopicKey];
  if (!current) notFound();

  const Icon = current.icon;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/help/shipping" className="hover:text-slate-900">Help Center</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">{current.title}</span>
      </nav>

      {/* Tabs bar */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {(Object.keys(TOPICS) as TopicKey[]).map((k) => (
          <Link
            key={k}
            href={`/help/${k}`}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              k === topic
                ? "bg-ink-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-900"
            }`}
          >
            {TOPICS[k].title.split(" ")[0]}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-volt-600">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{current.subtitle}</p>
          </div>
        </div>

        <div className="mt-8">{current.content}</div>
      </div>
    </div>
  );
}
