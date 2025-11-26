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

import Script from 'next/script';
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
  const ldJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.makemodelyear.in/#website',
        url: 'https://www.makemodelyear.in',
        name: 'Make Model Year',
        description:
          'Make Model Year helps users identify car make, model, and year details with quick and accurate vehicle lookup.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.makemodelyear.in/search?query={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.makemodelyear.in/#organization',
        name: 'Make Model Year',
        url: 'https://www.makemodelyear.in',
        logo: 'https://www.makemodelyear.in/logo.png',
        description:
          'A platform helping users easily find car make, model and year details with a user-friendly search system.',
        sameAs: [],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.makemodelyear.in/#webpage',
        url: 'https://www.makemodelyear.in',
        name: 'Make Model Year - Car Make, Model & Year Lookup',
        description:
          'Find accurate car Make, Model, and Year details instantly with Make Model Year’s easy online search tool.',
        isPartOf: {
          '@id': 'https://www.makemodelyear.in/#website',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.makemodelyear.in/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is MSPL AutoPartsFinderPro?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "It's a Shopify app that adds a Make, Model, and Year search to your store, making it easier for customers to find what they're looking for.",
            },
          },
          {
            '@type': 'Question',
            name: 'Is it only for auto parts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, it can be used for any industry that needs filtered search. It works for auto parts, hardware, electronics, and any industry where customers search by attributes.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does it cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It costs $9.99 per month with a 3-day free trial and no hidden fees or setup costs.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I get started?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Click the 'Get a 3-Day Free Trial' button and follow the instructions on the Shopify App Store. Installation takes just a few minutes.",
            },
          },
          {
            '@type': 'Question',
            name: 'Does it work with my Shopify theme?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, MSPL AutoPartsFinderPro works with all the latest Shopify themes and integrates seamlessly with your store design.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I customize the search attributes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, you can customize search attributes to match your industry needs, whether it\'s Make/Model/Year or other filters.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does setup take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most stores can complete the setup and go live in less than 30 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I import thousands of products?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, the bulk CSV import feature supports large catalogs efficiently.',
            },
          },
        ],
      },
    ],
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Script
          id="ldjson-home"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
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

