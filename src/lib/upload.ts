"use client";

import { getPresignedUrl } from "@/server/getPresignedUrl";

async function getPresignedUrls(files: File[]): Promise<string[]> {
  const presignedUrlPromises = files.map((file) => getPresignedUrl(file.name));
  const presignedUrls = await Promise.all(presignedUrlPromises);
  if (presignedUrls.includes(null)) {
    throw new Error("Failed to get presigned URLs for some files.");
  }
  return presignedUrls as string[];
}

export async function uploadFile(
  file: File,
  presignedUrl: string,
): Promise<string> {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${file.name}`);
  }
  return presignedUrl;
}

export async function uploadMany(
  files: File[],
  batchSize: number = 5,
): Promise<string[]> {
  const presignedUrls = await getPresignedUrls(files);
  const batchedFiles: string[] = [];
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files
      .slice(i, i + batchSize)
      .map((file, index) => uploadFile(file, presignedUrls[i + index]));

    batchedFiles.push(...(await Promise.all(batch)));
  }
  return batchedFiles;
}
