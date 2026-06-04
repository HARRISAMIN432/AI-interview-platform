"use server";

import { after } from "next/server";
import prisma from "@/lib/db/prisma";
import { extractJobDescriptionMetadata } from "@/lib/ai/jd-extractor";
import { scoreResumeAgainstJob } from "@/services/ats-scoring.service";
import {
  ExtractJdSchema,
  JobDescriptionFormSchema,
  type JobDescriptionFormInput,
  type JdMetadata,
} from "@/lib/validators/job-description";
import { applyRateLimit } from "@/lib/rate-limit";
import type { JobDescription } from "@prisma/client";

export type JobDescriptionListItem = {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  _count: { atsScores: number };
  atsScores: Array<{
    id: string;
    overallScore: number;
    resume: { id: string; fileName: string };
  }>;
};

function metadataToFormValues(
  metadata: JdMetadata,
  rawText: string,
): JobDescriptionFormInput {
  const reqSet = new Set([
    ...metadata.requirements,
    ...metadata.requiredSkills,
    ...metadata.preferredSkills,
  ]);

  const descriptionParts = [
    rawText.trim(),
    metadata.responsibilities.length > 0
      ? `\n\nResponsibilities:\n${metadata.responsibilities.map((r) => `• ${r}`).join("\n")}`
      : "",
    metadata.location ? `\nLocation: ${metadata.location}` : "",
    metadata.salaryRange ? `\nSalary: ${metadata.salaryRange}` : "",
    metadata.experienceLevel
      ? `\nExperience Level: ${metadata.experienceLevel}`
      : "",
  ];

  return {
    title: metadata.title,
    company: metadata.company,
    description: descriptionParts.join("").slice(0, 15000),
    requirements: [...reqSet].filter(Boolean).slice(0, 40),
  };
}

async function runAtsForAllResumes(
  clerkUserId: string,
  jobDescriptionId: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return;

  const resumes = await prisma.resume.findMany({
    where: {
      userId: user.id,
      parsedText: { not: null },
    },
    select: { id: true },
  });

  for (const resume of resumes) {
    try {
      await scoreResumeAgainstJob(
        clerkUserId,
        { resumeId: resume.id, jobDescriptionId },
        true,
      );
    } catch (err) {
      console.error(
        `[runAtsForAllResumes] Failed resume ${resume.id}:`,
        err,
      );
    }
  }
}

export async function extractJobDescriptionFromText(
  rawText: string,
  clerkUserId?: string,
): Promise<
  | { success: true; data: JobDescriptionFormInput }
  | { success: false; error: string }
> {
  try {
    if (clerkUserId) {
      const rateLimit = applyRateLimit(`ai:${clerkUserId}`, 30, 60 * 60 * 1000);
      if (!rateLimit.success) {
        return {
          success: false,
          error: "Too many AI requests. Please try again later.",
        };
      }
    }

    const parsed = ExtractJdSchema.parse({ rawText });
    const metadata = await extractJobDescriptionMetadata(parsed.rawText);
    return {
      success: true,
      data: metadataToFormValues(metadata, parsed.rawText),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function getJobDescriptionsForUser(
  clerkUserId: string,
): Promise<JobDescriptionListItem[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return [];

  return prisma.jobDescription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      requirements: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { atsScores: true } },
      atsScores: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          overallScore: true,
          resume: { select: { id: true, fileName: true } },
        },
      },
    },
  }) as Promise<JobDescriptionListItem[]>;
}

export async function getJobDescriptionById(
  id: string,
  clerkUserId: string,
): Promise<JobDescriptionListItem | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  return prisma.jobDescription.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      requirements: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { atsScores: true } },
      atsScores: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          overallScore: true,
          resume: { select: { id: true, fileName: true } },
        },
      },
    },
  }) as Promise<JobDescriptionListItem | null>;
}

export async function createJobDescription(
  clerkUserId: string,
  input: JobDescriptionFormInput,
): Promise<
  | { success: true; jobDescription: JobDescription; atsScoringStarted: boolean }
  | { success: false; error: string }
> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return { success: false, error: "User not found" };

  try {
    const data = JobDescriptionFormSchema.parse(input);
    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        title: data.title,
        company: data.company,
        description: data.description,
        requirements: data.requirements,
      },
    });

    after(async () => {
      try {
        await runAtsForAllResumes(clerkUserId, jobDescription.id);
      } catch (err) {
        console.error("[createJobDescription] Background ATS failed:", err);
      }
    });

    return { success: true, jobDescription, atsScoringStarted: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function updateJobDescription(
  id: string,
  clerkUserId: string,
  input: JobDescriptionFormInput,
): Promise<
  | { success: true; jobDescription: JobDescription; atsScoringStarted: boolean }
  | { success: false; error: string }
> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return { success: false, error: "User not found" };

  const existing = await prisma.jobDescription.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) {
    return { success: false, error: "Job description not found" };
  }

  try {
    const data = JobDescriptionFormSchema.parse(input);
    const jobDescription = await prisma.jobDescription.update({
      where: { id },
      data: {
        title: data.title,
        company: data.company,
        description: data.description,
        requirements: data.requirements,
      },
    });

    after(async () => {
      try {
        await runAtsForAllResumes(clerkUserId, jobDescription.id);
      } catch (err) {
        console.error("[updateJobDescription] Background ATS failed:", err);
      }
    });

    return { success: true, jobDescription, atsScoringStarted: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function deleteJobDescription(
  id: string,
  clerkUserId: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return { success: false, error: "User not found" };

  const existing = await prisma.jobDescription.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) {
    return { success: false, error: "Job description not found" };
  }

  try {
    await prisma.jobDescription.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
