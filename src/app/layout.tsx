import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MetaPixel from '@/components/analytics/MetaPixel';
import CookieBanner from '@/components/analytics/CookieBanner';
import { siteConfig } from '@/lib/site-config';
import { safeJsonLd, organizationLd, websiteLd } from '@/lib/seo/structured-data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${siteConfig.seo.titleSuffix}`,
  },
  description: siteConfig.seo.defaultDescription,
  metadataBase: new URL(siteConfig.baseUrl),
  keywords: siteConfig.seo.keywords,
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    locale: 'it_IT',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
  ...(siteConfig.tracking.searchConsoleId
    ? { verification: { google: siteConfig.tracking.searchConsoleId } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteLd()) }}
        />
      </head>
      <body>
        <GoogleAnalytics gaId={siteConfig.tracking.gaId} />
        <MetaPixel pixelId={siteConfig.tracking.metaPixelId} />
        <Header />
        <main className="pt-20 min-h-screen">{children}</main>
        <Footer />
        <CookieBanner gaId={siteConfig.tracking.gaId} />
      </body>
    </html>
  );
}
