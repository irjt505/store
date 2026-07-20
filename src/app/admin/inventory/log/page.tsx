"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpCircle, ArrowDownCircle, ShoppingCart, RotateCcw, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime } from "@/lib/utils";

type MovementType = "add" | "remove" | "order" | "return";

type StockMovement = {
  id: string;
  date: string;
  product: string;
  productId: string;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  staffMember: string;
  note: string;
};

const movementTypeLabels: Record<MovementType, string> = {
  add: "إضافة",
  remove: "خصم",
  order: "طلب",
  return: "مرتجع",
};

const movementTypeBadgeVariant: Record<MovementType, "success" | "danger" | "info" | "warning"> = {
  add: "success",
  remove: "danger",
  order: "info",
  return: "warning",
};

const movementTypeIcon: Record<MovementType, typeof ArrowUpCircle> = {
  add: ArrowUpCircle,
  remove: ArrowDownCircle,
  order: ShoppingCart,
  return: RotateCcw,
};

const initialMovements: StockMovement[] = [
  { id: "1", date: "2024-04-15T10:30:00", product: "قميص رجالي قطني", productId: "1", type: "add", quantity: 50, balanceAfter: 250, staffMember: "أحمد محمد", note: "إعادة تعبئة من المورد" },
  { id: "2", date: "2024-04-15T09:15:00", product: "حذاء رياضي آير ماكس", productId: "2", type: "order", quantity: -3, balanceAfter: 85, staffMember: "نظام الطلب", note: "طلب #1234" },
  { id: "3", date: "2024-04-14T16:45:00", product: "سماعات لاسلكية بلوتوث", productId: "3", type: "order", quantity: -2, balanceAfter: 0, staffMember: "نظام الطلب", note: "طلب #1235 - نفد المخزون" },
  { id: "4", date: "2024-04-14T14:20:00", product: "أكواد PlayStation 5", productId: "6", type: "add", quantity: 100, balanceAfter: 135, staffMember: "سارة أحمد", note: "شحنة أكواد جديدة" },
  { id: "5", date: "2024-04-14T11:00:00", product: "قميص رجالي قطني", productId: "1", type: "return", quantity: 5, balanceAfter: 200, staffMember: "نظام المرتجعات", note: "مرتجع من العميل - طلب #1200" },
  { id: "6", date: "2024-04-13T15:30:00", product: "وجبة دجاج مشوي", productId: "7", type: "remove", quantity: -10, balanceAfter: 30, staffMember: "خالد العلي", note: "تلف due to expiry" },
  { id: "7", date: "2024-04-13T10:00:00", product: "حزمة المطور الشاملة", productId: "5", type: "order", quantity: -1, balanceAfter: 500, staffMember: "نظام الطلب", note: "طلب #1230" },
  { id: "8", date: "2024-04-12T13:45:00", product: "وجبة سushi يابانية", productId: "8", type: "add", quantity: 20, balanceAfter: 25, staffMember: "محمد سعيد", note: "restock طازج" },
  { id: "9", date: "2024-04-12T09:30:00", product: "ساعة يد كلاسيكية", productId: "4", type: "return", quantity: 2, balanceAfter: 12, staffMember: "نظام المرتجعات", note: "مرتجع - حجم خاطئ" },
  { id: "10", date: "2024-04-11T16:00:00", product: "حجز موعد استشارة قانونية", productId: "9", type: "order", quantity: -1, balanceAfter: 10, staffMember: "نظام الحجوزات", note: "حجز #500" },
  { id: "11", date: "2024-04-11T11:15:00", product: "套件 تطوير React", productId: "10", type: "remove", quantity: -5, balanceAfter: 0, staffMember: "علي حسن", note: "تلف أقراص" },
  { id: "12", date: "2024-04-10T14:00:00", product: "أكواد PlayStation 5", productId: "6", type: "order", quantity: -15, balanceAfter: 35, staffMember: "نظام الطلب", note: "طلبات متعددة" },
];

const typeFilterOptions = [
  { value: "", label: "جميع الأنواع" },
  { value: "add", label: "إضافة" },
  { value: "remove", label: "خصم" },
  { value: "order", label: "طلب" },
  { value: "return", label: "مرتجع" },
];

export default function InventoryLogPage() {
  const { success } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    data: movements,
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    sortDir,
    setSort,
    page,
    setPage,
    perPage,
    setPerPage,
    totalItems,
    totalPages,
  } = useCrud<StockMovement>({
    initialData: initialMovements,
    searchFields: ["product", "staffMember", "note"],
    itemsPerPage: 10,
    defaultSortKey: "date",
    defaultSortDir: "desc",
  });

  const filteredByDate = useMemo(() => {
    let result = paginatedData;
    if (dateFrom) {
      result = result.filter((m) => new Date(m.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((m) => new Date(m.date) <= new Date(dateTo + "T23:59:59"));
    }
    return result;
  }, [paginatedData, dateFrom, dateTo]);

  const stats = useMemo(() => ({
    adds: movements.filter((m) => m.type === "add").reduce((s, m) => s + m.quantity, 0),
    removes: movements.filter((m) => m.type === "remove").reduce((s, m) => s + Math.abs(m.quantity), 0),
    orders: movements.filter((m) => m.type === "order").reduce((s, m) => s + Math.abs(m.quantity), 0),
    returns: movements.filter((m) => m.type === "return").reduce((s, m) => s + m.quantity, 0),
  }), [movements]);

  const columns = useMemo(
    () => [
      {
        key: "date" as const,
        label: "التاريخ والوقت",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm">{formatDateTime(String(value))}</span>
        ),
      },
      {
        key: "product" as const,
        label: "المنتج",
        sortable: true,
        render: (_: unknown, row: StockMovement) => (
          <div>
            <p className="font-medium text-text">{row.product}</p>
          </div>
        ),
      },
      {
        key: "type" as const,
        label: "نوع الحركة",
        sortable: true,
        render: (value: unknown) => {
          const type = value as MovementType;
          const Icon = movementTypeIcon[type];
          return (
            <Badge variant={movementTypeBadgeVariant[type]} className="gap-1">
              <Icon size={12} />
              {movementTypeLabels[type]}
            </Badge>
          );
        },
      },
      {
        key: "quantity" as const,
        label: "الكمية",
        sortable: true,
        render: (value: unknown) => {
          const qty = Number(value);
          return (
            <span className={`font-bold ${qty > 0 ? "text-success" : "text-danger"}`}>
              {qty > 0 ? `+${qty}` : qty}
            </span>
          );
        },
      },
      {
        key: "balanceAfter" as const,
        label: "الرصيد بعد الحركة",
        sortable: true,
        render: (value: unknown) => (
          <span className="font-semibold">{Number(value).toLocaleString("ar")}</span>
        ),
      },
      { key: "staffMember" as const, label: "الموظف", sortable: true },
      {
        key: "note" as const,
        label: "الملاحظة",
        render: (value: unknown) => (
          <span className="text-text-muted text-sm max-w-[200px] truncate block">{String(value)}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="سجل حركات المخزون"
        subtitle="تتبع جميع حركات الإضافة والخصم والمرتجعات"
        actions={
          <Link href="/admin/inventory">
            <Button variant="ghost" icon={<ArrowRight size={16} />}>
              العودة للمخزون
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ArrowUpCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats.adds.toLocaleString("ar")}</p>
              <p className="text-xs text-text-muted">إجمالي الإضافات</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
              <ArrowDownCircle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">{stats.removes.toLocaleString("ar")}</p>
              <p className="text-xs text-text-muted">إجمالي الخصومات</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <ShoppingCart size={20} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{stats.orders.toLocaleString("ar")}</p>
              <p className="text-xs text-text-muted">مبيعات (طلبات)</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <RotateCcw size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{stats.returns.toLocaleString("ar")}</p>
              <p className="text-xs text-text-muted">المرتجعات</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالمنتج، الموظف، الملاحظة..." value={search} onChange={setSearch} className="w-72" />
        <Select
          options={typeFilterOptions}
          value={filters.type || ""}
          onChange={(e) => setFilter("type", e.target.value)}
        />
        <Input
          type="date"
          label="من تاريخ"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          type="date"
          label="إلى تاريخ"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredByDate}
        emptyMessage="لا توجد حركات مخزون"
        emptyIcon={<Package size={48} />}
        sortable
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: perPage,
          onPageChange: setPage,
          onItemsPerPageChange: setPerPage,
        }}
        exportable
        title={`سجل الحركات (${totalItems})`}
        striped
      />
    </div>
  );
}
