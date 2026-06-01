"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video, PlayCircle, CheckCircle2, Trophy } from "lucide-react";
import {
  useInterviewSession,
  formatElapsed,
} from "@/hooks/use-interview-session";
import { startInterview } from "@/lib/actions/interview";
import { QuestionDisplay } from "./question-display";
import { AnswerInput } from "./answer-input";
import { ProgressTracker } from "./progress-tracker";
import type { InterviewWithQuestions } from "@/types/interview";
import type { SessionAnswer } from "@/types/interview";

interface InterviewConductorProps {
  interview: InterviewWithQuestions;
  clerkUserId: string;
}

export function InterviewConductor({
  interview,
  clerkUserId,
}: InterviewConductorProps) {
  const router = useRouter();
  const questions = interview.questions;
  const totalQuestions = questions.length;

  const handleComplete = useCallback(
    async (_answers: SessionAnswer[], totalSeconds: number) => {
      try {
        const res = await fetch(`/api/interview/${interview.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalSeconds }),
        });
        if (!res.ok) {
          console.error("[InterviewConductor] Complete failed:", await res.text());
        }
      } catch (err) {
        console.error("[InterviewConductor] Complete request failed:", err);
      }
      router.push(`/interview/${interview.id}/summary`);
      router.refresh();
    },
    [interview.id, router],
  );

  const { state, startSession, submitAnswer, skipQuestion } =
    useInterviewSession({
      totalQuestions,
      onComplete: handleComplete,
    });

  const currentQuestion = questions[state.currentQuestionIndex];

  // ── READY state ──────────────────────────────────────────────────────────
  if (state.stage === "ready") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8 animate-fade-in-up">
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-2xl mb-6"
          style={{
            width: 72,
            height: 72,
            background: "rgba(0,229,160,0.08)",
            border: "1px solid rgba(0,229,160,0.2)",
            boxShadow: "0 0 40px rgba(0,229,160,0.08)",
          }}
        >
          <Video size={28} color="#00e5a0" strokeWidth={1.5} />
        </div>

        {/* Info */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Ready to begin?
        </h2>
        <p
          className="text-sm mb-1 max-w-sm"
          style={{
            color: "#4a6a7a",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.7,
          }}
        >
          {totalQuestions} questions · {interview.jobDescription?.title} at{" "}
          {interview.jobDescription?.company}
        </p>
        <p className="text-xs mb-8" style={{ color: "#2a4050" }}>
          Take your time — answers auto-save as you go.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8">
          {[
            { label: "Questions", value: String(totalQuestions) },
            {
              label: "Role",
              value: interview.jobDescription?.title?.slice(0, 18) ?? "—",
            },
            {
              label: "Resume",
              value: interview.resume?.fileName?.slice(0, 18) ?? "—",
            },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p
                className="text-sm font-bold"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#3d6070" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={async () => {
            await startInterview(interview.id, clerkUserId);
            startSession();
          }}
          className="flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 24px rgba(0,201,138,0.35)",
          }}
        >
          <PlayCircle size={16} strokeWidth={2.5} />
          Start Interview
        </button>
      </div>
    );
  }

  // ── COMPLETED state ──────────────────────────────────────────────────────
  if (state.stage === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8 animate-fade-in-up">
        <div
          className="flex items-center justify-center rounded-2xl mb-5"
          style={{
            width: 64,
            height: 64,
            background: "rgba(0,229,160,0.1)",
            border: "1px solid rgba(0,229,160,0.25)",
          }}
        >
          <Trophy size={26} color="#00e5a0" strokeWidth={1.8} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Interview complete!
        </h2>
        <p className="text-sm" style={{ color: "#4a6a7a" }}>
          Evaluating your answers — this may take a moment…
        </p>
      </div>
    );
  }

  // ── ANSWERING / SUBMITTING state ─────────────────────────────────────────
  if (!currentQuestion) return null;

  return (
    <div className="animate-fade-in-up">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mb-6 pb-4"
        style={{ borderBottom: "1px solid #152636" }}
      >
        {/* Progress tracker */}
        <ProgressTracker
          totalQuestions={totalQuestions}
          currentIndex={state.currentQuestionIndex}
          answeredCount={state.answers.length}
        />

        {/* Total time */}
        <div
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #152636",
          }}
        >
          <span className="text-xs" style={{ color: "#3d6070" }}>
            Total:
          </span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: "#7a9aaa", fontFamily: "var(--font-syne)" }}
          >
            {formatElapsed(state.totalElapsedSeconds)}
          </span>
        </div>
      </div>

      {/* ── Question + Answer ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — question */}
        <div>
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={state.currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            elapsedSeconds={state.questionElapsedSeconds}
          />
        </div>

        {/* Right — answer input */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            Your Answer
          </p>
          <AnswerInput
            key={currentQuestion.id} // re-mount on question change to reset state
            questionId={currentQuestion.id}
            isSubmitting={state.stage === "submitting"}
            onSubmit={submitAnswer}
            onSkip={skipQuestion}
          />
        </div>
      </div>

      {/* ── Previous answers summary (collapsed) ────────────────────────── */}
      {state.answers.length > 0 && (
        <div
          className="mt-6 rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #152636",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} color="#00e5a0" strokeWidth={2} />
            <span
              className="text-xs"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
            >
              {state.answers.length} answer
              {state.answers.length !== 1 ? "s" : ""} saved
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
