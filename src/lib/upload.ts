"use client";

import { getPresignedUrl } from "@/server/getPresignedUrl";

export async function uploadFile(file: File): Promise<string> {
  const presignedUrl = await getPresignedUrl(file.name);
  if (!presignedUrl) {
    throw new Error(`Failed to get presigned URL for file: ${file.name}`);
  }

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

export async function uploadMany(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(uploadFile);
  return Promise.all(uploadPromises);
}
