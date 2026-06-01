"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Upload, MessageSquare, Star } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload & match",
    body: "Add your resume and job description. Get an ATS score with missing keywords in seconds.",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Run mock interviews",
    body: "Choose difficulty, question count, and focus areas. Answer at your pace with autosave.",
  },
  {
    step: "03",
    icon: Star,
    title: "Review & improve",
    body: "Read per-question feedback, full reports, study plans, and track progress in analytics.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The ATS breakdown alone saved me hours. I rewrote my resume and started getting callbacks.",
    name: "Priya S.",
    role: "Software Engineer",
  },
  {
    quote:
      "Mock interviews felt surprisingly real. The feedback on my STAR answers was spot-on.",
    name: "Marcus T.",
    role: "Product Manager",
  },
  {
    quote:
      "Went from nervous to confident in two weeks. The analytics showed exactly where I improved.",
    name: "Elena R.",
    role: "Data Analyst",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-14"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <p
                  className="text-4xl font-black mb-4"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(0,229,160,0.2)",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  {s.step}
                </p>
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-xl"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(0,229,160,0.08)",
                    border: "1px solid rgba(0,229,160,0.15)",
                  }}
                >
                  <Icon size={22} color="#00e5a0" />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm" style={{ color: "#4a6a7a", lineHeight: 1.7 }}>
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AtsDemoWidget() {
  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "#0c1a27",
            border: "1px solid #152636",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00e5a0, transparent)",
              opacity: 0.5,
            }}
          />
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#00e5a0" }}
          >
            ATS demo
          </p>
          <h3
            className="text-2xl font-bold mb-6"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            See how your resume stacks up
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div
              className="relative flex-shrink-0"
              style={{ width: 120, height: 120 }}
            >
              <svg width={120} height={120} viewBox="0 0 120 120">
                <circle
                  cx={60}
                  cy={60}
                  r={52}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={10}
                />
                <circle
                  cx={60}
                  cy={60}
                  r={52}
                  fill="none"
                  stroke="#00e5a0"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={326.7}
                  strokeDashoffset={326.7 * (1 - 0.78)}
                  transform="rotate(-90 60 60)"
                  style={{ filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))" }}
                />
                <text
                  x={60}
                  y={56}
                  textAnchor="middle"
                  style={{
                    fill: "#00e5a0",
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  78
                </text>
                <text
                  x={60}
                  y={74}
                  textAnchor="middle"
                  style={{ fill: "#4a6a7a", fontSize: 11 }}
                >
                  / 100
                </text>
              </svg>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {[
                { label: "Keywords", score: 82 },
                { label: "Experience", score: 75 },
                { label: "Format", score: 71 },
              ].map(({ label, score }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#7a9aaa" }}>{label}</span>
                    <span style={{ color: "#00e5a0" }}>{score}</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${score}%`,
                        background: "linear-gradient(90deg, #00c98a, #00e5a0)",
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs pt-2" style={{ color: "#3d6070" }}>
                Matched: React, TypeScript, Node.js · Missing: GraphQL, CI/CD
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Loved by candidates
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: "#0c1a27", border: "1px solid #152636" }}
            >
              <p
                className="text-sm mb-4"
                style={{ color: "#b0ccd8", lineHeight: 1.7 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#dff0ea" }}
                >
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "#4a6a7a" }}>
                  {t.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer
      className="py-12 px-6 border-t"
      style={{ borderColor: "#152636", background: "#07111c" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
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
            <Layers size={14} color="#050d14" />
          </div>
          <span
            className="font-bold"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            Interview Pro
          </span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm" style={{ color: "#4a6a7a" }}>
          <Link href="/sign-in" className="hover:text-[#00e5a0] transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up" className="hover:text-[#00e5a0] transition-colors">
            Sign up
          </Link>
          <Link href="#features" className="hover:text-[#00e5a0] transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-[#00e5a0] transition-colors">
            Pricing
          </Link>
        </div>
        <p className="text-xs" style={{ color: "#2a4050" }}>
          © {new Date().getFullYear()} Interview Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
