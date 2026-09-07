import Link from 'next/link';
import { signIn } from '../actions';
import scss from '../auth.module.scss';

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <>
      <h1 className={scss.title}>Welcome back</h1>
      <p className={scss.subtitle}>Sign in to keep building your love story.</p>

      {error && <div className={scss.error}>{error}</div>}
      {message && <div className={scss.notice}>{message}</div>}

      <form action={signIn}>
        <label className={scss.field}>
          Email
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label className={scss.field}>
          Password
          <input type="password" name="password" placeholder="••••••••" required />
        </label>
        <button type="submit" className={scss.submit}>
          Sign In
        </button>
      </form>

      <p className={scss.footer}>
        Don&apos;t have an account? <Link href="/signup">Create one</Link>
      </p>
    </>
  );
}
