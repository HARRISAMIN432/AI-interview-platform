import { unstable_cache } from "next/cache";
import { getUserAnalytics } from "@/lib/actions/analytics";
import { getATSScore } from "@/services/ats-scoring.service";
import type { UserAnalytics } from "@/lib/actions/analytics";
import type { ATSScore } from "@prisma/client";

export function analyticsCacheTag(clerkUserId: string): string {
  return `analytics-${clerkUserId}`;
}

export function atsScoreCacheTag(
  resumeId: string,
  jobDescriptionId: string,
): string {
  return `ats-${resumeId}-${jobDescriptionId}`;
}

export async function cacheUserAnalytics(
  clerkUserId: string,
): Promise<UserAnalytics | null> {
  return unstable_cache(
    async () => getUserAnalytics(clerkUserId),
    ["user-analytics", clerkUserId],
    {
      tags: [analyticsCacheTag(clerkUserId)],
      revalidate: 300,
    },
  )();
}

export async function cacheATSScore(
  resumeId: string,
  jobDescriptionId: string,
): Promise<ATSScore | null> {
  return unstable_cache(
    async () => getATSScore(resumeId, jobDescriptionId),
    ["ats-score", resumeId, jobDescriptionId],
    {
      tags: [atsScoreCacheTag(resumeId, jobDescriptionId)],
      revalidate: 3600,
    },
  )();
}
