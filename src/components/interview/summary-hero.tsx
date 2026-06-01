import { ScoreRing } from "@/components/resume/score-ring";
import { getScoreLabel } from "@/types/ats";
import { formatInterviewDuration } from "@/types/evaluation";
import { Calendar, Clock, FileText } from "lucide-react";

interface SummaryHeroProps {
  overallScore: number;
  jobTitle: string;
  company: string | null;
  resumeFileName: string | null;
  durationSeconds: number | null;
  completedAt: Date;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function SummaryHero({
  overallScore,
  jobTitle,
  company,
  resumeFileName,
  durationSeconds,
  completedAt,
}: SummaryHeroProps) {
  const rounded = Math.round(overallScore);
  const label = getScoreLabel(rounded);

  return (
    <div
      className="relative rounded-2xl p-6 lg:p-8"
      style={{
        background: "#0c1a27",
        border: "1px solid #152636",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
          opacity: 0.45,
        }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <ScoreRing score={rounded} size={100} strokeWidth={7} />

        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
          >
            Interview Complete
          </p>
          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            {jobTitle}
          </h1>
          {company && (
            <p
              className="text-sm mb-3"
              style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
            >
              {company}
            </p>
          )}
          <p
            className="text-base font-semibold"
            style={{ color: "#b0ccd8", fontFamily: "var(--font-syne)" }}
          >
            {label}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 lg:flex-col lg:items-end lg:gap-3">
          {[
            {
              icon: Calendar,
              label: "Date",
              value: formatDate(completedAt),
            },
            {
              icon: Clock,
              label: "Duration",
              value: formatInterviewDuration(durationSeconds),
            },
            ...(resumeFileName
              ? [
                  {
                    icon: FileText,
                    label: "Resume",
                    value:
                      resumeFileName.length > 22
                        ? `${resumeFileName.slice(0, 20)}…`
                        : resumeFileName,
                  },
                ]
              : []),
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={14} color="#3d6070" strokeWidth={1.8} />
              <div>
                <p
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "#3d6070", fontFamily: "var(--font-syne)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs font-medium"
                  style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
