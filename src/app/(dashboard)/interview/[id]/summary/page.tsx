import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { getInterviewSummary } from "@/lib/actions/interview-summary";
import { InterviewSummaryView } from "@/components/interview/interview-summary-view";
import { FeedbackSkeleton } from "@/components/shared/skeleton";

export const metadata: Metadata = {
  title: "Interview Summary",
};

interface SummaryPageProps {
  params: Promise<{ id: string }>;
}

async function SummaryContent({
  interviewId,
  clerkUserId,
}: {
  interviewId: string;
  clerkUserId: string;
}) {
  const interview = await getInterviewSummary(interviewId, clerkUserId);

  if (!interview) {
    notFound();
  }

  if (interview.status !== "COMPLETED") {
    redirect(`/interview/${interviewId}`);
  }

  return <InterviewSummaryView interview={interview} />;
}

export default async function InterviewSummaryPage({ params }: SummaryPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <Suspense fallback={<FeedbackSkeleton />}>
        <SummaryContent interviewId={id} clerkUserId={userId} />
      </Suspense>
    </div>
  );
}
