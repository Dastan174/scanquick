import Hero from '@/widgets/hero/Hero';
import HowItWork from '@/widgets/howItWork/HowItWork';
import WhyLove from '@/widgets/whyLove/WhyLove';
import Templates from '@/widgets/templates/Templates';
import Pricing from '@/widgets/pricing/Pricing';
import Faq from '@/widgets/faq/Faq';
import Cta from '@/widgets/cta/Cta';

const page = () => (
  <>
    <Hero />
    <WhyLove />
    <HowItWork />
    <Templates />
    <Pricing />
    <Faq />
    <Cta />
  </>
);

export default page;
