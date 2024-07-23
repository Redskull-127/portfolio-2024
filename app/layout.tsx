import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import RootComponent from '@/components/root';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NextAuthProvider from '@/lib/client/providers/NextAuthSessionProvider';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Children } from '@/lib/types/children';
import OG_IMG from '@/public/static/opengraph/image.png';
import Favicon from '@/public/favicon.ico';
import ConnectivityStatus from '@/lib/client/functions/connectivity-status';
import { Analytics } from '@vercel/analytics/react';
import { ChromeCastProvider } from '@/lib/client/providers/CastProvider';
import Script from 'next/script';
import { DriverProvider } from '@/lib/client/providers/Driver';
import DynamicIsland from '@/lib/client/functions/dynamic-island';
import { TailwindIndicator } from '@/lib/taillwind-indicator';
import { CSPostHogProvider } from '@/lib/client/providers/Posthog';
import { IntroDialogProvider } from '@/lib/client/providers/intro-provider';
import { siteConfig } from '@/site-config';
import TanstackProvider from '@/lib/client/providers/TanstackProvider';
const santoshiSans = localFont({
  src: './Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meertarbani.in'),
  title: siteConfig.about.name,
  description: `${siteConfig.about.name} Portfolio Website`,
  keywords: siteConfig.seo.keywords,
  icons: [
    {
      rel: 'icon',
      url: Favicon.src,
    },
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: siteConfig.about.name,
    description: `${siteConfig.about.name} Portfolio Website`,
    url: siteConfig.url,
    siteName: siteConfig.about.name,
    images: [
      {
        url: OG_IMG.src, // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <Script
        src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        defer
        async
      ></Script>
      <Script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={process.env['CF_WEB_TOKEN'] as string}
      ></Script>
      <CSPostHogProvider>
        <body
          className={cn(
            'min-h-screen bg-background antialiased transition-all duration-200',
            santoshiSans.className,
          )}
        >
          <TanstackProvider>
            <IntroDialogProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <SpeedInsights />
                <NextAuthProvider>
                  <ConnectivityStatus>
                    <ChromeCastProvider>
                      <DynamicIsland />
                      <DriverProvider>
                        <main className="flex flex-wrap gap-8 h-screen w-screen font-sans p-10 max-xl:gap-5 max-xl:px-5">
                          <RootComponent />
                          {children}
                          <Analytics />
                          <TailwindIndicator />
                        </main>
                      </DriverProvider>
                      <Toaster />
                      <Sonner />
                    </ChromeCastProvider>
                  </ConnectivityStatus>
                </NextAuthProvider>
              </ThemeProvider>
            </IntroDialogProvider>
          </TanstackProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
