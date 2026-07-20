"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DropdownAlign = "start" | "center" | "end";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: DropdownAlign;
}

const alignStyles: Record<DropdownAlign, string> = {
  start: "right-0",
  center: "left-1/2 -translate-x-1/2",
  end: "left-0",
};

export function Dropdown({ trigger, children, align = "start" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-border bg-surface py-1 shadow-lg",
            alignStyles[align]
          )}
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

export function DropdownItem({ children, onClick, className, danger }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-sm text-right transition-colors cursor-pointer",
        danger
          ? "text-danger hover:bg-danger-light"
          : "text-text hover:bg-surface-hover",
        className
      )}
    >
      {children}
    </button>
  );
}
