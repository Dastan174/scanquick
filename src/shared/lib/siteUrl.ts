// The real, scannable base URL for QR codes and shared links. Falls back to
// the known Vercel production domain when NEXT_PUBLIC_APP_URL is unset or
// still pointing at localhost (the default in .env.local for local dev).
const FALLBACK_SITE_URL = 'https://scanquick.vercel.app';

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured && configured.startsWith('http') && !configured.includes('localhost')) {
    return configured.replace(/\/$/, '');
  }
  return FALLBACK_SITE_URL;
}
