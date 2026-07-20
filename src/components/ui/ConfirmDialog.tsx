"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          variant === "danger" ? "bg-danger/10" : variant === "warning" ? "bg-warning/10" : "bg-primary/10"
        }`}>
          <AlertTriangle size={24} className={
            variant === "danger" ? "text-danger" : variant === "warning" ? "text-warning" : "text-primary"
          } />
        </div>
        <p className="text-sm text-text-secondary">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant === "primary" ? "primary" : "danger"} fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
