import Link from 'next/link';
import { Heart } from 'lucide-react';
import scss from './auth.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={scss.shell}>
      <Link href="/" className={scss.logo}>
        <span className={scss.logoIcon}>
          <Heart size={16} fill="currentColor" />
        </span>
        LoveQR
      </Link>
      <div className={scss.card}>{children}</div>
    </div>
  );
}
