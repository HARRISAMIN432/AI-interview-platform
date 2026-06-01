import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";
import type { JobDescriptionListItem } from "@/lib/actions/job-description";

interface JobDescriptionCardProps {
  job: JobDescriptionListItem;
  isSelected: boolean;
}

export function JobDescriptionCard({ job, isSelected }: JobDescriptionCardProps) {
  const resumeCount = job._count.atsScores;
  const topScore =
    job.atsScores.length > 0
      ? Math.round(
          Math.max(...job.atsScores.map((s) => s.overallScore)),
        )
      : null;

  return (
    <Link
      href={`/resume/job-descriptions?id=${job.id}`}
      className="block rounded-xl p-4 transition-all"
      style={{
        background: isSelected ? "rgba(0,229,160,0.06)" : "#0e1e2d",
        border: `1px solid ${isSelected ? "rgba(0,229,160,0.25)" : "#1a3048"}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: "rgba(0,229,160,0.08)",
            border: "1px solid rgba(0,229,160,0.15)",
          }}
        >
          <Briefcase size={16} color="#00e5a0" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            {job.title}
          </p>
          <p className="text-xs truncate mt-0.5" style={{ color: "#4a6a7a" }}>
            {job.company}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="inline-flex items-center gap-1 text-[10px]"
              style={{ color: "#3d6070" }}
            >
              <FileText size={10} />
              {resumeCount} resume{resumeCount !== 1 ? "s" : ""} scored
            </span>
            {topScore != null && (
              <span
                className="text-[10px] font-bold tabular-nums"
                style={{
                  color:
                    topScore >= 75
                      ? "#00e5a0"
                      : topScore >= 50
                        ? "#f59e0b"
                        : "#f87171",
                }}
              >
                Best ATS {topScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
