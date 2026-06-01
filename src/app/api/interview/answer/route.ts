import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SubmitAnswerSchema } from "@/lib/validators/interview";
import { saveAnswer } from "@/lib/actions/interview";

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

    const { questionId, answerText } = SubmitAnswerSchema.parse(body);
    const result = await saveAnswer(questionId, answerText, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(
      { success: true, answerId: result.answerId },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/interview/answer]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
