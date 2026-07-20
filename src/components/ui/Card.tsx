import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  padding?: CardPadding;
  hover?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  header,
  footer,
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      role="region"
      className={cn(
        "bg-surface rounded-xl border border-border",
        hover &&
          "transition-shadow duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border">{header}</div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border">{footer}</div>
      )}
    </div>
  );
}
