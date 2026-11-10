import type { Metadata } from "next";
import { PackCalculator } from "@/components/builder/PackCalculator";

export const metadata: Metadata = {
  title: "Custom Battery Pack Builder & Calculator",
  description:
    "Design and calculate custom Li-ion and LiFePO4 battery packs. Configure series, parallel, capacity, voltage, BMS rating and instant price estimate for Bangladesh builders.",
};

export default function PackBuilderPage() {
  return <PackCalculator />;
}
