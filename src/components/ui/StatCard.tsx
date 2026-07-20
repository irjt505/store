import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type StatColor = "primary" | "success" | "warning" | "danger" | "info";
type ChangeType = "up" | "down" | "neutral";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: ChangeType;
  color?: StatColor;
  className?: string;
}

const iconBgStyles: Record<StatColor, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
};

const changeStyles: Record<ChangeType, string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-text-muted",
};

const changeIcon: Record<ChangeType, ReactNode> = {
  up: <TrendingUp size={14} />,
  down: <TrendingDown size={14} />,
  neutral: <Minus size={14} />,
};

export function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  color = "primary",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg">
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgStyles[color])}>
            {icon}
          </span>
        </div>
        {change && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", changeStyles[changeType])}>
            {changeIcon[changeType]}
            {change}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="mt-1 text-2xl font-bold text-text">{value}</p>
      </div>
    </div>
  );
}
