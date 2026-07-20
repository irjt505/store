"use client";

import { useState, useCallback, useMemo } from "react";
import {
  CreditCard,
  RefreshCw,
  Pause,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  User,
  Mail,
  Tag,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate } from "@/lib/utils";

type Subscription = {
  id: string;
  customer: string;
  email: string;
  plan: string;
  price: number;
  interval: "monthly" | "yearly" | "quarterly";
  status: "active" | "cancelled" | "past_due" | "trial";
  startDate: string;
  nextBilling: string;
  totalPaid: number;
};

const mockSubscriptions: Subscription[] = [
  { id: "SUB-001", customer: "أحمد بن محمد", email: "ahmed@example.com", plan: "باقة الاحتراف", price: 99, interval: "monthly", status: "active", startDate: "2024-01-15", nextBilling: "2024-02-15", totalPaid: 1188 },
  { id: "SUB-002", customer: "سارة العلي", email: "sara@example.com", plan: "باقة المؤسسات", price: 499, interval: "yearly", status: "active", startDate: "2023-06-20", nextBilling: "2024-06-20", totalPaid: 499 },
  { id: "SUB-003", customer: "محمد الفهد", email: "mohammed@example.com", plan: "باقة المبتدئين", price: 49, interval: "monthly", status: "cancelled", startDate: "2023-09-10", nextBilling: "-", totalPaid: 196 },
  { id: "SUB-004", customer: "فاطمة الزهراء", email: "fatima@example.com", plan: "باقة الاحتراف", price: 249, interval: "quarterly", status: "active", startDate: "2023-11-01", nextBilling: "2024-02-01", totalPaid: 996 },
  { id: "SUB-005", customer: "خالد العمري", email: "khalid@example.com", plan: "باقة المؤسسات", price: 499, interval: "yearly", status: "past_due", startDate: "2023-03-15", nextBilling: "2024-03-15", totalPaid: 499 },
  { id: "SUB-006", customer: "نورة السعيد", email: "noura@example.com", plan: "باقة المبتدئين", price: 49, interval: "monthly", status: "trial", startDate: "2024-01-20", nextBilling: "2024-02-20", totalPaid: 0 },
  { id: "SUB-007", customer: "عبدالله الحربي", email: "abdullah@example.com", plan: "باقة الاحتراف", price: 99, interval: "monthly", status: "active", startDate: "2023-08-05", nextBilling: "2024-02-05", totalPaid: 594 },
  { id: "SUB-008", customer: "ريم الشمري", email: "reem@example.com", plan: "باقة المؤسسات", price: 249, interval: "quarterly", status: "cancelled", startDate: "2023-04-10", nextBilling: "-", totalPaid: 498 },
  { id: "SUB-009", customer: "ياسر القحطاني", email: "yasser@example.com", plan: "باقة المبتدئين", price: 49, interval: "monthly", status: "active", startDate: "2023-12-01", nextBilling: "2024-02-01", totalPaid: 98 },
  { id: "SUB-010", customer: "هند المطيري", email: "hnd@example.com", plan: "باقة الاحتراف", price: 99, interval: "monthly", status: "past_due", startDate: "2023-07-20", nextBilling: "2024-01-20", totalPaid: 396 },
];

const statusConfig: Record<Subscription["status"], { label: string; variant: "success" | "danger" | "warning" | "info" }> = {
  active: { label: "نشط", variant: "success" },
  cancelled: { label: "ملغي", variant: "danger" },
  past_due: { label: "متأخر الدفع", variant: "warning" },
  trial: { label: "تجريبي", variant: "info" },
};

const intervalLabels: Record<Subscription["interval"], string> = {
  monthly: "شهري",
  yearly: "سنوي",
  quarterly: "ربع سنوي",
};

const intervalFilterOptions = [
  { value: "", label: "جميع الفترات" },
  { value: "monthly", label: "شهري" },
  { value: "yearly", label: "سنوي" },
  { value: "quarterly", label: "ربع سنوي" },
];

const statusFilterOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "active", label: "نشط" },
  { value: "cancelled", label: "ملغي" },
  { value: "past_due", label: "متأخر الدفع" },
  { value: "trial", label: "تجريبي" },
];

export default function SubscriptionsPage() {
  const { success } = useToast();
  const [detailModal, setDetailModal] = useState<Subscription | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);

  const {
    data: subscriptions,
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    selectedIds,
    setSelectedIds,
    sortKey,
    sortDir,
    setSort,
    page,
    setPage,
    perPage,
    setPerPage,
    update,
    remove,
    removeMany,
    totalItems,
    totalPages,
  } = useCrud<Subscription>({
    initialData: mockSubscriptions,
    searchFields: ["customer", "email", "plan", "id"],
    itemsPerPage: 8,
    defaultSortKey: "startDate",
    defaultSortDir: "desc",
  });

  const activeCount = useMemo(() => subscriptions.filter((s) => s.status === "active").length, [subscriptions]);
  const cancelledCount = useMemo(() => subscriptions.filter((s) => s.status === "cancelled").length, [subscriptions]);
  const mrr = useMemo(() =>
    subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => {
        if (s.interval === "monthly") return sum + s.price;
        if (s.interval === "quarterly") return sum + s.price / 3;
        return sum + s.price / 12;
      }, 0),
    [subscriptions]
  );

  const handleConfirmCancel = useCallback(() => {
    if (!cancelTarget) return;
    update(cancelTarget.id, { status: "cancelled", nextBilling: "-" });
    success("تم الإلغاء", `تم إلغاء اشتراك "${cancelTarget.customer}" بنجاح`);
    setCancelTarget(null);
  }, [cancelTarget, update, success]);

  const handleBulkCancel = useCallback(() => {
    selectedIds.forEach((id) => update(id, { status: "cancelled", nextBilling: "-" }));
    success("تم الإلغاء", `تم إلغاء ${selectedIds.length} اشتراك بنجاح`);
    setSelectedIds([]);
  }, [selectedIds, update, success, setSelectedIds]);

  const handleBulkDelete = useCallback(() => {
    removeMany(selectedIds);
    success("تم الحذف", `تم حذف ${selectedIds.length} اشتراك بنجاح`);
    setSelectedIds([]);
  }, [selectedIds, removeMany, success, setSelectedIds]);

  const columns = useMemo(() => [
    {
      key: "customer" as const,
      label: "العميل",
      sortable: true,
      render: (value: unknown, row: Subscription) => (
        <div className="flex flex-col">
          <span className="font-medium text-text">{String(value)}</span>
          <span className="text-xs text-text-muted">{row.email}</span>
        </div>
      ),
    },
    { key: "plan" as const, label: "الباقة", sortable: true, render: (value: unknown) => <span className="font-medium">{String(value)}</span> },
    { key: "price" as const, label: "السعر", sortable: true, render: (value: unknown) => <span className="font-semibold">{formatCurrency(Number(value))}</span> },
    {
      key: "interval" as const,
      label: "الفترة",
      sortable: true,
      render: (value: unknown) => <Badge variant="default">{intervalLabels[value as Subscription["interval"]]}</Badge>,
    },
    {
      key: "status" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown) => {
        const config = statusConfig[value as Subscription["status"]];
        return <Badge variant={config.variant} dot>{config.label}</Badge>;
      },
    },
    {
      key: "nextBilling" as const,
      label: "الفاتورة القادمة",
      sortable: true,
      render: (value: unknown) =>
        String(value) === "-" ? <span className="text-text-muted">-</span> : <span>{formatDate(String(value))}</span>,
    },
    { key: "totalPaid" as const, label: "إجمالي المدفوع", sortable: true, render: (value: unknown) => <span className="font-semibold">{formatCurrency(Number(value))}</span> },
    {
      key: "id" as const,
      label: "الإجراءات",
      className: "w-24",
      render: (_value: unknown, row: Subscription) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setDetailModal(row)} />
          {row.status !== "cancelled" && (
            <Button variant="ghost" size="sm" icon={<XCircle size={14} />} className="text-danger hover:text-danger" onClick={() => setCancelTarget(row)} />
          )}
        </div>
      ),
    },
  ], []);

  const bulkActions = [
    { label: "إلغاء المحدد", icon: <XCircle size={14} />, onClick: handleBulkCancel, variant: "danger" as const },
    { label: "حذف المحدد", onClick: handleBulkDelete, variant: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="الاشتراكات" subtitle="إدارة اشتراكات المنتجات الرقمية والفواتير الدورية" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CreditCard size={20} />} label="إجمالي الاشتراكات" value={totalItems.toLocaleString("ar-SA")} change="" changeType="up" color="primary" />
        <StatCard icon={<RefreshCw size={20} />} label="الاشتراكات النشطة" value={activeCount.toLocaleString("ar-SA")} change="" changeType="up" color="success" />
        <StatCard icon={<Pause size={20} />} label="الملغاة" value={cancelledCount.toLocaleString("ar-SA")} change="" changeType="up" color="danger" />
        <StatCard icon={<DollarSign size={20} />} label="الإيراد الشهري المتكرر" value={formatCurrency(Math.round(mrr))} change="" changeType="up" color="info" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالاسم أو البريد أو الباقة أو الرقم..." value={search} onChange={setSearch} className="w-80" />
        <Select options={intervalFilterOptions} value={filters.interval || ""} onChange={(e) => setFilter("interval", e.target.value)} />
        <Select options={statusFilterOptions} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        selectable
        selectedKeys={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyMessage="لا توجد اشتراكات"
        rowKey="id"
        sortable
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: perPage,
          onPageChange: setPage,
          onItemsPerPageChange: setPerPage,
        }}
        bulkActions={bulkActions}
        title="الاشتراكات"
        striped
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="تأكيد إلغاء الاشتراك"
        message={`هل أنت متأكد من إلغاء اشتراك "${cancelTarget?.customer}" في الباقة "${cancelTarget?.plan}"؟ سيتم إلغاء الاشتراك فوراً.`}
        confirmLabel="نعم، إلغاء الاشتراك"
        cancelLabel="تراجع"
        variant="danger"
      />

      {detailModal && (
        <Modal open onClose={() => setDetailModal(null)} title="تفاصيل الاشتراك" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <User size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">العميل</p><p className="text-sm font-medium text-text">{detailModal.customer}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Mail size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">البريد الإلكتروني</p><p className="text-sm font-medium text-text">{detailModal.email}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Tag size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">رقم الاشتراك</p><p className="text-sm font-medium text-primary">{detailModal.id}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <CreditCard size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">الباقة</p><p className="text-sm font-medium text-text">{detailModal.plan}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <DollarSign size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">السعر</p><p className="text-sm font-semibold text-text">{formatCurrency(detailModal.price)}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <RefreshCw size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">الفترة</p><p className="text-sm font-medium text-text">{intervalLabels[detailModal.interval]}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Calendar size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">تاريخ البدء</p><p className="text-sm font-medium text-text">{formatDate(detailModal.startDate)}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Clock size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">الفاتورة القادمة</p><p className="text-sm font-medium text-text">{detailModal.nextBilling === "-" ? "-" : formatDate(detailModal.nextBilling)}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-text-muted" /><span className="text-sm text-text-secondary">إجمالي المدفوع</span></div>
              <span className="text-lg font-bold text-text">{formatCurrency(detailModal.totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">الحالة:</span>
                <Badge variant={statusConfig[detailModal.status].variant} dot>{statusConfig[detailModal.status].label}</Badge>
              </div>
              {detailModal.status !== "cancelled" && (
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => { setDetailModal(null); setCancelTarget(detailModal); }}>إلغاء الاشتراك</Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
