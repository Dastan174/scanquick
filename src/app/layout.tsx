import type { Metadata } from 'next';
import { Manrope, Inter, Playfair_Display } from 'next/font/google';
import { getLocale } from '@/shared/lib/i18n/locale';
import './globals.css';
import '@styles/theme.css';

// DM Sans has no Cyrillic glyphs on Google Fonts — Manrope is a close
// geometric-sans match that does, so Russian text keeps the same look.
const dmSans = Manrope({
  variable: '--font-body',
  subsets: ['latin', 'cyrillic'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin', 'cyrillic'],
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'LoveQR — Любовь, закодированная в QR-код',
  description: 'Создайте потрясающий интерактивный сайт с вашей историей любви и подарите его в виде одного QR-кода.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${playfairDisplay.variable} ${inter.className}`}
    >
      <body>{children}</body>
    </html>
  );
}
