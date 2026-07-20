"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={18} className="text-success" />,
  error: <XCircle size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info: <Info size={18} className="text-info" />,
};

const styles: Record<ToastType, string> = {
  success: "border-success/30 bg-success/5",
  error: "border-danger/30 bg-danger/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-info/30 bg-info/5",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const addToast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = options.duration ?? 4000;
      setToasts((prev) => [...prev, { ...options, id }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const toast = useCallback(
    (options: Omit<Toast, "id">) => addToast(options),
    [addToast]
  );

  const success = useCallback((title: string, message?: string) => addToast({ type: "success", title, message }), [addToast]);
  const error = useCallback((title: string, message?: string) => addToast({ type: "error", title, message, duration: 6000 }), [addToast]);
  const warning = useCallback((title: string, message?: string) => addToast({ type: "warning", title, message }), [addToast]);
  const info = useCallback((title: string, message?: string) => addToast({ type: "info", title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss, dismissAll }}>
      {children}
      <div className="fixed bottom-4 left-4 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-none sm:left-auto sm:right-4 sm:max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg bg-surface backdrop-blur-sm",
                styles[t.type]
              )}
            >
              <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{t.title}</p>
                {t.message && <p className="text-xs text-text-muted mt-1">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
