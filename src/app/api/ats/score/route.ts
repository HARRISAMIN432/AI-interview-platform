import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ATSScoringRequestSchema } from "@/lib/validators/ats";
import { scoreResumeAgainstJob } from "@/services/ats-scoring.service";
import {
  getATSScore,
  getATSScoresByResume,
} from "@/services/ats-scoring.service";

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse body ────────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const input = ATSScoringRequestSchema.parse(body);

    // ── Force refresh flag ────────────────────────────────────────────────
    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true";

    // ── Run scoring pipeline ──────────────────────────────────────────────
    const outcome = await scoreResumeAgainstJob(userId, input, forceRefresh);

    if (!outcome.success) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        ACCESS_DENIED: 403,
        NO_PARSED_TEXT: 422,
        AI_FAILURE: 502,
        DB_FAILURE: 500,
      };
      const status = statusMap[outcome.code] ?? 500;
      return NextResponse.json(
        { success: false, error: outcome.error, code: outcome.code },
        { status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        atsScore: outcome.atsScore,
        fromCache: outcome.fromCache,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    console.error("[/api/ats/score] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const resumeId = searchParams.get("resumeId");
    const jobDescriptionId = searchParams.get("jobDescriptionId");

    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId query parameter is required" },
        { status: 400 },
      );
    }

    // Return a specific pair score
    if (jobDescriptionId) {
      const score = await getATSScore(resumeId, jobDescriptionId);
      return NextResponse.json({ atsScore: score ?? null }, { status: 200 });
    }

    // Return all scores for a resume
    const scores = await getATSScoresByResume(resumeId);
    return NextResponse.json({ atsScores: scores }, { status: 200 });
  } catch (error) {
    console.error("[/api/ats/score GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
