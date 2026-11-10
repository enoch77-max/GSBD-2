import Link from "next/link";
import { Unplug } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-slate-300"><Unplug className="h-10 w-10" /></span>
      <h1 className="font-display mt-6 text-3xl font-bold">Circuit open — page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page or order you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <Link href="/" className="mt-6 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-white">Back to home</Link>
    </div>
  );
}
