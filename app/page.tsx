export const generateMetadata = () => ({
  title: 'Make Model Year | Discover the Best Vehicle Insights',
  description:
    'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease. Perfect for businesses looking to improve their local presence.',
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
      'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease. Perfect for businesses looking to improve their local presence.',
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

