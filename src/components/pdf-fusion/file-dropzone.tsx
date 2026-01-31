"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  hasFiles?: boolean;
};

export function FileDropzone({ onDrop, hasFiles = false }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "text/html": [".html", ".htm"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 text-center transition-colors duration-300 hover:border-primary hover:bg-accent",
        isDragActive && "border-primary bg-accent"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-foreground">
        <UploadCloud
          className={cn(
            "h-10 w-10 text-muted-foreground transition-transform duration-300",
            isDragActive && "scale-110 text-primary"
          )}
        />
        {hasFiles ? (
          <p className="text-lg font-medium text-foreground">
            {isDragActive
              ? "Drop to add more files!"
              : "Drag & drop to add more, or click to select"}
          </p>
        ) : (
          <p className="text-lg font-medium text-foreground">
            {isDragActive
              ? "Drop files here!"
              : "Drag & drop PDFs, images, or HTML files here"}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          PDF, JPG, PNG, and HTML files are supported.
        </p>
      </div>
    </div>
  );
}
