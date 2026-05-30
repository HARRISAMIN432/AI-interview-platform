import Link from "next/link";
import { FileText, Calendar, ChevronRight } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { getScoreLabel } from "@/types/ats";
import type { ResumeListItem } from "@/lib/actions/resume-page";

interface ResumeCardProps {
  resume: ResumeListItem;
  isSelected?: boolean;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatFileName(name: string): string {
  return name.length > 36 ? name.slice(0, 33) + "…" : name;
}

export function ResumeCard({ resume, isSelected }: ResumeCardProps) {
  // Use the most recent ATS score for the badge
  const latestScore = resume.atsScores[0] ?? null;
  const score = latestScore ? Math.round(latestScore.overallScore) : null;

  const scoreBg =
    score === null
      ? "rgba(255,255,255,0.04)"
      : score >= 75
        ? "rgba(0,229,160,0.08)"
        : score >= 50
          ? "rgba(245,158,11,0.08)"
          : "rgba(239,68,68,0.08)";

  const scoreBorder =
    score === null
      ? "#1a3048"
      : score >= 75
        ? "rgba(0,229,160,0.2)"
        : score >= 50
          ? "rgba(245,158,11,0.2)"
          : "rgba(239,68,68,0.2)";

  const scoreColor =
    score === null
      ? "#4a6a7a"
      : score >= 75
        ? "#00e5a0"
        : score >= 50
          ? "#f59e0b"
          : "#f87171";

  return (
    <Link
      href={`/resume?id=${resume.id}`}
      className="block group"
      prefetch={false}
    >
      <div
        className="rounded-2xl p-4 transition-all duration-200 group-hover:border-[rgba(0,229,160,0.15)] group-hover:bg-[#0e1e2d]"
        style={{
          background: isSelected ? "#0e1e2d" : "#0c1a27",
          border: `1px solid ${isSelected ? "rgba(0,229,160,0.25)" : "#152636"}`,
          boxShadow: isSelected ? "0 0 0 1px rgba(0,229,160,0.1)" : "none",
        }}
      >
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* File icon */}
          <div
            className="shrink-0 flex items-center justify-center rounded-xl mt-0.5"
            style={{
              width: 36,
              height: 36,
              background: isSelected
                ? "rgba(0,229,160,0.1)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${isSelected ? "rgba(0,229,160,0.2)" : "#1a3048"}`,
            }}
          >
            <FileText
              size={15}
              color={isSelected ? "#00e5a0" : "#3d6070"}
              strokeWidth={1.8}
            />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium leading-snug truncate"
              style={{
                color: isSelected ? "#dff0ea" : "#b0ccd8",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {formatFileName(resume.fileName)}
            </p>
            <div
              className="flex items-center gap-1.5 mt-1"
              style={{ color: "#3d6070" }}
            >
              <Calendar size={11} strokeWidth={1.8} />
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {formatDate(resume.createdAt)}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronRight
            size={14}
            className="shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
            style={{ color: "#2a4050" }}
          />
        </div>

        {/* Score badge + linked job */}
        <div className="mt-3 flex items-center gap-2">
          {score !== null ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{
                background: scoreBg,
                border: `1px solid ${scoreBorder}`,
                color: scoreColor,
                fontFamily: "var(--font-syne)",
              }}
            >
              {score}
              <span style={{ color: "#4a6a7a", fontWeight: 400, fontSize: 10 }}>
                ATS
              </span>
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #152636",
                color: "#3d6070",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Not scored
            </span>
          )}

          {latestScore?.jobDescription && (
            <span
              className="text-xs truncate"
              style={{ color: "#3d6070", maxWidth: 120 }}
            >
              vs {latestScore.jobDescription.title}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
