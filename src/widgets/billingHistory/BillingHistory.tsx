import Link from 'next/link';
import { invoices } from '@/shared/lib/mockData';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './billingHistory.module.scss';

export default function BillingHistory({ t }: { t: Dictionary['billingHistory'] }) {
  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className={scss.page}>
      <Link href="/profile" className={scss.back}>
        {t.backToProfile}
      </Link>
      <h1>{t.title}</h1>
      <p>{t.subtitle}</p>

      <div className={scss.summary}>
        <div>
          <span>{t.totalSpent}</span>
          <strong>${totalSpent.toFixed(2)}</strong>
        </div>
        <div>
          <span>{t.invoices}</span>
          <strong>{invoices.length}</strong>
        </div>
        <div>
          <span>{t.currentPlan}</span>
          <strong className={scss.pink}>Premium</strong>
        </div>
      </div>

      <div className={scss.card}>
        <h2>{t.paymentMethod}</h2>
        <div className={scss.paymentMethod}>
          <span className={scss.visa}>VISA</span>
          <div>
            <strong>•••• •••• •••• 4242</strong>
            <span>Expires 12/27</span>
          </div>
          <button>{t.update}</button>
        </div>
      </div>

      <div className={scss.card}>
        <div className={scss.invoicesHeader}>
          <h2>{t.invoicesTitle}</h2>
          <button>{t.downloadAll}</button>
        </div>
        <table className={scss.table}>
          <thead>
            <tr>
              <th>{t.tableInvoice}</th>
              <th>{t.tableDate}</th>
              <th>{t.tableDescription}</th>
              <th>{t.tableAmount}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.date}</td>
                <td>{inv.description}</td>
                <td>${inv.amount.toFixed(2)}</td>
                <td>
                  <button className={scss.pdfBtn}>⬇ PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
