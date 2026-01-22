"use client";

import { motion } from "framer-motion";
import { Trash2, FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileItemType } from "./pdf-fusion-client";
import { cn } from "@/lib/utils";

type FileItemSwipeProps = {
  fileItem: FileItemType;
  onDelete: (id: string) => void;
};

export function FileItemSwipe({ fileItem, onDelete }: FileItemSwipeProps) {

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
      variants={variants}
      layout
      className="relative group/item"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.5, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className={cn(
        "flex items-center w-full bg-card p-3 border rounded-xl transition-all duration-200 shadow-sm",
        "hover:border-primary/40 hover:shadow-sm"
      )}>
        <div className="w-8"/>

        <div className="flex-shrink-0 mx-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex-1 truncate min-w-0">
          <p className="truncate font-medium text-foreground">
            {fileItem.file.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatBytes(fileItem.file.size)}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full flex-shrink-0 ml-4"
          onClick={() => onDelete(fileItem.id)}
          aria-label="Delete file"
        >
          <Trash2 size={18} />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-destructive/80 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="text-xs font-semibold">Swipe to delete</span>
      </div>
    </motion.li>
  );
}
