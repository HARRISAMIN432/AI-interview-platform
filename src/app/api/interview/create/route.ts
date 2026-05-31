import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { CreateInterviewSchema } from "@/lib/validators/interview";
import { createInterview } from "@/lib/actions/interview";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const input = CreateInterviewSchema.parse(body);
    const outcome = await createInterview(userId, input);

    if (!outcome.success) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        ACCESS_DENIED: 403,
        NO_PARSED_TEXT: 422,
        AI_FAILURE: 502,
        DB_FAILURE: 500,
      };
      return NextResponse.json(
        { success: false, error: outcome.error, code: outcome.code },
        { status: statusMap[outcome.code] ?? 500 },
      );
    }

    return NextResponse.json(
      { success: true, interviewId: outcome.interviewId },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 422 },
      );
    }
    console.error("[POST /api/interview/create]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
