import { BarChart2, TrendingUp, Trophy, Video } from "lucide-react";
import type { UserAnalytics } from "@/lib/actions/analytics";

interface StatsOverviewProps {
  analytics: UserAnalytics;
}

export function StatsOverview({ analytics }: StatsOverviewProps) {
  const trendColor =
    analytics.improvementTrend > 0
      ? "#00e5a0"
      : analytics.improvementTrend < 0
        ? "#f87171"
        : "#7a9aaa";
  const trendPrefix = analytics.improvementTrend > 0 ? "+" : "";

  const cards = [
    {
      icon: Video,
      label: "Total Interviews",
      value: String(analytics.totalInterviews),
      sub: "Completed sessions",
    },
    {
      icon: BarChart2,
      label: "Avg Score",
      value: analytics.totalInterviews > 0 ? String(analytics.avgScore) : "—",
      sub: "Across all interviews",
    },
    {
      icon: Trophy,
      label: "Best Score",
      value: analytics.totalInterviews > 0 ? String(analytics.bestScore) : "—",
      sub: "Personal best",
    },
    {
      icon: TrendingUp,
      label: "30-Day Trend",
      value:
        analytics.totalInterviews > 0
          ? `${trendPrefix}${analytics.improvementTrend}%`
          : "—",
      sub: "vs prior 30 days",
      valueColor: trendColor,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, sub, valueColor }) => (
        <div
          key={label}
          className="rounded-2xl p-5"
          style={{ background: "#0c1a27", border: "1px solid #152636" }}
        >
          <div className="flex items-start justify-between mb-4">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
            >
              {label}
            </p>
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 32,
                height: 32,
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.12)",
              }}
            >
              <Icon size={15} color="#00e5a0" strokeWidth={1.8} />
            </div>
          </div>
          <p
            className="text-3xl font-bold tabular-nums"
            style={{
              color: valueColor ?? "#dff0ea",
              fontFamily: "var(--font-syne)",
            }}
          >
            {value}
          </p>
          <p className="text-xs mt-1" style={{ color: "#3d6070" }}>
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}
