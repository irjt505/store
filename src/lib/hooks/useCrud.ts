"use client";

import { useState, useMemo, useCallback } from "react";

interface UseCrudOptions<T extends Record<string, unknown>> {
  initialData: T[];
  searchFields?: (keyof T & string)[];
  itemsPerPage?: number;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
}

interface UseCrudReturn<T extends Record<string, unknown>> {
  data: T[];
  filteredData: T[];
  paginatedData: T[];
  search: string;
  setSearch: (s: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  sortKey: string | null;
  sortDir: "asc" | "desc" | null;
  setSort: (key: string, dir: "asc" | "desc" | null) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  add: (item: T) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => T | undefined;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isAllSelected: boolean;
}

export function useCrud<T extends Record<string, unknown>>({
  initialData,
  searchFields = [],
  itemsPerPage = 10,
  defaultSortKey,
  defaultSortDir = "asc",
}: UseCrudOptions<T>): UseCrudReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(defaultSortDir);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let result = data;

    if (search && searchFields.length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return val != null && String(val).toLowerCase().includes(lowerSearch);
        })
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => String(item[key]) === value);
      }
    });

    if (sortKey && sortDir) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal), "ar");
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchFields, filters, sortKey, sortDir]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, currentPage, perPage]);

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((item) => selectedIds.includes(String(item.id)));

  const setSort = useCallback((key: string, dir: "asc" | "desc" | null) => {
    setSortKey(key);
    setSortDir(dir);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (!value) delete next[key];
      return next;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearch("");
    setPage(1);
  }, []);

  const add = useCallback((item: T) => {
    setData((prev) => [item, ...prev]);
    setPage(1);
  }, []);

  const update = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) => prev.map((item) => (String(item.id) === id ? { ...item, ...updates } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => String(item.id) !== id));
    setSelectedIds((prev) => prev.filter((k) => k !== id));
  }, []);

  const removeMany = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setData((prev) => prev.filter((item) => !idSet.has(String(item.id))));
    setSelectedIds((prev) => prev.filter((k) => !idSet.has(k)));
  }, []);

  const getById = useCallback((id: string) => data.find((item) => String(item.id) === id), [data]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(paginatedData.map((item) => String(item.id)));
  }, [paginatedData]);

  const deselectAll = useCallback(() => setSelectedIds([]), []);

  return {
    data,
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    sortKey,
    sortDir,
    setSort,
    page: currentPage,
    setPage,
    perPage,
    setPerPage,
    selectedIds,
    setSelectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    add,
    update,
    remove,
    removeMany,
    getById,
    totalItems,
    totalPages,
    currentPage,
    isAllSelected,
  };
}
