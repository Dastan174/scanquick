import Link from 'next/link';
import scss from './header.module.scss';
import Button from '@/shared/ui/button/Button';

export default function Header() {
  return (
    <header className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h3>Scanquick.kg</h3>
          <nav>
            <Link href="/">Features</Link>
            <Link href="/">Templates</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">FAQ</Link>
          </nav>
          <nav>
            <Button variant="ghost">Sign in</Button>
            <Button>Start free</Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
