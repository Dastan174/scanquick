import type { LucideIcon } from 'lucide-react';
import scss from './statCard.module.scss';

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'neutral';
}

export default function StatCard({
  label,
  icon: Icon,
  value,
  delta,
  deltaTone = 'positive',
}: StatCardProps) {
  return (
    <div className={scss.card}>
      <div className={scss.top}>
        <span className={scss.label}>{label}</span>
        <span className={scss.icon}>
          <Icon size={16} />
        </span>
      </div>
      <div className={scss.value}>{value}</div>
      {delta && (
        <div className={`${scss.delta} ${deltaTone === 'neutral' ? scss.neutral : ''}`}>
          {delta}
        </div>
      )}
    </div>
  );
}
