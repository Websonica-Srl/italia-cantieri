import { formatNumber, formatEuro } from '@/lib/utils';

interface StatItem {
  label: string;
  value: number | string;
  format?: 'number' | 'euro' | 'plain';
  helper?: string;
}

export default function StatsBox({ items, columns = 4 }: { items: StatItem[]; columns?: 2 | 3 | 4 }) {
  const cols = columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 ${cols} gap-4`}>
      {items.map((s, i) => {
        const v =
          s.format === 'euro' && typeof s.value === 'number'
            ? formatEuro(s.value, { compact: true })
            : s.format === 'number' && typeof s.value === 'number'
              ? formatNumber(s.value)
              : s.value;
        return (
          <div key={i} className="rounded-2xl border border-border bg-white p-6">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">{v}</div>
            <div className="mt-1 text-sm font-medium text-foreground/70">{s.label}</div>
            {s.helper && <div className="mt-1 text-xs text-muted-foreground">{s.helper}</div>}
          </div>
        );
      })}
    </div>
  );
}
