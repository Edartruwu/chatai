"use client";

import { getPresignedUrl } from "@/server/getPresignedUrl";

export async function uploadFile(file: File): Promise<string | null> {
  const presignedUrl = await getPresignedUrl(file.name);
  if (!presignedUrl) {
    console.error("Failed to get presigned URL for file:", file.name);
    return null;
  }
  try {
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
  } catch (error) {
    console.error("Upload failed for file:", file.name, error);
    return null;
  }
}

export async function uploadMany(files: File[]): Promise<string[]> {
  const uploadPromises: Promise<string | null>[] = files.map((file) =>
    uploadFile(file),
  );
  const uploadResults = await Promise.all(uploadPromises);
  return uploadResults.filter((url): url is string => url !== null);
}
