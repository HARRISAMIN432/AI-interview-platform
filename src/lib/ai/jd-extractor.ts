import { getEvaluationModel } from "@/lib/ai/gemini";
import { JdMetadataSchema, type JdMetadata } from "@/lib/validators/job-description";

export async function extractJobDescriptionMetadata(
  rawText: string,
): Promise<JdMetadata> {
  const model = getEvaluationModel();
  const trimmed = rawText.slice(0, 8000);

  const prompt = `You are an expert recruiter parsing a job description.

Extract structured metadata from the text below. Return ONLY valid JSON. No markdown fences.

## JOB DESCRIPTION TEXT
${trimmed}

## REQUIRED JSON
{
  "title": "<job title>",
  "company": "<company name or Unknown>",
  "location": "<location or Remote>",
  "salaryRange": "<salary range if mentioned, else empty string>",
  "requiredSkills": ["<skill>", ...],
  "preferredSkills": ["<skill>", ...],
  "experienceLevel": "<e.g. Junior, Mid, Senior>",
  "responsibilities": ["<bullet>", ...],
  "requirements": ["<bullet>", ...]
}`;

  let rawResponse: string;
  try {
    const result = await model.generateContent(prompt);
    rawResponse = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[JdExtractor] Gemini API call failed: ${message}`);
  }

  const cleaned = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `[JdExtractor] Failed to parse JSON. Raw: ${cleaned.slice(0, 200)}`,
    );
  }

  const validated = JdMetadataSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[JdExtractor] Schema validation failed: ${JSON.stringify(
        validated.error.flatten().fieldErrors,
      )}`,
    );
  }

  return validated.data;
}
