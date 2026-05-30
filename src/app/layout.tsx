import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Syne } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
  title: {
    template: "%s | Interview Pro",
    default: "Interview Pro — Elite AI Interview Coaching",
  },
  description:
    "Land your dream role with AI-powered mock interviews, real-time feedback, and personalized coaching.",
  keywords: [
    "interview prep",
    "AI coaching",
    "mock interview",
    "career",
    "job",
  ],
  authors: [{ name: "Interview Pro AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://interviewpro.ai",
    siteName: "Interview Pro",
    title: "Interview Pro — Elite AI Interview Coaching",
    description:
      "Land your dream role with AI-powered mock interviews, real-time feedback, and personalized coaching.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interview Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Pro — Elite AI Interview Coaching",
    description:
      "Land your dream role with AI-powered mock interviews, real-time feedback, and personalized coaching.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
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
