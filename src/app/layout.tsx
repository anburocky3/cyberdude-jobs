import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000"
  ),
  title: {
    default: "CyberDude Careers & Free Internships",
    template: "%s | CyberDude Jobs",
  },
  description:
    "Join the CyberDude Networks community and find your dream job today! We are hiring for full-time and internship roles. We are a team of 20+ engineers and we are looking for new members to join our team.",
  applicationName: "CyberDude Jobs",
  keywords: [
    "jobs",
    "tech jobs",
    "internships",
    "software engineer",
    "CyberDude",
  ],
  authors: [{ name: "CyberDude" }],
  creator: "CyberDude",
  publisher: "CyberDude",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "CyberDude Jobs",
    title: "CyberDude Careers & Free Internships",
    description:
      "Join the CyberDude Networks community and find your dream job today! We are hiring for full-time and internship roles. We are a team of 20+ engineers and we are looking for new members to join our team.",
    url: "/",
    images: [
      {
        url: "/cyberdude-jobs-banner.png",
        width: 1200,
        height: 630,
        alt: "CyberDude Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberDude Careers & Free Internships",
    description:
      "Join the CyberDude Networks community and find your dream job today! We are hiring for full-time and internship roles. We are a team of 20+ engineers and we are looking for new members to join our team.",
    images: ["/cyberdude-jobs-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CyberDude Jobs",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#ea580c",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="CyberDude Jobs" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CyberDude Jobs" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ea580c" />

        {/* iOS splash screen meta tags */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-touch-startup-image"
          content="/icons/icon-512x512.png"
        />

        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-192x192.png"
        />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#ea580c" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <PWAInstallPrompt />
          <ServiceWorkerRegistration />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
