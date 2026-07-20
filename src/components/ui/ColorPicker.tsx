"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PRESETS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#84CC16",
  "#111827", "#6B7280", "#1E293B", "#FFFFFF", "#000000",
];

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  className?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  className,
}: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative h-10 w-10 shrink-0 rounded-lg border-2 border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
          aria-label="اختيار اللون"
        >
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          {value === "#FFFFFF" && (
            <div className="absolute inset-0 border border-border" />
          )}
        </button>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="sr-only"
          tabIndex={-1}
        />
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text font-mono uppercase transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
            title={copied ? "تم النسخ" : "نسخ"}
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange?.(color)}
            className={cn(
              "relative h-8 w-8 rounded-lg cursor-pointer transition-all hover:scale-110",
              value === color && "ring-2 ring-primary ring-offset-2 ring-offset-surface"
            )}
            style={{ backgroundColor: color }}
            aria-label={color}
          >
            {color === "#FFFFFF" && (
              <div className="absolute inset-0 rounded-lg border border-border" />
            )}
            {value === color && (
              <Check
                size={14}
                className={cn(
                  "absolute inset-0 m-auto",
                  ["#FFFFFF", "#F59E0B", "#84CC16", "#FFFFFF"].includes(color)
                    ? "text-text"
                    : "text-white"
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
