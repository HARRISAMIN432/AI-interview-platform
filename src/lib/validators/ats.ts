import { z } from "zod";

// ─── Request: score a resume against a job description ────────────────────
export const ATSScoringRequestSchema = z.object({
  resumeId: z.string().cuid("Invalid resume ID"),
  jobDescriptionId: z.string().cuid("Invalid job description ID"),
});

export type ATSScoringRequest = z.infer<typeof ATSScoringRequestSchema>;

// ─── The structured JSON the Gemini AI must return ────────────────────────
export const ATSScoreResultSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  keywordScore: z.number().int().min(0).max(100),
  formatScore: z.number().int().min(0).max(100),
  experienceScore: z.number().int().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()).max(10),
  summary: z.string().max(600),
});

export type ATSScoreResult = z.infer<typeof ATSScoreResultSchema>;
