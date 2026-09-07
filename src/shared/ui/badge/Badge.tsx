import scss from './badge.module.scss';

type Tone = 'green' | 'gray' | 'pink' | 'red' | 'gold';

const toneByStatus: Record<string, Tone> = {
  published: 'green',
  draft: 'gray',
  premium: 'pink',
  paid: 'pink',
  success: 'green',
  refunded: 'red',
  free: 'gray',
  gift: 'gold',
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
}

export default function Badge({ children, tone }: BadgeProps) {
  const key = String(children).toLowerCase();
  const resolvedTone = tone ?? toneByStatus[key] ?? 'gray';
  return <span className={`${scss.badge} ${scss[resolvedTone]}`}>{children}</span>;
}
