import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ParseResumeSchema } from "@/lib/validators/upload";
import { parseResumeById } from "@/services/pdf-parser.service";

/**
 * POST /api/parse/resume
 *
 * Triggers PDF text extraction for an existing Resume record.
 *
 * Called automatically by the upload flow after S3 upload completes,
 * but can also be called manually to re-parse (idempotent).
 *
 * Request body:
 *   { resumeId: string }
 *
 * Response (success):
 *   { success: true, stats: { pageCount, charCount, wordCount } }
 *
 * Response (failure):
 *   { success: false, error: { code, message } }
 */
export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse + validate body ─────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { resumeId } = ParseResumeSchema.parse(body);

    // ── Run parser pipeline ───────────────────────────────────────────────
    const outcome = await parseResumeById(resumeId, userId);

    if (!outcome.success) {
      // Return 422 for content issues (scanned PDF, empty text, etc.)
      // Return 500 for infrastructure issues (S3 failure, DB failure)
      const isContentError = [
        "EMPTY_TEXT",
        "SCANNED_PDF",
        "TEXT_TOO_SHORT",
        "INVALID_PDF",
      ].includes(outcome.error.code);
      return NextResponse.json(
        { success: false, error: outcome.error },
        { status: isContentError ? 422 : 500 },
      );
    }

    return NextResponse.json(
      { success: true, resumeId: outcome.resumeId, stats: outcome.stats },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    console.error("[/api/parse/resume] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
