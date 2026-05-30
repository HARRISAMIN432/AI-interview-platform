"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from "@/lib/validators/upload";

// ─── Types ─────────────────────────────────────────────────────────────────

type UploadStage =
  | "idle"
  | "selected"
  | "uploading"
  | "parsing"
  | "done"
  | "error";

interface UploadState {
  stage: UploadStage;
  file: File | null;
  progress: number; // 0–100
  errorMessage: string | null;
  resumeId: string | null;
}

interface UploadDropzoneProps {
  /** Called after the full pipeline (upload + parse) completes successfully. */
  onSuccess?: (resumeId: string) => void;
  /** Optional class override for the outer container. */
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function UploadDropzone({ onSuccess, className }: UploadDropzoneProps) {
  const [state, setState] = useState<UploadState>({
    stage: "idle",
    file: null,
    progress: 0,
    errorMessage: null,
    resumeId: null,
  });

  const reset = () =>
    setState({
      stage: "idle",
      file: null,
      progress: 0,
      errorMessage: null,
      resumeId: null,
    });

  // ── Core upload pipeline ─────────────────────────────────────────────────
  const runUploadPipeline = useCallback(
    async (file: File) => {
      setState((s) => ({ ...s, stage: "uploading", progress: 0, file }));

      try {
        // Step 1: Get presigned URL
        const presignRes = await fetch("/api/upload/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!presignRes.ok) {
          const err = await presignRes.json().catch(() => ({}));
          throw new Error(
            err.error ?? `Failed to get upload URL (${presignRes.status})`,
          );
        }

        const { uploadUrl, key, s3Url } = await presignRes.json();

        // Step 2: Upload directly to S3 using XHR for real progress tracking
        await uploadToS3WithProgress(file, uploadUrl, (progress) => {
          setState((s) => ({ ...s, progress }));
        });

        // Step 3: Confirm upload — persist metadata to DB
        setState((s) => ({ ...s, stage: "parsing", progress: 100 }));

        const confirmRes = await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            s3Key: key,
            s3Url,
            fileSize: file.size,
          }),
        });

        if (!confirmRes.ok) {
          const err = await confirmRes.json().catch(() => ({}));
          throw new Error(err.error ?? "Failed to save resume metadata");
        }

        const { resume } = await confirmRes.json();

        // Step 4: Trigger PDF parsing (fire-and-wait)
        const parseRes = await fetch("/api/parse/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId: resume.id }),
        });

        // Parsing failure is non-fatal for the upload flow —
        // the resume exists in DB, and parsing can be retried separately
        if (!parseRes.ok) {
          console.warn(
            "[UploadDropzone] PDF parsing failed — resume saved but text not extracted",
          );
        }

        setState((s) => ({ ...s, stage: "done", resumeId: resume.id }));
        onSuccess?.(resume.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setState((s) => ({
          ...s,
          stage: "error",
          errorMessage: message,
        }));
      }
    },
    [onSuccess],
  );

  // ── Dropzone config ──────────────────────────────────────────────────────
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxSize: MAX_FILE_SIZE_BYTES,
      maxFiles: 1,
      disabled: state.stage !== "idle" && state.stage !== "error",
      onDropAccepted: ([file]) => {
        setState((s) => ({
          ...s,
          stage: "selected",
          file,
          errorMessage: null,
        }));
        runUploadPipeline(file);
      },
      onDropRejected: ([rejection]) => {
        const code = rejection.errors[0]?.code;
        const message =
          code === "file-too-large"
            ? `File exceeds the ${MAX_FILE_SIZE_LABEL} limit`
            : code === "file-invalid-type"
              ? "Only PDF files are accepted"
              : "File rejected — please try again";
        setState((s) => ({
          ...s,
          stage: "error",
          errorMessage: message,
        }));
      },
    });

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full", className)}>
      {/* Drop zone */}
      {(state.stage === "idle" || state.stage === "error") && (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-200 cursor-pointer",
            isDragActive && !isDragReject
              ? "border-[#00e5a0] bg-[rgba(0,229,160,0.04)]"
              : isDragReject
                ? "border-red-500 bg-[rgba(239,68,68,0.04)]"
                : "border-[#1a3048] hover:border-[rgba(0,229,160,0.4)] hover:bg-[rgba(0,229,160,0.02)]",
          )}
          style={{ backgroundColor: isDragActive ? undefined : "#0c1a27" }}
        >
          <input {...getInputProps()} />

          {/* Icon */}
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 56,
              height: 56,
              background: isDragActive
                ? "rgba(0,229,160,0.12)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${isDragActive ? "rgba(0,229,160,0.3)" : "#1a3048"}`,
              transition: "all 0.2s",
            }}
          >
            <Upload
              size={22}
              color={isDragActive ? "#00e5a0" : "#3d6070"}
              strokeWidth={1.8}
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "#dff0ea", fontFamily: "var(--font-dm-sans)" }}
            >
              {isDragActive
                ? "Drop your resume here"
                : "Drag & drop your resume"}
            </p>
            <p className="text-xs" style={{ color: "#4a6a7a" }}>
              or{" "}
              <span style={{ color: "#00e5a0" }} className="font-medium">
                browse files
              </span>{" "}
              · PDF only · max {MAX_FILE_SIZE_LABEL}
            </p>
          </div>

          {/* Error message */}
          {state.stage === "error" && state.errorMessage && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={14} color="#f87171" strokeWidth={2} />
              <span className="text-xs" style={{ color: "#f87171" }}>
                {state.errorMessage}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Uploading / parsing state */}
      {(state.stage === "uploading" ||
        state.stage === "parsing" ||
        state.stage === "selected") &&
        state.file && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#0c1a27",
              border: "1px solid #1a3048",
            }}
          >
            {/* File info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(0,229,160,0.08)",
                  border: "1px solid rgba(0,229,160,0.15)",
                }}
              >
                <FileText size={18} color="#00e5a0" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#dff0ea" }}
                >
                  {state.file.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#4a6a7a" }}>
                  {formatBytes(state.file.size)}
                </p>
              </div>
              <Loader2
                size={16}
                color="#00e5a0"
                strokeWidth={2}
                className="animate-spin shrink-0"
              />
            </div>

            {/* Progress bar */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 4, background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${state.stage === "parsing" ? 100 : state.progress}%`,
                  background: "linear-gradient(90deg, #00c98a, #00e5a0)",
                  boxShadow: "0 0 8px rgba(0,229,160,0.4)",
                }}
              />
            </div>

            {/* Status label */}
            <p className="text-xs mt-2.5" style={{ color: "#4a6a7a" }}>
              {state.stage === "parsing"
                ? "Extracting text from PDF…"
                : `Uploading… ${state.progress}%`}
            </p>
          </div>
        )}

      {/* Success state */}
      {state.stage === "done" && state.file && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#0c1a27",
            border: "1px solid rgba(0,229,160,0.2)",
            boxShadow: "0 0 24px rgba(0,229,160,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 40,
                height: 40,
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.2)",
              }}
            >
              <CheckCircle2 size={18} color="#00e5a0" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#dff0ea" }}
              >
                {state.file.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#00e5a0" }}>
                Uploaded and processed successfully
              </p>
            </div>
            <button
              onClick={reset}
              className="flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{ width: 28, height: 28, color: "#3d6070" }}
              aria-label="Upload another file"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── XHR upload with real progress ────────────────────────────────────────

function uploadToS3WithProgress(
  file: File,
  presignedUrl: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(Math.min(percent, 99)); // Cap at 99 until confirmed
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(
          new Error(
            `S3 upload failed with status ${xhr.status}: ${xhr.responseText}`,
          ),
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(
        new Error("Network error during upload — please check your connection"),
      );
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
