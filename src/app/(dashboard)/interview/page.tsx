import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Video, Clock, BarChart2 } from "lucide-react";

import { getInterviewsForUser } from "@/lib/actions/interview";
import { Skeleton } from "@/components/shared/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Interviews",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; border: string; color: string }
> = {
  PENDING: {
    label: "Not started",
    bg: "rgba(255,255,255,0.04)",
    border: "#1a3048",
    color: "#4a6a7a",
  },
  IN_PROGRESS: {
    label: "In progress",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    color: "#f59e0b",
  },
  COMPLETED: {
    label: "Completed",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.2)",
    color: "#00e5a0",
  },
};

async function InterviewList({ clerkUserId }: { clerkUserId: string }) {
  const interviews = await getInterviewsForUser(clerkUserId);

  if (interviews.length === 0) {
    return (
      <div
        className="rounded-2xl flex flex-col items-center justify-center py-16 text-center"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <div
          className="flex items-center justify-center rounded-2xl mb-4"
          style={{
            width: 56,
            height: 56,
            background: "rgba(0,229,160,0.06)",
            border: "1px solid rgba(0,229,160,0.12)",
          }}
        >
          <Video size={22} color="#00e5a0" strokeWidth={1.5} />
        </div>
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
        >
          No interviews yet
        </p>
        <p
          className="text-xs mb-5"
          style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
        >
          Start your first AI mock interview to begin practicing.
        </p>
        <Link
          href="/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 16px rgba(0,201,138,0.25)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Interview
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      {/* Table header */}
      <div
        className="grid gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
        style={{
          gridTemplateColumns: "1fr 120px 80px 80px 100px",
          color: "#3d6070",
          fontFamily: "var(--font-syne)",
          borderBottom: "1px solid #152636",
        }}
      >
        <span>Role</span>
        <span>Date</span>
        <span>Questions</span>
        <span>Duration</span>
        <span>Score</span>
      </div>

      {/* Rows */}
      {interviews.map((interview) => {
        const statusConfig =
          STATUS_CONFIG[interview.status] ?? STATUS_CONFIG.PENDING;
        const score =
          interview.totalScore != null
            ? Math.round(interview.totalScore)
            : null;
        const scoreColor =
          score == null
            ? "#3d6070"
            : score >= 75
              ? "#00e5a0"
              : score >= 50
                ? "#f59e0b"
                : "#f87171";

        const href =
          interview.status === "COMPLETED"
            ? `/interview/${interview.id}/summary`
            : `/interview/${interview.id}`;

        return (
          <Link
            key={interview.id}
            href={href}
            className="grid gap-4 px-5 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] group"
            style={{
              gridTemplateColumns: "1fr 120px 80px 80px 100px",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            {/* Role */}
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate group-hover:text-[#dff0ea] transition-colors"
                style={{ color: "#b0ccd8", fontFamily: "var(--font-dm-sans)" }}
              >
                {interview.jobDescription?.title ?? "Untitled"}
              </p>
              {interview.jobDescription?.company && (
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: "#3d6070" }}
                >
                  {interview.jobDescription.company}
                </p>
              )}
            </div>

            {/* Date */}
            <p
              className="text-xs self-center"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
            >
              {formatDate(interview.createdAt)}
            </p>

            {/* Question count */}
            <p
              className="text-sm font-medium self-center"
              style={{ color: "#7a9aaa", fontFamily: "var(--font-syne)" }}
            >
              {interview._count.questions}
            </p>

            {/* Duration */}
            <div className="flex items-center gap-1 self-center">
              <Clock size={11} color="#3d6070" strokeWidth={1.8} />
              <p
                className="text-xs"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
              >
                {formatDuration(interview.duration)}
              </p>
            </div>

            {/* Score + status */}
            <div className="flex items-center gap-2 self-center">
              {score != null ? (
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: scoreColor, fontFamily: "var(--font-syne)" }}
                >
                  {score}
                </span>
              ) : (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                  style={{
                    background: statusConfig.bg,
                    border: `1px solid ${statusConfig.border}`,
                    color: statusConfig.color,
                  }}
                >
                  {statusConfig.label}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <div
        className="px-5 py-3.5"
        style={{ borderBottom: "1px solid #152636" }}
      >
        <Skeleton className="h-3 w-64" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
        >
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default async function InterviewsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            Interviews
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#4a6a7a" }}>
            Practice, review, and track your progress over time.
          </p>
        </div>
        <Link
          href="/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 16px rgba(0,201,138,0.25)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Interview
        </Link>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <InterviewList clerkUserId={userId} />
      </Suspense>
    </div>
  );
}
