import { ScoreRing } from "./score-ring";
import { KeywordMatch } from "./keyword-match";
import { SuggestionsPanel } from "./suggestions-panel";
import { getScoreLabel } from "@/types/ats";
import type { ResumeListItem } from "@/lib/actions/resume-page";

type ATSScoreRecord = ResumeListItem["atsScores"][number];

interface ATSScoreDisplayProps {
  atsScore: ATSScoreRecord;
}

interface SubScoreBarProps {
  label: string;
  score: number;
  weight: string;
}

function SubScoreBar({ label, score, weight }: SubScoreBarProps) {
  const rounded = Math.round(score);
  const color =
    rounded >= 75 ? "#00e5a0" : rounded >= 50 ? "#f59e0b" : "#f87171";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium"
            style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
          >
            {label}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#3d6070",
            }}
          >
            {weight}
          </span>
        </div>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color, fontFamily: "var(--font-syne)" }}
        >
          {rounded}
        </span>
      </div>
      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 5, background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${rounded}%`,
            background:
              rounded >= 75
                ? "linear-gradient(90deg, #00c98a, #00e5a0)"
                : rounded >= 50
                  ? "linear-gradient(90deg, #d97706, #f59e0b)"
                  : "linear-gradient(90deg, #dc2626, #f87171)",
          }}
        />
      </div>
    </div>
  );
}

export function ATSScoreDisplay({ atsScore }: ATSScoreDisplayProps) {
  const overall = Math.round(atsScore.overallScore);
  const label = getScoreLabel(overall);

  return (
    <div className="space-y-6">
      {/* Hero score row */}
      <div className="flex items-center gap-5">
        <ScoreRing score={overall} size={88} strokeWidth={7} />
        <div>
          <p
            className="text-lg font-bold leading-tight"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            {label}
          </p>
          {atsScore.jobDescription && (
            <p
              className="text-xs mt-1"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
            >
              vs{" "}
              <span style={{ color: "#7a9aaa" }}>
                {atsScore.jobDescription.title}
              </span>
              {atsScore.jobDescription.company && (
                <> · {atsScore.jobDescription.company}</>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Sub-score bars */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #152636",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Score Breakdown
        </p>
        <SubScoreBar
          label="Keywords"
          score={atsScore.keywordScore}
          weight="40%"
        />
        <SubScoreBar
          label="Experience"
          score={atsScore.experienceScore}
          weight="35%"
        />
        <SubScoreBar label="Format" score={atsScore.formatScore} weight="25%" />
      </div>

      {/* Keywords */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #152636",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Keyword Analysis
        </p>
        <KeywordMatch
          matchedKeywords={atsScore.matchedKeywords}
          missingKeywords={atsScore.missingKeywords}
        />
      </div>

      {/* Suggestions */}
      {atsScore.suggestions && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #152636",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            Improvement Suggestions
          </p>
          <SuggestionsPanel suggestions={atsScore.suggestions} />
        </div>
      )}
    </div>
  );
}
