import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { InterviewSetupForm } from "@/components/interview/interview-setup-form";

export const metadata: Metadata = {
  title: "New Interview",
};

async function getSetupData(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return { resumes: [], jobs: [] };

  const [resumes, jobs] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: user.id, parsedText: { not: null } },
      select: { id: true, fileName: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.jobDescription.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, company: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { resumes, jobs };
}

export default async function NewInterviewPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { resumes, jobs } = await getSetupData(userId);

  return (
    <div className="animate-fade-in-up max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          New Interview
        </h1>
        <p
          className="text-sm"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
        >
          Configure your AI mock interview and we'll generate tailored questions
          from your resume and the job description.
        </p>
      </div>

      {/* Form card */}
      <div
        className="relative rounded-2xl p-7"
        style={{
          background: "#0c1a27",
          border: "1px solid #152636",
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
        <InterviewSetupForm resumes={resumes} jobs={jobs} />
      </div>
    </div>
  );
}
