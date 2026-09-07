import Link from 'next/link';
import { signIn } from '../actions';
import scss from '../auth.module.scss';
import { getT, translateAuthError } from '@/shared/lib/i18n/locale';

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;
  const t = await getT();
  const translatedError = error ? await translateAuthError(error) : undefined;

  return (
    <>
      <h1 className={scss.title}>{t.auth.login.title}</h1>
      <p className={scss.subtitle}>{t.auth.login.subtitle}</p>

      {translatedError && <div className={scss.error}>{translatedError}</div>}
      {message && <div className={scss.notice}>{message}</div>}

      <form action={signIn}>
        <label className={scss.field}>
          {t.auth.login.email}
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label className={scss.field}>
          {t.auth.login.password}
          <input type="password" name="password" placeholder="••••••••" required />
        </label>
        <button type="submit" className={scss.submit}>
          {t.auth.login.submit}
        </button>
      </form>

      <p className={scss.footer}>
        {t.auth.login.noAccount} <Link href="/signup">{t.auth.login.createOne}</Link>
      </p>
    </>
  );
}
