import { getEvaluationModel } from "@/lib/ai/gemini";
import { parseGeminiJsonResponse } from "@/lib/ai/parse-gemini-json";
import {
  buildAnswerEvaluationPrompt,
  buildOverallFeedbackPrompt,
  buildSkippedAnswerEvaluation,
  isSkippedAnswer,
  type AnswerEvaluationPromptInput,
  type OverallFeedbackPromptInput,
} from "@/lib/prompts/answer-evaluation";
import {
  AnswerEvaluationResultSchema,
  OverallFeedbackResultSchema,
  type AnswerEvaluationResult,
  type OverallFeedbackResult,
} from "@/lib/validators/evaluation";

const MAX_ATTEMPTS = 2;

async function generateRaw(prompt: string): Promise<string> {
  const model = getEvaluationModel();
  const result = await model.generateContent(prompt);
  const finishReason = result.response.candidates?.[0]?.finishReason;

  if (finishReason === "MAX_TOKENS") {
    throw new Error("Gemini response truncated (MAX_TOKENS)");
  }

  const rawText = result.response.text();
  if (!rawText?.trim()) {
    throw new Error("Gemini returned an empty response");
  }

  return rawText;
}

async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[${label}] Attempt ${attempt}/${MAX_ATTEMPTS}:`, lastError.message);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastError ?? new Error(`[${label}] Unknown failure`);
}

export async function evaluateAnswer(
  input: AnswerEvaluationPromptInput,
): Promise<AnswerEvaluationResult> {
  if (isSkippedAnswer(input.answerText)) {
    return buildSkippedAnswerEvaluation();
  }

  const prompt = buildAnswerEvaluationPrompt(input);

  return withRetry("AnswerEvaluator", async () => {
    const rawText = await generateRaw(prompt);
    return parseGeminiJsonResponse(
      rawText,
      AnswerEvaluationResultSchema,
      "AnswerEvaluator",
    );
  });
}

export async function evaluateOverallFeedback(
  input: OverallFeedbackPromptInput,
): Promise<OverallFeedbackResult> {
  const prompt = buildOverallFeedbackPrompt(input);

  return withRetry("OverallFeedbackEvaluator", async () => {
    const rawText = await generateRaw(prompt);
    return parseGeminiJsonResponse(
      rawText,
      OverallFeedbackResultSchema,
      "OverallFeedbackEvaluator",
    );
  });
}
