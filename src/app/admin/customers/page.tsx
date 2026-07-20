"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  Pencil,
  Trash2,
  Download,
  MoreHorizontal,
  Ban,
  CheckCircle,
  MapPin,
  ShoppingBag,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  FileText,
  Shield,
  ShieldOff,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";

type CustomerStatus = "active" | "blocked";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinDate: string;
  status: CustomerStatus;
  city: string;
  country: string;
  notes: string;
};

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "محمدмыш",
    email: "mohammed@example.com",
    phone: "+966501234567",
    orders: 8,
    totalSpent: 4250,
    lastOrderDate: "2025-07-20",
    joinDate: "2024-01-15",
    status: "active",
    city: "الرياض",
    country: "السعودية",
    notes: "عميل مميز يفضل المنتجات الإلكترونية",
  },
  {
    id: "2",
    name: "فاطمة الزهراء",
    email: "fatima@example.com",
    phone: "+966509876543",
    orders: 5,
    totalSpent: 1890,
    lastOrderDate: "2025-07-19",
    joinDate: "2024-03-22",
    status: "active",
    city: "جدة",
    country: "السعودية",
    notes: "",
  },
  {
    id: "3",
    name: "خالد الشمري",
    email: "khalid@example.com",
    phone: "+966551122334",
    orders: 3,
    totalSpent: 980,
    lastOrderDate: "2025-07-15",
    joinDate: "2024-06-10",
    status: "active",
    city: "الدمام",
    country: "السعودية",
    notes: "يطلب بشكل دوري كل شهر",
  },
  {
    id: "4",
    name: "نورة السعيد",
    email: "noura@example.com",
    phone: "+966567788990",
    orders: 12,
    totalSpent: 8750,
    lastOrderDate: "2025-07-20",
    joinDate: "2023-09-18",
    status: "active",
    city: "مكة المكرمة",
    country: "السعودية",
    notes: "من أكثر العملاء نشاطاً",
  },
  {
    id: "5",
    name: "عبدالله الحربي",
    email: "abdullah@example.com",
    phone: "+966544455667",
    orders: 1,
    totalSpent: 150,
    lastOrderDate: "2025-06-30",
    joinDate: "2024-05-20",
    status: "blocked",
    city: "المدينة المنورة",
    country: "السعودية",
    notes: "تم حظر الحسابdue to suspicious activity",
  },
];

const statusFilterOptions = [
  { value: "", label: "الكل" },
  { value: "active", label: "نشط" },
  { value: "blocked", label: "محظور" },
];

const cityOptions = [
  { value: "", label: "جميع المدن" },
  { value: "الرياض", label: "الرياض" },
  { value: "جدة", label: "جدة" },
  { value: "الدمام", label: "الدمام" },
  { value: "مكة المكرمة", label: "مكة المكرمة" },
  { value: "المدينة المنورة", label: "المدينة المنورة" },
];

const countryOptions = [
  { value: "السعودية", label: "السعودية" },
  { value: "الإمارات", label: "الإمارات" },
  { value: "الكويت", label: "الكويت" },
  { value: "قطر", label: "قطر" },
  { value: "البحرين", label: "البحرين" },
  { value: "عُمان", label: "عُمان" },
  { value: "مصر", label: "مصر" },
  { value: "الأردن", label: "الأردن" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function CustomersPage() {
  const { success, error: showError } = useToast();
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [blockTarget, setBlockTarget] = useState<Customer | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [actionsMenu, setActionsMenu] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("السعودية");
  const [formStatus, setFormStatus] = useState<CustomerStatus>("active");

  const {
    data: customers,
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
    add,
    update,
    remove,
    removeMany,
    totalItems,
    totalPages,
  } = useCrud<Customer>({
    initialData: mockCustomers,
    searchFields: ["name", "email", "phone", "city"],
    itemsPerPage: 10,
    defaultSortKey: "joinDate",
    defaultSortDir: "desc",
  });

  const totalActive = useMemo(
    () => customers.filter((c) => c.status === "active").length,
    [customers]
  );
  const totalBlocked = useMemo(
    () => customers.filter((c) => c.status === "blocked").length,
    [customers]
  );
  const totalRevenue = useMemo(
    () => customers.reduce((s, c) => s + c.totalSpent, 0),
    [customers]
  );

  const resetForm = useCallback(() => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCity("");
    setFormCountry("السعودية");
    setFormStatus("active");
  }, []);

  const openAdd = useCallback(() => {
    resetForm();
    setAddModal(true);
  }, [resetForm]);

  const openEdit = useCallback((customer: Customer) => {
    setFormName(customer.name);
    setFormEmail(customer.email);
    setFormPhone(customer.phone);
    setFormCity(customer.city);
    setFormCountry(customer.country);
    setFormStatus(customer.status);
    setEditCustomer(customer);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) {
      showError("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (editCustomer) {
      update(editCustomer.id, {
        name: formName,
        email: formEmail,
        phone: formPhone,
        city: formCity,
        country: formCountry,
        status: formStatus,
      });
      success("تم التحديث", `تم تحديث بيانات "${formName}" بنجاح`);
      setEditCustomer(null);
    } else {
      add({
        id: generateId(),
        name: formName,
        email: formEmail,
        phone: formPhone,
        orders: 0,
        totalSpent: 0,
        lastOrderDate: "",
        joinDate: new Date().toISOString().split("T")[0],
        status: formStatus,
        city: formCity,
        country: formCountry,
        notes: "",
      });
      success("تمت الإضافة", `تم إضافة العميل "${formName}" بنجاح`);
      setAddModal(false);
    }
    resetForm();
  }, [
    formName,
    formEmail,
    formPhone,
    formCity,
    formCountry,
    formStatus,
    editCustomer,
    add,
    update,
    success,
    showError,
    resetForm,
  ]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف العميل "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleToggleBlock = useCallback(() => {
    if (!blockTarget) return;
    const newStatus: CustomerStatus =
      blockTarget.status === "active" ? "blocked" : "active";
    update(blockTarget.id, { status: newStatus });
    success(
      "تم التغيير",
      `تم ${newStatus === "active" ? "إلغاء حظر" : "حظر"} حساب "${blockTarget.name}"`
    );
    setBlockTarget(null);
  }, [blockTarget, update, success]);

  const handleBulkDelete = useCallback(() => {
    removeMany(selectedKeys);
    success("تم الحذف", `تم حذف ${selectedKeys.length} عميل بنجاح`);
    setSelectedKeys([]);
  }, [selectedKeys, removeMany, success]);

  const handleBulkBlock = useCallback(() => {
    selectedKeys.forEach((id) => update(id, { status: "blocked" }));
    success("تم الحظر", `تم حظر ${selectedKeys.length} عميل`);
    setSelectedKeys([]);
  }, [selectedKeys, update, success]);

  const handleBulkUnblock = useCallback(() => {
    selectedKeys.forEach((id) => update(id, { status: "active" }));
    success("تم الإلغاء", `تم إلغاء حظر ${selectedKeys.length} عميل`);
    setSelectedKeys([]);
  }, [selectedKeys, update, success]);

  const handleExport = useCallback(() => {
    const dataToExport =
      selectedKeys.length > 0
        ? customers.filter((c) => selectedKeys.includes(c.id))
        : filteredData;
    const csv = [
      "الاسم,البريد الإلكتروني,الهاتف,المدينة,الدولة,عدد الطلبات,إجمالي المشتريات,تاريخ الانضمام,الحالة",
      ...dataToExport.map(
        (c) =>
          `${c.name},${c.email},${c.phone},${c.city},${c.country},${c.orders},${c.totalSpent},${c.joinDate},${c.status === "active" ? "نشط" : "محظور"}`
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("تم التصدير", "تم تصدير بيانات العملاء بنجاح");
  }, [selectedKeys, customers, filteredData, success]);

  const columns = useMemo(
    () => [
      {
        key: "name" as const,
        label: "العميل",
        sortable: true,
        render: (_value: unknown, row: Customer) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.name} size="md" />
            <div className="min-w-0">
              <p className="font-medium text-text truncate">{row.name}</p>
              <p className="text-xs text-text-muted truncate" dir="ltr">
                {row.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "phone" as const,
        label: "الهاتف",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm" dir="ltr">
            {String(value)}
          </span>
        ),
      },
      {
        key: "city" as const,
        label: "المدينة",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm">{String(value)}</span>
        ),
      },
      {
        key: "orders" as const,
        label: "الطلبات",
        sortable: true,
        render: (value: unknown) => (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text">
            <ShoppingBag size={14} className="text-text-muted" />
            {String(value)}
          </span>
        ),
      },
      {
        key: "totalSpent" as const,
        label: "الإنفاق",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-sm font-semibold text-text">
            {formatCurrency(Number(value))}
          </span>
        ),
      },
      {
        key: "status" as const,
        label: "الحالة",
        sortable: true,
        render: (value: unknown) =>
          value === "active" ? (
            <Badge variant="success" dot size="sm">
              نشط
            </Badge>
          ) : (
            <Badge variant="danger" dot size="sm">
              محظور
            </Badge>
          ),
      },
      {
        key: "actions" as const,
        label: "الإجراءات",
        className: "w-12",
        render: (_value: unknown, row: Customer) => (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<MoreHorizontal size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                setActionsMenu(actionsMenu === row.id ? null : row.id);
              }}
            />
            {actionsMenu === row.id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setActionsMenu(null)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 bg-surface border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewCustomer(row);
                      setActionsMenu(null);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                  >
                    <Eye size={14} className="text-text-muted" />
                    عرض التفاصيل
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(row);
                      setActionsMenu(null);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                  >
                    <Pencil size={14} className="text-text-muted" />
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlockTarget(row);
                      setActionsMenu(null);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-surface-hover transition-colors"
                  >
                    {row.status === "active" ? (
                      <>
                        <Ban size={14} className="text-warning" />
                        <span className="text-warning">حظر</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} className="text-success" />
                        <span className="text-success">إلغاء الحظر</span>
                      </>
                    )}
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(row);
                      setActionsMenu(null);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-danger hover:bg-danger-light transition-colors"
                  >
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        ),
      },
    ],
    [actionsMenu, openEdit]
  );

  const bulkActions = useMemo(
    () => [
      {
        label: "حذف",
        icon: <Trash2 size={14} />,
        onClick: handleBulkDelete,
        variant: "danger" as const,
      },
      {
        label: "حظر",
        icon: <Ban size={14} />,
        onClick: handleBulkBlock,
      },
      {
        label: "إلغاء الحظر",
        icon: <CheckCircle size={14} />,
        onClick: handleBulkUnblock,
      },
      {
        label: "تصدير",
        icon: <Download size={14} />,
        onClick: handleExport,
      },
    ],
    [handleBulkDelete, handleBulkBlock, handleBulkUnblock, handleExport]
  );

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <PageHeader
          title="العملاء"
          subtitle="إدارة عملاء المتجر"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={<Download size={16} />} onClick={handleExport}>
                تصدير
              </Button>
              <Button icon={<UserPlus size={16} />} onClick={openAdd}>
                إضافة عميل
              </Button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="إجمالي العملاء"
          value={totalItems.toLocaleString("ar")}
          color="primary"
        />
        <StatCard
          icon={<UserCheck size={20} />}
          label="نشط"
          value={totalActive.toLocaleString("ar")}
          color="success"
        />
        <StatCard
          icon={<UserX size={20} />}
          label="محظور"
          value={totalBlocked.toLocaleString("ar")}
          color="danger"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="إجمالي الإنفاق"
          value={formatCurrency(totalRevenue)}
          color="info"
        />
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
        <SearchInput
          placeholder="بحث بالاسم أو البريد أو الهاتف..."
          value={search}
          onChange={setSearch}
          className="w-80"
        />
        <Select
          options={statusFilterOptions}
          value={filters.status || ""}
          onChange={(e) => setFilter("status", e.target.value)}
        />
        <Select
          options={cityOptions}
          value={filters.city || ""}
          onChange={(e) => setFilter("city", e.target.value)}
        />
        {(search || Object.keys(filters).length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              Object.keys(filters).forEach((k) => setFilter(k, ""));
            }}
          >
            مسح الفلاتر
          </Button>
        )}
      </motion.div>

      <motion.div variants={item}>
        <Card padding="none">
          <DataTable
            columns={columns}
            data={paginatedData}
            emptyMessage="لا يوجد عملاء"
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
        </Card>
      </motion.div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف العميل"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <ConfirmDialog
        open={!!blockTarget}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleToggleBlock}
        title={blockTarget?.status === "active" ? "حظر العميل" : "إلغاء حظر العميل"}
        message={
          blockTarget?.status === "active"
            ? `هل أنت متأكد من حظر "${blockTarget?.name}"؟ لن يتمكن من تسجيل الدخول أو إجراء طلبات.`
            : `هل أنت متأكد من إلغاء حظر "${blockTarget?.name}"؟`
        }
        confirmLabel={blockTarget?.status === "active" ? "حظر" : "إلغاء الحظر"}
        cancelLabel="إلغاء"
        variant={blockTarget?.status === "active" ? "danger" : "warning"}
      />

      {viewCustomer && (
        <Modal
          open
          onClose={() => setViewCustomer(null)}
          title="تفاصيل العميل"
          size="lg"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setViewCustomer(null)}>
                إغلاق
              </Button>
              <Button
                onClick={() => {
                  openEdit(viewCustomer);
                  setViewCustomer(null);
                }}
              >
                تعديل
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={viewCustomer.name} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-text">
                  {viewCustomer.name}
                </h3>
                <p className="text-sm text-text-muted" dir="ltr">
                  {viewCustomer.email}
                </p>
                <div className="mt-1">
                  {viewCustomer.status === "active" ? (
                    <Badge variant="success" dot size="sm">
                      نشط
                    </Badge>
                  ) : (
                    <Badge variant="danger" dot size="sm">
                      محظور
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                <Phone size={16} className="text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">الهاتف</p>
                  <p className="text-sm font-medium text-text" dir="ltr">
                    {viewCustomer.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                <MapPin size={16} className="text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">المدينة</p>
                  <p className="text-sm font-medium text-text">
                    {viewCustomer.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                <MapPin size={16} className="text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">الدولة</p>
                  <p className="text-sm font-medium text-text">
                    {viewCustomer.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                <Calendar size={16} className="text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">تاريخ الانضمام</p>
                  <p className="text-sm font-medium text-text">
                    {formatDate(viewCustomer.joinDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-bg rounded-lg">
                <p className="text-2xl font-bold text-text">
                  {viewCustomer.orders}
                </p>
                <p className="text-xs text-text-muted mt-1">إجمالي الطلبات</p>
              </div>
              <div className="text-center p-4 bg-bg rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(viewCustomer.totalSpent)}
                </p>
                <p className="text-xs text-text-muted mt-1">إجمالي الإنفاق</p>
              </div>
              <div className="text-center p-4 bg-bg rounded-lg">
                <p className="text-sm font-medium text-text">
                  {viewCustomer.lastOrderDate
                    ? formatDate(viewCustomer.lastOrderDate)
                    : "—"}
                </p>
                <p className="text-xs text-text-muted mt-1">آخر طلب</p>
              </div>
            </div>

            {viewCustomer.notes && (
              <div className="p-3 bg-bg rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-text-muted" />
                  <p className="text-xs font-medium text-text-muted">ملاحظات</p>
                </div>
                <p className="text-sm text-text-secondary">
                  {viewCustomer.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {(editCustomer || addModal) && (
        <Modal
          open
          onClose={() => {
            setEditCustomer(null);
            setAddModal(false);
            resetForm();
          }}
          title={editCustomer ? "تعديل العميل" : "إضافة عميل جديد"}
          size="md"
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditCustomer(null);
                  setAddModal(false);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
              <Button onClick={handleSave}>
                {editCustomer ? "حفظ التعديلات" : "إضافة"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="الاسم الكامل"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="أدخل اسم العميل"
              required
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="email@example.com"
              dir="ltr"
              required
            />
            <Input
              label="رقم الهاتف"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="+966501234567"
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="المدينة"
                options={cityOptions.filter((o) => o.value)}
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="اختر المدينة"
              />
              <Select
                label="الدولة"
                options={countryOptions}
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                الحالة
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormStatus("active")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                    formStatus === "active"
                      ? "border-success bg-success-light text-success"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  <Shield size={14} />
                  نشط
                </button>
                <button
                  type="button"
                  onClick={() => setFormStatus("blocked")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                    formStatus === "blocked"
                      ? "border-danger bg-danger-light text-danger"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  <ShieldOff size={14} />
                  محظور
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}
