import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { cn } from '@/lib/utils';
import '../globals.css';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import RootComponent from '@/components/root';
import { Toaster as DefaultToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import NextAuthProvider from '@/lib/client/providers/NextAuthSessionProvider';
import ConnectivityStatus from '@/lib/client/functions/connectivity-status';
import { ChromeCastProvider } from '@/lib/client/providers/CastProvider';
import { DriverProvider } from '@/lib/client/providers/Driver';
import DynamicIsland from '@/lib/client/functions/dynamic-island';
import { TailwindIndicator } from '@/lib/taillwind-indicator';
import { CSPostHogProvider } from '@/lib/client/providers/Posthog';
import { IntroDialogProvider } from '@/lib/client/providers/intro-provider';
import TanstackProvider from '@/lib/client/providers/TanstackProvider';

import OG_IMG from '@/public/static/opengraph/image.png';
import Favicon from '@/public/favicon.ico';
import { siteConfig } from '@/site-config';
import { Children } from '@/lib/types/children';

import { GoogleTagManager } from '@next/third-parties/google';
import SurfaceFormScript from './SurfaceConstructor';

const santoshiSans = localFont({
  src: '../Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meertarbani.in'),
  title: siteConfig.about.name,
  description: `${siteConfig.about.name} Portfolio Website`,
  keywords: siteConfig.seo.keywords,
  icons: [{ rel: 'icon', url: Favicon.src }],
  manifest: '/manifest.json',
  openGraph: {
    title: siteConfig.about.name,
    description: `${siteConfig.about.name} Portfolio Website`,
    url: siteConfig.url,
    siteName: siteConfig.about.name,
    images: [
      {
        url: OG_IMG.src,
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

export default async function RootLayout({ children }: Children) {
  const locale = await getLocale();
  const dictionary = await getMessages();

  return (
    <html lang={locale}>
        <Script
          src="https://cdn.jsdelivr.net/gh/trysurface/scripts@latest/surface_tag.min.js"
          strategy="beforeInteractive"
         />
      {/* External Scripts */}
      <Script
        src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        defer
        async
      />
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        defer
        data-cf-beacon={process.env['CF_WEB_TOKEN'] as string}
      />
      <GoogleTagManager gtmId="GTM-PRZBRVWT" />
      <CSPostHogProvider>
        <body
          className={cn(
            'min-h-screen bg-background antialiased transition-all duration-200',
            santoshiSans.className,
          )}
        >
          <TanstackProvider>
            <NextIntlClientProvider messages={dictionary}>
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
                          <main className="flex flex-wrap gap-8 h-screen w-screen font-sans p-10 max-xl:gap-5 max-xl:px-5 min-[2000px]:container min-[2000px]:size-fit">
                            <RootComponent />
                            {children}
                            <Analytics />
                            <TailwindIndicator />
                          </main>
                        </DriverProvider>
                        <DefaultToaster />
                        <SonnerToaster />
                      </ChromeCastProvider>
                    </ConnectivityStatus>
                  </NextAuthProvider>
                </ThemeProvider>
              </IntroDialogProvider>
            </NextIntlClientProvider>
          </TanstackProvider>
          <SurfaceFormScript
           formUrl="https://forms.withsurface.com/s/cmim9xinr0001jx0bnrvkbjk5" // Replace this with a Surface Form URL
           embedType="popup"
           popupSize="medium" // "small", "medium", "large"
           buttonClassName="surface-form-button"
         />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
