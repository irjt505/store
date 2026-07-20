"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Pencil,
  Printer,
  StickyNote,
  Plus,
  Download,
  Filter,
  ShoppingCart,
  Banknote,
  ArrowUpDown,
  FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate } from "@/lib/utils";

type OrderStatus = "review" | "processing" | "shipping" | "delivered" | "completed" | "cancelled" | "returned";
type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
type OrderSource = "online" | "phone" | "walk-in";

type Order = {
  id: string;
  number: string;
  customer: string;
  customerAvatar?: string;
  email: string;
  phone: string;
  date: string;
  items: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  source: OrderSource;
  shippingAddress?: string;
  notes?: string;
};

const mockOrders: Order[] = [
  { id: "1", number: "#1001", customer: "أحمد بن محمد", email: "ahmed@example.com", phone: "+966501234567", date: "2025-07-20", items: 5, total: 2450, paymentStatus: "paid", status: "completed", source: "online", shippingAddress: "الرياض، حي النسيم، شارع الأمير سلطان 45" },
  { id: "2", number: "#1002", customer: "سارة العلي", email: "sara@example.com", phone: "+966509876543", date: "2025-07-20", items: 2, total: 890, paymentStatus: "paid", status: "shipping", source: "online", shippingAddress: "جدة، حي الروضة، شارع فلسطين 12" },
  { id: "3", number: "#1003", customer: "محمد الفهد", email: "mohammed@example.com", phone: "+966505551234", date: "2025-07-19", items: 8, total: 3200, paymentStatus: "pending", status: "review", source: "phone" },
  { id: "4", number: "#1004", customer: "فاطمة الزهراء", email: "fatima@example.com", phone: "+966507778899", date: "2025-07-19", items: 3, total: 1560, paymentStatus: "paid", status: "processing", source: "online", shippingAddress: "الدمام، حي الفيصلية، شارع الملك فهد 78" },
  { id: "5", number: "#1005", customer: "خالد العمري", email: "khalid@example.com", phone: "+966502223344", date: "2025-07-18", items: 1, total: 750, paymentStatus: "failed", status: "cancelled", source: "online" },
  { id: "6", number: "#1006", customer: "نورة السعيد", email: "noura@example.com", phone: "+966504445566", date: "2025-07-18", items: 6, total: 4100, paymentStatus: "paid", status: "shipping", source: "walk-in" },
  { id: "7", number: "#1007", customer: "عبدالله الحربي", email: "abdullah@example.com", phone: "+966506667788", date: "2025-07-17", items: 2, total: 680, paymentStatus: "paid", status: "completed", source: "online", shippingAddress: "الخبر، حي العليا، شارع التحلية 33" },
  { id: "8", number: "#1008", customer: "ريم الشمري", email: "reem@example.com", phone: "+966508889900", date: "2025-07-17", items: 4, total: 2100, paymentStatus: "refunded", status: "returned", source: "phone", shippingAddress: "القطيف، حي الصالحية، شارع الأمير سلطان 90" },
  { id: "9", number: "#1009", customer: "ياسر القحطاني", email: "yasser@example.com", phone: "+966501112233", date: "2025-07-16", items: 3, total: 1850, paymentStatus: "pending", status: "review", source: "online", shippingAddress: "الظهران، حي الظهران، شارع الظهران 55" },
  { id: "10", number: "#1010", customer: "هند المطيري", email: "hind@example.com", phone: "+966503334455", date: "2025-07-16", items: 7, total: 3400, paymentStatus: "paid", status: "delivered", source: "online", shippingAddress: "الرياض، حي الملقا، شارع أنس بن مالك 21" },
  { id: "11", number: "#1011", customer: " Saud الدوسري", email: "saud@example.com", phone: "+966505556677", date: "2025-07-15", items: 2, total: 520, paymentStatus: "paid", status: "completed", source: "walk-in" },
  { id: "12", number: "#1012", customer: "منال العنزي", email: "manal@example.com", phone: "+966507778811", date: "2025-07-15", items: 5, total: 2890, paymentStatus: "paid", status: "completed", source: "online", shippingAddress: "مكة المكرمة، حي العزيزية، شارع المسجد الحرام 100" },
  { id: "13", number: "#1013", customer: "طارق البكري", email: "tariq@example.com", phone: "+966509990011", date: "2025-07-14", items: 1, total: 350, paymentStatus: "pending", status: "review", source: "phone" },
  { id: "14", number: "#1014", customer: "دانة السويلم", email: "dana@example.com", phone: "+966501122334", date: "2025-07-14", items: 4, total: 1780, paymentStatus: "paid", status: "processing", source: "online", shippingAddress: "المدينة المنورة، حي قباء، شارع قباء 67" },
  { id: "15", number: "#1015", customer: "حسن الجابري", email: "hassan@example.com", phone: "+966505566778", date: "2025-07-13", items: 3, total: 950, paymentStatus: "refunded", status: "cancelled", source: "online" },
  { id: "16", number: "#1016", customer: "لطيفة الحارثي", email: "latifa@example.com", phone: "+966503344556", date: "2025-07-13", items: 6, total: 5200, paymentStatus: "paid", status: "shipping", source: "online", shippingAddress: "أبها، حي السوادي، شارع الأمير سلطان 44" },
  { id: "17", number: "#1017", customer: "ماجد الصقر", email: "majed@example.com", phone: "+966507788990", date: "2025-07-12", items: 2, total: 680, paymentStatus: "paid", status: "delivered", source: "phone", shippingAddress: "بريدة، حي العارض، شارع الملك فهد 12" },
];

const statusConfig: Record<OrderStatus, { label: string; variant: "warning" | "info" | "success" | "danger" | "default" | "purple" }> = {
  review: { label: "قيد المراجعة", variant: "warning" },
  processing: { label: "قيد التنفيذ", variant: "purple" },
  shipping: { label: "قيد الشحن", variant: "info" },
  delivered: { label: "تم التوصيل", variant: "success" },
  completed: { label: "مكتمل", variant: "success" },
  cancelled: { label: "ملغي", variant: "danger" },
  returned: { label: "مرتجع", variant: "default" },
};

const paymentConfig: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  paid: { label: "مدفوع", variant: "success" },
  pending: { label: "قيد الانتظار", variant: "warning" },
  failed: { label: "فشل", variant: "danger" },
  refunded: { label: "مسترد", variant: "default" },
};

const sourceConfig: Record<OrderSource, { label: string }> = {
  online: { label: "موقع إلكتروني" },
  phone: { label: "هاتف" },
  "walk-in": { label: "زبون مباشرة" },
};

const statusOptions = [
  { value: "review", label: "قيد المراجعة" },
  { value: "processing", label: "قيد التنفيذ" },
  { value: "shipping", label: "قيد الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
  { value: "returned", label: "مرتجع" },
];

const paymentOptions = [
  { value: "paid", label: "مدفوع" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "failed", label: "فشل" },
  { value: "refunded", label: "مسترد" },
];

const sourceOptions = [
  { value: "online", label: "موقع إلكتروني" },
  { value: "phone", label: "هاتف" },
  { value: "walk-in", label: "زبون مباشرة" },
];

const tabList = [
  { key: "all", label: "الكل", icon: <Package size={16} /> },
  { key: "review", label: "قيد المراجعة", icon: <Clock size={16} /> },
  { key: "processing", label: "قيد التنفيذ", icon: <FileCheck size={16} /> },
  { key: "shipping", label: "قيد الشحن", icon: <Truck size={16} /> },
  { key: "delivered", label: "تم التوصيل", icon: <CheckCircle size={16} /> },
  { key: "completed", label: "مكتمل", icon: <CheckCircle size={16} /> },
  { key: "cancelled", label: "ملغي", icon: <XCircle size={16} /> },
  { key: "returned", label: "مرتجع", icon: <RotateCcw size={16} /> },
];

export default function OrdersPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>("review");
  const [editPayment, setEditPayment] = useState<PaymentStatus>("pending");
  const [noteOrder, setNoteOrder] = useState<Order | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("review");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    data: orders,
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    page,
    setPage,
    perPage,
    setPerPage,
    update,
    totalItems,
    totalPages,
  } = useCrud<Order>({
    initialData: mockOrders,
    searchFields: ["number", "customer", "email"],
    itemsPerPage: 10,
    defaultSortKey: "date",
    defaultSortDir: "desc",
  });

  const handleTabChange = useCallback((tab: string) => {
    setFilter("status", tab === "all" ? "" : tab);
  }, [setFilter]);

  const handleUpdateStatus = useCallback(() => {
    if (!editOrder) return;
    update(editOrder.id, { status: editStatus, paymentStatus: editPayment });
    success("تم التحديث", `تم تحديث حالة الطلب ${editOrder.number} بنجاح`);
    setEditOrder(null);
  }, [editOrder, editStatus, editPayment, update, success]);

  const handleAddNote = useCallback(() => {
    if (!noteOrder || !noteText.trim()) {
      showError("خطأ", "يرجى كتابة ملاحظة");
      return;
    }
    update(noteOrder.id, { notes: noteText.trim() });
    success("تمت الإضافة", "تم إضافة الملاحظة بنجاح");
    setNoteOrder(null);
    setNoteText("");
  }, [noteOrder, noteText, update, success, showError]);

  const handlePrintInvoice = useCallback((order: Order) => {
    success("جاري الطباعة", `جاري طباعة فاتورة الطلب ${order.number}`);
  }, [success]);

  const handleBulkStatusChange = useCallback(() => {
    selectedKeys.forEach((id) => {
      update(id, { status: bulkStatus });
    });
    success("تم التحديث", `تم تحديث حالة ${selectedKeys.length} طلب بنجاح`);
    setSelectedKeys([]);
    setBulkStatusModal(false);
  }, [selectedKeys, bulkStatus, update, success]);

  const handleExport = useCallback(() => {
    const dataToExport = selectedKeys.length > 0
      ? orders.filter((o) => selectedKeys.includes(o.id))
      : filteredData;
    const csv = [
      "رقم الطلب,العميل,التاريخ,المنتجات,المجموع,حالة الدفع,حالة الطلب,المصدر",
      ...dataToExport.map((o) =>
        `${o.number},${o.customer},${o.date},${o.items},${o.total},${paymentConfig[o.paymentStatus].label},${statusConfig[o.status].label},${sourceConfig[o.source].label}`
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("تم التصدير", "تم تصدير البيانات بنجاح");
  }, [selectedKeys, orders, filteredData, success]);

  const totalProcessing = useMemo(() => orders.filter((o) => o.status === "processing" || o.status === "review").length, [orders]);
  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return orders.filter((o) => o.date === today && o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  }, [orders]);
  const avgOrder = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === "paid");
    return paid.length > 0 ? paid.reduce((s, o) => s + o.total, 0) / paid.length : 0;
  }, [orders]);

  const columns = useMemo(() => [
    {
      key: "number" as const,
      label: "رقم الطلب",
      sortable: true,
      render: (_value: unknown, row: Order) => (
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${row.id}`); }}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          {row.number}
        </button>
      ),
    },
    {
      key: "customer" as const,
      label: "العميل",
      sortable: true,
      render: (_value: unknown, row: Order) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.customer} size="sm" src={row.customerAvatar} />
          <span>{row.customer}</span>
        </div>
      ),
    },
    {
      key: "date" as const,
      label: "التاريخ",
      sortable: true,
      render: (value: unknown) => formatDate(String(value)),
    },
    {
      key: "items" as const,
      label: "المنتجات",
      sortable: true,
      render: (value: unknown) => (
        <Badge variant="info">{String(value)} منتج</Badge>
      ),
    },
    {
      key: "total" as const,
      label: "المجموع",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: "paymentStatus" as const,
      label: "الدفع",
      sortable: true,
      render: (value: unknown) => {
        const config = paymentConfig[value as PaymentStatus];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "status" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown) => {
        const config = statusConfig[value as OrderStatus];
        return <Badge variant={config.variant} dot>{config.label}</Badge>;
      },
    },
    {
      key: "source" as const,
      label: "المصدر",
      sortable: true,
      render: (value: unknown) => {
        const config = sourceConfig[value as OrderSource];
        return <span className="text-sm text-text-secondary">{config.label}</span>;
      },
    },
    {
      key: "actions" as const,
      label: "الإجراءات",
      className: "w-32",
      render: (_value: unknown, row: Order) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${row.id}`); }} />
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={(e) => {
            e.stopPropagation();
            setEditOrder(row);
            setEditStatus(row.status);
            setEditPayment(row.paymentStatus);
          }} />
          <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={(e) => { e.stopPropagation(); handlePrintInvoice(row); }} />
          <Button variant="ghost" size="sm" icon={<StickyNote size={14} />} onClick={(e) => { e.stopPropagation(); setNoteOrder(row); setNoteText(row.notes || ""); }} />
        </div>
      ),
    },
  ], [router, handlePrintInvoice]);

  const bulkActions = useMemo(() => [
    {
      label: "تغيير الحالة",
      icon: <ArrowUpDown size={14} />,
      onClick: () => setBulkStatusModal(true),
    },
    {
      label: "تصدير",
      icon: <Download size={14} />,
      onClick: handleExport,
    },
  ], [handleExport]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الطلبات"
        subtitle="إدارة الطلبات والمبيعات"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => router.push("/admin/orders/new")}>
            طلب جديد
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package size={20} />} label="إجمالي الطلبات" value={totalItems.toLocaleString("ar")} change="" changeType="up" color="primary" />
        <StatCard icon={<Clock size={20} />} label="قيد التنفيذ" value={totalProcessing.toLocaleString("ar")} change="" changeType="up" color="warning" />
        <StatCard icon={<Banknote size={20} />} label="الإيرادات اليومية" value={formatCurrency(todayRevenue)} change="" changeType="up" color="success" />
        <StatCard icon={<ShoppingCart size={20} />} label="متوسط الطلب" value={formatCurrency(avgOrder)} change="" changeType="up" color="info" />
      </div>

      <Tabs tabs={tabList} onChange={handleTabChange}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput placeholder="بحث برقم الطلب أو اسم العميل أو البريد..." value={search} onChange={setSearch} className="w-80" />
            <Select
              options={sourceOptions}
              value={filters.source || ""}
              onChange={(e) => setFilter("source", e.target.value)}
            />
            <Button variant="secondary" size="sm" icon={<Filter size={14} />} onClick={() => setShowFilters(!showFilters)}>
              فلاتر متقدمة
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); Object.keys(filters).forEach((k) => setFilter(k, "")); }}>
                مسح الفلاتر
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="flex items-end gap-3 p-4 bg-surface rounded-xl border border-border">
              <Select
                options={statusOptions}
                value={filters.status || ""}
                onChange={(e) => setFilter("status", e.target.value)}
                label="حالة الطلب"
              />
              <Select
                options={paymentOptions}
                value={filters.paymentStatus || ""}
                onChange={(e) => setFilter("paymentStatus", e.target.value)}
                label="حالة الدفع"
              />
              <Input
                label="من تاريخ"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                label="إلى تاريخ"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          )}

          <DataTable
            columns={columns}
            data={paginatedData}
            emptyMessage="لا توجد طلبات"
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
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
            exportable
            striped
          />
        </div>
      </Tabs>

      {viewOrder && (
        <Modal open onClose={() => setViewOrder(null)} title={`تفاصيل الطلب ${viewOrder.number}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">رقم الطلب</p>
                <p className="font-medium text-primary">{viewOrder.number}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">العميل</p>
                <p className="font-medium text-text">{viewOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">التاريخ</p>
                <p className="font-medium text-text">{formatDate(viewOrder.date)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">المجموع</p>
                <p className="font-semibold text-text">{formatCurrency(viewOrder.total)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">حالة الطلب</p>
                <Badge variant={statusConfig[viewOrder.status].variant} dot>{statusConfig[viewOrder.status].label}</Badge>
              </div>
              <div>
                <p className="text-sm text-text-muted">حالة الدفع</p>
                <Badge variant={paymentConfig[viewOrder.paymentStatus].variant}>{paymentConfig[viewOrder.paymentStatus].label}</Badge>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewOrder(null)}>إغلاق</Button>
              <Button onClick={() => {
                router.push(`/admin/orders/${viewOrder.id}`);
              }}>عرض التفاصيل</Button>
            </div>
          </div>
        </Modal>
      )}

      {editOrder && (
        <Modal open onClose={() => setEditOrder(null)} title={`تعديل الطلب ${editOrder.number}`} size="md">
          <div className="space-y-4">
            <Select label="حالة الطلب" options={statusOptions} value={editStatus} onChange={(e) => setEditStatus(e.target.value as OrderStatus)} />
            <Select label="حالة الدفع" options={paymentOptions} value={editPayment} onChange={(e) => setEditPayment(e.target.value as PaymentStatus)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditOrder(null)}>إلغاء</Button>
              <Button onClick={handleUpdateStatus}>حفظ التعديلات</Button>
            </div>
          </div>
        </Modal>
      )}

      {noteOrder && (
        <Modal open onClose={() => { setNoteOrder(null); setNoteText(""); }} title={`ملاحظات الطلب ${noteOrder.number}`} size="md">
          <div className="space-y-4">
            <Textarea label="الملاحظة" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="أدخل ملاحظة للطلب..." rows={4} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setNoteOrder(null); setNoteText(""); }}>إلغاء</Button>
              <Button onClick={handleAddNote}>حفظ الملاحظة</Button>
            </div>
          </div>
        </Modal>
      )}

      {bulkStatusModal && (
        <Modal open onClose={() => setBulkStatusModal(false)} title="تغيير حالة الطلبات" size="md">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">تغيير حالة {selectedKeys.length} محدد</p>
            <Select label="الحالة الجديدة" options={statusOptions} value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as OrderStatus)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setBulkStatusModal(false)}>إلغاء</Button>
              <Button onClick={handleBulkStatusChange}>تغيير الحالة</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
