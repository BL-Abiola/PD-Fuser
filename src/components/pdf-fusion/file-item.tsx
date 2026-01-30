"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import type { FileItemType } from "./types";
import { cn } from "@/lib/utils";

type FileItemProps = {
  fileItem: FileItemType;
  onDelete: (id: string) => void;
};

export function FileItem({ fileItem, onDelete }: FileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      variants={variants}
      layout
      className={cn(
        "flex w-full items-center space-x-4 rounded-lg border bg-secondary/30 p-3 shadow-sm transition-shadow",
        isDragging ? "bg-card shadow-lg" : ""
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex flex-1 items-center gap-3 min-w-0 touch-none cursor-grab"
        aria-label="Drag to reorder"
      >
        <FileText className="h-5 w-5 flex-shrink-0 text-primary/80" />
        
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {fileItem.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(fileItem.file.size)}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full flex-shrink-0"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={16} />
      </Button>
    </motion.li>
  );
}
