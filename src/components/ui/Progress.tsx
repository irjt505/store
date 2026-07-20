import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

const sizeStyles: Record<NonNullable<ProgressProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const colorStyles: Record<NonNullable<ProgressProps["color"]>, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function Progress({
  value,
  label,
  showPercentage = false,
  size = "md",
  color = "primary",
  className,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-text">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-text-muted">{clamped}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-border",
          sizeStyles[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colorStyles[color])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
