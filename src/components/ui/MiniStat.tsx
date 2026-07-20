"use client";

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MiniStatProps {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  sparkline?: number[];
  color?: string;
}

const changeStyles: Record<MiniStatProps["changeType"], string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-text-muted",
};

const changeIcons: Record<MiniStatProps["changeType"], ReactNode> = {
  up: <TrendingUp size={12} />,
  down: <TrendingDown size={12} />,
  neutral: <Minus size={12} />,
};

export function MiniStat({
  icon,
  label,
  value,
  change,
  changeType,
  sparkline,
  color = "primary",
}: MiniStatProps) {
  const sparklinePath = (() => {
    if (!sparkline || sparkline.length < 2) return "";
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 28;
    const step = width / (sparkline.length - 1);

    return sparkline
      .map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  })();

  const sparklineColor =
    changeType === "up"
      ? "stroke-success"
      : changeType === "down"
        ? "stroke-danger"
        : "stroke-text-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm"
          )}
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
            color: color,
          }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-text-muted truncate">{label}</p>
          <p className="text-lg font-bold text-text leading-tight">{value}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={cn("flex items-center gap-1 text-xs font-medium", changeStyles[changeType])}>
          {changeIcons[changeType]}
          {change}
        </span>

        {sparklinePath && (
          <svg width="80" height="28" viewBox="0 0 80 28" className="overflow-visible">
            <motion.path
              d={sparklinePath}
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={sparklineColor}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
}
