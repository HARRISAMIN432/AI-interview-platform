"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreRing } from "@/components/resume/score-ring";
import { ScoreRadarChart } from "./score-radar-chart";
import { StudyPlan } from "./study-plan";
import type { FeedbackReportPayload } from "@/lib/actions/generate-feedback";

const READINESS_CONFIG = {
  ready: { label: "Interview Ready", color: "#00e5a0", bg: "rgba(0,229,160,0.1)" },
  "almost-ready": {
    label: "Almost Ready",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  "needs-preparation": {
    label: "Needs Preparation",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
  },
};

interface FeedbackReportProps {
  data: FeedbackReportPayload;
}

export function FeedbackReport({ data }: FeedbackReportProps) {
  const { feedback, interview } = data;
  const readiness = READINESS_CONFIG[feedback.interviewReadiness];
  const overall = Math.round(feedback.overallScore);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
          >
            Full Feedback Report
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            {interview.jobDescription?.title ?? "Interview Report"}
          </h1>
          {interview.jobDescription?.company && (
            <p className="text-sm mt-0.5" style={{ color: "#4a6a7a" }}>
              {interview.jobDescription.company}
            </p>
          )}
        </div>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: readiness.bg,
            color: readiness.color,
            border: `1px solid ${readiness.color}33`,
          }}
        >
          {readiness.label}
        </span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList
          variant="line"
          className="w-full justify-start gap-4 border-b border-[#152636] pb-0"
        >
          <TabsTrigger
            value="overview"
            className="data-active:text-[#00e5a0] text-[#4a6a7a]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="data-active:text-[#00e5a0] text-[#4a6a7a]"
          >
            Per-Question
          </TabsTrigger>
          <TabsTrigger
            value="study"
            className="data-active:text-[#00e5a0] text-[#4a6a7a]"
          >
            Study Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl p-6"
            style={{ background: "#0c1a27", border: "1px solid #152636" }}
          >
            <div className="flex items-center gap-5">
              <ScoreRing score={overall} size={96} strokeWidth={7} />
              <div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "#b0ccd8",
                    fontFamily: "var(--font-dm-sans)",
                    lineHeight: 1.8,
                  }}
                >
                  {feedback.summary}
                </p>
              </div>
            </div>
            <ScoreRadarChart
              communicationScore={feedback.communicationScore}
              technicalScore={feedback.technicalScore}
              confidenceScore={feedback.confidenceScore}
              problemSolvingScore={feedback.problemSolvingScore}
              overallScore={feedback.overallScore}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "#0c1a27", border: "1px solid #152636" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
              >
                Top Strengths
              </p>
              <div className="space-y-4">
                {feedback.strengths.map((s, i) => (
                  <div key={s.title}>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
                    >
                      {i + 1}. {s.title}
                    </p>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "#7a9aaa", lineHeight: 1.6 }}
                    >
                      {s.description}
                    </p>
                    <p
                      className="text-xs italic"
                      style={{ color: "#4a6a7a", lineHeight: 1.5 }}
                    >
                      Example: {s.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{ background: "#0c1a27", border: "1px solid #152636" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#f59e0b", fontFamily: "var(--font-syne)" }}
              >
                Growth Areas
              </p>
              <div className="space-y-4">
                {feedback.areasToImprove.map((a, i) => (
                  <div key={a.title}>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
                    >
                      {i + 1}. {a.title}
                    </p>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "#7a9aaa", lineHeight: 1.6 }}
                    >
                      {a.description}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "#00e5a0", lineHeight: 1.5 }}
                    >
                      → {a.actionPlan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6 space-y-3">
          {interview.questions.map((q) => {
            const score = q.answer?.score != null ? Math.round(q.answer.score) : null;
            const scoreColor =
              score == null
                ? "#3d6070"
                : score >= 75
                  ? "#00e5a0"
                  : score >= 50
                    ? "#f59e0b"
                    : "#f87171";

            return (
              <div
                key={q.id}
                className="rounded-xl p-4"
                style={{ background: "#0e1e2d", border: "1px solid #1a3048" }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: scoreColor, fontFamily: "var(--font-syne)" }}
                  >
                    {score ?? "—"}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ color: "#3d6070" }}
                    >
                      Q{q.orderIndex + 1} · {q.questionType}
                    </p>
                    <p className="text-sm" style={{ color: "#b0ccd8" }}>
                      {q.questionText}
                    </p>
                  </div>
                </div>
                {q.answer?.feedback && (
                  <p
                    className="text-xs mt-2"
                    style={{ color: "#7a9aaa", lineHeight: 1.6 }}
                  >
                    {q.answer.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          <StudyPlan items={feedback.studyPlan} />
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href={`/interview/${interview.id}/summary`}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #1a3048",
            color: "#7a9aaa",
          }}
        >
          <ArrowLeft size={14} />
          Back to Summary
        </Link>
        <Link
          href="/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Start New Interview
        </Link>
      </div>
    </div>
  );
}
