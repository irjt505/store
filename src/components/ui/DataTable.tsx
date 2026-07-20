"use client";

import { useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, MoreHorizontal } from "lucide-react";
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

const skeletonWidths = [
  [80, 60, 45, 70, 55],
  [55, 75, 60, 40, 80],
  [70, 50, 80, 55, 45],
  [45, 65, 55, 75, 60],
  [80, 40, 70, 65, 50],
];

function SkeletonRow({
  cols,
  selectable,
  rowIndex,
}: {
  cols: number;
  selectable: boolean;
  rowIndex: number;
}) {
  const widths = skeletonWidths[rowIndex % skeletonWidths.length];
  return (
    <tr className="border-b border-border-light">
      {selectable && (
        <td className="px-4 py-3 text-center w-12">
          <div className="h-4 w-4 rounded bg-border mx-auto animate-shimmer" />
        </td>
      )}
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded bg-border animate-shimmer"
            style={{ width: `${widths[i % widths.length]}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

function CustomCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex items-center justify-center size-4 rounded border transition-colors cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        checked || indeterminate
          ? "bg-primary border-primary"
          : "border-border bg-surface hover:border-primary/50"
      )}
    >
      {(checked || indeterminate) && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          {indeterminate ? (
            <rect x="2" y="4" width="6" height="1.5" rx="0.5" fill="white" />
          ) : (
            <path
              d="M2.5 5.5L4.5 7.5L7.5 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      )}
    </button>
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
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    if (!showExportMenu && !showBulkMenu) return;
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node)) {
        setShowBulkMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showExportMenu, showBulkMenu]);

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

  const allSelected =
    sortedData.length > 0 &&
    sortedData.every((row) => selectedKeys.includes(String(row[rowKey])));
  const someSelected =
    sortedData.some((row) => selectedKeys.includes(String(row[rowKey]))) && !allSelected;
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
    if (selectedKeys.includes(key))
      onSelectionChange(selectedKeys.filter((k) => k !== key));
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
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      downloadBlob(blob, "export.json");
    } else if (format === "csv") {
      const headers = visibleColumns.map((c) => c.label).join(",");
      const rows = exportData.map((row) =>
        visibleColumns
          .map((c) => {
            const val = row[c.key];
            return typeof val === "string" && val.includes(",")
              ? `"${val}"`
              : String(val ?? "");
          })
          .join(",")
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
    if (sortKey !== key)
      return (
        <ArrowUpDown
          size={14}
          className="text-text-muted opacity-0 group-hover/col:opacity-100 transition-opacity"
        />
      );
    return sortDir === "asc" ? (
      <ArrowUp size={14} className="text-primary" />
    ) : (
      <ArrowDown size={14} className="text-primary" />
    );
  };

  const showToolbar =
    title || bulkActions.length > 0 || exportable || selectedKeys.length > 0;

  return (
    <div className="w-full">
      {showToolbar && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-bg rounded-t-xl">
          <div className="flex items-center gap-3 min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-text truncate">
                {title}
              </h3>
            )}
            {selectedKeys.length > 0 && bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-medium whitespace-nowrap">
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
                  <div ref={bulkMenuRef} className="relative">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<MoreHorizontal size={14} />}
                      onClick={() => setShowBulkMenu(!showBulkMenu)}
                    />
                    {showBulkMenu && (
                      <div
                        role="menu"
                        className="absolute top-full start-0 mt-1 z-20 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[160px] animate-fade-in"
                      >
                        {bulkActions.slice(2).map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              action.onClick(selectedRows);
                              setShowBulkMenu(false);
                            }}
                            className={cn(
                              "flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors",
                              action.variant === "danger"
                                ? "text-danger"
                                : "text-text"
                            )}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {exportable && (
              <div ref={exportMenuRef} className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  تصدير
                </Button>
                {showExportMenu && (
                  <div
                    role="menu"
                    className="absolute top-full end-0 mt-1 z-20 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[140px] animate-fade-in"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleExport("csv")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors text-text"
                    >
                      تصدير CSV
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleExport("json")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-surface-hover transition-colors text-text"
                    >
                      تصدير JSON
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn(
                "border-b border-border bg-bg",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
              {selectable && (
                <th className="px-4 py-3 text-center w-12">
                  <CustomCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    ariaLabel="تحديد الكل"
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "group/col px-4 py-3 font-medium text-text-secondary whitespace-nowrap transition-colors",
                    col.sortable !== false &&
                      sortable &&
                      "cursor-pointer hover:text-text select-none",
                    col.align === "left"
                      ? "text-left"
                      : col.align === "center"
                        ? "text-center"
                        : "text-right",
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
              Array.from({ length: pagination?.itemsPerPage || 5 }).map(
                (_, i) => (
                  <SkeletonRow
                    key={i}
                    cols={visibleColumns.length}
                    selectable={selectable}
                    rowIndex={i}
                  />
                )
              )
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-4 py-20 text-center"
                >
                  {emptyIcon && (
                    <div className="flex justify-center mb-3 text-text-muted">
                      {emptyIcon}
                    </div>
                  )}
                  <p className="text-text-muted text-sm">{emptyMessage}</p>
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
                      striped && rowIndex % 2 === 1 && "bg-bg/30",
                      compact && "text-xs"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3 text-center">
                        <CustomCheckbox
                          checked={isSelected}
                          onChange={() => toggleRow(rowKeyValue)}
                          ariaLabel={`تحديد الصف ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "text-text whitespace-nowrap",
                          compact ? "px-3 py-2" : "px-4 py-3",
                          col.align === "left"
                            ? "text-left"
                            : col.align === "center"
                              ? "text-center"
                              : "text-right",
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

        {footer && (
          <div className="border-t border-border px-4 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
