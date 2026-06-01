"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import {
  JobDescriptionFormSchema,
  type JobDescriptionFormInput,
} from "@/lib/validators/job-description";
import {
  createJobDescription,
  updateJobDescription,
  deleteJobDescription,
  extractJobDescriptionFromText,
} from "@/lib/actions/job-description";
import type { JobDescriptionListItem } from "@/lib/actions/job-description";

interface JobDescriptionFormProps {
  clerkUserId: string;
  editingJob: JobDescriptionListItem | null;
}

export function JobDescriptionForm({
  clerkUserId,
  editingJob,
}: JobDescriptionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExtracting, startExtract] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobDescriptionFormInput>({
    resolver: zodResolver(JobDescriptionFormSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      requirements: [],
    },
  });

  const rawPaste = watch("description");
  const requirementsText = watch("requirements")?.join("\n") ?? "";

  useEffect(() => {
    if (editingJob) {
      reset({
        title: editingJob.title,
        company: editingJob.company,
        description: editingJob.description,
        requirements: editingJob.requirements,
      });
    } else {
      reset({
        title: "",
        company: "",
        description: "",
        requirements: [],
      });
    }
  }, [editingJob, reset]);

  function handleExtract() {
    if (!rawPaste || rawPaste.length < 80) return;

    startExtract(async () => {
      const result = await extractJobDescriptionFromText(rawPaste);
      if (!result.success) {
        alert(result.error);
        return;
      }
      setValue("title", result.data.title);
      setValue("company", result.data.company);
      setValue("description", result.data.description);
      setValue("requirements", result.data.requirements);
    });
  }

  function onSubmit(values: JobDescriptionFormInput) {
    startTransition(async () => {
      const result = editingJob
        ? await updateJobDescription(editingJob.id, clerkUserId, values)
        : await createJobDescription(clerkUserId, values);

      if (!result.success) {
        alert(result.error);
        return;
      }

      router.push(`/resume/job-descriptions?id=${result.jobDescription.id}`);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!editingJob) return;
    if (!confirm("Delete this job description?")) return;

    startTransition(async () => {
      const result = await deleteJobDescription(editingJob.id, clerkUserId);
      if (!result.success) {
        alert(result.error);
        return;
      }
      router.push("/resume/job-descriptions");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-wider mb-2 block"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
        >
          Paste job description
        </label>
        <textarea
          {...register("description")}
          rows={10}
          placeholder="Paste the full job description here…"
          className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none focus:ring-2"
          style={{
            background: "#0a1520",
            border: "1px solid #1a3048",
            color: "#b0ccd8",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.7,
          }}
        />
        {errors.description && (
          <p className="text-xs mt-1" style={{ color: "#f87171" }}>
            {errors.description.message}
          </p>
        )}
        <button
          type="button"
          onClick={handleExtract}
          disabled={isExtracting || !rawPaste || rawPaste.length < 80}
          className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold disabled:opacity-50"
          style={{
            background: "rgba(0,229,160,0.1)",
            border: "1px solid rgba(0,229,160,0.25)",
            color: "#00e5a0",
            fontFamily: "var(--font-syne)",
          }}
        >
          {isExtracting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Auto-extract details
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ color: "#4a6a7a" }}
          >
            Title
          </label>
          <input
            {...register("title")}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: "#0a1520",
              border: "1px solid #1a3048",
              color: "#dff0ea",
            }}
          />
          {errors.title && (
            <p className="text-xs mt-1" style={{ color: "#f87171" }}>
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ color: "#4a6a7a" }}
          >
            Company
          </label>
          <input
            {...register("company")}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: "#0a1520",
              border: "1px solid #1a3048",
              color: "#dff0ea",
            }}
          />
          {errors.company && (
            <p className="text-xs mt-1" style={{ color: "#f87171" }}>
              {errors.company.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          className="text-xs font-semibold uppercase tracking-wider mb-2 block"
          style={{ color: "#4a6a7a" }}
        >
          Requirements (one per line)
        </label>
        <textarea
          value={requirementsText}
          onChange={(e) => {
            const lines = e.target.value
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            setValue("requirements", lines);
          }}
          rows={5}
          className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none"
          style={{
            background: "#0a1520",
            border: "1px solid #1a3048",
            color: "#b0ccd8",
          }}
        />
      </div>

      {editingJob && editingJob.atsScores.length > 0 && (
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: "#0e1e2d", border: "1px solid #1a3048" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#4a6a7a" }}
          >
            ATS scores for this role
          </p>
          {editingJob.atsScores.map((score) => (
            <div
              key={score.id}
              className="flex items-center justify-between text-sm"
            >
              <span style={{ color: "#7a9aaa" }}>{score.resume.fileName}</span>
              <span
                className="font-bold tabular-nums"
                style={{
                  color:
                    score.overallScore >= 75
                      ? "#00e5a0"
                      : score.overallScore >= 50
                        ? "#f59e0b"
                        : "#f87171",
                }}
              >
                {Math.round(score.overallScore)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
          }}
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {editingJob ? "Save changes" : "Save job description"}
        </button>
        {editingJob ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
            }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        ) : (
          <Link
            href="/resume/job-descriptions"
            className="rounded-xl px-4 py-2.5 text-sm inline-flex items-center"
            style={{ color: "#4a6a7a" }}
          >
            Cancel
          </Link>
        )}
      </div>
      {editingJob && (
        <p className="text-[10px]" style={{ color: "#3d6070" }}>
          Saving runs ATS scoring against all parsed resumes.
        </p>
      )}
    </form>
  );
}
