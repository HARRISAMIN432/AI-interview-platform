import { S3Client } from "@aws-sdk/client-s3";

let _s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (_s3Client) return _s3Client;

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "[S3Client] Missing required AWS credentials. " +
        "Ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.",
    );
  }

  _s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _s3Client;
}
