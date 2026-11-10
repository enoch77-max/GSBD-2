import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LiveActivityTicker } from "@/components/ui/LiveActivityTicker";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Glowing Space BD — Cells, Battery Packs, BMS, UPS & DIY Electronics",
    template: "%s · Glowing Space BD",
  },
  description:
    "Bangladesh's trusted store for genuine 18650 / 21700 Li-ion cells, LiFePO4, BMS, router UPS, ESP32 and pack-building tools. Tested cells, fast delivery nationwide.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cats = await getCategories();
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-cyan-200 selection:text-cyan-950">
        <Header
          categories={cats.map((c) => ({
            slug: c.slug,
            name: c.name,
            image: c.image,
            tagline: c.tagline,
          }))}
        />
        <main className="min-h-[60vh] pb-20 lg:pb-0">{children}</main>
        <Footer categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
        <MobileBottomNav />
        <CartDrawer />
        <LiveActivityTicker />
        <Toaster />
      </body>
    </html>
  );
}
