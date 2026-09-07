import Link from 'next/link';
import scss from './auth.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={scss.shell}>
      <Link href="/" className={scss.logo}>
        <span className={scss.logoIcon}>♥</span>
        LoveQR
      </Link>
      <div className={scss.card}>{children}</div>
    </div>
  );
}
