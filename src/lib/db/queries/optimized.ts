import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

const resumeListSelect = {
  id: true,
  fileName: true,
  s3Key: true,
  s3Url: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ResumeSelect;

const atsScoreListSelect = {
  id: true,
  overallScore: true,
  keywordScore: true,
  formatScore: true,
  experienceScore: true,
  matchedKeywords: true,
  missingKeywords: true,
  suggestions: true,
  createdAt: true,
  jobDescriptionId: true,
  jobDescription: {
    select: { title: true, company: true },
  },
} satisfies Prisma.ATSScoreSelect;

export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export async function getResumesListOptimized(
  userId: string,
  { cursor, limit = 20 }: CursorPaginationParams = {},
): Promise<
  CursorPage<
    Prisma.ResumeGetPayload<{ select: typeof resumeListSelect }>
  >
> {
  const items = await prisma.resume.findMany({
    where: { userId },
    select: resumeListSelect,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;

  return {
    items: page,
    nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
  };
}

export async function getInterviewWithFullDetails(
  interviewId: string,
  userId: string,
) {
  return prisma.interview.findFirst({
    where: { id: interviewId, userId },
    include: {
      resume: {
        select: { id: true, fileName: true, parsedText: true },
      },
      jobDescription: {
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          requirements: true,
        },
      },
      questions: {
        orderBy: { orderIndex: "asc" },
        include: {
          answer: true,
        },
      },
      feedback: true,
    },
  });
}

export async function getUserInterviewsListOptimized(
  userId: string,
  limit = 20,
) {
  return prisma.interview.findMany({
    where: { userId },
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
  });
}

export async function getResumeWithAtsScoresOptimized(
  resumeId: string,
  userId: string,
) {
  return prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: {
      ...resumeListSelect,
      parsedText: true,
      atsScores: {
        select: atsScoreListSelect,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getJobDescriptionsListOptimized(userId: string) {
  return prisma.jobDescription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      requirements: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { atsScores: true, interviews: true } },
    },
  });
}
