"use client";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

interface StatusBadgeProps {
  status: string;
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "default" | "purple";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

const variantStyles: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  default: "bg-surface-hover text-text-secondary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  purple: "bg-primary-light text-primary",
};

const dotStyles: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  default: "bg-text-secondary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  purple: "bg-primary",
};

const sizeStyles: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3 py-1 text-sm gap-1.5",
};

const dotSizeStyles: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

export function StatusBadge({
  status,
  label,
  variant = "default",
  size = "md",
  tooltip,
}: StatusBadgeProps) {
  const badge = (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size]
      )}
    >
      <span className={cn("rounded-full shrink-0", dotStyles[variant], dotSizeStyles[size])} />
      {label}
    </span>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{badge}</Tooltip>;
  }

  return badge;
}
