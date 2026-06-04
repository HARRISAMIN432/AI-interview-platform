import type { z } from "zod";

export function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/** Best-effort repair for truncated JSON objects/arrays from Gemini. */
export function repairTruncatedJson(raw: string): string {
  let text = stripJsonFences(raw).trim();

  // Drop trailing comma before we close brackets
  text = text.replace(/,(\s*)$/, "$1");

  // Close an unterminated string (truncated mid-value)
  const quoteCount = (text.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    text += '"';
  }

  const openBraces = (text.match(/\{/g) || []).length;
  const closeBraces = (text.match(/\}/g) || []).length;
  const openBrackets = (text.match(/\[/g) || []).length;
  const closeBrackets = (text.match(/\]/g) || []).length;

  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    text += "]";
  }
  for (let i = 0; i < openBraces - closeBraces; i++) {
    text += "}";
  }

  return text;
}

export function tryParseJson(raw: string): unknown {
  const cleaned = stripJsonFences(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    return JSON.parse(repairTruncatedJson(raw));
  }
}

export async function parseGeminiJsonResponse<T extends z.ZodType>(
  rawText: string,
  schema: T,
  label: string,
): Promise<z.infer<T>> {
  if (!rawText?.trim()) {
    throw new Error(`[${label}] Gemini returned an empty response`);
  }

  let parsed: unknown;
  try {
    parsed = tryParseJson(rawText);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[${label}] Failed to parse response as JSON. Raw: ${stripJsonFences(rawText).slice(0, 280)}. ${message}`,
    );
  }

  const validated = schema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[${label}] Schema validation failed: ${JSON.stringify(
        validated.error.flatten().fieldErrors,
      )}`,
    );
  }

  return validated.data;
}
