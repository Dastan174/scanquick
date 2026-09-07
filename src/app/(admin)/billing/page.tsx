import BillingHistory from '@/widgets/billingHistory/BillingHistory';
import { getT } from '@/shared/lib/i18n/locale';

export default async function BillingPage() {
  const t = await getT();
  return <BillingHistory t={t.billingHistory} />;
}
