'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './upgradePlans.module.scss';

const planMeta = [
  { id: 'premium', monthly: 990, yearly: 700 },
  { id: 'gift', monthly: 2490, yearly: 2490 },
];

export default function UpgradePlans({ t }: { t: Dictionary['upgradePlans'] }) {
  const [billing, setBilling] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [selected, setSelected] = useState<string | null>(null);

  const plans = t.plans.map((p, i) => ({ ...p, ...planMeta[i] }));
  const activePlan = plans.find((p) => p.id === selected);

  return (
    <div className={scss.page}>
      <Link href="/dashboard" className={scss.back}>
        {t.back}
      </Link>
      <h1>
        {t.title1} <em>{t.titleEm}</em>
      </h1>
      <p>{t.subtitle}</p>

      <div className={scss.toggle}>
        <button
          className={billing === 'Monthly' ? scss.toggleActive : ''}
          onClick={() => setBilling('Monthly')}
        >
          {t.monthly}
        </button>
        <button
          className={billing === 'Yearly' ? scss.toggleActive : ''}
          onClick={() => setBilling('Yearly')}
        >
          {t.yearly} <span>{t.yearlyDiscount}</span>
        </button>
      </div>

      <div className={scss.grid}>
        <div className={scss.plans}>
          {plans.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              className={`${scss.planCard} ${p.id === 'premium' ? scss.planHighlight : ''} ${selected === p.id ? scss.planSelected : ''}`}
              onClick={() => setSelected(p.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(p.id)}
            >
              {'tag' in p && p.tag && <span className={scss.bestValue}>{p.tag}</span>}
              <strong>{p.name}</strong>
              <div className={scss.price}>
                <span className={scss.amount}>{billing === 'Monthly' ? p.monthly : p.yearly} ₽</span>
                <span>{p.id === 'gift' ? t.oneTime : t.perMonth}</span>
              </div>
              {p.id !== 'gift' && billing === 'Yearly' && (
                <span className={scss.billedNote}>{p.yearlyNote}</span>
              )}
              <div className={scss.features}>
                {p.features.map((f) => (
                  <div key={f}>
                    <span>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={scss.checkout}>
          {!activePlan ? (
            <div className={scss.empty}>
              <span>♡</span>
              <strong>{t.selectPlan}</strong>
              <p>{t.selectPlanDescr}</p>
            </div>
          ) : (
            <div className={scss.form}>
              <h2>
                {t.checkout} {activePlan.name}
              </h2>
              <label>
                {t.nameOnCard}
                <input placeholder="Sofia Martinez" />
              </label>
              <label>
                {t.cardNumber}
                <input placeholder="4242 4242 4242 4242" />
              </label>
              <div className={scss.fieldRow}>
                <label>
                  {t.expiry}
                  <input placeholder="12/27" />
                </label>
                <label>
                  {t.cvc}
                  <input placeholder="123" />
                </label>
              </div>
              <button className={scss.payBtn}>
                {t.pay} {billing === 'Monthly' ? activePlan.monthly : activePlan.yearly} ₽
                {activePlan.id !== 'gift' ? t.perMonth : ''} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
