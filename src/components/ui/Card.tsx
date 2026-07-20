import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  padding?: CardPadding;
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
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border",
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
}
