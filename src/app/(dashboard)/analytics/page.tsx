import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { getUserAnalytics } from "@/lib/actions/analytics";
import { StatsOverview } from "@/components/analytics/stats-overview";
import { ScoreTrendChart } from "@/components/analytics/score-trend-chart";
import { SkillRadar } from "@/components/analytics/skill-radar";
import { InterviewHeatmap } from "@/components/analytics/interview-heatmap";
import { HeroSkeleton, StatCardSkeleton } from "@/components/shared/skeleton";

export const metadata: Metadata = {
  title: "Analytics",
};

async function AnalyticsContent({ clerkUserId }: { clerkUserId: string }) {
  const analytics = await getUserAnalytics(clerkUserId);

  if (!analytics) {
    return (
      <p className="text-sm" style={{ color: "#4a6a7a" }}>
        Unable to load analytics.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <StatsOverview analytics={analytics} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ScoreTrendChart data={analytics.scoreTrend} />
        <SkillRadar
          current={analytics.currentPeriodSkills}
          previous={analytics.previousPeriodSkills}
        />
      </div>

      <InterviewHeatmap data={analytics.heatmapData} />

      {analytics.topWeakAreas.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "#0c1a27", border: "1px solid #152636" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f59e0b", fontFamily: "var(--font-syne)" }}
          >
            Top Weak Areas (aggregated)
          </p>
          <div className="flex flex-wrap gap-2">
            {analytics.topWeakAreas.map((area) => (
              <span
                key={area}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#7a9aaa",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <HeroSkeleton />
    </div>
  );
}

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="animate-fade-in-up">
      <div className="mb-7">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Analytics
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#4a6a7a" }}>
          Track your interview performance and improvement over time.
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent clerkUserId={userId} />
      </Suspense>
    </div>
  );
}
