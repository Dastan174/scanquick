import Link from 'next/link';
import Image from 'next/image';
import scss from './auth.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={scss.shell}>
      <Link href="/" className={scss.logo}>
        <span className={scss.logoIcon}>
          <Image src="/logo.png" alt="" width={36} height={36} />
        </span>
        scanquick.kg
      </Link>
      <div className={scss.card}>{children}</div>
    </div>
  );
}
