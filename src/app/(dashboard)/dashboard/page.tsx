import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import prisma from "@/lib/db/prisma";
import { getInterviewsForUser } from "@/lib/actions/interview";
import { getUserAnalytics } from "@/lib/actions/analytics";
import { QuickActions } from "@/components/shared/quick-actions";
import { RecentInterviews } from "@/components/shared/recent-interviews";
import { PerformanceSummary } from "@/components/shared/performance-summary";
import { ScoreRing } from "@/components/resume/score-ring";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [clerkUser, interviews, analytics, resumeStats, latestAts] =
    await Promise.all([
      currentUser(),
      getInterviewsForUser(userId, 5),
      getUserAnalytics(userId),
      prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          _count: { select: { resumes: true, jobDescriptions: true } },
          resumes: {
            select: { id: true, parsedText: true },
            take: 20,
          },
        },
      }),
      prisma.aTSScore.findMany({
        where: { resume: { user: { clerkId: userId } } },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          overallScore: true,
          createdAt: true,
          jobDescription: { select: { title: true, company: true } },
          resume: { select: { fileName: true } },
        },
      }),
    ]);

  const firstName =
    clerkUser?.firstName ?? clerkUser?.username ?? "there";
  const hasResume = (resumeStats?._count.resumes ?? 0) > 0;
  const hasParsedResume =
    resumeStats?.resumes.some(
      (r) => r.parsedText && r.parsedText.trim().length > 50,
    ) ?? false;
  const hasJobDescription = (resumeStats?._count.jobDescriptions ?? 0) > 0;

  return (
    <div className="animate-fade-in-up space-y-8">
      <div
        className="relative rounded-2xl p-7 overflow-hidden"
        style={{
          background: "#0c1a27",
          border: "1px solid #152636",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
            opacity: 0.45,
          }}
        />
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: "#00e5a0", fontFamily: "var(--font-syne)" }}
        >
          Welcome back
        </p>
        <h1
          className="text-2xl lg:text-3xl font-bold tracking-tight"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Hey {firstName}, ready to practice?
        </h1>
        <p
          className="mt-2 text-sm max-w-xl"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)", lineHeight: 1.7 }}
        >
          Upload resumes, score against roles, and run AI mock interviews — all
          in one place.
        </p>
      </div>

      <QuickActions
        hasResume={hasResume}
        hasParsedResume={hasParsedResume}
        hasJobDescription={hasJobDescription}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentInterviews interviews={interviews} />
        </div>
        <PerformanceSummary
          avgScore={analytics?.avgScore ?? 0}
          bestScore={analytics?.bestScore ?? 0}
          improvementTrend={analytics?.improvementTrend ?? 0}
          totalInterviews={analytics?.totalInterviews ?? 0}
        />
      </div>

      {latestAts.length > 0 && (
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            Latest ATS Scores
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestAts.map((ats) => (
              <Link
                key={ats.id}
                href="/resume"
                className="rounded-2xl p-4 flex items-center gap-4 transition-colors hover:border-[rgba(0,229,160,0.2)]"
                style={{ background: "#0c1a27", border: "1px solid #152636" }}
              >
                <ScoreRing
                  score={Math.round(ats.overallScore)}
                  size={56}
                  strokeWidth={5}
                  showLabel={true}
                />
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "#dff0ea" }}
                  >
                    {ats.jobDescription?.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#4a6a7a" }}>
                    {ats.resume?.fileName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
