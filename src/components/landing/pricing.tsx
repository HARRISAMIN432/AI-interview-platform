"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with core interview prep tools.",
    highlighted: false,
    cta: "Start Free",
    href: "/sign-up",
    features: [
      "3 mock interviews / month",
      "1 resume + ATS score",
      "Basic feedback summary",
      "Interview analytics",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious candidates actively interviewing.",
    highlighted: true,
    cta: "Go Pro",
    href: "/sign-up",
    features: [
      "Unlimited mock interviews",
      "Unlimited resumes & JDs",
      "Full AI feedback reports",
      "Study plans & resource links",
      "Priority AI evaluation",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/ user / mo",
    description: "Career centers, bootcamps, and hiring coaches.",
    highlighted: false,
    cta: "Contact sales",
    href: "mailto:sales@interviewpro.app",
    features: [
      "Everything in Pro",
      "Shared analytics dashboard",
      "Cohort management",
      "Custom rubrics",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
          >
            Pricing
          </p>
          <h2
            className="text-3xl font-bold"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            Simple plans, serious results
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="relative rounded-2xl p-6 flex flex-col"
              style={{
                background: tier.highlighted ? "#0e1e2d" : "#0c1a27",
                border: `1px solid ${tier.highlighted ? "rgba(0,229,160,0.35)" : "#152636"}`,
                boxShadow: tier.highlighted
                  ? "0 0 40px rgba(0,229,160,0.08)"
                  : "none",
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #00e5a0, transparent)",
                  }}
                />
              )}
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                {tier.name}
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
                >
                  {tier.price}
                </span>
                <span className="text-xs" style={{ color: "#4a6a7a" }}>
                  {tier.period}
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: "#4a6a7a" }}>
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={14}
                      color="#00e5a0"
                      className="shrink-0 mt-0.5"
                    />
                    <span style={{ color: "#7a9aaa" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className="block text-center rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97]"
                style={
                  tier.highlighted
                    ? {
                        background: "#00c98a",
                        color: "#050d14",
                        fontFamily: "var(--font-syne)",
                      }
                    : {
                        border: "1px solid #1a3048",
                        color: "#b0ccd8",
                      }
                }
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
