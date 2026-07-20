import { useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  const pages = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {totalItems > 0 && (
          <p className="text-sm text-text-secondary whitespace-nowrap">
            عرض {startItem.toLocaleString("ar-SA")}–{endItem.toLocaleString("ar-SA")}{" "}
            من {totalItems.toLocaleString("ar-SA")}
          </p>
        )}

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">
              عناصر في الصفحة
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="h-8 rounded-md border border-border bg-surface px-2 text-sm text-text cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {PER_PAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors duration-150 cursor-pointer",
            "text-text-secondary hover:bg-surface-hover active:bg-surface-active",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex items-center justify-center h-8 w-8 text-sm text-text-muted select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                page === currentPage
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-hover active:bg-surface-active"
              )}
            >
              {page.toLocaleString("ar-SA")}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors duration-150 cursor-pointer",
            "text-text-secondary hover:bg-surface-hover active:bg-surface-active",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
