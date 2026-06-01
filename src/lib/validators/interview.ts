import { z } from "zod";

// ─── Enums (mirror Prisma) ─────────────────────────────────────────────────

export const InterviewTypeSchema = z.enum(["TECHNICAL", "BEHAVIORAL", "MIXED"]);
export const DifficultySchema = z.enum(["JUNIOR", "MID", "SENIOR"]);
export const QuestionCountSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(15),
]);

export type InterviewType = z.infer<typeof InterviewTypeSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type QuestionCount = z.infer<typeof QuestionCountSchema>;

// ─── Create Interview ──────────────────────────────────────────────────────

export const CreateInterviewSchema = z.object({
  resumeId: z.string().uuid("Invalid resume ID"),
  jobDescriptionId: z.string().uuid("Invalid job description ID"),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultySchema,
  questionCount: QuestionCountSchema,
  focusAreas: z
    .array(z.string())
    .max(6)
    .default([])
    .optional()
    .transform((v) => v ?? []),
});

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;

export const SubmitAnswerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  answerText: z
    .string()
    .min(1, "Answer cannot be empty")
    .max(5000, "Answer exceeds 5000 character limit"),
});

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
