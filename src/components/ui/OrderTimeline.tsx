"use client";

import { CheckCircle, Circle, Clock, Truck, Package, RotateCcw, XCircle, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  status: string;
  label: string;
  date?: string;
  note?: string;
  icon?: string;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
  currentStatus: string;
}

const statusOrder = ["review", "processing", "shipping", "delivered", "completed"];

const statusIcons: Record<string, React.ReactNode> = {
  review: <Clock size={18} />,
  processing: <FileCheck size={18} />,
  shipping: <Truck size={18} />,
  delivered: <Package size={18} />,
  completed: <CheckCircle size={18} />,
  cancelled: <XCircle size={18} />,
  returned: <RotateCcw size={18} />,
};

function getStepIndex(status: string): number {
  const idx = statusOrder.indexOf(status);
  return idx >= 0 ? idx : -1;
}

export function OrderTimeline({ steps, currentStatus }: OrderTimelineProps) {
  const currentIdx = getStepIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";
  const isReturned = currentStatus === "returned";

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const stepIdx = getStepIndex(step.status);
        const isActive = step.status === currentStatus;
        const isCompleted = !isCancelled && !isReturned && stepIdx >= 0 && currentIdx >= 0 && stepIdx < currentIdx;
        const isFuture = !isCancelled && !isReturned && stepIdx >= 0 && currentIdx >= 0 && stepIdx > currentIdx;

        const isDone = step.date && (isCompleted || isActive);
        const isPending = isFuture;

        return (
          <div key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isDone
                    ? "bg-success border-success text-white"
                    : isActive
                    ? "bg-primary border-primary text-white"
                    : isPending
                    ? "bg-surface border-border text-text-muted"
                    : "bg-surface border-border text-text-muted"
                )}
              >
                {statusIcons[step.icon || step.status] || <Circle size={18} />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] my-1",
                    isDone ? "bg-success" : isPending ? "bg-border" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-6 pt-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary" : isDone ? "text-text" : "text-text-muted"
                  )}
                >
                  {step.label}
                </h4>
                {isActive && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary-light text-primary">
                    الحالي
                  </span>
                )}
              </div>
              {step.date && (
                <p className="text-xs text-text-muted mt-0.5">{step.date}</p>
              )}
              {step.note && (
                <p className="text-xs text-text-secondary mt-1 bg-surface-hover rounded-lg px-3 py-2">
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
