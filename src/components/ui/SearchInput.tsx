"use client";

import { useState, useRef, useCallback, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  debounce?: number;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
}

export function SearchInput({
  className,
  debounce = 300,
  onSearch,
  onChange,
  value: externalValue,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const displayedValue = externalValue !== undefined ? externalValue : internalValue;

  const debouncedSearch = useCallback(
    (val: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch?.(val);
      }, debounce);
    },
    [debounce, onSearch]
  );

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={displayedValue}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "w-full h-9 rounded-lg border border-border bg-surface pr-9 pl-8 text-sm text-text placeholder:text-text-muted",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:bg-surface-hover disabled:cursor-not-allowed"
        )}
        {...props}
      />
      {displayedValue && (
        <button
          onClick={handleClear}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
