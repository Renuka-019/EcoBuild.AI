import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  benchmark?: string | number;
  benchmarkLabel?: string;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'alert' | 'neutral';
  note?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  benchmark,
  benchmarkLabel = 'Standard Benchmark',
  icon: Icon,
  status = 'neutral',
  note
}) => {
  let badgeColor = 'bg-mist text-ink2 border-ink/10';
  if (status === 'good') badgeColor = 'bg-lime/20 text-forest border-lime2';
  if (status === 'warning') badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  if (status === 'alert') badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink2/70 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-ink font-mono tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-xs font-mono text-ink2/60">{unit}</span>}
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center text-ink group-hover:bg-lime/30 group-hover:text-forest transition-colors">
          <Icon className="w-6 h-6 stroke-[1.8]" />
        </div>
      </div>

      {benchmark !== undefined && (
        <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs font-mono">
          <span className="text-ink2/60">{benchmarkLabel}:</span>
          <span className="font-semibold text-ink">{benchmark} {unit}</span>
        </div>
      )}

      {note && (
        <p className="mt-2 text-[11px] text-ink2/70 leading-relaxed font-sans">
          {note}
        </p>
      )}
    </div>
  );
};
