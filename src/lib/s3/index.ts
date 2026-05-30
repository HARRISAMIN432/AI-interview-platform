export { getS3Client } from "./client";
export {
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  deleteS3Object,
  downloadS3ObjectAsBuffer,
  getS3ObjectUrl,
} from "./operations";
export {
  generateResumeKey,
  generateAudioKey,
  extractUserIdFromKey,
} from "./keys";
export type {
  PresignedUploadOptions,
  PresignedUploadResult,
  PresignedDownloadOptions,
} from "./operations";
