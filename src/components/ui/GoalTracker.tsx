"use client";

import { useMemo } from "react";
import { Target, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GoalTrackerProps {
  current: number;
  target: number;
  daysRemaining: number;
  currency?: string;
}

export function GoalTracker({
  current,
  target,
  daysRemaining,
  currency = "ر.س",
}: GoalTrackerProps) {
  const percentage = useMemo(
    () => (target > 0 ? Math.min((current / target) * 100, 100) : 0),
    [current, target]
  );

  const dailyRateNeeded = useMemo(
    () => (daysRemaining > 0 ? Math.max(0, (target - current) / daysRemaining) : 0),
    [current, target, daysRemaining]
  );

  const message = useMemo(() => {
    if (percentage >= 100) return { text: "🎉 تجاوزت الهدف! أداء ممتاز", color: "text-success" };
    if (percentage >= 80) return { text: "_almost there! واصل التقدم", color: "text-primary" };
    if (percentage >= 50) return { text: "👍 أنت في المنتصف، واصل!", color: "text-primary" };
    if (percentage >= 25) return { text: "💪 بداية جيدة، واصل الجهد!", color: "text-warning" };
    return { text: "🚀 ابدأ بقوة لتحقيق الهدف!", color: "text-text-secondary" };
  }, [percentage]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const progressColor =
    percentage >= 100
      ? "stroke-success"
      : percentage >= 50
        ? "stroke-primary"
        : percentage >= 25
          ? "stroke-warning"
          : "stroke-danger";

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={progressColor}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={Math.round(percentage)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-text"
            >
              {Math.round(percentage)}%
            </motion.span>
            <span className="text-[10px] text-text-muted">مكتمل</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className={cn("text-sm font-medium", message.color)}>
            {message.text}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-2 rounded-lg bg-surface-hover p-3">
            <Target size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-text-muted">الهدف</p>
              <p className="text-sm font-semibold text-text">
                {target.toLocaleString("ar-SA")} {currency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-surface-hover p-3">
            <TrendingUp size={16} className="text-success shrink-0" />
            <div>
              <p className="text-[10px] text-text-muted">المحقق</p>
              <p className="text-sm font-semibold text-text">
                {current.toLocaleString("ar-SA")} {currency}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 w-full flex items-center justify-between rounded-lg bg-surface-hover px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-text-muted" />
            <span className="text-xs text-text-secondary">
              متبقي {daysRemaining} يوم
            </span>
          </div>
          {daysRemaining > 0 && percentage < 100 && (
            <span className="text-xs text-text-muted">
              {(target - current).toLocaleString("ar-SA")} {currency} / يوم
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
