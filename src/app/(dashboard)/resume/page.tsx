import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import {
  getResumesForUser,
  getResumeDetail,
  getJobDescriptionsForUser,
} from "@/lib/actions/resume-page";
import { UploadDropzone } from "@/components/resume/upload-dropzone";
import { ResumeCard } from "@/components/resume/resume-card";
import { ResumeDetail } from "@/components/resume/resume-detail";
import { EmptyResumes } from "@/components/resume/empty-resumes";
import { ResumeCardSkeleton, Skeleton } from "@/components/shared/skeleton";

export const metadata: Metadata = {
  title: "Resumes",
};

// ─── Page props ───────────────────────────────────────────────────────────

interface ResumePageProps {
  searchParams: { id?: string };
}

// ─── Left panel skeleton ──────────────────────────────────────────────────

function LeftPanelSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="space-y-2 mt-4">
        {[...Array(4)].map((_, i) => (
          <ResumeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Right panel skeleton ─────────────────────────────────────────────────

function RightPanelSkeleton() {
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-[88px] w-[88px] rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-7 inline-block rounded-lg mr-2"
            style={{ width: `${60 + (i % 3) * 24}px` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const selectedId = params.id ?? null;

  // Parallel fetch — resumes list + jobs for the selector
  const [resumes, jobs] = await Promise.all([
    getResumesForUser(userId),
    getJobDescriptionsForUser(userId),
  ]);

  // Fetch detail only if a resume is selected
  const selectedResume = selectedId
    ? await getResumeDetail(selectedId, userId)
    : null;

  // If ?id= doesn't match any resume, fall through gracefully (selectedResume = null)

  return (
    <div className="animate-fade-in-up">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="mb-7">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          Resumes
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
        >
          Upload your resume, run ATS scoring, and identify gaps before you
          apply.
        </p>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="flex gap-6 items-start">
        {/* ── LEFT: Upload + list ──────────────────────────────────── */}
        <div className="w-[340px] shrink-0 space-y-4">
          {/* Upload card */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "#0c1a27",
              border: "1px solid #152636",
            }}
          >
            {/* Top emerald accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
                opacity: 0.45,
              }}
            />
            <div className="p-4">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Upload Resume
              </p>
              <Suspense
                fallback={<Skeleton className="h-36 w-full rounded-xl" />}
              >
                <UploadDropzone />
              </Suspense>
            </div>
          </div>

          {/* Resume list */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Your Resumes
              </p>
              {resumes.length > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#3d6070",
                    border: "1px solid #152636",
                  }}
                >
                  {resumes.length}
                </span>
              )}
            </div>

            <Suspense fallback={<LeftPanelSkeleton />}>
              {resumes.length === 0 ? (
                <EmptyResumes variant="no-resumes" />
              ) : (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      isSelected={resume.id === selectedId}
                    />
                  ))}
                </div>
              )}
            </Suspense>
          </div>
        </div>

        {/* ── RIGHT: Detail panel ──────────────────────────────────── */}
        <div
          className="relative flex-1 min-w-0 rounded-2xl overflow-hidden"
          style={{
            background: "#0c1a27",
            border: "1px solid #152636",
            minHeight: 560,
          }}
        >
          <Suspense fallback={<RightPanelSkeleton />}>
            {selectedResume ? (
              <ResumeDetail resume={selectedResume} jobs={jobs} />
            ) : (
              <EmptyResumes variant="no-selection" />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
