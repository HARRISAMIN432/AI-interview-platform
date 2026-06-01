import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import {
  HowItWorks,
  AtsDemoWidget,
  Testimonials,
  LandingFooter,
} from "@/components/landing/landing-sections";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#060f18", color: "#dff0ea" }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          background: "rgba(6,15,24,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(145deg, #00e5a0, #00916a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={14} color="#050d14" strokeWidth={2.2} />
            </div>
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "var(--font-syne)", color: "#e8faf4" }}
            >
              Interview Pro
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-8 text-sm">
            <a href="#features" style={{ color: "#4a6a7a" }}>
              Features
            </a>
            <a href="#how-it-works" style={{ color: "#4a6a7a" }}>
              How it works
            </a>
            <a href="#pricing" style={{ color: "#4a6a7a" }}>
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium px-4 py-2"
              style={{ color: "#7a9aaa" }}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-bold px-4 py-2 rounded-lg"
              style={{
                background: "#00c98a",
                color: "#050d14",
                fontFamily: "var(--font-syne)",
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AtsDemoWidget />
        <Testimonials />
        <Pricing />
      </main>

      <LandingFooter />
    </div>
  );
}
