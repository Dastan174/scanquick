import UpgradePlans from '@/widgets/upgradePlans/UpgradePlans';
import { getT } from '@/shared/lib/i18n/locale';

export default async function UpgradePage() {
  const t = await getT();
  return <UpgradePlans t={t.upgradePlans} />;
}
