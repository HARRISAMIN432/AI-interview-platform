"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Video,
  BarChart2,
  Brain,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: FileText,
    title: "Resume upload & parsing",
    description:
      "Drop your PDF — we extract clean text and keep it ready for scoring and interviews.",
  },
  {
    icon: Target,
    title: "ATS match scoring",
    description:
      "See keyword gaps, format score, and actionable fixes tailored to each job description.",
  },
  {
    icon: Video,
    title: "Live mock interviews",
    description:
      "Technical, behavioral, or mixed sessions with timers, progress tracking, and autosave.",
  },
  {
    icon: Brain,
    title: "AI answer evaluation",
    description:
      "Every answer scored with strengths, improvements, and rubric-based feedback.",
  },
  {
    icon: BarChart2,
    title: "Analytics dashboard",
    description:
      "Track score trends, skill radar evolution, and weak areas across all sessions.",
  },
  {
    icon: Shield,
    title: "Private & secure",
    description:
      "Your files stay in your account with Clerk auth and isolated S3 storage.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
          >
            Features
          </p>
          <h2
            className="text-3xl font-bold"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            Everything you need to land the offer
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="rounded-2xl p-6"
                style={{
                  background: "#0c1a27",
                  border: "1px solid #152636",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(0,229,160,0.08)",
                    border: "1px solid rgba(0,229,160,0.15)",
                  }}
                >
                  <Icon size={20} color="#00e5a0" strokeWidth={1.8} />
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "#4a6a7a", lineHeight: 1.65 }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
