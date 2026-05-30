import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./client";
import type { Readable } from "stream";

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

// ─── Presigned Upload URL ──────────────────────────────────────────────────
export interface PresignedUploadOptions {
  key: string;
  contentType: string;
  /** TTL in seconds. Default: 300 (5 min) */
  expiresIn?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
}

/**
 * Generates a presigned PUT URL for client-side direct upload to S3.
 * The client uploads directly — no file data passes through the app server.
 */
export async function generatePresignedUploadUrl(
  options: PresignedUploadOptions,
): Promise<PresignedUploadResult> {
  const { key, contentType, expiresIn = 300 } = options;

  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn });

  return { uploadUrl, key };
}

// ─── Presigned Download URL ────────────────────────────────────────────────
export interface PresignedDownloadOptions {
  key: string;
  /** TTL in seconds. Default: 3600 (1 hour) */
  expiresIn?: number;
}

/**
 * Generates a presigned GET URL for secure, time-limited access to a private S3 object.
 */
export async function generatePresignedDownloadUrl(
  options: PresignedDownloadOptions,
): Promise<string> {
  const { key, expiresIn = 3600 } = options;

  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

// ─── Delete Object ─────────────────────────────────────────────────────────

/**
 * Permanently deletes an object from S3.
 * Safe to call on non-existent keys — S3 returns 204 regardless.
 */
export async function deleteS3Object(key: string): Promise<void> {
  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await getS3Client().send(command);
}

// ─── Download as Buffer (for server-side processing) ─────────────────────

/**
 * Downloads an S3 object and returns its content as a Buffer.
 * Used by the PDF parser service for server-side text extraction.
 * Streams the response to avoid loading the entire file into memory at once.
 */
export async function downloadS3ObjectAsBuffer(key: string): Promise<Buffer> {
  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const response = await getS3Client().send(command);

  if (!response.Body) {
    throw new Error(`[S3] No body returned for key: ${key}`);
  }

  // Stream → Buffer (memory-efficient chunk accumulation)
  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => {
      reject(new Error(`[S3] Stream error for key ${key}: ${err.message}`));
    });
  });
}

// ─── Construct public CDN URL (optional, if bucket is public) ────────────

/**
 * Constructs the canonical S3 object URL (for storing in DB as s3Url).
 * If your bucket is private, use presigned URLs for access instead.
 */
export function getS3ObjectUrl(key: string): string {
  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }
  const region = process.env.AWS_REGION!;
  return `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;
}
