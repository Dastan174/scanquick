import scss from './statCard.module.scss';

interface StatCardProps {
  label: string;
  icon: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'neutral';
}

export default function StatCard({
  label,
  icon,
  value,
  delta,
  deltaTone = 'positive',
}: StatCardProps) {
  return (
    <div className={scss.card}>
      <div className={scss.top}>
        <span className={scss.label}>{label}</span>
        <span className={scss.icon}>{icon}</span>
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
