import { S3_BASE_URL } from "@/components/chat/response";

export function convertS3UrlToBaseUrl(s3Url: string | undefined): string {
  if (!s3Url) {
    throw new Error("S3 URL is required");
  }
  if (!s3Url.startsWith("s3://")) {
    throw new Error("Invalid S3 URL");
  }
  const path = s3Url.slice(14);
  const newUrl = `${S3_BASE_URL}${path}`;
  return newUrl;
}
