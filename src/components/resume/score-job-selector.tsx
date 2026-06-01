"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Zap, ChevronDown, Loader2 } from "lucide-react";

interface JobOption {
  id: string;
  title: string;
  company: string;
}

interface ScoreJobSelectorProps {
  resumeId: string;
  jobs: JobOption[];
  /** The jobDescriptionId that currently has a score for this resume, if any */
  scoredJobId?: string | null;
}

export function ScoreJobSelector({
  resumeId,
  jobs,
  scoredJobId,
}: ScoreJobSelectorProps) {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState(scoredJobId ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleScore() {
    if (!selectedJobId) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ats/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId, jobDescriptionId: selectedJobId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error ?? "Scoring failed. Please try again.");
          return;
        }

        // Refresh the page to show the new score
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  if (jobs.length === 0) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-center"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed #1a3048",
        }}
      >
        <p className="text-xs" style={{ color: "#3d6070" }}>
          No job descriptions saved.{" "}
          <a
            href="/resume/job-descriptions"
            className="underline"
            style={{ color: "#00e5a0" }}
          >
            Add one
          </a>{" "}
          to run ATS scoring.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Select */}
      <div className="relative">
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-8 outline-none transition-all"
          style={{
            background: "#0c1a27",
            border: `1px solid ${selectedJobId ? "#1a3048" : "#152636"}`,
            color: selectedJobId ? "#dff0ea" : "#4a6a7a",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          <option value="" disabled>
            Select a job description…
          </option>
          {jobs.map((job) => (
            <option
              key={job.id}
              value={job.id}
              style={{ background: "#0c1a27" }}
            >
              {job.title} · {job.company}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#3d6070" }}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleScore}
        disabled={!selectedJobId || isPending}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: selectedJobId && !isPending ? "#00c98a" : "#0e1e2d",
          color: selectedJobId && !isPending ? "#050d14" : "#3d6070",
          border: selectedJobId && !isPending ? "none" : "1px solid #1a3048",
          fontFamily: "var(--font-syne)",
          boxShadow:
            selectedJobId && !isPending
              ? "0 4px 16px rgba(0,201,138,0.25)"
              : "none",
        }}
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Scoring…
          </>
        ) : (
          <>
            <Zap size={14} strokeWidth={2.5} />
            {scoredJobId === selectedJobId ? "Re-score" : "Run ATS Score"}
          </>
        )}
      </button>

      {error && (
        <p
          className="text-xs px-1"
          style={{ color: "#f87171", fontFamily: "var(--font-dm-sans)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
