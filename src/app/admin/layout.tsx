"use client";

import { ToastProvider } from "@/components/ui/Toast";
import AdminShell from "@/components/admin/AdminShell";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShell>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AdminShell>
    </ToastProvider>
  );
}
