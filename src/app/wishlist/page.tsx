import type { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved electronics components, battery cells and tools.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
