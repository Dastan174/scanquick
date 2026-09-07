import Link from 'next/link';
import scss from './footer.module.scss';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Templates', 'Pricing', 'Gift Plans'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Press', 'Careers'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookies', 'Security'],
  },
];

export default function Footer() {
  return (
    <footer className={scss.container}>
      <div className="container">
        <div className={scss.grid}>
          <div className={scss.brand}>
            <div className={scss.logo}>
              <span className={scss.logoIcon}>♥</span>
              LoveQR
            </div>
            <p>Turning love stories into scannable moments of joy, one QR code at a time.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <span className={scss.colTitle}>{col.title}</span>
              <div className={scss.colLinks}>
                {col.links.map((link) => (
                  <Link key={link} href="/">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={scss.bottom}>
          <span>© 2024 LoveQR. Made with ♡</span>
          <span>12,847 love stories created</span>
        </div>
      </div>
    </footer>
  );
}
