"use server";

import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export interface AnalyticsInterviewPoint {
  id: string;
  date: string;
  overallScore: number;
  jobTitle: string;
  company: string;
}

export interface AnalyticsATSScorePoint {
  date: string;
  overallScore: number;
  jobTitle: string;
}

export interface WeeklySkillAverages {
  weekStart: string;
  communication: number;
  technical: number;
  confidence: number;
  problemSolving: number;
}

export interface UserAnalytics {
  totalInterviews: number;
  avgScore: number;
  bestScore: number;
  improvementTrend: number;
  scoreTrend: AnalyticsInterviewPoint[];
  atsScoreTrend: AnalyticsATSScorePoint[];
  weeklySkills: WeeklySkillAverages[];
  currentPeriodSkills: {
    communication: number;
    technical: number;
    confidence: number;
    problemSolving: number;
    structure: number;
  };
  previousPeriodSkills: {
    communication: number;
    technical: number;
    confidence: number;
    problemSolving: number;
    structure: number;
  };
  topWeakAreas: string[];
  heatmapData: Array<{ date: string; count: number }>;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseProblemSolvingScore(
  areasToImprove: Prisma.JsonValue | null,
): number {
  if (!areasToImprove || typeof areasToImprove !== "object" || Array.isArray(areasToImprove)) {
    return 0;
  }
  const score = (areasToImprove as Record<string, unknown>).problemSolvingScore;
  return typeof score === "number" ? score : 0;
}

function parseWeakAreas(areasToImprove: Prisma.JsonValue | null): string[] {
  if (!areasToImprove || typeof areasToImprove !== "object" || Array.isArray(areasToImprove)) {
    return [];
  }
  const items = (areasToImprove as Record<string, unknown>).items;
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "object" && item !== null && "title" in item) {
        return String((item as { title: string }).title);
      }
      return null;
    })
    .filter((t): t is string => Boolean(t));
}

export async function getUserAnalytics(
  clerkUserId: string,
): Promise<UserAnalytics | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [interviews, atsScores] = await Promise.all([
    prisma.interview.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        createdAt: true,
        totalScore: true,
        jobDescription: { select: { title: true, company: true } },
        feedback: {
          select: {
            communicationScore: true,
            technicalScore: true,
            confidenceScore: true,
            areasToImprove: true,
          },
        },
      },
    }),
    prisma.aTSScore.findMany({
      where: { resume: { userId: user.id } },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        overallScore: true,
        jobDescription: { select: { title: true } },
      },
    }),
  ]);

  const scores = interviews
    .map((i) => i.totalScore)
    .filter((s): s is number => s != null);

  const totalInterviews = interviews.length;
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const bestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0;

  const recentScores = interviews
    .filter((i) => i.createdAt >= thirtyDaysAgo && i.totalScore != null)
    .map((i) => i.totalScore as number);
  const priorScores = interviews
    .filter(
      (i) =>
        i.createdAt >= sixtyDaysAgo &&
        i.createdAt < thirtyDaysAgo &&
        i.totalScore != null,
    )
    .map((i) => i.totalScore as number);

  const recentAvg =
    recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : 0;
  const priorAvg =
    priorScores.length > 0
      ? priorScores.reduce((a, b) => a + b, 0) / priorScores.length
      : 0;

  const improvementTrend =
    priorAvg > 0
      ? Math.round(((recentAvg - priorAvg) / priorAvg) * 100)
      : recentAvg > 0
        ? 100
        : 0;

  const scoreTrend: AnalyticsInterviewPoint[] = interviews
    .filter((i) => i.totalScore != null)
    .map((i) => ({
      id: i.id,
      date: i.createdAt.toISOString().slice(0, 10),
      overallScore: Math.round(i.totalScore as number),
      jobTitle: i.jobDescription?.title ?? "Interview",
      company: i.jobDescription?.company ?? "",
    }));

  const atsScoreTrend: AnalyticsATSScorePoint[] = atsScores.map((s) => ({
    date: s.createdAt.toISOString().slice(0, 10),
    overallScore: Math.round(s.overallScore),
    jobTitle: s.jobDescription?.title ?? "Role",
  }));

  const weekMap = new Map<string, WeeklySkillAverages>();

  for (const interview of interviews) {
    if (!interview.feedback) continue;
    const weekKey = startOfWeek(interview.createdAt).toISOString().slice(0, 10);
    const existing = weekMap.get(weekKey) ?? {
      weekStart: weekKey,
      communication: 0,
      technical: 0,
      confidence: 0,
      problemSolving: 0,
      _count: 0,
    };
    const count = (existing as WeeklySkillAverages & { _count: number })._count + 1;
    existing.communication += interview.feedback.communicationScore;
    existing.technical += interview.feedback.technicalScore;
    existing.confidence += interview.feedback.confidenceScore;
    existing.problemSolving += parseProblemSolvingScore(
      interview.feedback.areasToImprove,
    );
    (existing as WeeklySkillAverages & { _count: number })._count = count;
    weekMap.set(weekKey, existing);
  }

  const weeklySkills: WeeklySkillAverages[] = [...weekMap.values()]
    .map((w) => {
      const entry = w as WeeklySkillAverages & { _count: number };
      const c = entry._count || 1;
      return {
        weekStart: w.weekStart,
        communication: Math.round(w.communication / c),
        technical: Math.round(w.technical / c),
        confidence: Math.round(w.confidence / c),
        problemSolving: Math.round(w.problemSolving / c),
      };
    })
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  function periodSkillAverages(from: Date, to: Date) {
    const slice = interviews.filter(
      (i) => i.createdAt >= from && i.createdAt < to && i.feedback,
    );
    if (slice.length === 0) {
      return {
        communication: 0,
        technical: 0,
        confidence: 0,
        problemSolving: 0,
        structure: 0,
      };
    }
    let communication = 0;
    let technical = 0;
    let confidence = 0;
    let problemSolving = 0;
    let structure = 0;

    for (const i of slice) {
      const f = i.feedback!;
      communication += f.communicationScore;
      technical += f.technicalScore;
      confidence += f.confidenceScore;
      problemSolving += parseProblemSolvingScore(f.areasToImprove);
      structure += i.totalScore ?? 0;
    }

    const n = slice.length;
    return {
      communication: Math.round(communication / n),
      technical: Math.round(technical / n),
      confidence: Math.round(confidence / n),
      problemSolving: Math.round(problemSolving / n),
      structure: Math.round(structure / n),
    };
  }

  const now = new Date();
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
  const previousPeriodStart = new Date(now);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 60);

  const currentPeriodSkills = periodSkillAverages(currentPeriodStart, now);
  const previousPeriodSkills = periodSkillAverages(
    previousPeriodStart,
    currentPeriodStart,
  );

  const weakAreaCounts = new Map<string, number>();
  for (const interview of interviews) {
    if (!interview.feedback) continue;
    for (const area of parseWeakAreas(interview.feedback.areasToImprove)) {
      weakAreaCounts.set(area, (weakAreaCounts.get(area) ?? 0) + 1);
    }
  }

  const topWeakAreas = [...weakAreaCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title]) => title);

  const heatmapCounts = new Map<string, number>();
  for (const interview of interviews) {
    const key = interview.createdAt.toISOString().slice(0, 10);
    heatmapCounts.set(key, (heatmapCounts.get(key) ?? 0) + 1);
  }

  const heatmapData = [...heatmapCounts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalInterviews,
    avgScore,
    bestScore,
    improvementTrend,
    scoreTrend,
    atsScoreTrend,
    weeklySkills,
    currentPeriodSkills,
    previousPeriodSkills,
    topWeakAreas,
    heatmapData,
  };
}
