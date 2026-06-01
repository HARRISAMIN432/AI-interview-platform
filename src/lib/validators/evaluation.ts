import { z } from "zod";

// ─── Per-answer AI output ───────────────────────────────────────────────────

export const AnswerEvaluationResultSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(10),
  strengths: z.array(z.string()).min(1).max(5),
  improvements: z.array(z.string()).min(1).max(5),
});

export type AnswerEvaluationResult = z.infer<typeof AnswerEvaluationResultSchema>;

// ─── Overall interview feedback AI output ───────────────────────────────────

export const OverallFeedbackResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(20),
  strengths: z.array(z.string()).min(1).max(8),
  areasToImprove: z.array(z.string()).min(1).max(8),
  communicationScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
});

export type OverallFeedbackResult = z.infer<typeof OverallFeedbackResultSchema>;

// ─── Complete interview request ─────────────────────────────────────────────

export const CompleteInterviewSchema = z.object({
  totalSeconds: z.number().int().min(0).max(86_400),
});

export type CompleteInterviewInput = z.infer<typeof CompleteInterviewSchema>;
