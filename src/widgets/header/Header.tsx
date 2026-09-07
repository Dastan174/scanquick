import Link from 'next/link';
import scss from './header.module.scss';
import Button from '@/shared/ui/button/Button';

export default function Header() {
  return (
    <header className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <Link href="/" className={scss.logo}>
            <span className={scss.logoIcon}>♥</span>
            LoveQR
          </Link>
          <nav className={scss.links}>
            <Link href="/">Features</Link>
            <Link href="/">Templates</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">FAQ</Link>
          </nav>
          <nav className={scss.actions}>
            <Button variant="ghost" size="sm" href="/login">
              Sign in
            </Button>
            <Button size="sm" href="/signup">
              Start free
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
