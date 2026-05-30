import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { PresignedUrlRequestSchema } from "@/lib/validators/upload";
import { prepareResumeUpload } from "@/services/upload.service";

/**
 * POST /api/upload/presigned-url
 *
 * Generates a presigned S3 upload URL for authenticated users.
 *
 * Request body:
 *   { fileName: string, fileType: string, fileSize: number }
 *
 * Response:
 *   { uploadUrl: string, key: string, s3Url: string }
 *
 * The client should:
 *   1. Call this endpoint to get the presigned URL
 *   2. PUT the file directly to uploadUrl (with Content-Type header)
 *   3. Call /api/upload/confirm with the key to save metadata
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

    const parsed = PresignedUrlRequestSchema.parse(body);

    // ── Generate presigned URL ────────────────────────────────────────────
    const result = await prepareResumeUpload(userId, parsed);

    return NextResponse.json(result, { status: 200 });
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

    console.error("[/api/upload/presigned-url] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
