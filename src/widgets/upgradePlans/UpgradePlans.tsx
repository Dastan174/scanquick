'use client';

import { useState } from 'react';
import Link from 'next/link';
import scss from './upgradePlans.module.scss';

const plans = [
  {
    id: 'premium',
    name: 'Premium',
    tag: 'BEST VALUE',
    monthly: 12,
    yearly: 7,
    yearlyNote: 'Billed yearly ($84/year, save $60)',
    features: [
      'Unlimited Projects',
      'All Templates',
      'No Watermark',
      'Custom Slug',
      'Music Upload',
      'Priority Support',
    ],
  },
  {
    id: 'gift',
    name: 'Gift Plan',
    monthly: 29,
    yearly: 29,
    yearlyNote: 'one-time',
    features: [
      'Everything in Premium',
      'Printed QR Frame',
      'Gift Box',
      'Handwritten Card',
      'Lifetime Access',
    ],
  },
];

export default function UpgradePlans() {
  const [billing, setBilling] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [selected, setSelected] = useState<string | null>(null);

  const activePlan = plans.find((p) => p.id === selected);

  return (
    <div className={scss.page}>
      <Link href="/dashboard" className={scss.back}>
        ‹ Back
      </Link>
      <h1>
        Upgrade to <em>Premium</em>
      </h1>
      <p>Unlock your full love story potential.</p>

      <div className={scss.toggle}>
        <button
          className={billing === 'Monthly' ? scss.toggleActive : ''}
          onClick={() => setBilling('Monthly')}
        >
          Monthly
        </button>
        <button
          className={billing === 'Yearly' ? scss.toggleActive : ''}
          onClick={() => setBilling('Yearly')}
        >
          Yearly <span>-40%</span>
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
              {p.tag && <span className={scss.bestValue}>{p.tag}</span>}
              <strong>{p.name}</strong>
              <div className={scss.price}>
                <span className={scss.amount}>${billing === 'Monthly' ? p.monthly : p.yearly}</span>
                <span>{p.id === 'gift' ? 'one-time' : '/mo'}</span>
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
              <strong>Select a plan</strong>
              <p>to continue to payment</p>
            </div>
          ) : (
            <div className={scss.form}>
              <h2>Checkout — {activePlan.name}</h2>
              <label>
                Name on card
                <input placeholder="Sofia Martinez" />
              </label>
              <label>
                Card number
                <input placeholder="4242 4242 4242 4242" />
              </label>
              <div className={scss.fieldRow}>
                <label>
                  Expiry
                  <input placeholder="12/27" />
                </label>
                <label>
                  CVC
                  <input placeholder="123" />
                </label>
              </div>
              <button className={scss.payBtn}>
                Pay ${billing === 'Monthly' ? activePlan.monthly : activePlan.yearly}
                {activePlan.id !== 'gift' ? '/mo' : ''} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
