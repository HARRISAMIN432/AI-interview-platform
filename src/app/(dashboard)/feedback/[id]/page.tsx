import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import {
  generateFeedbackForInterview,
  getFeedbackReport,
} from "@/lib/actions/generate-feedback";
import { FeedbackReport } from "@/components/feedback/feedback-report";
import { FeedbackSkeleton } from "@/components/shared/skeleton";

export const metadata: Metadata = {
  title: "Feedback Report",
};

interface FeedbackPageProps {
  params: Promise<{ id: string }>;
}

async function FeedbackContent({
  interviewId,
  clerkUserId,
}: {
  interviewId: string;
  clerkUserId: string;
}) {
  let report = await getFeedbackReport(interviewId, clerkUserId);

  if (!report) {
    const generated = await generateFeedbackForInterview(
      interviewId,
      clerkUserId,
    );
    if (!generated.success) {
      notFound();
    }
    report = await getFeedbackReport(interviewId, clerkUserId);
  }

  if (!report) {
    notFound();
  }

  return <FeedbackReport data={report} />;
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <Suspense fallback={<FeedbackSkeleton />}>
        <FeedbackContent interviewId={id} clerkUserId={userId} />
      </Suspense>
    </div>
  );
}
