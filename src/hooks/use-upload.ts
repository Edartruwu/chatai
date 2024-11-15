"use client";

import { uploadFile, uploadMany } from "@/lib/upload";
import { useState, useCallback } from "react";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedUrl: null,
  });

  const upload = useCallback(async (file: File) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      uploadedUrl: null,
    });

    try {
      const url = await uploadFile(file);
      if (url) {
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          uploadedUrl: url,
        });
        return url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : String(error),
        uploadedUrl: null,
      });
      return null;
    }
  }, []);

  const uploadMultiple = useCallback(async (files: File[]) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      uploadedUrl: null,
    });

    try {
      const urls = await uploadMany(files);
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        uploadedUrl: urls.join(","),
      });
      return urls;
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : String(error),
        uploadedUrl: null,
      });
      return [];
    }
  }, []);

  return { uploadState, upload, uploadMultiple };
}
