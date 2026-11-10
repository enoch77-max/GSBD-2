"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Battery,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";
import { formatBDT, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { toast } from "@/components/ui/Toaster";

type CellChoice = {
  id: string;
  name: string;
  brand: string;
  chemistry: "li-ion" | "lifepo4";
  nominalV: number;
  maxV: number;
  capacityAh: number;
  maxDischargeA: number;
  weightG: number;
  pricePerCell: number;
  image: string;
};

const CELLS: CellChoice[] = [
  {
    id: "samsung-30q",
    name: "Samsung 30Q 18650 (3000mAh 15A)",
    brand: "Samsung SDI",
    chemistry: "li-ion",
    nominalV: 3.6,
    maxV: 4.2,
    capacityAh: 3.0,
    maxDischargeA: 15,
    weightG: 48,
    pricePerCell: 385,
    image: "/images/18650.jpg",
  },
  {
    id: "lg-mj1",
    name: "LG MJ1 18650 (3500mAh 10A)",
    brand: "LG Chem",
    chemistry: "li-ion",
    nominalV: 3.635,
    maxV: 4.2,
    capacityAh: 3.5,
    maxDischargeA: 10,
    weightG: 49,
    pricePerCell: 410,
    image: "/images/18650.jpg",
  },
  {
    id: "molicel-p42a",
    name: "Molicel P42A 21700 (4200mAh 45A)",
    brand: "Molicel",
    chemistry: "li-ion",
    nominalV: 3.6,
    maxV: 4.2,
    capacityAh: 4.2,
    maxDischargeA: 45,
    weightG: 70,
    pricePerCell: 890,
    image: "/images/18650.jpg",
  },
  {
    id: "eve-lf105",
    name: "EVE LF105 LiFePO4 Prismatic (105Ah)",
    brand: "EVE Energy",
    chemistry: "lifepo4",
    nominalV: 3.2,
    maxV: 3.65,
    capacityAh: 105,
    maxDischargeA: 105,
    weightG: 1950,
    pricePerCell: 6900,
    image: "/images/lifepo4.jpg",
  },
];

const PRESETS = [
  {
    name: "12V Router UPS (3S2P)",
    chem: "li-ion",
    cellId: "samsung-30q",
    s: 3,
    p: 2,
    desc: "4–8 hrs backup for WiFi router + ONU",
  },
  {
    name: "12.8V IPS LiFePO4 (4S1P)",
    chem: "lifepo4",
    cellId: "eve-lf105",
    s: 4,
    p: 1,
    desc: "1.34kWh home solar & IPS lead-acid replacement",
  },
  {
    name: "36V E-Bike Pack (10S3P)",
    chem: "li-ion",
    cellId: "samsung-30q",
    s: 10,
    p: 3,
    desc: "Typical 250W–350W pedal assist e-bike (35km range)",
  },
  {
    name: "48V Easy-Bike / EV (13S4P)",
    chem: "li-ion",
    cellId: "samsung-30q",
    s: 13,
    p: 4,
    desc: "48V 12Ah pack for conversions and heavy duty tools",
  },
];

export function PackCalculator() {
  const [chemistry, setChemistry] = useState<"li-ion" | "lifepo4">("li-ion");
  const [selectedCellId, setSelectedCellId] = useState("samsung-30q");
  const [series, setSeries] = useState(13);
  const [parallel, setParallel] = useState(4);
  const [includeBms, setIncludeBms] = useState(true);
  const [includeService, setIncludeService] = useState(true);

  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const availableCells = useMemo(
    () => CELLS.filter((c) => c.chemistry === chemistry),
    [chemistry],
  );

  const currentCell = useMemo(() => {
    const found = availableCells.find((c) => c.id === selectedCellId);
    return found || availableCells[0];
  }, [availableCells, selectedCellId]);

  // Calculations
  const totalCells = series * parallel;
  const nominalVoltage = Number((series * currentCell.nominalV).toFixed(1));
  const fullChargeVoltage = Number((series * currentCell.maxV).toFixed(1));
  const totalCapacityAh = Number((parallel * currentCell.capacityAh).toFixed(1));
  const totalEnergyWh = Math.round(nominalVoltage * totalCapacityAh);
  const totalEnergyKWh = (totalEnergyWh / 1000).toFixed(2);
  const maxDischargeAmps = parallel * currentCell.maxDischargeA;
  const estimatedWeightKg = ((totalCells * currentCell.weightG) / 1000).toFixed(2);

  // Suggested BMS
  const suggestedBmsRating = useMemo(() => {
    if (chemistry === "lifepo4" && series === 4) return "JBD 4S 100A Smart BMS (৳3,450)";
    if (series <= 3) return "3S 40A Balanced BMS (৳185)";
    if (series <= 7) return "7S 30A Balanced BMS (৳450)";
    if (series <= 13) return "13S 48V 35A Daly BMS (৳2,650)";
    if (series <= 16) return "16S 60V 50A Daly BMS (৳3,800)";
    return `${series}S 50A Smart BMS`;
  }, [chemistry, series]);

  const bmsEstimatedCost = useMemo(() => {
    if (!includeBms) return 0;
    if (chemistry === "lifepo4" && series === 4) return 3450;
    if (series <= 3) return 185;
    if (series <= 7) return 450;
    if (series <= 13) return 2650;
    return 3600;
  }, [chemistry, series, includeBms]);

  const cellCost = totalCells * currentCell.pricePerCell;
  const weldingCost = includeService ? totalCells * 60 : 0;
  const hardwareCost = includeService ? (chemistry === "lifepo4" ? 600 : 350) : 0;
  const totalEstimatedCost = cellCost + bmsEstimatedCost + weldingCost + hardwareCost;

  const handleApplyPreset = (p: (typeof PRESETS)[0]) => {
    setChemistry(p.chem as "li-ion" | "lifepo4");
    setSelectedCellId(p.cellId);
    setSeries(p.s);
    setParallel(p.p);
  };

  const handleAddToCart = () => {
    const packName = `Custom ${series}S${parallel}P ${nominalVoltage}V ${totalCapacityAh}Ah Pack (${currentCell.name})`;
    addItem(
      {
        id: 99000 + series * 10 + parallel,
        slug: "custom-battery-pack-builder",
        name: packName,
        brand: "Glowing Space Build",
        price: totalEstimatedCost,
        compareAtPrice: Math.round(totalEstimatedCost * 1.1),
        image: currentCell.image,
        stock: 50,
      },
      1,
    );
    toast({
      title: "Custom pack added to cart",
      description: `${series}S${parallel}P ${nominalVoltage}V · ${formatBDT(totalEstimatedCost)}`,
      image: currentCell.image,
    });
    openCart();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Glowing Space BD! I would like to order a custom battery pack build:\n\n• Configuration: ${series}S${parallel}P\n• Chemistry: ${chemistry.toUpperCase()}\n• Cell: ${currentCell.name}\n• Voltage: ${nominalVoltage}V (${fullChargeVoltage}V full)\n• Capacity: ${totalCapacityAh}Ah (${totalEnergyWh}Wh)\n• BMS: ${suggestedBmsRating}\n• Total Cells: ${totalCells} pcs\n• Estimated Quote: ৳${totalEstimatedCost.toLocaleString("en-IN")}\n\nPlease confirm availability and build lead time. Thank you!`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      {/* Heading */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-volt-700">
          <Sparkles className="h-3.5 w-3.5 text-volt-500" /> Professional Pack Design Suite
        </span>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Custom Battery Pack <span className="text-gradient">Builder &amp; Calculator</span>
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Configure series and parallel cell combinations, calculate total energy and voltage, select genuine
          tested cells, and get an honest, instant build quote in Bangladeshi Taka.
        </p>
      </div>

      {/* Quick presets */}
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Popular Pre-configured Builds
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={cn(
                "rounded-2xl border p-3.5 text-left transition hover:border-slate-400 hover:shadow-soft",
                series === p.s && parallel === p.p && chemistry === p.chem
                  ? "border-ink-950 bg-slate-900 text-white shadow-soft"
                  : "border-slate-200 bg-white text-slate-900",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                {p.s}S {p.p}P
              </p>
              <p className="mt-1 font-semibold text-sm">{p.name}</p>
              <p className="mt-1 text-[11.5px] opacity-80">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Builder Layout */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left: Interactive Controls */}
        <div className="space-y-6 lg:col-span-7">
          {/* Chemistry selection */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="font-display flex items-center gap-2.5 text-base font-bold text-slate-900">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-50 text-volt-600 shrink-0">
                <Zap className="h-4 w-4" />
              </span>
              <span>Step 1: Select Battery Chemistry</span>
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setChemistry("li-ion");
                  setSelectedCellId("samsung-30q");
                  if (series === 4) setSeries(13);
                }}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition",
                  chemistry === "li-ion"
                    ? "border-ink-950 bg-cyan-50/40 shadow-soft"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs sm:text-sm">Lithium-ion (NMC)</p>
                  {chemistry === "li-ion" && <Check className="h-4 w-4 shrink-0 text-volt-600" />}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">
                  3.6V nom · 4.2V max
                  <span className="hidden sm:inline">. High energy density for e-bikes, tools &amp; drones.</span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setChemistry("lifepo4");
                  setSelectedCellId("eve-lf105");
                  if (series > 8) setSeries(4);
                }}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition",
                  chemistry === "lifepo4"
                    ? "border-ink-950 bg-emerald-50/40 shadow-soft"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs sm:text-sm">LiFePO4 (Phosphate)</p>
                  {chemistry === "lifepo4" && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">
                  3.2V nom · 3.65V max
                  <span className="hidden sm:inline">. 4000+ cycles, ultra-safe for solar &amp; IPS.</span>
                </p>
              </button>
            </div>
          </div>

          {/* Cell selection */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="font-display flex items-center gap-2.5 text-base font-bold text-slate-900">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-50 text-volt-600 shrink-0">
                <Battery className="h-4 w-4" />
              </span>
              <span>Step 2: Choose Cell Model</span>
            </h3>
            <div className="mt-4 space-y-2.5">
              {availableCells.map((cell) => (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => setSelectedCellId(cell.id)}
                  className={cn(
                    "flex w-full items-center gap-3.5 rounded-2xl border-2 p-3 text-left transition",
                    currentCell.id === cell.id
                      ? "border-ink-950 bg-slate-50 shadow-soft"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image src={cell.image} alt={cell.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {cell.brand}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{cell.name}</p>
                    <p className="text-xs text-slate-500">
                      {cell.capacityAh}Ah · Max {cell.maxDischargeA}A · {cell.weightG}g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold tabular-nums text-slate-900">
                      {formatBDT(cell.pricePerCell)}
                    </p>
                    <p className="text-[10.5px] text-slate-400">per cell</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* S and P Configuration Sliders */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="font-display flex items-center gap-2.5 text-base font-bold text-slate-900">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-50 text-volt-600 shrink-0">
                <Wrench className="h-4 w-4" />
              </span>
              <span>Step 3: Set Series &amp; Parallel Combination</span>
            </h3>

            <div className="mt-6 space-y-6">
              {/* Series */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    Series (S) — Controls Voltage
                  </span>
                  <span className="rounded-lg bg-ink-950 px-2.5 py-0.5 font-display text-sm font-bold text-white tabular-nums">
                    {series}S ({nominalVoltage}V)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={chemistry === "lifepo4" ? 8 : 20}
                  value={series}
                  onChange={(e) => setSeries(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                  <span>1S (3.6V)</span>
                  <span>4S (14.4V)</span>
                  <span>10S (36V)</span>
                  <span>13S (48V)</span>
                  {chemistry !== "lifepo4" && <span>20S (72V)</span>}
                </div>
              </div>

              {/* Parallel */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    Parallel (P) — Controls Capacity &amp; Current
                  </span>
                  <span className="rounded-lg bg-ink-950 px-2.5 py-0.5 font-display text-sm font-bold text-white tabular-nums">
                    {parallel}P ({totalCapacityAh}Ah)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={parallel}
                  onChange={(e) => setParallel(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                  <span>1P</span>
                  <span>3P</span>
                  <span>5P</span>
                  <span>7P</span>
                  <span>10P</span>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={includeBms}
                  onChange={(e) => setIncludeBms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-ink-950"
                />
                <div>
                  <p className="font-semibold text-slate-900">Include matching BMS protection board</p>
                  <p className="text-xs text-slate-500">
                    Suggested: {suggestedBmsRating} (+{formatBDT(bmsEstimatedCost)})
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={includeService}
                  onChange={(e) => setIncludeService(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-ink-950"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    Full assembly &amp; testing service by Glowing Space Dhaka
                  </p>
                  <p className="text-xs text-slate-500">
                    0.15mm pure nickel spot welds, fish paper, wiring harness, PVC wrap &amp; Opus test report (+{formatBDT(weldingCost + hardwareCost)})
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Live Calculation & Order Summary */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  {series}S{parallel}P Pack
                </span>
                <p className="text-xs text-slate-500">{totalCells} × {currentCell.brand} cells</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 font-mono text-xs font-bold text-volt-700">
                {nominalVoltage}V / {totalCapacityAh}Ah
              </span>
            </div>

            {/* Calculated specs grid */}
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3.5">
                <dt className="text-xs text-slate-500">Nominal Voltage</dt>
                <dd className="font-display mt-0.5 text-lg font-bold text-slate-900">{nominalVoltage} V</dd>
                <p className="text-[10.5px] text-slate-400">Full charge: {fullChargeVoltage}V</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5">
                <dt className="text-xs text-slate-500">Total Capacity</dt>
                <dd className="font-display mt-0.5 text-lg font-bold text-slate-900">{totalCapacityAh} Ah</dd>
                <p className="text-[10.5px] text-slate-400">{totalEnergyWh} Wh ({totalEnergyKWh} kWh)</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5">
                <dt className="text-xs text-slate-500">Max Discharge</dt>
                <dd className="font-display mt-0.5 text-lg font-bold text-slate-900">{maxDischargeAmps} A</dd>
                <p className="text-[10.5px] text-slate-400">Peak capability</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5">
                <dt className="text-xs text-slate-500">Est. Pack Weight</dt>
                <dd className="font-display mt-0.5 text-lg font-bold text-slate-900">{estimatedWeightKg} kg</dd>
                <p className="text-[10.5px] text-slate-400">Cells only</p>
              </div>
            </dl>

            {/* Price breakdown */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between items-center py-1 text-slate-600">
                <span className="truncate max-w-[220px] sm:max-w-xs">
                  {totalCells} × {currentCell.brand} ({currentCell.capacityAh}Ah)
                </span>
                <span className="tabular-nums font-semibold shrink-0">{formatBDT(cellCost)}</span>
              </div>
              {includeBms && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>BMS Protection Board</span>
                  <span className="tabular-nums font-semibold">{formatBDT(bmsEstimatedCost)}</span>
                </div>
              )}
              {includeService && (
                <>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Spot welding labour ({totalCells} cells × ৳60)</span>
                    <span className="tabular-nums font-semibold">{formatBDT(weldingCost)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Insulation &amp; PVC heat shrink wrap</span>
                    <span className="tabular-nums font-semibold">{formatBDT(hardwareCost)}</span>
                  </div>
                </>
              )}

              <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-3">
                <span className="text-sm font-bold text-slate-900">Total Estimate</span>
                <span className="font-display text-2xl font-bold tabular-nums text-slate-900">
                  {formatBDT(totalEstimatedCost)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Lead time: 2–4 working days · Dispatched from Multiplan Dhaka
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-950 text-sm font-semibold text-white transition hover:bg-ink-800 active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" /> Add build to cart · {formatBDT(totalEstimatedCost)}
              </button>

              <a
                href={`https://wa.me/8801700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-600 bg-emerald-50 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" /> Discuss specs on WhatsApp
              </a>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              100% genuine cells tested for capacity &amp; IR before welding
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky quote bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 shadow-lift backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">
              {series}S{parallel}P · {nominalVoltage}V · {totalCapacityAh}Ah
            </p>
            <p className="font-display text-xl font-bold tabular-nums text-slate-900">
              {formatBDT(totalEstimatedCost)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink-950 px-5 text-sm font-semibold text-white shadow transition active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
