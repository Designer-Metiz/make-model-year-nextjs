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
    images: ['/assets/Make-Model-year-logo-blueBG.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@makemodelyear',
    creator: '@makemodelyear',
    title: 'Make Model Year',
    description:
      'Discover and connect with local businesses using our advanced store locator technology. Find stores, get directions, and explore business directories with ease.',
    images: ['/assets/Make-Model-year-logo-blueBG.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/MMY-Favicon.ico', sizes: 'any' },
      { url: '/assets/Make-Model-year-logo-blueBG.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/Make-Model-year-logo-blueBG.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/Make-Model-year-logo-blueBG.png',
  },
  verification: {
    google: 'wf0wXY0_57rFb9yhC-HeICobNTHU8c-Iun20dXU3Ihs',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BX6CWPCTLE"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BX6CWPCTLE');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}

