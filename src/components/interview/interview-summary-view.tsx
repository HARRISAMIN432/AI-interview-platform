import Link from "next/link";
import { ArrowLeft, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { SummaryHero } from "./summary-hero";
import { SummaryDimensions } from "./summary-dimensions";
import { QuestionReviewCard } from "./question-review-card";
import { jsonToStringArray, type InterviewSummaryData } from "@/types/evaluation";

interface InterviewSummaryViewProps {
  interview: InterviewSummaryData;
}

export function InterviewSummaryView({ interview }: InterviewSummaryViewProps) {
  const feedback = interview.feedback;
  if (!feedback) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <AlertCircle size={24} color="#f59e0b" className="mx-auto mb-3" />
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
        >
          Feedback is not available yet
        </p>
        <p className="text-xs mb-4" style={{ color: "#3d6070" }}>
          Complete the interview session to generate your evaluation report.
        </p>
        <Link
          href={`/interview/${interview.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
        >
          Return to session
        </Link>
      </div>
    );
  }

  const strengths = jsonToStringArray(feedback.strengths);
  const areasToImprove = jsonToStringArray(feedback.areasToImprove);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SummaryHero
        overallScore={feedback.overallScore}
        jobTitle={interview.jobDescription?.title ?? "Interview"}
        company={interview.jobDescription?.company ?? null}
        resumeFileName={interview.resume?.fileName ?? null}
        durationSeconds={interview.duration}
        completedAt={interview.updatedAt}
      />

      <SummaryDimensions
        communicationScore={feedback.communicationScore}
        technicalScore={feedback.technicalScore}
        confidenceScore={feedback.confidenceScore}
      />

      {/* Executive summary */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Summary
        </p>
        <p
          className="text-sm"
          style={{ color: "#b0ccd8", fontFamily: "var(--font-dm-sans)", lineHeight: 1.8 }}
        >
          {feedback.summary}
        </p>
      </div>

      {/* Strengths & improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: "#0c1a27", border: "1px solid #152636" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} color="#00e5a0" strokeWidth={2} />
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
            >
              Key Strengths
            </p>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 text-sm"
                style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)", lineHeight: 1.6 }}
              >
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "rgba(0,229,160,0.1)",
                    color: "#00e5a0",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "#0c1a27", border: "1px solid #152636" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={14} color="#f59e0b" strokeWidth={2} />
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#f59e0b", fontFamily: "var(--font-syne)" }}
            >
              Areas to Improve
            </p>
          </div>
          <ul className="space-y-2.5">
            {areasToImprove.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 text-sm"
                style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)", lineHeight: 1.6 }}
              >
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    color: "#f59e0b",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-question review */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Question-by-Question Review ({interview.questions.length})
        </p>
        <div className="space-y-3">
          {interview.questions.map((q) => (
            <QuestionReviewCard
              key={q.id}
              orderIndex={q.orderIndex}
              questionText={q.questionText}
              questionType={q.questionType}
              answerText={q.answer?.answerText ?? null}
              score={q.answer?.score ?? null}
              feedback={q.answer?.feedback ?? null}
              strengths={q.answer?.strengths ?? []}
              improvements={q.answer?.improvements ?? []}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href={`/feedback/${interview.id}`}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 16px rgba(0,201,138,0.25)",
          }}
        >
          View Full Report
        </Link>
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #1a3048",
            color: "#7a9aaa",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          <ArrowLeft size={14} />
          All Interviews
        </Link>
        <Link
          href="/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 16px rgba(0,201,138,0.25)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Interview
        </Link>
      </div>
    </div>
  );
}
