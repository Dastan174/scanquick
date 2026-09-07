import Link from 'next/link';
import scss from './pricing.module.scss';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['1 Project', '5 Photos', 'Basic Templates', 'LoveQR Watermark', 'QR Code Download'],
    cta: 'Start Free',
    href: '/projects/new',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$12',
    badge: 'Most Popular',
    features: [
      'Unlimited Projects',
      'Unlimited Photos',
      'All Templates',
      'No Watermark',
      'Custom Slug',
      'Password Protection',
      'Music Upload',
      'Heart Game',
      'Priority Support',
    ],
    cta: 'Get Premium',
    href: '/upgrade',
    highlight: true,
  },
  {
    name: 'Gift',
    price: '$29',
    features: [
      'Everything in Premium',
      'Printed QR Frame',
      'Gift Box Packaging',
      'Handwritten Card',
      'Lifetime Access',
      'White-glove Setup',
    ],
    cta: 'Send a Gift',
    href: '/upgrade',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>Pricing</span>
          <h1>Choose your love plan</h1>
          <div className={scss.list}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`${scss.card} ${plan.highlight ? scss.highlight : ''}`}
              >
                {plan.badge && <span className={scss.badge}>{plan.badge}</span>}
                <span className={scss.name}>{plan.name}</span>
                <div className={scss.price}>
                  <span className={scss.amount}>{plan.price}</span>
                  <span className={scss.period}>/mo</span>
                </div>
                <div className={scss.features}>
                  {plan.features.map((f) => (
                    <div key={f}>
                      <span>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href={plan.href} className={scss.cta}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
