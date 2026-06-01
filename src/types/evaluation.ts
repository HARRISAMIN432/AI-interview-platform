import type { Prisma } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";

export type InterviewSummaryData = Prisma.InterviewGetPayload<{
  include: {
    questions: {
      include: { answer: true };
      orderBy: { orderIndex: "asc" };
    };
    feedback: true;
    resume: { select: { id: true; fileName: true } };
    jobDescription: {
      select: { id: true; title: true; company: true };
    };
  };
}>;

/** Safely coerce Prisma Json? fields to string arrays for UI rendering. */
export function jsonToStringArray(value: JsonValue | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export function formatInterviewDuration(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}
