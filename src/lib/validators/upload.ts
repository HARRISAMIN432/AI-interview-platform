import { z } from "zod";

// ─── Constants ─────────────────────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = ["application/pdf"] as const;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILE_SIZE_LABEL = "10MB";

// ─── Presigned URL Request Schema ──────────────────────────────────────────
export const PresignedUrlRequestSchema = z.object({
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long")
    .refine(
      (name) => name.toLowerCase().endsWith(".pdf"),
      "Only PDF files are accepted",
    ),
  fileType: z
    .string()
    .refine(
      (type): type is (typeof ALLOWED_MIME_TYPES)[number] =>
        (ALLOWED_MIME_TYPES as readonly string[]).includes(type),
      `File type must be one of: ${ALLOWED_MIME_TYPES.join(", ")}`,
    ),
  fileSize: z
    .number()
    .int("File size must be an integer")
    .positive("File size must be positive")
    .max(
      MAX_FILE_SIZE_BYTES,
      `File size must not exceed ${MAX_FILE_SIZE_LABEL}`,
    ),
});

export type PresignedUrlRequest = z.infer<typeof PresignedUrlRequestSchema>;

// ─── Save Resume Metadata Schema ──────────────────────────────────────────
export const SaveResumeMetadataSchema = z.object({
  fileName: z.string().min(1).max(255),
  s3Key: z.string().min(1),
  s3Url: z.string().url(),
  fileSize: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
});

export type SaveResumeMetadata = z.infer<typeof SaveResumeMetadataSchema>;

// ─── Parse Resume Schema - Changed from .cuid() to .uuid() ─────────────────
export const ParseResumeSchema = z.object({
  resumeId: z.string().uuid("Invalid resume ID - expected UUID format"),
});

export type ParseResumeInput = z.infer<typeof ParseResumeSchema>;
