import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import { cn } from '@/lib/utils';
import '../../globals.css';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { Toaster as DefaultToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import NextAuthProvider from '@/lib/client/providers/NextAuthSessionProvider';
import ConnectivityStatus from '@/lib/client/functions/connectivity-status';
import { TailwindIndicator } from '@/lib/taillwind-indicator';
import { CSPostHogProvider } from '@/lib/client/providers/Posthog';
import TanstackProvider from '@/lib/client/providers/TanstackProvider';

import OG_IMG from '@/public/static/opengraph/image.png';
import Favicon from '@/public/favicon.ico';
import { siteConfig } from '@/site-config';
import { Children } from '@/lib/types/children';
import { DockDemo } from '@/components/job-board/components/navbar';
import JobBoardFlag from '@/lib/feature-flags/job-board';

const santoshiSans = localFont({
  src: '../../Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.pages.JobBoard.link),
  title: siteConfig.pages.JobBoard.title,
  description: siteConfig.pages.JobBoard.description,
  keywords: siteConfig.pages.JobBoard.keywords,
  icons: [{ rel: 'icon', url: Favicon.src }],
  manifest: '/manifest.json',
  openGraph: {
    title: siteConfig.pages.JobBoard.title,
    description: siteConfig.pages.JobBoard.description,
    url: siteConfig.pages.JobBoard.link,
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
  return (
    <html>
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

      <CSPostHogProvider>
        <body
          className={cn(
            'min-h-screen bg-background antialiased transition-all duration-200',
            santoshiSans.className,
          )}
        >
          <JobBoardFlag>
            <TanstackProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <SpeedInsights />
                <NextAuthProvider>
                  <ConnectivityStatus>
                    <main className="flex flex-wrap gap-8 h-screen w-screen font-sans p-10 max-xl:gap-5 max-xl:px-5 min-[2000px]:container min-[2000px]:size-fit">
                      <DockDemo />
                      {children}
                      <Analytics />
                      <TailwindIndicator />
                    </main>
                    <DefaultToaster />
                    <SonnerToaster />
                  </ConnectivityStatus>
                </NextAuthProvider>
              </ThemeProvider>
            </TanstackProvider>
          </JobBoardFlag>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
