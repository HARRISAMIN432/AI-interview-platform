"use server";

import prisma from "@/lib/db/prisma";
import type { InterviewSummaryData } from "@/types/evaluation";

export async function getInterviewSummary(
  interviewId: string,
  clerkUserId: string,
): Promise<InterviewSummaryData | null> {
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
      feedback: true,
      resume: { select: { id: true, fileName: true } },
      jobDescription: { select: { id: true, title: true, company: true } },
    },
  });
}
