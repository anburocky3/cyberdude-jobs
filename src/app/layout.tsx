import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";

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
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
