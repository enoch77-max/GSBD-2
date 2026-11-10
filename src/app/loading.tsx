export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-64 rounded-lg" />
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/80">
            <div className="skeleton aspect-square" />
            <div className="space-y-2 p-4"><div className="skeleton h-3 w-16 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-6 w-24 rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
