import Link from 'next/link';
import { invoices } from '@/shared/lib/mockData';
import scss from './billingHistory.module.scss';

export default function BillingHistory() {
  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className={scss.page}>
      <Link href="/profile" className={scss.back}>
        ‹ Back to Profile
      </Link>
      <h1>Billing History</h1>
      <p>All your past invoices and payments</p>

      <div className={scss.summary}>
        <div>
          <span>Total Spent</span>
          <strong>${totalSpent.toFixed(2)}</strong>
        </div>
        <div>
          <span>Invoices</span>
          <strong>{invoices.length}</strong>
        </div>
        <div>
          <span>Current Plan</span>
          <strong className={scss.pink}>Premium</strong>
        </div>
      </div>

      <div className={scss.card}>
        <h2>Payment Method</h2>
        <div className={scss.paymentMethod}>
          <span className={scss.visa}>VISA</span>
          <div>
            <strong>•••• •••• •••• 4242</strong>
            <span>Expires 12/27</span>
          </div>
          <button>Update</button>
        </div>
      </div>

      <div className={scss.card}>
        <div className={scss.invoicesHeader}>
          <h2>Invoices</h2>
          <button>Download All</button>
        </div>
        <table className={scss.table}>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
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
