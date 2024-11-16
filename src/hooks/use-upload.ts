"use client";

import { uploadFile, uploadMany } from "@/lib/upload";
import { useState, useCallback } from "react";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrls: string[];
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedUrls: [],
  });

  function upload(file: File): Promise<string | null> {
    return new Promise(function (resolve) {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        uploadedUrls: [],
      });

      uploadFile(file, "")
        .then(function (url: string) {
          setUploadState({
            isUploading: false,
            progress: 100,
            error: null,
            uploadedUrls: [url],
          });
          resolve(url);
        })
        .catch(function (error: unknown) {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: error instanceof Error ? error.message : String(error),
            uploadedUrls: [],
          });
          resolve(null);
        });
    });
  }

  function uploadMultiple(files: File[]): Promise<string[]> {
    return new Promise(function (resolve) {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        uploadedUrls: [],
      });

      uploadMany(files)
        .then(function (urls: string[]) {
          setUploadState({
            isUploading: false,
            progress: 100,
            error: null,
            uploadedUrls: urls,
          });
          resolve(urls);
        })
        .catch(function (error: unknown) {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: error instanceof Error ? error.message : String(error),
            uploadedUrls: [],
          });
          resolve([]);
        });
    });
  }

  return {
    uploadState,
    upload: useCallback(upload, []),
    uploadMultiple: useCallback(uploadMultiple, []),
  };
}
