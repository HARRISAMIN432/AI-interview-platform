import prisma from "@/lib/db/prisma";
import {
  evaluateInterviewAnswers,
  persistInterviewFeedback,
} from "@/services/interview-evaluation.service";
import type { Feedback, Interview } from "@prisma/client";

export interface CompleteInterviewSuccess {
  success: true;
  interview: Interview;
  feedback: Feedback;
  fromCache: boolean;
}

export interface CompleteInterviewFailure {
  success: false;
  error: string;
  code:
    | "NOT_FOUND"
    | "ACCESS_DENIED"
    | "ALREADY_COMPLETED"
    | "NO_ANSWERS"
    | "AI_FAILURE"
    | "DB_FAILURE";
}

export type CompleteInterviewOutcome =
  | CompleteInterviewSuccess
  | CompleteInterviewFailure;

/**
 * Full interview completion pipeline:
 *   1. Ownership check
 *   2. Idempotent return if already completed (unless forceRefresh)
 *   3. Guard: at least one non-empty answer exists
 *   4. AI evaluation for all questions + overall Feedback
 *   5. Set Interview.status=COMPLETED, totalScore, duration
 */
export async function completeInterview(
  interviewId: string,
  clerkUserId: string,
  totalSeconds: number,
  forceRefresh = false,
): Promise<CompleteInterviewOutcome> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return { success: false, error: "User not found", code: "NOT_FOUND" };
  }

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId: user.id },
    include: {
      feedback: true,
      questions: {
        include: { answer: { select: { answerText: true } } },
      },
    },
  });

  if (!interview) {
    return {
      success: false,
      error: "Interview not found or access denied",
      code: "ACCESS_DENIED",
    };
  }

  if (interview.status === "COMPLETED" && interview.feedback && !forceRefresh) {
    return {
      success: true,
      interview,
      feedback: interview.feedback,
      fromCache: true,
    };
  }

  const hasAnswers = interview.questions.some(
    (q) => q.answer?.answerText && q.answer.answerText.trim().length > 0,
  );

  if (!hasAnswers) {
    return {
      success: false,
      error: "No answers to evaluate. Submit at least one answer before completing.",
      code: "NO_ANSWERS",
    };
  }

  let evaluationResult;
  try {
    evaluationResult = await evaluateInterviewAnswers(interviewId, clerkUserId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[CompleteInterview] Evaluation failed:", message);
    return { success: false, error: message, code: "AI_FAILURE" };
  }

  try {
    const feedback = await persistInterviewFeedback(
      interviewId,
      evaluationResult.overallFeedback,
    );

    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "COMPLETED",
        totalScore: evaluationResult.overallFeedback.overallScore,
        duration: totalSeconds,
      },
    });

    console.log(
      `[CompleteInterview] Interview ${interviewId} completed — overall=${evaluationResult.overallFeedback.overallScore}`,
    );

    return {
      success: true,
      interview: updatedInterview,
      feedback,
      fromCache: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[CompleteInterview] DB persistence failed:", message);
    return {
      success: false,
      error: `DB write failed: ${message}`,
      code: "DB_FAILURE",
    };
  }
}
