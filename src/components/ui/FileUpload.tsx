"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, File, FileText, FileImage, FileVideo, FileAudio, FileArchive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (files: UploadedFile[]) => void;
  label?: string;
  description?: string;
  className?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <FileImage size={16} className="text-blue-500" />;
  if (type.startsWith("video/")) return <FileVideo size={16} className="text-purple-500" />;
  if (type.startsWith("audio/")) return <FileAudio size={16} className="text-pink-500" />;
  if (type.includes("pdf")) return <FileText size={16} className="text-red-500" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <FileArchive size={16} className="text-yellow-500" />;
  return <File size={16} className="text-text-muted" />;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} ميجابايت`;
  return `${(bytes / 1073741824).toFixed(1)} جيجابايت`;
}

export function FileUpload({
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024,
  onFilesChange,
  label,
  description,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const arr = Array.from(newFiles);

      const valid = arr.filter((f) => {
        if (f.size > maxSize) {
          setError(`الملف ${f.name} يتجاوز الحد الأقصى ${formatFileSize(maxSize)}`);
          return false;
        }
        return true;
      });

      const remaining = multiple ? maxFiles - files.length : 1;
      const toAdd = valid.slice(0, remaining);

      if (toAdd.length < valid.length) {
        setError(`يمكن إضافة ${remaining} ملف فقط`);
      }

      const mapped: UploadedFile[] = toAdd.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        progress: 100,
      }));

      const updated = multiple ? [...files, ...mapped] : mapped;
      setFiles(updated);
      onFilesChange?.(updated);
    },
    [files, multiple, maxFiles, maxSize, onFilesChange]
  );

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-surface-hover"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Upload size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text">
            اسحب الملفات هنا أو <span className="text-primary">اختر ملف</span>
          </p>
          {description && (
            <p className="mt-1 text-xs text-text-muted">{description}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
      />

      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text truncate">{file.name}</p>
                <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
              </div>
              {file.progress !== undefined && file.progress < 100 && (
                <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
