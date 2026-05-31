import { z } from "zod";
import { getGeminiClient } from "@/lib/ai/gemini";
import { buildQuestionGenerationPrompt } from "@/lib/prompts/question-generator";
import type { InterviewConfig, GeneratedQuestion } from "@/types/interview";

// ─── Output schema ─────────────────────────────────────────────────────────

const GeneratedQuestionSchema = z.object({
  questionText: z.string().min(10),
  questionType: z.enum(["TECHNICAL", "BEHAVIORAL", "SITUATIONAL"]),
  expectedTopics: z.array(z.string()).min(1).max(6),
  followUpHint: z.string(),
});

const GeneratedQuestionsArraySchema = z.array(GeneratedQuestionSchema).min(1);

// ─── Generator ────────────────────────────────────────────────────────────

/**
 * Calls Gemini to generate interview questions tailored to the candidate and role.
 *
 * Uses gemini-1.5-flash for speed (question generation is latency-sensitive
 * because the user is waiting on the setup screen).
 *
 * @returns Array of validated GeneratedQuestion objects
 * @throws Error with descriptive message on AI or parse failure
 */
export async function generateInterviewQuestions(
  config: InterviewConfig,
): Promise<GeneratedQuestion[]> {
  const model = getGeminiClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7, // Some creativity for varied questions
      maxOutputTokens: 2048,
    },
  });

  const prompt = buildQuestionGenerationPrompt(config);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[QuestionGenerator] Gemini API call failed: ${message}`);
  }

  if (!rawText?.trim()) {
    throw new Error("[QuestionGenerator] Gemini returned an empty response");
  }

  // Strip markdown fences if present
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `[QuestionGenerator] Failed to parse response as JSON. Raw: ${cleaned.slice(0, 300)}`,
    );
  }

  const validated = GeneratedQuestionsArraySchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[QuestionGenerator] Schema validation failed: ${JSON.stringify(
        validated.error.flatten().fieldErrors,
      )}`,
    );
  }

  // Trim to exactly the requested count (Gemini sometimes returns more)
  return validated.data.slice(0, config.questionCount);
}
