"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileItemType } from "./pdf-fusion-client";
import { cn } from "@/lib/utils";

type FileItemProps = {
  fileItem: FileItemType;
  onDelete: (id: string) => void;
  isMergeDone: boolean;
};

export function FileItem({ fileItem, onDelete, isMergeDone }: FileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id, disabled: isMergeDone });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number; }; }) => {
    if (info.offset.x < -60) { // Swiping left
      onDelete(fileItem.id);
    }
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      variants={variants}
      layout
      className={cn(
        "relative group/item",
        isDragging && "opacity-60"
      )}
      drag={isMergeDone ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.5, right: 0 }}
      onDragEnd={isMergeDone ? handleDragEnd : undefined}
    >
      <div className={cn(
        "flex items-center w-full bg-card p-2.5 border rounded-lg transition-all duration-200",
        "hover:border-primary/40 hover:shadow-sm",
        isDragging ? "shadow-lg bg-accent border-primary" : "shadow-xs",
      )}>
        {!isMergeDone ? (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none p-2 text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
        ) : <div className="w-10"/> // Placeholder to keep alignment
        }

        <div className="flex-shrink-0 mx-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
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
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full flex-shrink-0 ml-2"
          onClick={() => onDelete(fileItem.id)}
          aria-label="Delete file"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      {isMergeDone && (
         <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-destructive/80 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="text-xs font-semibold">Swipe</span>
        </div>
      )}
    </motion.li>
  );
}
