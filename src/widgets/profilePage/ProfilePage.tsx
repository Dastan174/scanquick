'use client';

import { useState } from 'react';
import { Check, Pencil, Sparkles } from 'lucide-react';
import Badge from '@/shared/ui/badge/Badge';
import BillingHistory from '@/widgets/billingHistory/BillingHistory';
import { currentUser } from '@/shared/lib/mockData';
import { updateProfile } from '@/app/(admin)/profile/actions';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { memberSince as formatMemberSince } from '@/shared/lib/i18n/format';
import scss from './profilePage.module.scss';

interface ProfilePageProps {
  name: string;
  email: string;
  plan: string;
  memberSince: string;
  locale: Locale;
  t: Dictionary;
}

export default function ProfilePage({ name, email, plan, memberSince, locale, t }: ProfilePageProps) {
  const p = t.profilePage;
  const [tab, setTab] = useState(0);

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
          <span className={scss.editBadge}>
            <Pencil size={12} />
          </span>
        </span>
        <div>
          <h1>{name}</h1>
          <span className={scss.meta}>
            <Badge tone="pink" label={plan === 'free' ? t.common.free : t.common.premium}>
              {plan}
            </Badge>
            {memberSince && <>{formatMemberSince(locale, memberSince)}</>}
          </span>
        </div>
      </div>

      <div className={scss.tabs}>
        {p.tabs.map((label, i) => (
          <button key={label} className={tab === i ? scss.tabActive : ''} onClick={() => setTab(i)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <form action={updateProfile} className={scss.card}>
            <h2>{p.personalInfo}</h2>
            <label className={scss.field}>
              {p.fullName}
              <input name="fullName" defaultValue={name} />
            </label>
            <label className={scss.field}>
              {p.emailAddress}
              <input value={email} disabled />
            </label>
            <label className={scss.field}>
              {p.language}
              <select defaultValue="Русский">
                <option>Русский</option>
                <option>English</option>
              </select>
            </label>
            <button type="submit" className={scss.saveBtn}>
              {p.saveChanges}
            </button>
          </form>

          <div className={scss.card}>
            <h2>{p.changePassword}</h2>
            <label className={scss.field}>
              {p.currentPassword}
              <input type="password" />
            </label>
            <label className={scss.field}>
              {p.newPassword}
              <input type="password" />
            </label>
            <label className={scss.field}>
              {p.confirmPassword}
              <input type="password" />
            </label>
            <button className={scss.saveBtn}>{p.updatePassword}</button>
          </div>
        </>
      )}

      {tab === 1 && (
        <div className={scss.subCard}>
          <div className={scss.subHeader}>
            <div>
              <span className={scss.subIcon}>
                <Sparkles size={20} />
              </span>
              <strong>{p.premiumPlan}</strong>
              <span className={scss.subMeta}>{p.activeRenews}</span>
            </div>
          </div>
          <div className={scss.subStats}>
            <div>
              <span>{p.projects}</span>
              <strong>{currentUser.projectsCount} / ∞</strong>
            </div>
            <div>
              <span>{p.plan}</span>
              <strong>{p.annual}</strong>
            </div>
            <div>
              <span>{p.nextBill}</span>
              <strong>$84</strong>
            </div>
          </div>
          <div className={scss.subActions}>
            <button className={scss.manageBtn}>{p.manageBilling}</button>
            <button className={scss.cancelBtn}>{p.cancelPlan}</button>
          </div>
          <h3>{p.planFeatures}</h3>
          <div className={scss.features}>
            {p.features.map((f) => (
              <div key={f}>
                <span>
                  <Check size={14} />
                </span>{' '}
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && <BillingHistory t={t.billingHistory} />}
    </div>
  );
}
