import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Syne } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://interviewpro.ai";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | Interview Pro",
    default: "Interview Pro — Elite AI Interview Coaching",
  },
  description:
    "Land your dream role with AI-powered mock interviews, ATS resume scoring, and personalized coaching.",
  keywords: [
    "interview prep",
    "AI coaching",
    "mock interview",
    "ATS resume",
    "career",
    "job search",
  ],
  authors: [{ name: "Interview Pro" }],
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Interview Pro",
    title: "Interview Pro — Elite AI Interview Coaching",
    description:
      "Land your dream role with AI-powered mock interviews, ATS resume scoring, and personalized coaching.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interview Pro — AI Interview Prep Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Pro — Elite AI Interview Coaching",
    description:
      "Land your dream role with AI-powered mock interviews, ATS resume scoring, and personalized coaching.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Interview Pro",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "AI-powered mock interviews, ATS resume scoring, and personalized interview feedback.",
  url: APP_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${dmSans.variable} ${syne.variable} antialiased`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0e1e2d",
                border: "1px solid #1a3048",
                color: "#dff0ea",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
