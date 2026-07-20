"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Printer,
  StickyNote,
  Download,
  Filter,
  ShoppingCart,
  Banknote,
  ArrowUpDown,
  FileCheck,
  RotateCcw,
  ChevronDown,
  CircleDot,
  Calendar,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  MoreHorizontal,
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
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type OrderStatus =
  | "review"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancelled"
  | "returned";
type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

type Order = {
  id: string;
  number: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  items: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress?: string;
  notes?: string;
};

const mockOrders: Order[] = [
  {
    id: "1",
    number: "#10001",
    customer: "محمد العلي",
    email: "mohammed@example.com",
    phone: "+966501234567",
    date: "2026-01-15",
    items: 5,
    total: 6198,
    paymentStatus: "paid",
    status: "completed",
    shippingAddress: "الرياض، حي النسيم، شارع الأمير سلطان 45",
  },
  {
    id: "2",
    number: "#10002",
    customer: "فاطمة الزهراء",
    email: "fatima@example.com",
    phone: "+966509876543",
    date: "2026-01-14",
    items: 2,
    total: 1123,
    paymentStatus: "paid",
    status: "shipping",
    shippingAddress: "جدة، حي الروضة، شارع فلسطين 12",
  },
  {
    id: "3",
    number: "#10003",
    customer: "نورة السعيد",
    email: "noura@example.com",
    phone: "+966505551234",
    date: "2026-01-13",
    items: 8,
    total: 5199,
    paymentStatus: "paid",
    status: "processing",
    shippingAddress: "الدمام، حي الفيصلية، شارع الملك فهد 78",
  },
  {
    id: "4",
    number: "#10004",
    customer: "خالد الشمري",
    email: "khalid@example.com",
    phone: "+966507778899",
    date: "2026-01-12",
    items: 3,
    total: 899,
    paymentStatus: "pending",
    status: "review",
  },
  {
    id: "5",
    number: "#10005",
    customer: "عبدالله الحربي",
    email: "abdullah@example.com",
    phone: "+966502223344",
    date: "2026-01-11",
    items: 1,
    total: 249,
    paymentStatus: "pending",
    status: "review",
  },
  {
    id: "6",
    number: "#10006",
    customer: "أحمد بن محمد",
    email: "ahmed@example.com",
    phone: "+966501112233",
    date: "2026-01-10",
    items: 4,
    total: 3450,
    paymentStatus: "paid",
    status: "delivered",
    shippingAddress: "الخبر، حي العليا، شارع التحلية 33",
  },
  {
    id: "7",
    number: "#10007",
    customer: "ريم الشمري",
    email: "reem@example.com",
    phone: "+966503334455",
    date: "2026-01-09",
    items: 6,
    total: 2100,
    paymentStatus: "paid",
    status: "completed",
    shippingAddress: "القطيف، حي الصالحية، شارع الأمير سلطان 90",
  },
  {
    id: "8",
    number: "#10008",
    customer: "ياسر القحطاني",
    email: "yasser@example.com",
    phone: "+966504445566",
    date: "2026-01-08",
    items: 2,
    total: 780,
    paymentStatus: "failed",
    status: "cancelled",
  },
  {
    id: "9",
    number: "#10009",
    customer: "هند المطيري",
    email: "hind@example.com",
    phone: "+966505556677",
    date: "2026-01-07",
    items: 7,
    total: 4200,
    paymentStatus: "paid",
    status: "shipping",
    shippingAddress: "الرياض، حي الملقا، شارع أنس بن مالك 21",
  },
  {
    id: "10",
    number: "#10010",
    customer: "منال العنزي",
    email: "manal@example.com",
    phone: "+966507778811",
    date: "2026-01-06",
    items: 3,
    total: 1560,
    paymentStatus: "refunded",
    status: "returned",
    shippingAddress: "مكة المكرمة، حي العزيزية، شارع المسجد الحرام 100",
  },
];

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "warning" | "info" | "success" | "danger" | "default" | "purple"; icon: React.ReactNode }
> = {
  review: { label: "قيد الانتظار", variant: "warning", icon: <Clock size={14} /> },
  processing: { label: "قيد المعالجة", variant: "purple", icon: <FileCheck size={14} /> },
  shipping: { label: "قيد الشحن", variant: "info", icon: <Truck size={14} /> },
  delivered: { label: "تم التوصيل", variant: "success", icon: <CheckCircle size={14} /> },
  completed: { label: "مكتمل", variant: "success", icon: <CheckCircle size={14} /> },
  cancelled: { label: "ملغي", variant: "danger", icon: <XCircle size={14} /> },
  returned: { label: "مرتجع", variant: "default", icon: <RotateCcw size={14} /> },
};

const paymentConfig: Record<
  PaymentStatus,
  { label: string; variant: "success" | "warning" | "danger" | "default" }
> = {
  paid: { label: "مدفوع", variant: "success" },
  pending: { label: "قيد الدفع", variant: "warning" },
  failed: { label: "فشل", variant: "danger" },
  refunded: { label: "مسترد", variant: "default" },
};

const statusOptions = [
  { value: "review", label: "قيد الانتظار" },
  { value: "processing", label: "قيد المعالجة" },
  { value: "shipping", label: "قيد الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
  { value: "returned", label: "مرتجع" },
];

const paymentOptions = [
  { value: "paid", label: "مدفوع" },
  { value: "pending", label: "قيد الدفع" },
  { value: "failed", label: "فشل" },
  { value: "refunded", label: "مسترد" },
];

const tabList = [
  { key: "all", label: "الكل" },
  { key: "review", label: "قيد الانتظار" },
  { key: "processing", label: "قيد المعالجة" },
  { key: "shipping", label: "قيد الشحن" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
  { key: "returned", label: "مرتجع" },
];

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const statusTimeline: OrderStatus[] = ["review", "processing", "shipping", "delivered", "completed"];

function getTimelineIndex(status: OrderStatus): number {
  if (status === "cancelled" || status === "returned") return -1;
  return statusTimeline.indexOf(status);
}

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

  const handleTabChange = useCallback(
    (tab: string) => {
      setFilter("status", tab === "all" ? "" : tab);
    },
    [setFilter]
  );

  const handleUpdateStatus = useCallback(() => {
    if (!editOrder) return;
    update(editOrder.id, {
      status: editStatus,
      paymentStatus: editPayment,
    });
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

  const handlePrintInvoice = useCallback(
    (order: Order) => {
      success("جاري الطباعة", `جاري طباعة فاتورة الطلب ${order.number}`);
    },
    [success]
  );

  const handleBulkStatusChange = useCallback(() => {
    selectedKeys.forEach((id) => {
      update(id, { status: bulkStatus });
    });
    success(
      "تم التحديث",
      `تم تحديث حالة ${selectedKeys.length} طلب بنجاح`
    );
    setSelectedKeys([]);
    setBulkStatusModal(false);
  }, [selectedKeys, bulkStatus, update, success]);

  const handleExport = useCallback(() => {
    const dataToExport =
      selectedKeys.length > 0
        ? orders.filter((o) => selectedKeys.includes(o.id))
        : filteredData;
    const csv = [
      "رقم الطلب,العميل,التاريخ,المنتجات,المجموع,حالة الدفع,حالة الطلب",
      ...dataToExport.map(
        (o) =>
          `${o.number},${o.customer},${o.date},${o.items},${o.total},${paymentConfig[o.paymentStatus].label},${statusConfig[o.status].label}`
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("تم التصدير", "تم تصدير البيانات بنجاح");
  }, [selectedKeys, orders, filteredData, success]);

  const totalPending = useMemo(
    () => orders.filter((o) => o.status === "review").length,
    [orders]
  );
  const totalShipping = useMemo(
    () => orders.filter((o) => o.status === "shipping").length,
    [orders]
  );
  const totalCompleted = useMemo(
    () =>
      orders.filter((o) => o.status === "completed" || o.status === "delivered")
        .length,
    [orders]
  );

  const columns = useMemo(
    () => [
      {
        key: "number" as const,
        label: "رقم الطلب",
        sortable: true,
        render: (_value: unknown, row: Order) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewOrder(row);
            }}
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer transition-colors"
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
          <div className="flex items-center gap-2.5">
            <Avatar name={row.customer} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#111827] truncate">
                {row.customer}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "status" as const,
        label: "الحالة",
        sortable: true,
        render: (value: unknown) => {
          const config = statusConfig[value as OrderStatus];
          return (
            <Badge variant={config.variant} dot size="sm">
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: "paymentStatus" as const,
        label: "الدفع",
        sortable: true,
        render: (value: unknown) => {
          const config = paymentConfig[value as PaymentStatus];
          return (
            <Badge variant={config.variant} size="sm">
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: "total" as const,
        label: "المبلغ",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm font-semibold text-[#111827]">
            {formatCurrency(Number(value))}
          </span>
        ),
      },
      {
        key: "date" as const,
        label: "التاريخ",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm text-[#6B7280]">
            {formatDate(String(value))}
          </span>
        ),
      },
      {
        key: "actions" as const,
        label: "",
        className: "w-12",
        render: (_value: unknown, row: Order) => (
          <Dropdown
            align="start"
            trigger={
              <button
                type="button"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <ChevronDown size={16} />
              </button>
            }
          >
            <DropdownItem onClick={() => setViewOrder(row)}>
              <Eye size={14} />
              عرض التفاصيل
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setEditOrder(row);
                setEditStatus(row.status);
                setEditPayment(row.paymentStatus);
              }}
            >
              <Pencil size={14} />
              تعديل الحالة
            </DropdownItem>
            <DropdownItem onClick={() => handlePrintInvoice(row)}>
              <Printer size={14} />
              طباعة الفاتورة
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setNoteOrder(row);
                setNoteText(row.notes || "");
              }}
            >
              <StickyNote size={14} />
              ملاحظات
            </DropdownItem>
          </Dropdown>
        ),
      },
    ],
    [handlePrintInvoice]
  );

  const bulkActions = useMemo(
    () => [
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
    ],
    [handleExport]
  );

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          title="الطلبيات"
          subtitle="إدارة طلبيات المتجر"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={fadeUp}
      >
        <StatCard
          icon={<Package size={20} />}
          label="إجمالي الطلبيات"
          value={totalItems.toLocaleString("ar")}
          color="primary"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="قيد الانتظار"
          value={totalPending.toLocaleString("ar")}
          color="warning"
        />
        <StatCard
          icon={<Truck size={20} />}
          label="قيد الشحن"
          value={totalShipping.toLocaleString("ar")}
          color="info"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="مكتملة"
          value={totalCompleted.toLocaleString("ar")}
          color="success"
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Tabs tabs={tabList} onChange={handleTabChange}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <SearchInput
                placeholder="بحث برقم الطلب أو اسم العميل..."
                value={search}
                onChange={setSearch}
                className="w-80"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
                <span className="text-[#9CA3AF] text-sm">إلى</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <Select
                options={paymentOptions}
                value={filters.paymentStatus || ""}
                onChange={(e) => setFilter("paymentStatus", e.target.value)}
              />
              {Object.keys(filters).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    Object.keys(filters).forEach((k) => setFilter(k, ""));
                  }}
                  className="text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                >
                  مسح الفلاتر
                </button>
              )}
            </div>

            <DataTable
              columns={columns}
              data={paginatedData}
              emptyMessage="لا توجد طلبيات"
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
            />
          </div>
        </Tabs>
      </motion.div>

      {viewOrder && (
        <Modal
          open
          onClose={() => setViewOrder(null)}
          title={`الطلب ${viewOrder.number}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FA]">
              <div className="flex items-center gap-3">
                <Avatar name={viewOrder.customer} size="md" />
                <div>
                  <p className="font-semibold text-[#111827]">
                    {viewOrder.customer}
                  </p>
                  <p className="text-sm text-[#6B7280]">{viewOrder.email}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-[#111827]">
                  {formatCurrency(viewOrder.total)}
                </p>
                <Badge
                  variant={statusConfig[viewOrder.status].variant}
                  dot
                  size="sm"
                >
                  {statusConfig[viewOrder.status].label}
                </Badge>
              </div>
            </div>

            {viewOrder.status !== "cancelled" &&
              viewOrder.status !== "returned" && (
                <div className="px-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[#E5E7EB]" />
                    <div
                      className="absolute top-3.5 right-0 h-0.5 bg-[#2563EB] transition-all"
                      style={{
                        width: `${Math.max(0, (getTimelineIndex(viewOrder.status) / (statusTimeline.length - 1)) * 100)}%`,
                      }}
                    />
                    {statusTimeline.map((s, i) => {
                      const idx = getTimelineIndex(viewOrder.status);
                      const isActive = i <= idx;
                      const isCurrent = i === idx;
                      return (
                        <div
                          key={s}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <div
                            className={cn(
                              "h-7 w-7 rounded-full flex items-center justify-center border-2 transition-colors",
                              isCurrent
                                ? "bg-[#2563EB] border-[#2563EB] text-white"
                                : isActive
                                  ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                                  : "bg-[#F7F8FA] border-[#E5E7EB] text-[#9CA3AF]"
                            )}
                          >
                            {statusConfig[s].icon}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] mt-1.5 font-medium whitespace-nowrap",
                              isCurrent
                                ? "text-[#2563EB]"
                                : isActive
                                  ? "text-[#111827]"
                                  : "text-[#9CA3AF]"
                            )}
                          >
                            {statusConfig[s].label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={14} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">التاريخ</p>
                  <p className="text-sm font-medium text-[#111827]">
                    {formatDate(viewOrder.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard size={14} className="text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">الدفع</p>
                  <Badge
                    variant={paymentConfig[viewOrder.paymentStatus].variant}
                    size="sm"
                  >
                    {paymentConfig[viewOrder.paymentStatus].label}
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingCart size={14} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">المنتجات</p>
                  <p className="text-sm font-medium text-[#111827]">
                    {viewOrder.items} منتج
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={14} className="text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">الهاتف</p>
                  <p className="text-sm font-medium text-[#111827]" dir="ltr">
                    {viewOrder.phone}
                  </p>
                </div>
              </div>
              {viewOrder.shippingAddress && (
                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <div className="h-8 w-8 rounded-lg bg-[#FEF2F2] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">عنوان التوصيل</p>
                    <p className="text-sm font-medium text-[#111827]">
                      {viewOrder.shippingAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {viewOrder.notes && (
              <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#F59E0B]/20">
                <p className="text-xs text-[#9CA3AF] mb-1">ملاحظات</p>
                <p className="text-sm text-[#111827]">{viewOrder.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <Button
                variant="secondary"
                onClick={() => setViewOrder(null)}
              >
                إغلاق
              </Button>
              <Button
                variant="primary"
                icon={<Pencil size={14} />}
                onClick={() => {
                  setViewOrder(null);
                  setEditOrder(viewOrder);
                  setEditStatus(viewOrder.status);
                  setEditPayment(viewOrder.paymentStatus);
                }}
              >
                تعديل الحالة
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {editOrder && (
        <Modal
          open
          onClose={() => setEditOrder(null)}
          title={`تعديل الطلب ${editOrder.number}`}
          size="md"
        >
          <div className="space-y-4">
            <Select
              label="حالة الطلب"
              options={statusOptions}
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
            />
            <Select
              label="حالة الدفع"
              options={paymentOptions}
              value={editPayment}
              onChange={(e) =>
                setEditPayment(e.target.value as PaymentStatus)
              }
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditOrder(null)}
              >
                إلغاء
              </Button>
              <Button onClick={handleUpdateStatus}>حفظ التعديلات</Button>
            </div>
          </div>
        </Modal>
      )}

      {noteOrder && (
        <Modal
          open
          onClose={() => {
            setNoteOrder(null);
            setNoteText("");
          }}
          title={`ملاحظات الطلب ${noteOrder.number}`}
          size="md"
        >
          <div className="space-y-4">
            <Textarea
              label="الملاحظة"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="أدخل ملاحظة للطلب..."
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setNoteOrder(null);
                  setNoteText("");
                }}
              >
                إلغاء
              </Button>
              <Button onClick={handleAddNote}>حفظ الملاحظة</Button>
            </div>
          </div>
        </Modal>
      )}

      {bulkStatusModal && (
        <Modal
          open
          onClose={() => setBulkStatusModal(false)}
          title="تغيير حالة الطلبيات"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-[#6B7280]">
              تغيير حالة {selectedKeys.length} محدد
            </p>
            <Select
              label="الحالة الجديدة"
              options={statusOptions}
              value={bulkStatus}
              onChange={(e) =>
                setBulkStatus(e.target.value as OrderStatus)
              }
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setBulkStatusModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleBulkStatusChange}>تغيير الحالة</Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}
