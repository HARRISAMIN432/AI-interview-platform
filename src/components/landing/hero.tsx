"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,160,0.12) 0%, transparent 55%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.03 }}
        aria-hidden
      >
        <defs>
          <pattern
            id="landing-hex"
            x="0"
            y="0"
            width="56"
            height="97"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="28,0 56,14 56,42 28,56 0,42 0,14"
              fill="none"
              stroke="#00e5a0"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#landing-hex)" />
      </svg>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] mb-5"
          style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
        >
          Elite AI Interview Coaching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Practice interviews that feel{" "}
          <span style={{ color: "#00e5a0" }}>like the real thing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-lg max-w-2xl mx-auto mb-10"
          style={{
            color: "#7a9aaa",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.75,
          }}
        >
          Upload your resume, match it to any role with ATS scoring, and run
          AI mock interviews with instant feedback — so you walk in prepared.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all active:scale-[0.97]"
            style={{
              background: "#00c98a",
              color: "#050d14",
              fontFamily: "var(--font-syne)",
              boxShadow: "0 4px 28px rgba(0,201,138,0.35)",
            }}
          >
            Start Free
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:bg-[rgba(255,255,255,0.04)]"
            style={{
              border: "1px solid #1a3048",
              color: "#b0ccd8",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <Play size={16} />
            See Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
