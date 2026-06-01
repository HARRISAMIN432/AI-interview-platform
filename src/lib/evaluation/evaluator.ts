import { getEvaluationModel } from "@/lib/ai/gemini";
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

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function parseGeminiJson<T>(
  rawText: string,
  schema: {
    safeParse: (data: unknown) => {
      success: boolean;
      data?: T;
      error?: { flatten: () => { fieldErrors: unknown } };
    };
  },
  label: string,
): Promise<T> {
  if (!rawText?.trim()) {
    throw new Error(`[${label}] Gemini returned an empty response`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(rawText));
  } catch {
    throw new Error(
      `[${label}] Failed to parse response as JSON. Raw: ${rawText.slice(0, 200)}`,
    );
  }

  const validated = schema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[${label}] Schema validation failed: ${JSON.stringify(
        validated.error?.flatten().fieldErrors,
      )}`,
    );
  }

  return validated.data as T;
}

export async function evaluateAnswer(
  input: AnswerEvaluationPromptInput,
): Promise<AnswerEvaluationResult> {
  if (isSkippedAnswer(input.answerText)) {
    return buildSkippedAnswerEvaluation();
  }

  const model = getEvaluationModel();
  const prompt = buildAnswerEvaluationPrompt(input);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[AnswerEvaluator] Gemini API call failed: ${message}`);
  }

  return parseGeminiJson(rawText, AnswerEvaluationResultSchema, "AnswerEvaluator");
}

export async function evaluateOverallFeedback(
  input: OverallFeedbackPromptInput,
): Promise<OverallFeedbackResult> {
  const model = getEvaluationModel();
  const prompt = buildOverallFeedbackPrompt(input);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[OverallFeedbackEvaluator] Gemini API call failed: ${message}`,
    );
  }

  return parseGeminiJson(
    rawText,
    OverallFeedbackResultSchema,
    "OverallFeedbackEvaluator",
  );
}
