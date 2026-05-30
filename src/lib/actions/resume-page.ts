"use server";

import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export type ResumeListItem = Prisma.ResumeGetPayload<{
  select: {
    id: true;
    fileName: true;
    s3Key: true;
    s3Url: true;
    createdAt: true;
    updatedAt: true;
    atsScores: {
      select: {
        id: true;
        overallScore: true;
        keywordScore: true;
        formatScore: true;
        experienceScore: true;
        matchedKeywords: true;
        missingKeywords: true;
        suggestions: true;
        createdAt: true;
        jobDescriptionId: true;
        jobDescription: {
          select: { title: true; company: true };
        };
      };
    };
  };
}>;

/**
 * Resume detail — includes parsedText for the detail panel only.
 */
export type ResumeDetail = Prisma.ResumeGetPayload<{
  select: {
    id: true;
    fileName: true;
    s3Key: true;
    s3Url: true;
    parsedText: true;
    createdAt: true;
    updatedAt: true;
    atsScores: {
      select: {
        id: true;
        overallScore: true;
        keywordScore: true;
        formatScore: true;
        experienceScore: true;
        matchedKeywords: true;
        missingKeywords: true;
        suggestions: true;
        createdAt: true;
        jobDescriptionId: true;
        jobDescription: {
          select: { title: true; company: true };
        };
      };
    };
  };
}>;

// ─── Reusable select shapes ────────────────────────────────────────────────

const atsScoreSelect = {
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

const resumeListSelect = {
  id: true,
  fileName: true,
  s3Key: true,
  s3Url: true,
  createdAt: true,
  updatedAt: true,
  atsScores: {
    select: atsScoreSelect,
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.ResumeSelect;

const resumeDetailSelect = {
  ...resumeListSelect,
  parsedText: true,
} satisfies Prisma.ResumeSelect;

// ─── Queries ───────────────────────────────────────────────────────────────

/**
 * Returns all resumes for a user with their ATS scores.
 * parsedText is excluded — use getResumeDetail for that.
 */
export async function getResumesForUser(
  clerkUserId: string,
): Promise<ResumeListItem[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return [];

  return prisma.resume.findMany({
    where: { userId: user.id },
    select: resumeListSelect,
    orderBy: { createdAt: "desc" },
  }) as Promise<ResumeListItem[]>;
}

/**
 * Returns a single resume with full detail including parsedText and ATS scores.
 * Returns null if not found or not owned by the user.
 */
export async function getResumeDetail(
  resumeId: string,
  clerkUserId: string,
): Promise<ResumeDetail | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  return prisma.resume.findFirst({
    where: { id: resumeId, userId: user.id },
    select: resumeDetailSelect,
  }) as Promise<ResumeDetail | null>;
}

/**
 * Returns all job descriptions for a user — used to populate the
 * "Score against job" dropdown in the detail panel.
 */
export async function getJobDescriptionsForUser(
  clerkUserId: string,
): Promise<Array<{ id: string; title: string; company: string }>> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return [];

  return prisma.jobDescription.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, company: true },
    orderBy: { createdAt: "desc" },
  });
}
