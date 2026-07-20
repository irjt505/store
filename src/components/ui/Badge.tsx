import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "purple";
type BadgeSize = "sm" | "md";
type BadgeAppearance = "filled" | "outline";

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  appearance?: BadgeAppearance;
  dot?: boolean;
  children: ReactNode;
}

const filledStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-text-secondary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  primary: "bg-primary-light text-primary",
  purple: "bg-primary-light text-primary",
};

const outlineStyles: Record<BadgeVariant, string> = {
  default: "border border-border text-text-secondary",
  success: "border border-success/30 text-success",
  warning: "border border-warning/30 text-warning",
  danger: "border border-danger/30 text-danger",
  info: "border border-info/30 text-info",
  primary: "border border-primary/30 text-primary",
  purple: "border border-primary/30 text-primary",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-text-secondary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  primary: "bg-primary",
  purple: "bg-primary",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-px text-[11px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({
  variant = "default",
  size = "md",
  appearance = "filled",
  dot,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap leading-none",
        appearance === "outline" ? outlineStyles[variant] : filledStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "shrink-0 rounded-full",
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
            dotStyles[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
