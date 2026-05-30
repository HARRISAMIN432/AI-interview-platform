// ─── Upload Types ──────────────────────────────────────────────────────────

export interface UploadMetadata {
  fileName: string;
  s3Key: string;
  s3Url: string;
  fileSize: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  s3Url: string;
}

// ─── PDF Parse Types ───────────────────────────────────────────────────────

export type ParseErrorCode =
  | "EMPTY_TEXT"
  | "SCANNED_PDF"
  | "PARSE_FAILED"
  | "INVALID_PDF"
  | "TEXT_TOO_SHORT";

export interface ParseStats {
  pageCount: number;
  charCount: number;
  wordCount: number;
}

export interface ParseSuccessResponse {
  success: true;
  resumeId: string;
  stats: ParseStats;
}

export interface ParseFailureResponse {
  success: false;
  error: {
    code: ParseErrorCode;
    message: string;
  };
}

export type ParseResponse = ParseSuccessResponse | ParseFailureResponse;

// ─── Resume ────────────────────────────────────────────────────────────────

/**
 * Lightweight resume DTO — returned from server actions to client components.
 * Omits heavy fields (parsedText) to keep payloads small.
 */
export interface ResumeListItem {
  id: string;
  fileName: string;
  s3Key: string;
  s3Url: string;
  atsScore: number | null;
  parsedText: string | null;
  createdAt: Date;
  updatedAt: Date;
}
