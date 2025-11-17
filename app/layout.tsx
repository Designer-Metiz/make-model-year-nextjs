import './globals.css';
import Script from 'next/script';
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Make Model Year',
    template: '%s | Make Model Year',
  },
  description:
    'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease.',
  keywords: [
    'store locator',
    'business directory',
    'local businesses',
    'store finder',
    'business search',
    'location services',
    'local SEO',
  ],
  authors: [{ name: 'Make Model Year Team' }],
  creator: 'Make Model Year',
  publisher: 'Make Model Year',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Make Model Year',
    title: 'Make Model Year',
    description:
      'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease.',
    url: '/',
    images: ['/assets/new-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@makemodelyear',
    creator: '@makemodelyear',
    title: 'Make Model Year',
    description:
      'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease.',
    images: ['/assets/new-logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'CMytYuT0pIESVq4wKjt-iVkDggavO4IcuoeDtiLeQH8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X6F1D16YWQ"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X6F1D16YWQ');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

