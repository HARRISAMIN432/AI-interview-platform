import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./client";
import type { Readable } from "stream";

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

export interface PresignedUploadOptions {
  key: string;
  contentType: string;
  expiresIn?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
}

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

export interface PresignedDownloadOptions {
  key: string;
  expiresIn?: number;
}

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

export function getS3ObjectUrl(key: string): string {
  if (!BUCKET) {
    throw new Error("[S3] AWS_S3_BUCKET_NAME is not set.");
  }
  const region = process.env.AWS_REGION!;
  return `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;
}
