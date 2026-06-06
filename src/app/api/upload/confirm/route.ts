export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { SaveResumeMetadataSchema } from "@/lib/validators/upload";
import { saveResumeMetadata } from "@/lib/actions/resume";

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

    const parsed = SaveResumeMetadataSchema.parse(body);

    // ── Ownership check: ensure key belongs to this user ──────────────────
    if (!parsed.s3Key.startsWith(`resumes/${userId}/`)) {
      return NextResponse.json(
        { error: "S3 key does not belong to the authenticated user" },
        { status: 403 },
      );
    }

    // ── Persist metadata ──────────────────────────────────────────────────
    const resume = await saveResumeMetadata(userId, parsed);

    return NextResponse.json({ resume }, { status: 201 });
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

    console.error("[/api/upload/confirm] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
