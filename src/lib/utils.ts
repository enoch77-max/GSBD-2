export function formatBDT(amount: number) {
  return "৳" + amount.toLocaleString("en-IN");
}

export function discountPct(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff} days ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} month${Math.floor(diff / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 365)} year${Math.floor(diff / 365) > 1 ? "s" : ""} ago`;
}

export const SHIPPING = {
  dhaka: { label: "Inside Dhaka", fee: 70, eta: "1–2 days" },
  outside: { label: "Outside Dhaka", fee: 130, eta: "2–4 days" },
  pickup: { label: "Store pickup (Elephant Road)", fee: 0, eta: "Same day" },
} as const;

export const FREE_SHIPPING_THRESHOLD = 5000;

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCompact(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
  return String(n);
}
