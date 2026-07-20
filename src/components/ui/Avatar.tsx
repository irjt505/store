import type { HTMLAttributes } from "react";
import { cn, getInitials } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name: string;
  size?: AvatarSize;
  online?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const dotPositionStyles: Record<AvatarSize, string> = {
  xs: "-bottom-0 -left-0 h-2 w-2 border",
  sm: "-bottom-0.5 -left-0.5 h-2.5 w-2.5 border-[1.5px]",
  md: "-bottom-0.5 -left-0.5 h-3 w-3 border-2",
  lg: "-bottom-0.5 -left-0.5 h-3 w-3 border-2",
  xl: "-bottom-0 -left-0 h-3.5 w-3.5 border-2",
};

const colorPool = [
  "bg-primary text-white",
  "bg-success text-white",
  "bg-warning text-white",
  "bg-danger text-white",
  "bg-info text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-teal-500 text-white",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  online,
  className,
  ...props
}: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = colorPool[hashString(name) % colorPool.length];

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-medium",
            sizeStyles[size],
            colorClass
          )}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute rounded-full bg-success border-surface",
            online ? "bg-success" : "bg-text-muted",
            dotPositionStyles[size]
          )}
        />
      )}
    </div>
  );
}
