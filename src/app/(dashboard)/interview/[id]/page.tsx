import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { getInterviewForSession } from "@/lib/actions/interview";
import { InterviewConductor } from "@/components/interview/interview-conductor";

export const metadata: Metadata = {
  title: "Interview Session",
};

interface InterviewSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewSessionPage({
  params,
}: InterviewSessionPageProps) {
  const { id } = await params; // Await the params Promise
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const interview = await getInterviewForSession(id, userId);

  if (!interview) {
    notFound();
  }

  if (interview.status === "COMPLETED") {
    redirect(`/interview/${id}/summary`);
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
            >
              {interview.jobDescription?.title ?? "Interview Session"}
            </h1>
            {interview.jobDescription?.company && (
              <p
                className="text-sm mt-0.5"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
              >
                {interview.jobDescription.company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Session card */}
      <div
        className="relative rounded-2xl p-6 lg:p-8"
        style={{
          background: "#0c1a27",
          border: "1px solid #152636",
          minHeight: 500,
        }}
      >
        {/* Top emerald accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
            opacity: 0.45,
          }}
        />

        <InterviewConductor interview={interview} clerkUserId={userId} />
      </div>
    </div>
  );
}
