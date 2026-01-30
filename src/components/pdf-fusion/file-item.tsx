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
        "flex w-full items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow",
        isDragging ? "bg-accent shadow-lg scale-105" : ""
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab touch-none"
        aria-label="Drag to reorder"
      >
        <FileText className="h-8 w-8 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {fileItem.file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(fileItem.file.size)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 flex-shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={18} />
      </Button>
    </motion.li>
  );
}
