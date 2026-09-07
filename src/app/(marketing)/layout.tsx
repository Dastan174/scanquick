import Header from '@/widgets/header/Header';
import Footer from '@/widgets/footer/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
