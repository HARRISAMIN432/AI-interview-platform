import { getAtsModel } from "@/lib/ai/gemini";
import { buildAtsScoringPrompt } from "@/lib/prompts/ats-scoring";
import { type ATSScoreResult, ATSScoreResultSchema } from "../validators/ats";

export interface RunAtsScoringInput {
  resumeText: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
  jobRequirements: string;
}

export async function runAtsScoring(
  input: RunAtsScoringInput,
): Promise<ATSScoreResult> {
  const model = getAtsModel();

  const prompt = buildAtsScoringPrompt(
    input.resumeText,
    input.jobTitle,
    input.jobCompany,
    input.jobDescription,
    input.jobRequirements,
  );

  let rawText: string;

  try {
    const result = await model.generateContent(prompt);
    console.log("finishReason:", result.response.candidates?.[0]?.finishReason);
    rawText = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[AtsScorer] Gemini API call failed: ${message}`);
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("[AtsScorer] Gemini returned an empty response");
  }

  // Strip markdown fences if Gemini wraps the JSON despite responseMimeType
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.log(e);
    throw new Error(
      `[AtsScorer] Failed to parse Gemini response as JSON. Raw: ${cleaned.slice(0, 200)}`,
    );
  }

  // Validate the structure against our schema
  const validated = ATSScoreResultSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[AtsScorer] Gemini response failed schema validation: ${JSON.stringify(
        validated.error.flatten().fieldErrors,
      )}`,
    );
  }

  return validated.data;
}
