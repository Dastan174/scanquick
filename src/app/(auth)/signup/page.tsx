import Link from 'next/link';
import { signUp } from '../actions';
import scss from '../auth.module.scss';

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className={scss.title}>Create your account</h1>
      <p className={scss.subtitle}>Start your love story — free to try.</p>

      {error && <div className={scss.error}>{error}</div>}

      <form action={signUp}>
        <label className={scss.field}>
          Full name
          <input type="text" name="fullName" placeholder="Sofia Martinez" required />
        </label>
        <label className={scss.field}>
          Email
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label className={scss.field}>
          Password
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>
        <button type="submit" className={scss.submit}>
          Create Account
        </button>
      </form>

      <p className={scss.footer}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
