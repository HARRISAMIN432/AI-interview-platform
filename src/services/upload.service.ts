import {
  generatePresignedUploadUrl,
  generateResumeKey,
  getS3ObjectUrl,
} from "@/lib/s3";
import type { PresignedUploadResult } from "@/lib/s3";
import { PresignedUrlRequest } from "@/lib/validators/upload";

export interface PrepareUploadResult extends PresignedUploadResult {
  s3Url: string;
}

export async function prepareResumeUpload(
  clerkUserId: string,
  input: PresignedUrlRequest,
): Promise<PrepareUploadResult> {
  const key = generateResumeKey(clerkUserId, input.fileName);

  const { uploadUrl } = await generatePresignedUploadUrl({
    key,
    contentType: input.fileType,
    expiresIn: 300,
  });

  const s3Url = getS3ObjectUrl(key);

  return { uploadUrl, key, s3Url };
}
