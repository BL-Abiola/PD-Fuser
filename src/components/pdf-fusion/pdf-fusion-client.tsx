"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Files, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileItemType } from "./types";

type PdfFusionClientProps = {
  onMergeComplete: (mergedFile: { name: string; url: string }) => void;
};

let fileCounter = 0;

export function PdfFusionClient({ onMergeComplete }: PdfFusionClientProps) {
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: `file-${fileCounter++}`,
      file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const handleReorder = useCallback((reorderedFiles: FileItemType[]) => {
    setFiles(reorderedFiles);
  }, []);

  const handleClearAll = () => {
    setFiles([]);
  };

  const reset = () => {
    setFiles([]);
    setIsMerging(false);
    setProgress(0);
  };

  const handleMerge = async () => {
    if (files.length < 1) {
      toast({
        variant: "destructive",
        title: "No files",
        description: "Please upload at least one PDF file.",
      });
      return;
    }

    setIsMerging(true);
    setProgress(0);

    const filename = `merged-${Date.now()}.pdf`;

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      onMergeComplete({ name: filename, url });

      toast({
        title: "Merge successful!",
        description: `${filename} has been added to your library.`,
      });

      reset();
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Could not merge the PDFs. Please ensure they are valid files.",
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border bg-card text-card-foreground shadow-lg"
      >
        <div className="p-6">
          <FileDropzone onDrop={handleDrop} hasFiles={files.length > 0} />
        </div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="rounded-xl border bg-card text-card-foreground shadow-lg flex flex-col"
          >
            <div className="p-4 px-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Your Files</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag to reorder.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <ScrollArea className="flex-grow" style={{ maxHeight: "40vh" }}>
              <FileQueue
                files={files}
                onReorder={handleReorder}
                onDelete={handleDelete}
              />
            </ScrollArea>
            <div className="border-t p-6 text-center">
              <AnimatePresence mode="wait">
                {isMerging ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full space-y-3"
                  >
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                      Merging your documents...
                    </p>
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progress)}% complete
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="text-md font-medium text-foreground">
                      Ready to go?
                    </h3>
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={handleMerge}
                        className="shadow-lg w-full max-w-xs"
                      >
                        <Files size={20} />
                        <span className="ml-2">
                          {`Merge ${files.length} File${
                            files.length > 1 ? "s" : ""
                          }`}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {files.length === 0 && (
          <motion.div
            key="placeholder_card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="rounded-xl border border-dashed bg-card/50"
          >
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Add files above to get started.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
