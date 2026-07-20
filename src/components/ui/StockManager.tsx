"use client";

import { useMemo } from "react";
import { Minus, Plus, AlertTriangle, XCircle, RotateCcw, Package, ShoppingCart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StockMovement {
  id: string;
  type: "add" | "remove" | "order" | "return";
  quantity: number;
  date: string;
  note: string;
}

interface StockManagerProps {
  stock: number;
  lowThreshold: number;
  movements: StockMovement[];
  onChange: (stock: number) => void;
  onThresholdChange: (threshold: number) => void;
}

const movementConfig: Record<
  StockMovement["type"],
  { icon: React.ReactNode; color: string; label: string }
> = {
  add: { icon: <Plus size={12} />, color: "text-success", label: "إضافة" },
  remove: { icon: <LogOut size={12} />, color: "text-danger", label: "سحب" },
  order: { icon: <ShoppingCart size={12} />, color: "text-info", label: "طلب" },
  return: { icon: <RotateCcw size={12} />, color: "text-warning", label: "إرجاع" },
};

export function StockManager({
  stock,
  lowThreshold,
  movements,
  onChange,
  onThresholdChange,
}: StockManagerProps) {
  const stockStatus = useMemo(() => {
    if (stock === 0) return { label: "نفذ من المخزون", color: "danger", bg: "bg-danger-light", textColor: "text-danger" };
    if (stock <= lowThreshold) return { label: "مخزون منخفض", color: "warning", bg: "bg-warning-light", textColor: "text-warning" };
    return { label: "متوفر", color: "success", bg: "bg-success-light", textColor: "text-success" };
  }, [stock, lowThreshold]);

  const dotColor = stock === 0 ? "bg-danger" : stock <= lowThreshold ? "bg-warning" : "bg-success";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stockStatus.bg)}>
            <Package size={20} className={stockStatus.textColor} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                key={stock}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-text"
              >
                {stock}
              </motion.span>
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: stock === 0 ? "var(--color-danger-light, #fef2f2)" : stock <= lowThreshold ? "var(--color-warning-light, #fffbeb)" : "var(--color-success-light, #f0fdf4)",
                  color: stock === 0 ? "var(--color-danger, #ef4444)" : stock <= lowThreshold ? "var(--color-warning, #f59e0b)" : "var(--color-success, #22c55e)",
                }}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
                {stockStatus.label}
              </span>
            </div>
            <p className="text-xs text-text-muted">الكمية الحالية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, stock - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>

          <input
            type="number"
            value={stock}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 0) onChange(val);
            }}
            className="h-8 w-16 rounded-lg border border-border bg-surface text-center text-sm font-semibold text-text focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
          />

          <button
            type="button"
            onClick={() => onChange(stock + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
        <AlertTriangle size={16} className="text-text-muted shrink-0" />
        <span className="text-xs text-text-secondary shrink-0">حد المخزون المنخفض:</span>
        <input
          type="number"
          value={lowThreshold}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 0) onThresholdChange(val);
          }}
          className="h-7 w-16 rounded-md border border-border bg-surface px-2 text-xs text-text text-center focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {stock === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl bg-danger-light px-4 py-3 text-danger text-sm font-medium"
        >
          <XCircle size={16} />
          المنتج نفد من المخزون
        </motion.div>
      )}

      {movements.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary">حركات المخزون</p>
          <div className="space-y-1.5">
            {movements.slice(0, 5).map((movement, index) => {
              const config = movementConfig[movement.type];
              return (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg bg-surface-hover px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-surface", config.color)}>
                      {config.icon}
                    </span>
                    <span className="text-xs text-text-secondary">{config.label}</span>
                    <span className={cn("text-xs font-semibold", config.color)}>
                      {movement.type === "add" || movement.type === "return" ? "+" : "-"}
                      {movement.quantity}
                    </span>
                  </div>
                  <div className="text-end">
                    <p className="text-[10px] text-text-muted">{movement.date}</p>
                    {movement.note && (
                      <p className="text-[10px] text-text-muted">{movement.note}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
