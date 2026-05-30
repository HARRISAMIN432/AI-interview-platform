"use server";

import prisma from "@/lib/db/prisma";
import type { SaveResumeMetadata } from "@/lib/validators/upload";
import type { Resume } from "@prisma/client";

/**
 * Persists resume file metadata to the database after a successful S3 upload.
 *
 * This is intentionally kept thin — it only writes what we know at upload time.
 * parsedText and atsScore are populated later by Module 6 and 7 respectively.
 */
export async function saveResumeMetadata(
  clerkUserId: string,
  metadata: SaveResumeMetadata,
): Promise<Resume> {
  // Look up Prisma user by Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(
      `[saveResumeMetadata] No user found for clerkId: ${clerkUserId}`,
    );
  }

  return prisma.resume.create({
    data: {
      userId: user.id,
      fileName: metadata.fileName,
      s3Key: metadata.s3Key,
      s3Url: metadata.s3Url,
      // parsedText and atsScore are null until parsing/scoring runs
    },
  });
}

/**
 * Fetches all resumes for a user, ordered by newest first.
 */
export async function getUserResumes(clerkUserId: string): Promise<Resume[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) return [];

  return prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetches a single resume by ID, verifying it belongs to the requesting user.
 * Returns null if not found or unauthorized.
 */
export async function getResumeById(
  resumeId: string,
  clerkUserId: string,
): Promise<Resume | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) return null;

  return prisma.resume.findFirst({
    where: { id: resumeId, userId: user.id },
  });
}

/**
 * Updates the parsedText field on a Resume record.
 * Called by the PDF parser service after successful extraction.
 */
export async function updateResumeParsedText(
  resumeId: string,
  parsedText: string,
): Promise<Resume> {
  return prisma.resume.update({
    where: { id: resumeId },
    data: { parsedText },
  });
}

/**
 * Deletes a resume record and — critically — also schedules S3 cleanup.
 * S3 deletion should be handled by the calling service to keep this action pure.
 */
export async function deleteResume(
  resumeId: string,
  clerkUserId: string,
): Promise<{ s3Key: string }> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("[deleteResume] User not found");
  }

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: user.id },
    select: { id: true, s3Key: true },
  });

  if (!resume) {
    throw new Error("[deleteResume] Resume not found or access denied");
  }

  await prisma.resume.delete({ where: { id: resumeId } });

  return { s3Key: resume.s3Key };
}
