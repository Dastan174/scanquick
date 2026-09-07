import AdminPanel from '@/widgets/adminPanel/AdminPanel';
import { getT } from '@/shared/lib/i18n/locale';

export default async function AdminPage() {
  const t = await getT();
  return <AdminPanel t={t.adminPanel} />;
}
