import type { ReactNode } from "react";
import Link from "next/link";
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
  href?: string;
  onClick?: () => void;
  className?: string;
}

const iconBgStyles: Record<StatColor, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
};

const changePillStyles: Record<ChangeType, string> = {
  up: "bg-success-light text-success",
  down: "bg-danger-light text-danger",
  neutral: "bg-surface-hover text-text-muted",
};

const changeIcon: Record<ChangeType, ReactNode> = {
  up: <TrendingUp size={12} />,
  down: <TrendingDown size={12} />,
  neutral: <Minus size={12} />,
};

export function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  color = "primary",
  href,
  onClick,
  className,
}: StatCardProps) {
  const cardContent = (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border p-6",
        "transition-all duration-200",
        (href || onClick) &&
          "hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex items-center justify-center size-10 rounded-lg text-lg",
            iconBgStyles[color]
          )}
        >
          {icon}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              changePillStyles[changeType]
            )}
          >
            {changeIcon[changeType]}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary leading-none">{label}</p>
        <p className="mt-1.5 text-2xl font-bold text-text tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
      >
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
      >
        {cardContent}
      </button>
    );
  }

  return <div className={className}>{cardContent}</div>;
}
