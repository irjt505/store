"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, X, Star, GripVertical, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
}

export function ImageGallery({ images, onChange, maxImages = 10 }: ImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canAddMore = images.length < maxImages;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remainingSlots = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      const newImages: GalleryImage[] = filesToProcess.map((file, i) => ({
        id: `img-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        name: file.name,
        isPrimary: images.length === 0 && i === 0,
      }));

      onChange([...images, ...newImages]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [images, onChange, maxImages]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = images.filter((img) => img.id !== id);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      onChange(updated);
    },
    [images, onChange]
  );

  const handleSetPrimary = useCallback(
    (id: string) => {
      onChange(
        images.map((img) => ({
          ...img,
          isPrimary: img.id === id,
        }))
      );
    },
    [images, onChange]
  );

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const reordered = [...images];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(dropIndex, 0, removed);
      onChange(reordered);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [images, onChange, draggedIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: draggedIndex === index ? 0.5 : 1,
                scale: 1,
                borderColor: dragOverIndex === index ? "var(--color-primary)" : undefined,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, index)}
              onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e as unknown as React.DragEvent, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "group relative aspect-square rounded-xl border-2 border-border overflow-hidden bg-surface-hover cursor-grab active:cursor-grabbing",
                dragOverIndex === index && "border-primary"
              )}
            >
              <img
                src={image.url}
                alt={image.name}
                className="h-full w-full object-cover"
              />

              <span className="absolute top-2 start-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(image.id);
                }}
                className="absolute top-2 end-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={12} strokeWidth={3} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetPrimary(image.id);
                }}
                className={cn(
                  "absolute bottom-2 end-2 flex h-7 w-7 items-center justify-center rounded-full transition-all cursor-pointer",
                  image.isPrimary
                    ? "bg-primary text-white opacity-100"
                    : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
                )}
              >
                <Star size={14} fill={image.isPrimary ? "currentColor" : "none"} />
              </button>

              {image.isPrimary && (
                <span className="absolute top-2 start-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                  الصورة الرئيسية
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface transition-colors cursor-pointer",
              "hover:border-primary hover:bg-primary/5"
            )}
          >
            <ImagePlus size={24} className="text-text-muted" />
            <span className="text-xs text-text-muted font-medium">إضافة صورة</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="mt-2 text-xs text-text-muted">
        {images.length} / {maxImages} صور
      </p>
    </div>
  );
}
