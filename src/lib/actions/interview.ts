"use server";

import prisma from "@/lib/db/prisma";
import { generateInterviewQuestions } from "@/lib/ai/question-generator";
import type { CreateInterviewInput } from "@/lib/validators/interview";
import type { InterviewWithQuestions } from "@/types/interview";
import type { Interview } from "@prisma/client";

export interface CreateInterviewResult {
  success: true;
  interviewId: string;
}

export interface CreateInterviewFailure {
  success: false;
  error: string;
  code:
    | "NOT_FOUND"
    | "ACCESS_DENIED"
    | "NO_PARSED_TEXT"
    | "AI_FAILURE"
    | "DB_FAILURE";
}

export type CreateInterviewOutcome =
  | CreateInterviewResult
  | CreateInterviewFailure;

export async function createInterview(
  clerkUserId: string,
  input: CreateInterviewInput,
): Promise<CreateInterviewOutcome> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) {
    return { success: false, error: "User not found", code: "NOT_FOUND" };
  }

  const resume = await prisma.resume.findFirst({
    where: { id: input.resumeId, userId: user.id },
    select: { id: true, parsedText: true, fileName: true },
  });
  if (!resume) {
    return {
      success: false,
      error: "Resume not found or access denied",
      code: "ACCESS_DENIED",
    };
  }
  if (!resume.parsedText || resume.parsedText.trim().length < 50) {
    return {
      success: false,
      error:
        "Resume text not extracted. Run PDF parsing before creating an interview.",
      code: "NO_PARSED_TEXT",
    };
  }

  const jd = await prisma.jobDescription.findFirst({
    where: { id: input.jobDescriptionId, userId: user.id },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      requirements: true,
    },
  });
  if (!jd) {
    return {
      success: false,
      error: "Job description not found or access denied",
      code: "ACCESS_DENIED",
    };
  }

  let generatedQuestions;
  try {
    generatedQuestions = await generateInterviewQuestions({
      resumeText: resume.parsedText,
      jobTitle: jd.title,
      jobCompany: jd.company ?? "",
      jobDescription: jd.description,
      jobRequirements: jd.requirements,
      interviewType: input.interviewType,
      difficulty: input.difficulty,
      questionCount: input.questionCount,
      focusAreas: input.focusAreas,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[createInterview] Question generation failed:", message);
    return { success: false, error: message, code: "AI_FAILURE" };
  }

  try {
    const interview = await prisma.$transaction(async (tx) => {
      const created = await tx.interview.create({
        data: {
          userId: user.id,
          resumeId: input.resumeId,
          jobDescriptionId: input.jobDescriptionId,
          status: "PENDING",
        },
      });

      await tx.interviewQuestion.createMany({
        data: generatedQuestions.map((q, idx) => ({
          interviewId: created.id,
          questionText: q.questionText,
          questionType: q.questionType,
          orderIndex: idx,
        })),
      });

      return created;
    });

    console.log(
      `[createInterview] Created interview ${interview.id} with ${generatedQuestions.length} questions`,
    );

    return { success: true, interviewId: interview.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[createInterview] DB persistence failed:", message);
    return {
      success: false,
      error: `DB write failed: ${message}`,
      code: "DB_FAILURE",
    };
  }
}

export async function getInterviewForSession(
  interviewId: string,
  clerkUserId: string,
): Promise<InterviewWithQuestions | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  return prisma.interview.findFirst({
    where: { id: interviewId, userId: user.id },
    include: {
      questions: {
        include: { answer: true },
        orderBy: { orderIndex: "asc" },
      },
      resume: { select: { id: true, fileName: true } },
      jobDescription: { select: { id: true, title: true, company: true } },
    },
  }) as Promise<InterviewWithQuestions | null>;
}

export async function startInterview(
  interviewId: string,
  clerkUserId: string,
): Promise<Interview | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId: user.id },
    select: { id: true, status: true },
  });
  if (!interview) return null;

  if (interview.status !== "PENDING") {
    return prisma.interview.findUnique({ where: { id: interviewId } });
  }

  return prisma.interview.update({
    where: { id: interviewId },
    data: { status: "IN_PROGRESS" },
  });
}

export async function saveAnswer(
  questionId: string,
  answerText: string,
  clerkUserId: string,
): Promise<{ success: boolean; answerId?: string; error?: string }> {
  const question = await prisma.interviewQuestion.findFirst({
    where: {
      id: questionId,
      interview: {
        user: { clerkId: clerkUserId },
      },
    },
    select: { id: true },
  });

  if (!question) {
    return { success: false, error: "Question not found or access denied" };
  }

  try {
    const answer = await prisma.interviewAnswer.upsert({
      where: { questionId },
      create: { questionId, answerText },
      update: { answerText },
      select: { id: true },
    });
    return { success: true, answerId: answer.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export type InterviewListItem = {
  id: string;
  status: string;
  totalScore: number | null;
  duration: number | null;
  createdAt: Date;
  jobDescription: { title: string; company: string } | null;
  resume: { fileName: string } | null;
  _count: { questions: number };
};

export async function getInterviewsForUser(
  clerkUserId: string,
  limit = 20,
): Promise<InterviewListItem[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return [];

  return prisma.interview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      totalScore: true,
      duration: true,
      createdAt: true,
      jobDescription: { select: { title: true, company: true } },
      resume: { select: { fileName: true } },
      _count: { select: { questions: true } },
    },
  }) as Promise<InterviewListItem[]>;
}
