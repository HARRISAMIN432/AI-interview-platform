import { useState } from "react";
import { Lightbulb, Clock } from "lucide-react";
import { formatElapsed } from "@/hooks/use-interview-session";
import type { InterviewQuestionWithAnswer } from "@/types/interview";

interface QuestionDisplayProps {
  question: InterviewQuestionWithAnswer;
  questionNumber: number;
  totalQuestions: number;
  elapsedSeconds: number;
}

const TYPE_CONFIG = {
  TECHNICAL: {
    label: "Technical",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    color: "#60a5fa",
  },
  BEHAVIORAL: {
    label: "Behavioral",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
    color: "#c084fc",
  },
  SITUATIONAL: {
    label: "Situational",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    color: "#f59e0b",
  },
};

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  elapsedSeconds,
}: QuestionDisplayProps) {
  const [hintVisible, setHintVisible] = useState(false);
  const typeConfig = TYPE_CONFIG[question.questionType];

  return (
    <div className="space-y-4">
      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Question number */}
          <span
            className="text-xs font-semibold"
            style={{ color: "#3d6070", fontFamily: "var(--font-syne)" }}
          >
            Q{questionNumber} / {totalQuestions}
          </span>

          {/* Type badge */}
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: typeConfig.bg,
              border: `1px solid ${typeConfig.border}`,
              color: typeConfig.color,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Timer */}
        <div
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #152636",
          }}
        >
          <Clock size={11} color="#3d6070" strokeWidth={1.8} />
          <span
            className="text-xs tabular-nums font-medium"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            {formatElapsed(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Question text */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1a3048",
        }}
      >
        {/* Top accent */}
        <div
          className="w-8 h-0.5 rounded-full mb-4"
          style={{ background: typeConfig.color, opacity: 0.6 }}
        />
        <p
          className="text-base leading-relaxed font-medium"
          style={{ color: "#dff0ea", fontFamily: "var(--font-dm-sans)" }}
        >
          {question.questionText}
        </p>

        {/* STAR hint for behavioral */}
        {question.questionType === "BEHAVIORAL" && (
          <p
            className="text-xs mt-4"
            style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
          >
            Tip: Use the <span style={{ color: "#4a6a7a" }}>STAR method</span> —
            Situation, Task, Action, Result.
          </p>
        )}
      </div>

      {/* Hint reveal */}
      <button
        type="button"
        onClick={() => setHintVisible((v) => !v)}
        className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
        style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
      >
        <Lightbulb size={12} strokeWidth={1.8} />
        {hintVisible ? "Hide hint" : "Show hint"}
      </button>

      {hintVisible && (
        <div
          className="rounded-xl px-4 py-3 animate-fade-in-up"
          style={{
            background: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.12)",
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "#a3783c", fontFamily: "var(--font-dm-sans)" }}
          >
            Think about: core concepts, real-world application, and trade-offs.
          </p>
        </div>
      )}
    </div>
  );
}
