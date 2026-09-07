import ProjectWizard from '@/widgets/projectWizard/ProjectWizard';
import { getT, getLocale } from '@/shared/lib/i18n/locale';

export default async function NewProjectPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  return <ProjectWizard locale={locale} t={t.projectWizard} />;
}
