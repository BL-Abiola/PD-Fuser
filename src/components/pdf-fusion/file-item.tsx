"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileItemType } from "./pdf-fusion-client";
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        "flex items-center gap-4 bg-card p-3 border rounded-lg shadow-sm transition-shadow",
        isDragging ? "shadow-lg bg-accent ring-2 ring-primary" : "hover:shadow-md"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none p-2 text-muted-foreground hover:text-foreground">
        <GripVertical size={20} />
      </button>
      <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-md">
        <FileType2 className="h-6 w-6" />
      </div>
      <div className="flex-1 truncate min-w-0">
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
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full flex-shrink-0"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={18} />
      </Button>
    </motion.li>
  );
}
