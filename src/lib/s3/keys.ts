import { randomUUID } from "crypto";
import path from "path";

export function generateResumeKey(
  clerkUserId: string,
  fileName: string,
): string {
  const ext = path.extname(fileName).toLowerCase();
  const uuid = randomUUID();
  return `resumes/${clerkUserId}/${uuid}${ext}`;
}

/**
 * Generates a key for audio recordings (used in future modules).
 * Pattern: interviews/{interviewId}/answers/{questionId}/{uuid}.webm
 */
export function generateAudioKey(
  interviewId: string,
  questionId: string,
): string {
  const uuid = randomUUID();
  return `interviews/${interviewId}/answers/${questionId}/${uuid}.webm`;
}

/**
 * Extracts the user ID from a resume S3 key for ownership verification.
 * Returns null if the key doesn't match the expected pattern.
 */
export function extractUserIdFromKey(key: string): string | null {
  const match = key.match(/^resumes\/([^/]+)\//);
  return match ? match[1] : null;
}
