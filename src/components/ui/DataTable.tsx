"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface BulkAction<T = Record<string, unknown>> {
  label: string;
  icon?: ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: "primary" | "secondary" | "danger";
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  rowKey?: keyof T & string;
  loading?: boolean;
  sortable?: boolean;
  defaultSort?: { key: string; direction: SortDirection };
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (items: number) => void;
  };
  bulkActions?: BulkAction<T>[];
  exportable?: boolean;
  onExport?: (format: "csv" | "json" | "xlsx") => void;
  title?: string;
  compact?: boolean;
  striped?: boolean;
  stickyHeader?: boolean;
  footer?: ReactNode;
}

function SkeletonRow({ cols, selectable }: { cols: number; selectable: boolean }) {
  return (
    <tr className="border-b border-border-light animate-pulse">
      {selectable && (
        <td className="px-4 py-3 text-center">
          <div className="h-4 w-4 rounded bg-border mx-auto" />
        </td>
      )}
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-border" style={{ width: `${55 + ((i * 7) % 40)}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "لا توجد بيانات",
  emptyIcon,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  rowKey = "id" as keyof T & string,
  loading = false,
  sortable = false,
  defaultSort,
  pagination,
  bulkActions = [],
  exportable = false,
  onExport,
  title,
  compact = false,
  striped = false,
  stickyHeader = false,
  footer,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSort?.direction ?? null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  );

  const handleSort = useCallback(
    (key: string) => {
      if (!sortable) return;
      if (sortKey === key) {
        if (sortDir === "asc") setSortDir("desc");
        else if (sortDir === "desc") {
          setSortKey(null);
          setSortDir(null);
        }
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortable, sortKey, sortDir]
  );

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === "asc" ? aStr.localeCompare(bStr, "ar") : bStr.localeCompare(aStr, "ar");
    });
  }, [data, sortKey, sortDir]);

  const allSelected = sortedData.length > 0 && sortedData.every((row) => selectedKeys.includes(String(row[rowKey])));
  const someSelected = sortedData.some((row) => selectedKeys.includes(String(row[rowKey])));
  const selectedRows = useMemo(
    () => data.filter((row) => selectedKeys.includes(String(row[rowKey]))),
    [data, selectedKeys, rowKey]
  );

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) onSelectionChange([]);
    else onSelectionChange(sortedData.map((row) => String(row[rowKey])));
  };

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) onSelectionChange(selectedKeys.filter((k) => k !== key));
    else onSelectionChange([...selectedKeys, key]);
  };

  const handleExport = (format: "csv" | "json" | "xlsx") => {
    setShowExportMenu(false);
    if (onExport) {
      onExport(format);
      return;
    }
    const exportData = selectedKeys.length > 0 ? selectedRows : sortedData;
    if (format === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      downloadBlob(blob, "export.json");
    } else if (format === "csv") {
      const headers = visibleColumns.map((c) => c.label).join(",");
      const rows = exportData.map((row) =>
        visibleColumns.map((c) => {
          const val = row[c.key];
          return typeof val === "string" && val.includes(",") ? `"${val}"` : String(val ?? "");
        }).join(",")
      );
      const csv = "\uFEFF" + headers + "\n" + rows.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      downloadBlob(blob, "export.csv");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSortIcon = (key: string) => {
    if (!sortable) return null;
    if (sortKey !== key) return <ArrowUpDown size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortDir === "asc" ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  return (
    <div className="w-full">
      {(title || bulkActions.length > 0 || exportable || selectedKeys.length > 0) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-bg rounded-t-xl">
          <div className="flex items-center gap-3">
            {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
            {selectedKeys.length > 0 && bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-medium">
                  {selectedKeys.length} محدد
                </span>
                {bulkActions.slice(0, 2).map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant || "secondary"}
                    size="sm"
                    icon={action.icon}
                    onClick={() => action.onClick(selectedRows)}
                  >
                    {action.label}
                  </Button>
                ))}
                {bulkActions.length > 2 && (
                  <div className="relative">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<MoreHorizontal size={14} />}
                      onClick={() => setShowBulkMenu(!showBulkMenu)}
                    />
                    {showBulkMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowBulkMenu(false)} />
                        <div className="absolute top-full left-0 mt-1 z-20 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                          {bulkActions.slice(2).map((action, i) => (
                            <button
                              key={i}
                              onClick={() => { action.onClick(selectedRows); setShowBulkMenu(false); }}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors",
                                action.variant === "danger" ? "text-danger" : "text-text"
                              )}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {exportable && (
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  تصدير
                </Button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute top-full right-0 mt-1 z-20 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                      <button onClick={() => handleExport("csv")} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors text-text">
                        تصدير CSV
                      </button>
                      <button onClick={() => handleExport("json")} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors text-text">
                        تصدير JSON
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn("border-b border-border bg-bg", stickyHeader && "sticky top-0 z-10")}>
              {selectable && (
                <th className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "group px-4 py-3 font-medium text-text-secondary whitespace-nowrap transition-colors",
                    col.sortable !== false && sortable && "cursor-pointer hover:text-text select-none",
                    col.align === "left" ? "text-left" : col.align === "center" ? "text-center" : "text-right",
                    col.className
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pagination?.itemsPerPage || 10 }).map((_, i) => (
                <SkeletonRow key={i} cols={visibleColumns.length} selectable={selectable} />
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                  {emptyIcon && <div className="flex justify-center mb-3 text-text-muted">{emptyIcon}</div>}
                  <p className="text-text-muted">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const rowKeyValue = String(row[rowKey]);
                const isSelected = selectedKeys.includes(rowKeyValue);
                return (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border-light last:border-0 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-surface-hover",
                      isSelected && "bg-primary/5",
                      striped && rowIndex % 2 === 1 && "bg-bg/50",
                      compact && "text-xs"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(rowKeyValue)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                    )}
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "text-text whitespace-nowrap",
                          compact ? "px-3 py-2" : "px-4 py-3",
                          col.align === "left" ? "text-left" : col.align === "center" ? "text-center" : "text-right",
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
      </div>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>
              عرض {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>
            <span>من</span>
            <span className="font-medium text-text">{pagination.totalItems.toLocaleString("ar-SA")}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage <= 1}
              className="p-1.5 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1.5 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>

            {(() => {
              const pages: (number | "...")[] = [];
              const total = pagination.totalPages;
              const current = pagination.currentPage;
              if (total <= 7) {
                for (let i = 1; i <= total; i++) pages.push(i);
              } else {
                pages.push(1);
                if (current > 3) pages.push("...");
                for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                  pages.push(i);
                }
                if (current < total - 2) pages.push("...");
                pages.push(total);
              }
              return pages.map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-text-muted">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => pagination.onPageChange(page)}
                    className={cn(
                      "min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors",
                      current === page
                        ? "bg-primary text-white"
                        : "border border-border hover:bg-surface-hover text-text"
                    )}
                  >
                    {page.toLocaleString("ar-SA")}
                  </button>
                )
              );
            })()}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
          </div>

          {pagination.onItemsPerPageChange && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>عناصر في الصفحة:</span>
              <select
                value={pagination.itemsPerPage}
                onChange={(e) => pagination.onItemsPerPageChange!(Number(e.target.value))}
                className="border border-border rounded-lg px-2 py-1 text-sm bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
