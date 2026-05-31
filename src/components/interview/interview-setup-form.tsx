"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Zap,
  Brain,
  Users,
  Layers,
  Check,
} from "lucide-react";
import {
  CreateInterviewSchema,
  type CreateInterviewInput,
} from "@/lib/validators/interview";
import { cn } from "@/lib/utils";
import z from "zod";

const FOCUS_AREAS = [
  "System Design",
  "Data Structures",
  "Leadership",
  "Problem Solving",
  "Communication",
  "Conflict Resolution",
  "Technical Architecture",
  "Product Thinking",
  "Agile / Scrum",
  "Performance Optimization",
  "Security",
  "Testing",
];

// ─── Props ─────────────────────────────────────────────────────────────────

interface ResumeOption {
  id: string;
  fileName: string;
  atsScore?: number | null;
}

interface JobOption {
  id: string;
  title: string;
  company: string;
}

interface InterviewSetupFormProps {
  resumes: ResumeOption[];
  jobs: JobOption[];
}

// ─── Step indicator ────────────────────────────────────────────────────────

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = step < current;
  const active = step === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: 32,
          height: 32,
          background: done
            ? "#00c98a"
            : active
              ? "rgba(0,229,160,0.15)"
              : "rgba(255,255,255,0.04)",
          border: `2px solid ${done ? "#00c98a" : active ? "#00e5a0" : "#1a3048"}`,
          boxShadow: active ? "0 0 12px rgba(0,229,160,0.35)" : "none",
        }}
      >
        {done ? (
          <Check size={14} color="#050d14" strokeWidth={2.5} />
        ) : (
          <span
            className="text-xs font-bold"
            style={{
              color: active ? "#00e5a0" : "#3d6070",
              fontFamily: "var(--font-syne)",
            }}
          >
            {step}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Card selector ─────────────────────────────────────────────────────────

function SelectCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-3.5 transition-all duration-150"
      style={{
        background: selected
          ? "rgba(0,229,160,0.07)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${selected ? "rgba(0,229,160,0.3)" : "#1a3048"}`,
        boxShadow: selected ? "0 0 0 1px rgba(0,229,160,0.1)" : "none",
      }}
    >
      {children}
    </button>
  );
}

// ─── Main form ─────────────────────────────────────────────────────────────

export function InterviewSetupForm({ resumes, jobs }: InterviewSetupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof CreateInterviewSchema>>({
    resolver: zodResolver(CreateInterviewSchema),
    defaultValues: {
      resumeId: "",
      jobDescriptionId: "",
      interviewType: "MIXED",
      difficulty: "MID",
      questionCount: 10,
      focusAreas: [],
    },
  });

  const watchedValues = watch();

  // ── Step 1 validation ────────────────────────────────────────────────
  function canProceedStep1() {
    return !!watchedValues.resumeId && !!watchedValues.jobDescriptionId;
  }

  // ── Submit ───────────────────────────────────────────────────────────
  const onSubmit = handleSubmit((data) => {
    setApiError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/interview/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          setApiError(
            result.error ?? "Failed to create interview. Please try again.",
          );
          return;
        }

        router.push(`/interview/${result.interviewId}`);
      } catch {
        setApiError("Network error. Please try again.");
      }
    });
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <StepIndicator step={1} current={step} />
        <div
          className="flex-1 h-px transition-all duration-500"
          style={{
            background:
              step > 1
                ? "linear-gradient(90deg, #00c98a, rgba(0,201,138,0.3))"
                : "#1a3048",
          }}
        />
        <StepIndicator step={2} current={step} />
      </div>

      <form onSubmit={onSubmit}>
        {/* ── STEP 1: Select resume + job ──────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                Select your context
              </h2>
              <p className="text-sm" style={{ color: "#4a6a7a" }}>
                Choose the resume and job description for this interview.
              </p>
            </div>

            {/* Resume selection */}
            <div>
              <label
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                <FileText size={12} />
                Resume
              </label>
              {resumes.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed #1a3048",
                  }}
                >
                  <p className="text-sm" style={{ color: "#4a6a7a" }}>
                    No resumes uploaded.{" "}
                    <a
                      href="/resume"
                      className="underline"
                      style={{ color: "#00e5a0" }}
                    >
                      Upload one first
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <Controller
                  name="resumeId"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {resumes.map((resume) => (
                        <SelectCard
                          key={resume.id}
                          selected={field.value === resume.id}
                          onClick={() => field.onChange(resume.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center rounded-lg shrink-0"
                              style={{
                                width: 34,
                                height: 34,
                                background:
                                  field.value === resume.id
                                    ? "rgba(0,229,160,0.1)"
                                    : "rgba(255,255,255,0.04)",
                                border: `1px solid ${field.value === resume.id ? "rgba(0,229,160,0.2)" : "#1a3048"}`,
                              }}
                            >
                              <FileText
                                size={14}
                                color={
                                  field.value === resume.id
                                    ? "#00e5a0"
                                    : "#3d6070"
                                }
                                strokeWidth={1.8}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-medium truncate"
                                style={{
                                  color:
                                    field.value === resume.id
                                      ? "#dff0ea"
                                      : "#7a9aaa",
                                  fontFamily: "var(--font-dm-sans)",
                                }}
                              >
                                {resume.fileName}
                              </p>
                            </div>
                            {resume.atsScore != null && (
                              <span
                                className="text-xs font-bold shrink-0"
                                style={{
                                  color:
                                    resume.atsScore >= 75
                                      ? "#00e5a0"
                                      : resume.atsScore >= 50
                                        ? "#f59e0b"
                                        : "#f87171",
                                  fontFamily: "var(--font-syne)",
                                }}
                              >
                                {Math.round(resume.atsScore)}
                              </span>
                            )}
                          </div>
                        </SelectCard>
                      ))}
                    </div>
                  )}
                />
              )}
              {errors.resumeId && (
                <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
                  {errors.resumeId.message}
                </p>
              )}
            </div>

            {/* Job description selection */}
            <div>
              <label
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                <Briefcase size={12} />
                Job Description
              </label>
              {jobs.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed #1a3048",
                  }}
                >
                  <p className="text-sm" style={{ color: "#4a6a7a" }}>
                    No job descriptions saved.{" "}
                    <a
                      href="/job-descriptions"
                      className="underline"
                      style={{ color: "#00e5a0" }}
                    >
                      Add one first
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <Controller
                  name="jobDescriptionId"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {jobs.map((job) => (
                        <SelectCard
                          key={job.id}
                          selected={field.value === job.id}
                          onClick={() => field.onChange(job.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center rounded-lg shrink-0"
                              style={{
                                width: 34,
                                height: 34,
                                background:
                                  field.value === job.id
                                    ? "rgba(0,229,160,0.1)"
                                    : "rgba(255,255,255,0.04)",
                                border: `1px solid ${field.value === job.id ? "rgba(0,229,160,0.2)" : "#1a3048"}`,
                              }}
                            >
                              <Briefcase
                                size={14}
                                color={
                                  field.value === job.id ? "#00e5a0" : "#3d6070"
                                }
                                strokeWidth={1.8}
                              />
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color:
                                    field.value === job.id
                                      ? "#dff0ea"
                                      : "#7a9aaa",
                                  fontFamily: "var(--font-dm-sans)",
                                }}
                              >
                                {job.title}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#3d6070" }}
                              >
                                {job.company}
                              </p>
                            </div>
                          </div>
                        </SelectCard>
                      ))}
                    </div>
                  )}
                />
              )}
              {errors.jobDescriptionId && (
                <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
                  {errors.jobDescriptionId.message}
                </p>
              )}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1()}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canProceedStep1() ? "#00c98a" : "#0e1e2d",
                color: canProceedStep1() ? "#050d14" : "#3d6070",
                border: canProceedStep1() ? "none" : "1px solid #1a3048",
                fontFamily: "var(--font-syne)",
                boxShadow: canProceedStep1()
                  ? "0 4px 20px rgba(0,201,138,0.25)"
                  : "none",
              }}
            >
              Continue
              <ChevronRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Configure interview ──────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                Configure your interview
              </h2>
              <p className="text-sm" style={{ color: "#4a6a7a" }}>
                Tailor the interview format to your preparation goals.
              </p>
            </div>

            {/* Interview Type */}
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-3 block"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Interview Type
              </label>
              <Controller
                name="interviewType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        {
                          value: "TECHNICAL",
                          label: "Technical",
                          icon: Brain,
                          desc: "Skills & knowledge",
                        },
                        {
                          value: "BEHAVIORAL",
                          label: "Behavioral",
                          icon: Users,
                          desc: "Experience & soft skills",
                        },
                        {
                          value: "MIXED",
                          label: "Mixed",
                          icon: Layers,
                          desc: "Best of both",
                        },
                      ] as const
                    ).map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className="flex flex-col items-center gap-2 rounded-xl py-4 px-3 transition-all duration-150"
                        style={{
                          background:
                            field.value === value
                              ? "rgba(0,229,160,0.07)"
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${field.value === value ? "rgba(0,229,160,0.3)" : "#1a3048"}`,
                        }}
                      >
                        <Icon
                          size={18}
                          color={field.value === value ? "#00e5a0" : "#3d6070"}
                          strokeWidth={1.8}
                        />
                        <p
                          className="text-xs font-semibold"
                          style={{
                            color:
                              field.value === value ? "#dff0ea" : "#7a9aaa",
                            fontFamily: "var(--font-syne)",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-[10px] text-center leading-tight"
                          style={{ color: "#3d6070" }}
                        >
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-3 block"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Difficulty Level
              </label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { value: "JUNIOR", label: "Junior", years: "0–2 yrs" },
                        { value: "MID", label: "Mid-level", years: "3–5 yrs" },
                        { value: "SENIOR", label: "Senior", years: "6+ yrs" },
                      ] as const
                    ).map(({ value, label, years }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className="flex flex-col items-center gap-1.5 rounded-xl py-3.5 transition-all duration-150"
                        style={{
                          background:
                            field.value === value
                              ? "rgba(0,229,160,0.07)"
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${field.value === value ? "rgba(0,229,160,0.3)" : "#1a3048"}`,
                        }}
                      >
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              field.value === value ? "#dff0ea" : "#7a9aaa",
                            fontFamily: "var(--font-syne)",
                          }}
                        >
                          {label}
                        </p>
                        <p className="text-[10px]" style={{ color: "#3d6070" }}>
                          {years}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Question Count */}
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-3 block"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Number of Questions
              </label>
              <Controller
                name="questionCount"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {([5, 10, 15] as const).map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => field.onChange(count)}
                        className="flex flex-col items-center gap-1 rounded-xl py-3.5 transition-all duration-150"
                        style={{
                          background:
                            field.value === count
                              ? "rgba(0,229,160,0.07)"
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${field.value === count ? "rgba(0,229,160,0.3)" : "#1a3048"}`,
                        }}
                      >
                        <p
                          className="text-xl font-bold"
                          style={{
                            color:
                              field.value === count ? "#00e5a0" : "#4a6a7a",
                            fontFamily: "var(--font-syne)",
                          }}
                        >
                          {count}
                        </p>
                        <p className="text-[10px]" style={{ color: "#3d6070" }}>
                          {count === 5
                            ? "~20 min"
                            : count === 10
                              ? "~40 min"
                              : "~60 min"}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Focus Areas */}
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-3 block"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
              >
                Focus Areas{" "}
                <span
                  style={{
                    color: "#2a4050",
                    fontWeight: 400,
                    textTransform: "none",
                  }}
                >
                  (optional)
                </span>
              </label>
              <Controller
                name="focusAreas"
                control={control}
                render={({ field }) => {
                  const value = field.value ?? [];

                  return (
                    <div className="flex flex-wrap gap-2">
                      {FOCUS_AREAS.map((area) => {
                        const selected = value.includes(area);

                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                field.onChange(value.filter((a) => a !== area));
                              } else if (value.length < 6) {
                                field.onChange([...value, area]);
                              }
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs transition-all duration-150"
                            style={{
                              background: selected
                                ? "rgba(0,229,160,0.1)"
                                : "rgba(255,255,255,0.03)",
                              border: `1px solid ${
                                selected ? "rgba(0,229,160,0.3)" : "#1a3048"
                              }`,
                              color: selected ? "#00e5a0" : "#4a6a7a",
                              fontFamily: "var(--font-dm-sans)",
                            }}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  );
                }}
              />
            </div>

            {/* Error */}
            {apiError && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color: "#f87171",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {apiError}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.04)]"
                style={{
                  border: "1px solid #1a3048",
                  color: "#5a8090",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97] disabled:opacity-60"
                style={{
                  background: "#00c98a",
                  color: "#050d14",
                  fontFamily: "var(--font-syne)",
                  boxShadow: "0 4px 20px rgba(0,201,138,0.3)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating Questions…
                  </>
                ) : (
                  <>
                    <Zap size={14} strokeWidth={2.5} />
                    Start Interview
                  </>
                )}
              </button>
            </div>

            {isPending && (
              <p
                className="text-xs text-center"
                style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
              >
                AI is generating your tailored questions — this takes 5–15
                seconds.
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
