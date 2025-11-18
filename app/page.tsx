export const generateMetadata = () => ({
  title: 'Make Model Year | Discover the Best Vehicle Insights',
  description:
    'Find the right auto parts with our Make Model Year search for Shopify. Boost accuracy, reduce returns, and grow sales. Try it now.',
  keywords: [
    'store locator',
    'business directory',
    'local businesses',
    'store finder',
    'business search',
    'location services',
    'business listings',
    'local SEO',
  ],
  openGraph: {
    title: 'Make Model Year | Discover the Best Vehicle Insights',
    description:
      'Find the right auto parts with our Make Model Year search for Shopify. Boost accuracy, reduce returns, and grow sales. Try it now.',
    type: 'website',
    url: '/',
  },
});

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import WhoIsThisFor from '@/components/WhoIsThisFor';
import PricingAndFeatures from '@/components/PricingAndFeatures';
import Testimonials from '@/components/Testimonials';
import Experience from '@/components/Experience';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <WhoIsThisFor />
        <PricingAndFeatures />
        <Testimonials />
        <Experience />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

