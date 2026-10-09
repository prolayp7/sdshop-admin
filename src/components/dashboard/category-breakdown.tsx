export type CategoryCount = { label: string; count: number };

export function CategoryBreakdown({ categories, loading }: { categories: CategoryCount[]; loading: boolean }) {
  if (loading) return <p className="p-5 text-[13px] text-ink-muted">Loading…</p>;
  if (!categories.length) return <p className="p-5 text-[13px] text-ink-muted">No categories yet.</p>;
  const max = Math.max(1, ...categories.map((category) => category.count));
  return (
    <div className="space-y-4 p-5">
      {categories.map((category) => (
        <div key={category.label}>
          <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
            <span className="font-medium text-ink">{category.label}</span>
            <span className="tabular-nums text-ink-muted">{category.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-tint">
            <div className="h-full rounded-full bg-ink" style={{ width: `${(category.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
