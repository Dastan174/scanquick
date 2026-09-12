import Hero from '@/widgets/hero/Hero';
import HowItWork from '@/widgets/howItWork/HowItWork';
import WhyLove from '@/widgets/whyLove/WhyLove';
import Pricing from '@/widgets/pricing/Pricing';
import Faq from '@/widgets/faq/Faq';
import Cta from '@/widgets/cta/Cta';
import { getT } from '@/shared/lib/i18n/locale';

const page = async () => {
  const t = await getT();
  return (
    <>
      <Hero />
      <WhyLove />
      <HowItWork />
      <Pricing />
      <Faq t={t.faq} />
      <Cta />
    </>
  );
};

export default page;
