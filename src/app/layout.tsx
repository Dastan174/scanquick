import type { Metadata } from 'next';
import { Manrope, Inter, Playfair_Display, Marck_Script } from 'next/font/google';
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

// Handwritten cursive for intimate, "personal note" moments in the love
// story (typewriter reveal, quote cards, balloon message, hold-heart hint) —
// distinct from Playfair Display, which is the app's structural heading font.
const marckScript = Marck_Script({
  variable: '--font-script',
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'scanquick.kg — Любовь, закодированная в QR-код',
  description:
    'Создайте потрясающий интерактивный сайт с вашей историей любви и подарите его в виде одного QR-кода.',
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
      className={`${dmSans.variable} ${playfairDisplay.variable} ${marckScript.variable} ${inter.className}`}
    >
      <body>{children}</body>
    </html>
  );
}
