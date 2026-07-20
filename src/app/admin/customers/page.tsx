"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  tags: string[];
};

const mockCustomers: Customer[] = [
  { id: "1", name: "أحمد بن محمد", email: "ahmed@example.com", phone: "+966501234567", orders: 18, totalSpent: 12450, lastOrderDate: "2025-07-20", joinDate: "2023-06-15", status: "active", city: "الرياض", tags: ["VIP", "oyal"] },
  { id: "2", name: "سارة العلي", email: "sara@example.com", phone: "+966509876543", orders: 12, totalSpent: 8900, lastOrderDate: "2025-07-19", joinDate: "2023-08-22", status: "active", city: "جدة", tags: ["oyal"] },
  { id: "3", name: "محمد الفهد", email: "mohammed@example.com", phone: "+966505551234", orders: 5, totalSpent: 3200, lastOrderDate: "2025-07-15", joinDate: "2023-03-10", status: "active", city: "الدمام", tags: [] },
  { id: "4", name: "فاطمة الزهراء", email: "fatima@example.com", phone: "+966507778899", orders: 24, totalSpent: 15600, lastOrderDate: "2025-07-18", joinDate: "2022-11-05", status: "active", city: "الرياض", tags: ["VIP", "oyal", "عضو ذهبي"] },
  { id: "5", name: "خالد العمري", email: "khalid@example.com", phone: "+966502223344", orders: 1, totalSpent: 750, lastOrderDate: "2025-07-10", joinDate: "2024-01-08", status: "blocked", city: "الخبر", tags: [] },
  { id: "6", name: "نورة السعيد", email: "noura@example.com", phone: "+966504445566", orders: 7, totalSpent: 4100, lastOrderDate: "2025-07-17", joinDate: "2023-09-18", status: "active", city: "مكة المكرمة", tags: ["oyal"] },
  { id: "7", name: "عبدالله الحربي", email: "abdullah@example.com", phone: "+966506667788", orders: 2, totalSpent: 680, lastOrderDate: "2025-06-30", joinDate: "2022-05-20", status: "active", city: "المدينة المنورة", tags: [] },
  { id: "8", name: "ريم الشمري", email: "reem@example.com", phone: "+966508889900", orders: 4, totalSpent: 2100, lastOrderDate: "2025-07-16", joinDate: "2023-12-01", status: "active", city: "القطيف", tags: [] },
  { id: "9", name: "ياسر القحطاني", email: "yasser@example.com", phone: "+966501112233", orders: 3, totalSpent: 1850, lastOrderDate: "2025-07-14", joinDate: "2024-02-15", status: "active", city: "الظهران", tags: ["oyal"] },
  { id: "10", name: "هند المطيري", email: "hind@example.com", phone: "+966503334455", orders: 9, totalSpent: 6200, lastOrderDate: "2025-07-19", joinDate: "2023-07-20", status: "active", city: "الرياض", tags: ["VIP"] },
  { id: "11", name: "منال العنزي", email: "manal@example.com", phone: "+966507778811", orders: 6, totalSpent: 4500, lastOrderDate: "2025-07-18", joinDate: "2023-10-05", status: "active", city: "مكة المكرمة", tags: ["oyal"] },
  { id: "12", name: "طارق البكري", email: "tariq@example.com", phone: "+966509990011", orders: 1, totalSpent: 350, lastOrderDate: "2025-07-12", joinDate: "2025-01-10", status: "active", city: "أبها", tags: [] },
  { id: "13", name: "دانة السويلم", email: "dana@example.com", phone: "+966501122334", orders: 11, totalSpent: 7800, lastOrderDate: "2025-07-20", joinDate: "2023-05-12", status: "active", city: "الرياض", tags: ["VIP", "oyal"] },
  { id: "14", name: "حسن الجابري", email: "hassan@example.com", phone: "+966505566778", orders: 2, totalSpent: 950, lastOrderDate: "2025-07-08", joinDate: "2024-06-01", status: "blocked", city: "بريدة", tags: [] },
];

const statusFilterOptions = [
  { value: "", label: "جميع العملاء" },
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
  { value: "الخبر", label: "الخبر" },
  { value: "القطيف", label: "القطيف" },
  { value: "الظهران", label: "الظهران" },
  { value: "أبها", label: "أبها" },
  { value: "بريدة", label: "بريدة" },
];

export default function CustomersPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minSpent, setMinSpent] = useState("");
  const [maxSpent, setMaxSpent] = useState("");

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
    searchFields: ["name", "email", "phone"],
    itemsPerPage: 10,
    defaultSortKey: "joinDate",
    defaultSortDir: "desc",
  });

  const totalBlocked = useMemo(() => customers.filter((c) => c.status === "blocked").length, [customers]);
  const totalRevenue = useMemo(() => customers.reduce((s, c) => s + c.totalSpent, 0), [customers]);
  const newThisMonth = useMemo(() => {
    const now = new Date();
    return customers.filter((c) => {
      const d = new Date(c.joinDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [customers]);

  const openAdd = useCallback(() => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCity("");
    setAddModal(true);
  }, []);

  const openEdit = useCallback((customer: Customer) => {
    setEditCustomer(customer);
    setFormName(customer.name);
    setFormEmail(customer.email);
    setFormPhone(customer.phone);
    setFormCity(customer.city);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) {
      showError("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (editCustomer) {
      update(editCustomer.id, { name: formName, email: formEmail, phone: formPhone, city: formCity });
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
        status: "active",
        city: formCity,
        tags: [],
      });
      success("تمت الإضافة", `تم إضافة العميل "${formName}" بنجاح`);
      setAddModal(false);
    }
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCity("");
  }, [formName, formEmail, formPhone, formCity, editCustomer, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف العميل "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleBulkDelete = useCallback(() => {
    removeMany(selectedKeys);
    success("تم الحذف", `تم حذف ${selectedKeys.length} عميل بنجاح`);
    setSelectedKeys([]);
  }, [selectedKeys, removeMany, success]);

  const handleToggleStatus = useCallback((customer: Customer) => {
    const newStatus = customer.status === "active" ? "blocked" : "active";
    update(customer.id, { status: newStatus });
    success("تم التغيير", `تم ${newStatus === "active" ? "تفعيل" : "حظ"} حساب "${customer.name}"`);
  }, [update, success]);

  const handleExport = useCallback(() => {
    const dataToExport = selectedKeys.length > 0
      ? customers.filter((c) => selectedKeys.includes(c.id))
      : filteredData;
    const csv = [
      "الاسم,البريد الإلكتروني,الهاتف,المدينة,عدد الطلبات,إجمالي المشتريات,تاريخ الانضمام,الحالة",
      ...dataToExport.map((c) =>
        `${c.name},${c.email},${c.phone},${c.city},${c.orders},${c.totalSpent},${c.joinDate},${c.status === "active" ? "نشط" : "محظور"}`
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

  const columns = useMemo(() => [
    {
      key: "name" as const,
      label: "العميل",
      sortable: true,
      render: (_value: unknown, row: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="md" />
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone" as const, label: "الهاتف", sortable: true },
    { key: "city" as const, label: "المدينة", sortable: true },
    {
      key: "orders" as const,
      label: "الطلبات",
      sortable: true,
      render: (value: unknown) => (
        <Badge variant="info">{String(value)} طلب</Badge>
      ),
    },
    {
      key: "totalSpent" as const,
      label: "إجمالي المشتريات",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: "lastOrderDate" as const,
      label: "آخر طلب",
      sortable: true,
      render: (value: unknown) => value ? formatDate(String(value)) : <span className="text-text-muted">—</span>,
    },
    {
      key: "joinDate" as const,
      label: "تاريخ الانضمام",
      sortable: true,
      render: (value: unknown) => formatDate(String(value)),
    },
    {
      key: "status" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown, row: Customer) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }} className="cursor-pointer">
          {value === "active"
            ? <Badge variant="success" dot>نشط</Badge>
            : <Badge variant="danger" dot>محظور</Badge>
          }
        </button>
      ),
    },
    {
      key: "actions" as const,
      label: "الإجراءات",
      className: "w-28",
      render: (_value: unknown, row: Customer) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={(e) => { e.stopPropagation(); router.push(`/admin/customers/${row.id}`); }} />
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={(e) => { e.stopPropagation(); openEdit(row); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} />
        </div>
      ),
    },
  ], [handleToggleStatus, openEdit, router]);

  const bulkActions = useMemo(() => [
    {
      label: "حذف",
      icon: <Trash2 size={14} />,
      onClick: handleBulkDelete,
      variant: "danger" as const,
    },
    {
      label: "تصدير",
      icon: <Download size={14} />,
      onClick: handleExport,
    },
  ], [handleBulkDelete, handleExport]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        subtitle="إدارة حسابات العملاء"
        actions={<Button icon={<UserPlus size={16} />} onClick={openAdd}>إضافة عميل</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="إجمالي العملاء" value={totalItems.toLocaleString("ar")} change="" changeType="up" color="primary" />
        <StatCard icon={<UserPlus size={20} />} label="عملاء جدد هذا الشهر" value={String(newThisMonth)} change="" changeType="up" color="success" />
        <StatCard icon={<UserCheck size={20} />} label="إجمالي المشتريات" value={formatCurrency(totalRevenue)} change="" changeType="up" color="info" />
        <StatCard icon={<UserX size={20} />} label="محظورين" value={String(totalBlocked)} change="" changeType="down" color="warning" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput placeholder="بحث بالاسم أو البريد الإلكتروني أو الهاتف..." value={search} onChange={setSearch} className="w-80" />
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
        <Button variant="secondary" size="sm" icon={<Filter size={14} />} onClick={() => setShowFilters(!showFilters)}>
          فلاتر متقدمة
        </Button>
        {(Object.keys(filters).length > 0 || minSpent || maxSpent) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); Object.keys(filters).forEach((k) => setFilter(k, "")); setMinSpent(""); setMaxSpent(""); }}>
            مسح الفلاتر
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-end gap-3 p-4 bg-surface rounded-xl border border-border">
          <Input label="الحد الأدنى للمشتريات" type="number" value={minSpent} onChange={(e) => setMinSpent(e.target.value)} placeholder="0" />
          <Input label="الحد الأعلى للمشتريات" type="number" value={maxSpent} onChange={(e) => setMaxSpent(e.target.value)} placeholder="100000" />
        </div>
      )}

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
        striped
      />

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

      {viewCustomer && (
        <Modal open onClose={() => setViewCustomer(null)} title="تفاصيل العميل" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-text-muted">الاسم</p><p className="font-medium text-text">{viewCustomer.name}</p></div>
              <div><p className="text-sm text-text-muted">البريد الإلكتروني</p><p className="font-medium text-text" dir="ltr">{viewCustomer.email}</p></div>
              <div><p className="text-sm text-text-muted">الهاتف</p><p className="font-medium text-text" dir="ltr">{viewCustomer.phone}</p></div>
              <div><p className="text-sm text-text-muted">المدينة</p><p className="font-medium text-text">{viewCustomer.city}</p></div>
              <div><p className="text-sm text-text-muted">تاريخ الانضمام</p><p className="font-medium text-text">{formatDate(viewCustomer.joinDate)}</p></div>
              <div><p className="text-sm text-text-muted">إجمالي المشتريات</p><p className="font-semibold text-text">{formatCurrency(viewCustomer.totalSpent)}</p></div>
              <div><p className="text-sm text-text-muted">عدد الطلبات</p><p className="font-medium text-text">{viewCustomer.orders}</p></div>
              <div>
                <p className="text-sm text-text-muted">الحالة</p>
                {viewCustomer.status === "active" ? <Badge variant="success" dot>نشط</Badge> : <Badge variant="danger" dot>محظور</Badge>}
              </div>
            </div>
            {viewCustomer.tags.length > 0 && (
              <div>
                <p className="text-sm text-text-muted mb-2">التاقات</p>
                <div className="flex gap-2">
                  {viewCustomer.tags.map((tag) => <Badge key={tag} variant="purple">{tag}</Badge>)}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewCustomer(null)}>إغلاق</Button>
              <Button onClick={() => { router.push(`/admin/customers/${viewCustomer.id}`); }}>عرض الملف الشخصي</Button>
            </div>
          </div>
        </Modal>
      )}

      {(editCustomer || addModal) && (
        <Modal open onClose={() => { setEditCustomer(null); setAddModal(false); }} title={editCustomer ? "تعديل العميل" : "إضافة عميل جديد"} size="md">
          <div className="space-y-4">
            <Input label="الاسم" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="أدخل اسم العميل" required />
            <Input label="البريد الإلكتروني" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" dir="ltr" required />
            <Input label="الهاتف" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+966501234567" dir="ltr" />
            <Select
              label="المدينة"
              options={cityOptions.filter((o) => o.value)}
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
              placeholder="اختر المدينة"
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setEditCustomer(null); setAddModal(false); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editCustomer ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
