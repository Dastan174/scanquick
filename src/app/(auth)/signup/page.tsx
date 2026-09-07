import Link from 'next/link';
import { signUp } from '../actions';
import scss from '../auth.module.scss';
import { getT, translateAuthError } from '@/shared/lib/i18n/locale';

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;
  const t = await getT();
  const translatedError = error ? await translateAuthError(error) : undefined;

  return (
    <>
      <h1 className={scss.title}>{t.auth.signup.title}</h1>
      <p className={scss.subtitle}>{t.auth.signup.subtitle}</p>

      {translatedError && <div className={scss.error}>{translatedError}</div>}

      <form action={signUp}>
        <label className={scss.field}>
          {t.auth.signup.fullName}
          <input type="text" name="fullName" placeholder="Sofia Martinez" required />
        </label>
        <label className={scss.field}>
          {t.auth.signup.email}
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label className={scss.field}>
          {t.auth.signup.password}
          <input
            type="password"
            name="password"
            placeholder={t.auth.signup.passwordHint}
            minLength={6}
            required
          />
        </label>
        <button type="submit" className={scss.submit}>
          {t.auth.signup.submit}
        </button>
      </form>

      <p className={scss.footer}>
        {t.auth.signup.haveAccount} <Link href="/login">{t.auth.signup.signIn}</Link>
      </p>
    </>
  );
}
