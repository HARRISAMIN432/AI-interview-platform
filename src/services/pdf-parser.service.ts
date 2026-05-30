import { downloadS3ObjectAsBuffer } from "@/lib/s3";
import { parsePdfBuffer } from "@/lib/pdf";
import { updateResumeParsedText, getResumeById } from "@/lib/actions/resume";
import type { ParsePdfResult, ParsePdfError } from "@/lib/pdf";

export interface ParseResumeResult {
  resumeId: string;
  success: true;
  stats: {
    pageCount: number;
    charCount: number;
    wordCount: number;
  };
}

export interface ParseResumeFailure {
  resumeId: string;
  success: false;
  error: ParsePdfError;
}

export type ParseResumeOutcome = ParseResumeResult | ParseResumeFailure;

/**
 * Full pipeline: S3 download → PDF parse → text clean → DB persist
 *
 * This service is:
 *   - Retry-safe: calling it multiple times on the same resumeId just
 *     re-parses and overwrites parsedText (idempotent)
 *   - Memory-efficient: streams the S3 object into a buffer, parses it,
 *     then lets GC reclaim the buffer
 *   - Async-safe: no shared state, safe to call in parallel for different IDs
 *
 * @param resumeId - The Prisma Resume record ID
 * @param clerkUserId - The Clerk user ID (for ownership verification)
 */
export async function parseResumeById(
  resumeId: string,
  clerkUserId: string,
): Promise<ParseResumeOutcome> {
  // ── 1. Ownership check ──────────────────────────────────────────────────
  const resume = await getResumeById(resumeId, clerkUserId);
  if (!resume) {
    return {
      resumeId,
      success: false,
      error: {
        code: "PARSE_FAILED",
        message: "Resume not found or access denied",
      },
    };
  }

  console.log(
    `[PdfParserService] Starting parse for resume ${resumeId} (key: ${resume.s3Key})`,
  );

  // ── 2. Download from S3 ─────────────────────────────────────────────────
  let buffer: Buffer;
  try {
    buffer = await downloadS3ObjectAsBuffer(resume.s3Key);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[PdfParserService] S3 download failed for ${resumeId}:`,
      message,
    );
    return {
      resumeId,
      success: false,
      error: {
        code: "PARSE_FAILED",
        message: `Failed to download file from storage: ${message}`,
      },
    };
  }

  // ── 3. Parse PDF ────────────────────────────────────────────────────────
  let parsed: ParsePdfResult;
  try {
    parsed = await parsePdfBuffer(buffer);
  } catch (err) {
    // parsePdfBuffer throws ParsePdfError on failure
    const parseError = err as ParsePdfError;
    console.error(
      `[PdfParserService] Parse failed for ${resumeId}:`,
      parseError,
    );
    return {
      resumeId,
      success: false,
      error: parseError,
    };
  } finally {
    // Explicitly release the buffer reference to assist GC for large files
    // @ts-expect-error intentional null assignment for GC hint
    buffer = null;
  }

  // ── 4. Persist to DB ────────────────────────────────────────────────────
  try {
    await updateResumeParsedText(resumeId, parsed.text);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[PdfParserService] DB update failed for ${resumeId}:`,
      message,
    );
    return {
      resumeId,
      success: false,
      error: {
        code: "PARSE_FAILED",
        message: `Parsed text extracted but DB update failed: ${message}`,
      },
    };
  }

  console.log(
    `[PdfParserService] Resume ${resumeId} parsed successfully — ` +
      `${parsed.pageCount} pages, ${parsed.wordCount} words, ${parsed.charCount} chars`,
  );

  return {
    resumeId,
    success: true,
    stats: {
      pageCount: parsed.pageCount,
      charCount: parsed.charCount,
      wordCount: parsed.wordCount,
    },
  };
}

/**
 * Parses multiple resumes in parallel.
 * Useful for batch operations (e.g., re-parsing all resumes after a parser upgrade).
 * Results are returned per-resume regardless of individual failures.
 */
export async function parseMultipleResumes(
  items: Array<{ resumeId: string; clerkUserId: string }>,
): Promise<ParseResumeOutcome[]> {
  return Promise.all(
    items.map(({ resumeId, clerkUserId }) =>
      parseResumeById(resumeId, clerkUserId),
    ),
  );
}
