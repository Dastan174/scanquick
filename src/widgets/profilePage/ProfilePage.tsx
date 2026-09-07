'use client';

import { useState } from 'react';
import Badge from '@/shared/ui/badge/Badge';
import BillingHistory from '@/widgets/billingHistory/BillingHistory';
import { currentUser } from '@/shared/lib/mockData';
import { updateProfile } from '@/app/(admin)/profile/actions';
import scss from './profilePage.module.scss';

const tabs = ['Profile', 'Subscription', 'Billing History'] as const;

const subscriptionFeatures = [
  'Unlimited Projects',
  'All 6 Templates',
  'No Watermark',
  'Custom URL Slug',
  'Password Protection',
  'Music Upload',
  'Heart Game',
  'Priority Support',
];

interface ProfilePageProps {
  name: string;
  email: string;
  plan: string;
  memberSince: string;
}

export default function ProfilePage({ name, email, plan, memberSince }: ProfilePageProps) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile');

  const initials =
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('') || '?';

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <span className={scss.avatar}>
          {initials}
          <span className={scss.editBadge}>✎</span>
        </span>
        <div>
          <h1>{name}</h1>
          <span className={scss.meta}>
            <Badge tone="pink">{plan}</Badge>
            {memberSince && <>Member since {memberSince}</>}
          </span>
        </div>
      </div>

      <div className={scss.tabs}>
        {tabs.map((t) => (
          <button key={t} className={tab === t ? scss.tabActive : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Profile' && (
        <>
          <form action={updateProfile} className={scss.card}>
            <h2>Personal Information</h2>
            <label className={scss.field}>
              Full name
              <input name="fullName" defaultValue={name} />
            </label>
            <label className={scss.field}>
              Email address
              <input value={email} disabled />
            </label>
            <label className={scss.field}>
              Language
              <select defaultValue="English (US)">
                <option>English (US)</option>
                <option>Español</option>
                <option>Français</option>
                <option>Italiano</option>
                <option>Português</option>
              </select>
            </label>
            <button type="submit" className={scss.saveBtn}>
              Save Changes
            </button>
          </form>

          <div className={scss.card}>
            <h2>Change Password</h2>
            <label className={scss.field}>
              Current password
              <input type="password" />
            </label>
            <label className={scss.field}>
              New password
              <input type="password" />
            </label>
            <label className={scss.field}>
              Confirm new password
              <input type="password" />
            </label>
            <button className={scss.saveBtn}>Update Password</button>
          </div>
        </>
      )}

      {tab === 'Subscription' && (
        <div className={scss.subCard}>
          <div className={scss.subHeader}>
            <div>
              <span className={scss.subIcon}>✦</span>
              <strong>Premium Plan</strong>
              <span className={scss.subMeta}>Active · Renews December 14, 2024</span>
            </div>
          </div>
          <div className={scss.subStats}>
            <div>
              <span>Projects</span>
              <strong>{currentUser.projectsCount} / ∞</strong>
            </div>
            <div>
              <span>Plan</span>
              <strong>Annual</strong>
            </div>
            <div>
              <span>Next bill</span>
              <strong>$84</strong>
            </div>
          </div>
          <div className={scss.subActions}>
            <button className={scss.manageBtn}>Manage Billing</button>
            <button className={scss.cancelBtn}>Cancel Plan</button>
          </div>
          <h3>Plan Features</h3>
          <div className={scss.features}>
            {subscriptionFeatures.map((f) => (
              <div key={f}>
                <span>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Billing History' && <BillingHistory />}
    </div>
  );
}
