"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  className,
}: ToggleGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-surface p-1 border border-border",
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text hover:bg-surface-hover"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
