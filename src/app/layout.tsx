import type { Metadata } from 'next';
import { DM_Sans, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import '@styles/theme.css';

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'LoveQR — Love, Encoded in a QR Code',
  description:
    'Create a breathtaking interactive website with your love story and gift it as a single QR code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfairDisplay.variable} ${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
