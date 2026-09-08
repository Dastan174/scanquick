import Link from 'next/link';
import { Check } from 'lucide-react';
import scss from './pricing.module.scss';
import { getT } from '@/shared/lib/i18n/locale';

const planMeta = [
  { href: '/projects/new', highlight: false },
  { href: '/upgrade', highlight: true },
  { href: '/upgrade', highlight: false },
];

export default async function Pricing() {
  const t = await getT();

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>{t.pricing.eyebrow}</span>
          <h1>{t.pricing.title}</h1>
          <div className={scss.list}>
            {t.pricing.plans.map((plan, i) => {
              const meta = planMeta[i];
              return (
                <div
                  key={plan.name}
                  className={`${scss.card} ${meta.highlight ? scss.highlight : ''}`}
                >
                  {'badge' in plan && plan.badge && <span className={scss.badge}>{plan.badge}</span>}
                  <span className={scss.name}>{plan.name}</span>
                  <div className={scss.price}>
                    <span className={scss.amount}>{plan.price}</span>
                    <span className={scss.period}>{t.pricing.perMonth}</span>
                  </div>
                  <div className={scss.features}>
                    {plan.features.map((f) => (
                      <div key={f}>
                        <span>
                          <Check size={14} />
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href={meta.href} className={scss.cta}>
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
