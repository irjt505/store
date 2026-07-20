"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const positionStyles: Record<NonNullable<TooltipProps["position"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  right: "start-full top-1/2 -translate-y-1/2 ms-2",
  left: "end-full top-1/2 -translate-y-1/2 me-2",
};

const arrowStyles: Record<NonNullable<TooltipProps["position"]>, string> = {
  top: "top-full start-1/2 -translate-x-1/2 border-t-neutral-900 border-e-transparent border-b-transparent border-s-transparent",
  bottom: "bottom-full start-1/2 -translate-x-1/2 border-b-neutral-900 border-e-transparent border-t-transparent border-s-transparent",
  right: "end-full top-1/2 -translate-y-1/2 border-e-neutral-900 border-t-transparent border-b-transparent border-s-transparent",
  left: "start-full top-1/2 -translate-y-1/2 border-s-neutral-900 border-t-transparent border-b-transparent border-e-transparent",
};

export function Tooltip({
  children,
  content,
  position = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "absolute z-50 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 pointer-events-none transition-opacity duration-200",
          positionStyles[position],
          visible && "opacity-100"
        )}
      >
        {content}
        <span
          className={cn(
            "absolute h-0 w-0 border-[4px]",
            arrowStyles[position]
          )}
        />
      </span>
    </span>
  );
}
