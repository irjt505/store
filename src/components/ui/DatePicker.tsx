import { forwardRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  id?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      disabled = false,
      min,
      max,
      className,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const autoId = label
      ? `dp-${label.toLowerCase().replace(/\s+/g, "-")}`
      : undefined;
    const id = idProp ?? autoId;

    return (
      <div className={cn("flex flex-col", className)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="date"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            min={min}
            max={max}
            lang="ar"
            dir="rtl"
            className={cn(
              "w-full h-9 rounded-lg border bg-surface px-3 pr-9 text-sm text-text placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              error ? "border-danger" : "border-border",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            {...props}
          />
          <Calendar
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
