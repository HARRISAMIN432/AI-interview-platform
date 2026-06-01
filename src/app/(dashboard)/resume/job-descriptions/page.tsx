import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";

import {
  getJobDescriptionsForUser,
  getJobDescriptionById,
} from "@/lib/actions/job-description";
import { JobDescriptionCard } from "@/components/resume/job-description-card";
import { JobDescriptionForm } from "@/components/resume/job-description-form";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Job Descriptions",
};

interface JobDescriptionsPageProps {
  searchParams: Promise<{ id?: string; new?: string }>;
}

export default async function JobDescriptionsPage({
  searchParams,
}: JobDescriptionsPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const jobs = await getJobDescriptionsForUser(userId);
  const selectedId = params.id;
  const isNew = params.new === "true";

  const editingJob =
    selectedId && !isNew
      ? await getJobDescriptionById(selectedId, userId)
      : null;

  const showForm = isNew || Boolean(editingJob);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
          >
            Job Board
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#4a6a7a" }}>
            Save roles, extract requirements, and score resumes automatically.
          </p>
        </div>
        <Link
          href="/resume/job-descriptions?new=true"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Job
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <div
          className="rounded-2xl p-4 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto"
          style={{ background: "#0c1a27", border: "1px solid #152636" }}
        >
          {jobs.length === 0 ? (
            <EmptyState
              heading="No job descriptions"
              body="Add a role to run ATS scoring and mock interviews."
              ctaLabel="Add your first job"
              ctaHref="/resume/job-descriptions?new=true"
            />
          ) : (
            jobs.map((job) => (
              <JobDescriptionCard
                key={job.id}
                job={job}
                isSelected={job.id === selectedId}
              />
            ))
          )}
        </div>

        <div
          className="relative rounded-2xl p-6 lg:p-8"
          style={{
            background: "#0c1a27",
            border: "1px solid #152636",
            minHeight: 400,
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
          {showForm ? (
            <>
              <h2
                className="text-lg font-bold mb-5"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                {editingJob ? "Edit job description" : "New job description"}
              </h2>
              <JobDescriptionForm
                clerkUserId={userId}
                editingJob={editingJob}
              />
            </>
          ) : (
            <EmptyState
              heading="Select or create a job"
              body="Choose a saved job from the list or add a new one to extract details and score your resumes."
              ctaLabel="Add job description"
              ctaHref="/resume/job-descriptions?new=true"
            />
          )}
        </div>
      </div>
    </div>
  );
}
