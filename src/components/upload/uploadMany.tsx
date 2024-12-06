"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface MultipleFileUploadProps {
  accept?: string;
  maxFiles?: number;
}

export default function MultipleFileUpload({
  accept = "*",
  maxFiles = 1000,
}: MultipleFileUploadProps = {}) {
  const { uploadState, uploadMultiple } = useUpload();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fakeProgress, setFakeProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("content");

  function handleFiles(selectedFiles: File[]): void {
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) =>
        [...prevFiles, ...selectedFiles].slice(0, maxFiles),
      );
      const newPreviews = selectedFiles.map((file) => {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          return URL.createObjectURL(file);
        }
        return "";
      });
      setPreviews((prevPreviews) =>
        [...prevPreviews, ...newPreviews].slice(0, maxFiles),
      );
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const selectedFiles = Array.from(event.target.files || []);
    handleFiles(selectedFiles);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }

  async function handleUpload(): Promise<void> {
    if (files.length > 0) {
      setUploadSuccess(false);
      setFakeProgress(0);

      const interval = setInterval(() => {
        setFakeProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 500);

      const urls = await uploadMultiple(files);

      clearInterval(interval);
      setFakeProgress(100);

      if (urls.length > 0) {
        setUploadSuccess(true);
        location.reload();
      }
    }
  }

  function handleDelete(index: number): void {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple
          className="hidden"
          ref={fileInputRef}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">{t("uploadManyTitle")}</p>
        <p className="mt-1 text-xs text-gray-500">{`${t("first")} ${maxFiles} ${t("second")}${maxFiles > 1 ? "s" : ""}`}</p>
      </div>
      {files.length > 0 && (
        <ScrollArea className="h-[240px]">
          <div className="space-y-2 pr-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded"
              >
                {previews[index] && (
                  <div className="w-16 h-16 flex-shrink-0">
                    {file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[index]}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : file.type.startsWith("video/") ? (
                      <video
                        src={previews[index]}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-xs text-gray-500">
                          {file.name.split(".").pop()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm flex-grow truncate">
                  {(() => {
                    const maxLength = 15;
                    const fileParts = file.name.split(".");
                    const extension = fileParts.pop();
                    const nameWithoutExtension = fileParts
                      .join(".")
                      .split(" ")
                      .slice(0, 2)
                      .join(" ");
                    return nameWithoutExtension.length > maxLength
                      ? `${nameWithoutExtension.slice(0, maxLength)}...${extension}`
                      : `${nameWithoutExtension}.${extension}`;
                  })()}
                </p>
                <Button
                  onClick={() => handleDelete(index)}
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("deleteButton")}</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploadState.isUploading || files.length === 0}
          className="w-full"
        >
          {uploadState.isUploading ? t("uploading") : t("uploadAll")}
        </Button>
      )}
      {uploadState.isUploading && (
        <div className="space-y-2">
          <Progress value={fakeProgress} className="w-full" />
          <p className="text-sm text-center text-gray-600">
            {t("fakeProgress")} {fakeProgress}%
          </p>
        </div>
      )}
      {uploadState.error && (
        <p className="text-destructive">{uploadState.error}</p>
      )}
      {uploadSuccess && (
        <div className="text-center">
          <p className="text-green-500 font-semibold">{t("success")}</p>
        </div>
      )}
    </div>
  );
}
