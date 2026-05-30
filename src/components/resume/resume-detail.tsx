import {
  FileText,
  Download,
  Clock,
  FileSearch,
  ChevronRight,
} from "lucide-react";
import { ATSScoreDisplay } from "./ats-score-display";
import { ScoreJobSelector } from "./score-job-selector";
import { DeleteResumeButton } from "./delete-resume-button";
import { generatePresignedDownloadUrl } from "@/lib/s3/operations";
import type { ResumeDetail as ResumeDetailType } from "@/lib/actions/resume-page";

interface ResumeDetailProps {
  resume: ResumeDetailType;
  jobs: Array<{ id: string; title: string; company: string }>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatFileSize(text: string | null): string {
  if (!text) return "—";
  const bytes = new TextEncoder().encode(text).length;
  return bytes < 1024 * 1024
    ? `~${(bytes / 1024).toFixed(0)} KB`
    : `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function ResumeDetail({ resume, jobs }: ResumeDetailProps) {
  // Generate a short-lived presigned download URL
  let downloadUrl: string | null = null;
  try {
    downloadUrl = await generatePresignedDownloadUrl({
      key: resume.s3Key,
      expiresIn: 3600,
    });
  } catch {
    // Non-fatal — download button will be hidden
  }

  const latestScore = resume.atsScores[0] ?? null;
  const scoredJobId = latestScore?.jobDescriptionId ?? null;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="px-6 py-5 shrink-0"
        style={{ borderBottom: "1px solid #152636" }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
            opacity: 0.5,
          }}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="shrink-0 flex items-center justify-center rounded-xl mt-0.5"
              style={{
                width: 40,
                height: 40,
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.15)",
              }}
            >
              <FileText size={17} color="#00e5a0" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h2
                className="text-base font-bold leading-snug truncate"
                style={{
                  color: "#dff0ea",
                  fontFamily: "var(--font-syne)",
                  maxWidth: 280,
                }}
              >
                {resume.fileName}
              </h2>
              <div
                className="flex items-center gap-1.5 mt-1"
                style={{ color: "#3d6070" }}
              >
                <Clock size={11} strokeWidth={1.8} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {formatDate(resume.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all hover:bg-[rgba(255,255,255,0.06)]"
                style={{
                  color: "#4a6a7a",
                  border: "1px solid #152636",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <Download size={12} strokeWidth={1.8} />
                Download
              </a>
            )}
            <DeleteResumeButton
              resumeId={resume.id}
              fileName={resume.fileName}
            />
          </div>
        </div>

        {/* Parse status pill */}
        <div className="flex items-center gap-2 mt-3">
          {resume.parsedText ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
              style={{
                background: "rgba(0,229,160,0.07)",
                border: "1px solid rgba(0,229,160,0.15)",
                color: "#00e5a0",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#00e5a0",
                  boxShadow: "0 0 4px rgba(0,229,160,0.6)",
                  display: "inline-block",
                }}
              />
              Text extracted · {formatFileSize(resume.parsedText)}
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
              style={{
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.15)",
                color: "#f59e0b",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "inline-block",
                }}
              />
              Not yet parsed
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* ATS Score section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
            >
              ATS Analysis
            </h3>
            {resume.atsScores.length > 1 && (
              <span
                className="text-xs"
                style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
              >
                {resume.atsScores.length} scores
              </span>
            )}
          </div>

          {latestScore ? (
            <ATSScoreDisplay atsScore={latestScore} />
          ) : (
            <div
              className="rounded-xl px-4 py-5 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed #1a3048",
              }}
            >
              <FileSearch
                size={24}
                className="mx-auto mb-2"
                style={{ color: "#2a4050" }}
                strokeWidth={1.5}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
              >
                No ATS score yet
              </p>
              <p
                className="text-xs"
                style={{ color: "#2a4050", fontFamily: "var(--font-dm-sans)" }}
              >
                Select a job description below to run scoring.
              </p>
            </div>
          )}
        </section>

        {/* Score against job */}
        {resume.parsedText && (
          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
            >
              Score Against Job
            </h3>
            <ScoreJobSelector
              resumeId={resume.id}
              jobs={jobs}
              scoredJobId={scoredJobId}
            />
          </section>
        )}

        {/* All scores history */}
        {resume.atsScores.length > 1 && (
          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
            >
              Score History
            </h3>
            <div className="space-y-1.5">
              {resume.atsScores.map((score) => {
                const s = Math.round(score.overallScore);
                const color =
                  s >= 75 ? "#00e5a0" : s >= 50 ? "#f59e0b" : "#f87171";
                return (
                  <div
                    key={score.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid #152636",
                    }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{
                          color: "#7a9aaa",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        {score.jobDescription?.title ?? "Unknown role"}
                      </p>
                      {score.jobDescription?.company && (
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "#3d6070" }}
                        >
                          {score.jobDescription.company}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-sm font-bold tabular-nums shrink-0 ml-3"
                      style={{ color, fontFamily: "var(--font-syne)" }}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
