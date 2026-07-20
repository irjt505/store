"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, showDetails: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, showDetails } = this.state;

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="w-full max-w-md bg-surface rounded-xl border border-border p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-light">
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>

            <h2 className="text-xl font-bold text-text">حدث خطأ ما</h2>
            <p className="mt-2 text-sm text-text-secondary">
              حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </p>

            {error && (
              <div className="mt-4">
                <button
                  onClick={this.toggleDetails}
                  className="text-xs text-text-secondary hover:text-text underline underline-offset-2"
                >
                  {showDetails ? "إخفاء التفاصيل" : "عرض تفاصيل الخطأ"}
                </button>
                {showDetails && (
                  <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-bg border border-border p-3 text-start text-xs text-text-secondary">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover active:bg-primary-hover transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </button>
              <a
                href="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-hover transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                العودة للوحة التحكم
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
