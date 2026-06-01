import { ChevronDown } from "lucide-react";
import type { QuestionType } from "@prisma/client";
import { isSkippedAnswer } from "@/lib/prompts/answer-evaluation";

const TYPE_COLORS: Record<QuestionType, { bg: string; border: string; color: string }> = {
  TECHNICAL: {
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    color: "#60a5fa",
  },
  BEHAVIORAL: {
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.2)",
    color: "#00e5a0",
  },
  SITUATIONAL: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    color: "#f59e0b",
  },
};

interface QuestionReviewCardProps {
  orderIndex: number;
  questionText: string;
  questionType: QuestionType;
  answerText: string | null;
  score: number | null;
  feedback: string | null;
  strengths: string[];
  improvements: string[];
}

export function QuestionReviewCard({
  orderIndex,
  questionText,
  questionType,
  answerText,
  score,
  feedback,
  strengths,
  improvements,
}: QuestionReviewCardProps) {
  const typeStyle = TYPE_COLORS[questionType];
  const roundedScore = score != null ? Math.round(score) : null;
  const scoreColor =
    roundedScore == null
      ? "#3d6070"
      : roundedScore >= 75
        ? "#00e5a0"
        : roundedScore >= 50
          ? "#f59e0b"
          : "#f87171";
  const skipped = isSkippedAnswer(answerText);

  return (
    <details
      className="group rounded-xl overflow-hidden"
      style={{ background: "#0e1e2d", border: "1px solid #1a3048" }}
    >
      <summary className="flex items-start gap-4 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-sm tabular-nums"
          style={{
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #152636",
            color: scoreColor,
            fontFamily: "var(--font-syne)",
          }}
        >
          {roundedScore ?? "—"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "#3d6070", fontFamily: "var(--font-syne)" }}
            >
              Q{orderIndex + 1}
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: typeStyle.bg,
                border: `1px solid ${typeStyle.border}`,
                color: typeStyle.color,
              }}
            >
              {questionType}
            </span>
            {skipped && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171",
                }}
              >
                Skipped
              </span>
            )}
          </div>
          <p
            className="text-sm font-medium line-clamp-2"
            style={{ color: "#b0ccd8", fontFamily: "var(--font-dm-sans)", lineHeight: 1.5 }}
          >
            {questionText}
          </p>
        </div>

        <ChevronDown
          size={16}
          color="#3d6070"
          className="flex-shrink-0 mt-1 transition-transform group-open:rotate-180"
        />
      </summary>

      <div
        className="px-4 pb-4 pt-0 space-y-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {answerText && !skipped && (
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#3d6070", fontFamily: "var(--font-syne)" }}
            >
              Your Answer
            </p>
            <p
              className="text-sm rounded-lg p-3"
              style={{
                color: "#7a9aaa",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #152636",
                fontFamily: "var(--font-dm-sans)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {answerText}
            </p>
          </div>
        )}

        {feedback && (
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#3d6070", fontFamily: "var(--font-syne)" }}
            >
              Feedback
            </p>
            <p
              className="text-sm"
              style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)", lineHeight: 1.7 }}
            >
              {feedback}
            </p>
          </div>
        )}

        {strengths.length > 0 && (
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
            >
              Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(0,229,160,0.08)",
                    border: "1px solid rgba(0,229,160,0.15)",
                    color: "#7a9aaa",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {improvements.length > 0 && (
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#f59e0b", fontFamily: "var(--font-syne)" }}
            >
              To Improve
            </p>
            <ul className="space-y-1.5">
              {improvements.map((item) => (
                <li
                  key={item}
                  className="text-xs flex gap-2"
                  style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)", lineHeight: 1.6 }}
                >
                  <span style={{ color: "#f59e0b" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
