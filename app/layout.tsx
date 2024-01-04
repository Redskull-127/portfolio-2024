import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import RootComponent from "@/components/root";
import CommandProvider from "@/lib/commandbar/provider";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SpotifyTip } from "@/lib/client/functions/initialfunctions";
import NextAuthProvider from "@/lib/client/providers/NextAuthSessionProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Children } from "@/lib/types/children";

const santoshiSans = localFont({
  src: "./Satoshi-Variable.woff2",
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `Meer Tarbani`,
  description: `Meer Tarbani's Portfolio Website`,
  keywords:
    "Meer Tarbani, Meer, Tarbani, Portfolio, Website, meer tarbani, meer tarbani acid, meer tarbani as a fraction, meer tarbani ba, meer tarbani bali, meer tarbani bangla, meer tarbani bangla lyrics, meer tarbani battery, meer tarbani bank, meer tarbani blood pressure, meer tarbani chords, meer tarbani com, meer tarbani code, meer tarbani center, meer tarbani de, meer tarbani delhi, meer tarbani dei, meer tarbani dit, meer tarbani definition, meer tarbani download, meer tarbani disease, meer tarbani english translation, meer tarbani english lyrics, meer tarbani english, meer tarbani english pdf, meer tarbani english subtitles, meer tarbani englisch, meer tarbani example, meer tarbani film, meer tarbani facebook, meer tarbani full movie, meer tarbani fakaza, meer tarbani font, meer tarbani file, meer tarbani for sale,  eer tarbani gif, meer tarbani google translate,  meer tarbani google scholar, meer tarbani google, meer tarbani google drive, meer tarbani games, meer tarbani germany",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased transition-all duration-200",
          santoshiSans.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SpeedInsights />
          <NextAuthProvider>
            <CommandProvider>
              <main className="flex gap-8 h-screen w-full p-10 font-sans flex-wrap max-xl:gap-5 max-xl:px-6">
                <RootComponent />
                {children}
              </main>
              <Toaster />
              <Sonner />
              <SpotifyTip />
            </CommandProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
