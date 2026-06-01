import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceAiRateLimit } from "@/lib/api/ai-rate-limit";
import { CompleteInterviewSchema } from "@/lib/validators/evaluation";
import { completeInterview } from "@/services/complete-interview.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimited = enforceAiRateLimit(userId);
    if (rateLimited) return rateLimited;

    const { id: interviewId } = await params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { totalSeconds } = CompleteInterviewSchema.parse(body);
    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true";

    const outcome = await completeInterview(
      interviewId,
      userId,
      totalSeconds,
      forceRefresh,
    );

    if (!outcome.success) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        ACCESS_DENIED: 403,
        ALREADY_COMPLETED: 409,
        NO_ANSWERS: 422,
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
        interviewId: outcome.interview.id,
        totalScore: outcome.interview.totalScore,
        duration: outcome.interview.duration,
        feedback: outcome.feedback,
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

    console.error("[POST /api/interview/[id]/complete]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
