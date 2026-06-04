import { getAtsModel } from "@/lib/ai/gemini";
import { parseGeminiJsonResponse } from "@/lib/ai/parse-gemini-json";
import { buildAtsScoringPrompt } from "@/lib/prompts/ats-scoring";
import {
  type ATSScoreResult,
  ATSScoreResultSchema,
} from "../validators/ats";

export interface RunAtsScoringInput {
  resumeText: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
  jobRequirements: string;
}

const MAX_ATTEMPTS = 2;

async function callGeminiOnce(prompt: string): Promise<string> {
  const model = getAtsModel();
  const result = await model.generateContent(prompt);
  const finishReason = result.response.candidates?.[0]?.finishReason;

  if (finishReason === "MAX_TOKENS") {
    throw new Error("[AtsScorer] Gemini response truncated (MAX_TOKENS)");
  }

  const rawText = result.response.text();
  if (!rawText?.trim()) {
    throw new Error("[AtsScorer] Gemini returned an empty response");
  }

  return rawText;
}

export async function runAtsScoring(
  input: RunAtsScoringInput,
): Promise<ATSScoreResult> {
  const prompt = buildAtsScoringPrompt(
    input.resumeText,
    input.jobTitle,
    input.jobCompany,
    input.jobDescription,
    input.jobRequirements,
  );

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const rawText = await callGeminiOnce(prompt);
      return await parseGeminiJsonResponse(
        rawText,
        ATSScoreResultSchema,
        "AtsScorer",
      );
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(
        `[AtsScorer] Attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        lastError.message,
      );
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastError ?? new Error("[AtsScorer] Unknown scoring failure");
}
