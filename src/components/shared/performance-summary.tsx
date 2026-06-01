import Link from "next/link";
import { TrendingUp, BarChart2 } from "lucide-react";

interface PerformanceSummaryProps {
  avgScore: number;
  bestScore: number;
  improvementTrend: number;
  totalInterviews: number;
}

export function PerformanceSummary({
  avgScore,
  bestScore,
  improvementTrend,
  totalInterviews,
}: PerformanceSummaryProps) {
  const trendColor =
    improvementTrend > 0
      ? "#00e5a0"
      : improvementTrend < 0
        ? "#f87171"
        : "#7a9aaa";

  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Performance
        </p>
        <BarChart2 size={16} color="#3d6070" />
      </div>

      {totalInterviews === 0 ? (
        <p className="text-sm" style={{ color: "#4a6a7a" }}>
          Complete interviews to see your performance summary.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span
              className="text-4xl font-bold tabular-nums"
              style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
            >
              {avgScore}
            </span>
            <span className="text-sm mb-1" style={{ color: "#4a6a7a" }}>
              avg score
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: "#7a9aaa" }}>
              Best:{" "}
              <strong style={{ color: "#00e5a0" }}>{bestScore}</strong>
            </span>
            <span className="inline-flex items-center gap-1" style={{ color: trendColor }}>
              <TrendingUp size={12} />
              {improvementTrend > 0 ? "+" : ""}
              {improvementTrend}% (30d)
            </span>
          </div>
        </div>
      )}

      <Link
        href="/analytics"
        className="inline-block mt-4 text-xs font-semibold"
        style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
      >
        Open analytics →
      </Link>
    </div>
  );
}
