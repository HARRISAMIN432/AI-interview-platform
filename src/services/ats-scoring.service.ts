import prisma from "@/lib/db/prisma";
import { runAtsScoring } from "@/lib/ats/scorer";
import type { ATSScoringRequest } from "@/lib/validators/ats";
import type { ATSScore } from "@prisma/client";

export interface ATSScoringSuccess {
  success: true;
  atsScore: ATSScore;
  fromCache: boolean;
}

export interface ATSScoringFailure {
  success: false;
  error: string;
  code:
    | "NOT_FOUND"
    | "NO_PARSED_TEXT"
    | "ACCESS_DENIED"
    | "AI_FAILURE"
    | "DB_FAILURE";
}

export type ATSScoringOutcome = ATSScoringSuccess | ATSScoringFailure;

/**
 * Full ATS scoring pipeline:
 *   1. Ownership + existence checks for resume and job description
 *   2. Guard: resume must have parsedText (Module 6 must have run)
 *   3. Cache check: if an ATSScore already exists for this pair, return it
 *   4. Call Gemini for AI scoring
 *   5. Upsert ATSScore (schema has @@unique([resumeId, jobDescriptionId]))
 *   6. Return the result
 *
 * @param clerkUserId  - The Clerk user ID for ownership verification
 * @param input        - { resumeId, jobDescriptionId }
 * @param forceRefresh - If true, re-score even if a cached result exists
 */
export async function scoreResumeAgainstJob(
  clerkUserId: string,
  input: ATSScoringRequest,
  forceRefresh = false,
): Promise<ATSScoringOutcome> {
  // ── 1. Resolve Prisma user ──────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return { success: false, error: "User not found", code: "NOT_FOUND" };
  }

  // ── 2. Fetch resume (with ownership check) ──────────────────────────────
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
        "Resume has not been parsed yet. Run PDF text extraction before ATS scoring.",
      code: "NO_PARSED_TEXT",
    };
  }

  // ── 3. Fetch job description (with ownership check) ─────────────────────
  const jobDescription = await prisma.jobDescription.findFirst({
    where: { id: input.jobDescriptionId, userId: user.id },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      requirements: true,
    },
  });

  if (!jobDescription) {
    return {
      success: false,
      error: "Job description not found or access denied",
      code: "ACCESS_DENIED",
    };
  }

  // ── 4. Cache check ──────────────────────────────────────────────────────
  if (!forceRefresh) {
    const cached = await prisma.aTSScore.findUnique({
      where: {
        resumeId_jobDescriptionId: {
          resumeId: input.resumeId,
          jobDescriptionId: input.jobDescriptionId,
        },
      },
    });

    if (cached) {
      console.log(
        `[ATSScoringService] Cache hit for resume ${input.resumeId} × job ${input.jobDescriptionId}`,
      );
      return { success: true, atsScore: cached, fromCache: true };
    }
  }

  // ── 5. Call AI ──────────────────────────────────────────────────────────
  console.log(
    `[ATSScoringService] Scoring resume "${resume.fileName}" against "${jobDescription.title}" at ${jobDescription.company}`,
  );

  let scoreResult;
  try {
    scoreResult = await runAtsScoring({
      resumeText: resume.parsedText,
      jobTitle: jobDescription.title,
      jobCompany: jobDescription.company ?? "",
      jobDescription: jobDescription.description,
      // requirements is String[] in schema — join into a single string for the prompt
      jobRequirements: jobDescription.requirements.join("\n"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ATSScoringService] AI scoring failed:", message);
    return { success: false, error: message, code: "AI_FAILURE" };
  }

  // ── 6. Upsert results ───────────────────────────────────────────────────
  // Schema has @@unique([resumeId, jobDescriptionId]) so we upsert, not create.
  // forceRefresh overwrites the existing row with fresh scores.
  try {
    const atsScore = await prisma.aTSScore.upsert({
      where: {
        resumeId_jobDescriptionId: {
          resumeId: input.resumeId,
          jobDescriptionId: input.jobDescriptionId,
        },
      },
      create: {
        resumeId: input.resumeId,
        jobDescriptionId: input.jobDescriptionId,
        overallScore: scoreResult.overallScore,
        keywordScore: scoreResult.keywordScore,
        formatScore: scoreResult.formatScore,
        experienceScore: scoreResult.experienceScore,
        matchedKeywords: scoreResult.matchedKeywords,
        missingKeywords: scoreResult.missingKeywords,
        suggestions: scoreResult.suggestions,
      },
      update: {
        overallScore: scoreResult.overallScore,
        keywordScore: scoreResult.keywordScore,
        formatScore: scoreResult.formatScore,
        experienceScore: scoreResult.experienceScore,
        matchedKeywords: scoreResult.matchedKeywords,
        missingKeywords: scoreResult.missingKeywords,
        suggestions: scoreResult.suggestions,
      },
    });

    console.log(
      `[ATSScoringService] Upserted: overall=${scoreResult.overallScore}, ` +
        `keyword=${scoreResult.keywordScore}, experience=${scoreResult.experienceScore}, ` +
        `format=${scoreResult.formatScore}`,
    );

    return { success: true, atsScore, fromCache: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ATSScoringService] DB persistence failed:", message);
    return {
      success: false,
      error: `DB write failed: ${message}`,
      code: "DB_FAILURE",
    };
  }
}

/**
 * Fetches the ATSScore for a specific resume + job description pair.
 * Returns null if no score exists yet.
 */
export async function getATSScore(
  resumeId: string,
  jobDescriptionId: string,
): Promise<ATSScore | null> {
  return prisma.aTSScore.findUnique({
    where: {
      resumeId_jobDescriptionId: { resumeId, jobDescriptionId },
    },
  });
}

/**
 * Fetches all ATSScores for a resume across all job descriptions.
 * Used by the resume detail page to show scoring history.
 */
export async function getATSScoresByResume(
  resumeId: string,
): Promise<ATSScore[]> {
  return prisma.aTSScore.findMany({
    where: { resumeId },
    orderBy: { createdAt: "desc" },
    include: { jobDescription: { select: { title: true, company: true } } },
  });
}
