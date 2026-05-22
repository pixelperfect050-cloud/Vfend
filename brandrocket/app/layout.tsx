import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider, PostHogPageView } from "@/components/providers/posthog-provider";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandRocket — Your AI Growth Team",
  description: "Describe your growth goal. Your autonomous AI agents plan, build, and launch campaigns while you sleep.",
  openGraph: {
    title: "BrandRocket — Your AI Growth Team",
    description: "Describe your growth goal. Your autonomous AI agents plan, build, and launch campaigns while you sleep.",
    url: "https://brandrocket.io",
    siteName: "BrandRocket",
    images: [
      {
        url: "https://brandrocket.io/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BrandRocket — Autonomous AI Growth Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandRocket — Your AI Growth Team",
    description: "Describe your growth goal. Your autonomous AI agents plan, build, and launch campaigns while you sleep.",
    images: ["https://brandrocket.io/og-image.jpg"],
    creator: "@brandrocket",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>
                <Suspense fallback={null}>
                  <PostHogPageView />
                </Suspense>
                {children}
                <Toaster />
              </TooltipProvider>
            </QueryProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
