import { z } from "zod";

/** Gemini sometimes returns { title, description } objects instead of plain strings. */
export function coerceStringArray(
  value: unknown,
  fallback: string[] = ["See feedback for details"],
): string[] {
  if (value == null) return fallback;

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const o = item as Record<string, unknown>;
        const title =
          typeof o.title === "string"
            ? o.title
            : typeof o.name === "string"
              ? o.name
              : "";
        const body =
          typeof o.description === "string"
            ? o.description
            : typeof o.text === "string"
              ? o.text
              : typeof o.point === "string"
                ? o.point
                : typeof o.actionPlan === "string"
                  ? o.actionPlan
                  : "";
        const combined = [title, body].filter(Boolean).join(": ").trim();
        if (combined) return combined;
      }
      return null;
    })
    .filter((s): s is string => Boolean(s));

  return items.length > 0 ? items : fallback;
}

function coerceFeedbackText(value: unknown): string {
  const text = typeof value === "string" ? value : String(value ?? "");
  const trimmed = text.trim();
  if (trimmed.length >= 10) return trimmed;
  return "The answer was evaluated. Review the strengths and improvements below for specific guidance.";
}

function coerceScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// ─── Per-answer AI output ───────────────────────────────────────────────────

export const AnswerEvaluationResultSchema = z.object({
  score: z.preprocess(coerceScore, z.number().min(0).max(100)),
  feedback: z.preprocess(coerceFeedbackText, z.string().min(10)),
  strengths: z.preprocess(
    (v) => coerceStringArray(v, ["Addressed the question"]),
    z.array(z.string().min(1)).min(1).max(5),
  ),
  improvements: z.preprocess(
    (v) => coerceStringArray(v, ["Add more specific examples and depth"]),
    z.array(z.string().min(1)).min(1).max(5),
  ),
});

export type AnswerEvaluationResult = z.infer<
  typeof AnswerEvaluationResultSchema
>;

// ─── Overall interview feedback AI output ───────────────────────────────────

export const OverallFeedbackResultSchema = z.object({
  overallScore: z.preprocess(coerceScore, z.number().min(0).max(100)),
  summary: z.preprocess(
    (v) => {
      const s = typeof v === "string" ? v : String(v ?? "");
      return s.trim().length >= 20
        ? s.trim()
        : "Overall interview performance has been recorded. Review per-question feedback to identify patterns and focus areas for your next practice session.";
    },
    z.string().min(20),
  ),
  strengths: z.preprocess(
    (v) => coerceStringArray(v, ["Completed the interview session"]),
    z.array(z.string().min(1)).max(8),
  ),
  areasToImprove: z.preprocess(
    (v) =>
      coerceStringArray(v, ["Continue practicing with more structured answers"]),
    z.array(z.string().min(1)).max(8),
  ),
  communicationScore: z.preprocess(coerceScore, z.number().min(0).max(100)),
  technicalScore: z.preprocess(coerceScore, z.number().min(0).max(100)),
  confidenceScore: z.preprocess(coerceScore, z.number().min(0).max(100)),
});

export type OverallFeedbackResult = z.infer<typeof OverallFeedbackResultSchema>;

// ─── Complete interview request ─────────────────────────────────────────────

export const CompleteInterviewSchema = z.object({
  totalSeconds: z.number().int().min(0).max(86_400),
});

export type CompleteInterviewInput = z.infer<typeof CompleteInterviewSchema>;
