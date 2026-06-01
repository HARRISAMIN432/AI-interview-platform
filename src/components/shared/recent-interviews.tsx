import Link from "next/link";
import { EmptyState } from "./empty-state";

export type RecentInterviewRow = {
  id: string;
  status: string;
  totalScore: number | null;
  createdAt: Date;
  jobDescription: { title: string; company: string } | null;
};

interface RecentInterviewsProps {
  interviews: RecentInterviewRow[];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function RecentInterviews({ interviews }: RecentInterviewsProps) {
  if (interviews.length === 0) {
    return (
      <EmptyState
        heading="No interviews yet"
        body="Start a mock interview to see your results here."
        ctaLabel="Start interview"
        ctaHref="/interview/new"
      />
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <div
        className="px-5 py-3.5"
        style={{ borderBottom: "1px solid #152636" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Recent Interviews
        </p>
      </div>
      {interviews.map((interview) => {
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
        const reportHref =
          interview.status === "COMPLETED"
            ? `/feedback/${interview.id}`
            : `/interview/${interview.id}`;

        return (
          <div
            key={interview.id}
            className="flex items-center gap-4 px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#b0ccd8" }}
              >
                {interview.jobDescription?.title ?? "Interview"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#3d6070" }}>
                {formatDate(interview.createdAt)}
                {interview.jobDescription?.company &&
                  ` · ${interview.jobDescription.company}`}
              </p>
            </div>
            {score != null ? (
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: scoreColor, fontFamily: "var(--font-syne)" }}
              >
                {score}
              </span>
            ) : (
              <span className="text-[10px]" style={{ color: "#4a6a7a" }}>
                {interview.status.replace("_", " ")}
              </span>
            )}
            <Link
              href={reportHref}
              className="text-xs font-semibold shrink-0"
              style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
            >
              View Report
            </Link>
          </div>
        );
      })}
    </div>
  );
}
