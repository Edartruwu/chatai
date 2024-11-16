import React, { useState, useRef } from "react";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SingleFileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
}

export function SingleFileUpload({
  onUploadComplete,
  accept = "*",
}: SingleFileUploadProps) {
  const { uploadState, upload } = useUpload();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type.startsWith("video/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      const url = await upload(file);
      if (url) {
        onUploadComplete(url);
      }
    }
  };

  const handleDelete = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        ref={fileInputRef}
      />
      {!file && (
        <Button onClick={() => fileInputRef.current?.click()}>
          Select File
        </Button>
      )}
      {file && (
        <div className="relative">
          {preview && (
            <div className="mb-2">
              {file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto"
                />
              ) : (
                <video src={preview} controls className="max-w-full h-auto" />
              )}
            </div>
          )}
          <p className="text-sm">{file.name}</p>
          <Button onClick={handleUpload} disabled={uploadState.isUploading}>
            {uploadState.isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button onClick={handleDelete} variant="destructive" className="ml-2">
            Delete
          </Button>
        </div>
      )}
      {uploadState.isUploading && (
        <Progress value={uploadState.progress} className="w-full" />
      )}
      {uploadState.error && <p className="text-red-500">{uploadState.error}</p>}
      {uploadState.uploadedUrls[0] && (
        <p className="text-green-500">File uploaded successfully!</p>
      )}
    </div>
  );
}
