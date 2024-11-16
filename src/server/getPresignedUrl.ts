"use client";

import { BASE_URL } from "@/lib/url";

interface GetPresignedUrlResponse {
  url: string;
}

export async function getPresignedUrl(
  fileName: string,
): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/generate-presigned-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName }),
      credentials: "include",
    });
    console.log(JSON.stringify(response));
    console.log("Fetch response status:", response.status);

    if (!response.ok) {
      console.error("Error response received:", response.statusText);
      return null;
    }

    const data: GetPresignedUrlResponse = await response.json();
    console.log("Presigned URL received:", data.url);

    return data.url;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    return null;
  }
}
