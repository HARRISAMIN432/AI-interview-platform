// ─── ATS Score DTOs ────────────────────────────────────────────────────────

export interface ATSScoreBreakdown {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  experienceScore: number;
}

export interface ATSScoreDetail extends ATSScoreBreakdown {
  id: string;
  resumeId: string;
  jobDescriptionId: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  createdAt: Date;
  jobDescription?: {
    title: string;
    company: string | null;
  };
}

// ─── Score tier helpers ────────────────────────────────────────────────────

export type ScoreTier = "high" | "mid" | "low";

/**
 * Maps a 0-100 score to a display tier.
 * Matches the score-badge-* CSS classes defined in globals.css.
 */
export function getScoreTier(score: number): ScoreTier {
  if (score >= 75) return "high";
  if (score >= 50) return "mid";
  return "low";
}

/**
 * Returns the CSS class name for a score badge.
 * Use with className={getScoreBadgeClass(score)}.
 */
export function getScoreBadgeClass(score: number): string {
  const tier = getScoreTier(score);
  return `score-badge-${tier}`;
}

/**
 * Returns a human-readable label for a score tier.
 */
export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Good Match";
  if (score >= 50) return "Partial Match";
  if (score >= 35) return "Weak Match";
  return "Poor Match";
}
