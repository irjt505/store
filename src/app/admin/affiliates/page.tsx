"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Eye, Users, TrendingUp, DollarSign, Copy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, generateId } from "@/lib/utils";

type Affiliate = {
  id: string;
  name: string;
  email: string;
  code: string;
  commission: number;
  commissionType: "percentage" | "fixed";
  clicks: number;
  conversions: number;
  revenue: number;
  earnings: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  payoutMethod: string;
};

const initialAffiliates: Affiliate[] = [
  { id: "1", name: "أحمد المارقي", email: "ahmed@marquee.com", code: "AHMED20", commission: 20, commissionType: "percentage", clicks: 1250, conversions: 89, revenue: 8900, earnings: 1780, status: "active", joinDate: "2024-01-15", payoutMethod: "تحويل بنكي" },
  { id: "2", name: "سارة القحطاني", email: "sara@techblog.com", code: "SARA15", commission: 15, commissionType: "percentage", clicks: 890, conversions: 56, revenue: 5600, earnings: 840, status: "active", joinDate: "2024-02-20", payoutMethod: " PayPal" },
  { id: "3", name: "خالد العتيبي", email: "khalid@review.com", code: "KHALID10", commission: 10, commissionType: "fixed", clicks: 450, conversions: 23, revenue: 2300, earnings: 230, status: "active", joinDate: "2024-03-10", payoutMethod: "تحويل بنكي" },
  { id: "4", name: "نورة الشمري", email: "noura@digital.com", code: "NOURA25", commission: 25, commissionType: "percentage", clicks: 2100, conversions: 134, revenue: 13400, earnings: 3350, status: "active", joinDate: "2024-01-05", payoutMethod: "تحويل بنكي" },
  { id: "5", name: "عبدالله الحربي", email: "abdullah@marketing.com", code: "ABDULLAH5", commission: 5, commissionType: "fixed", clicks: 120, conversions: 8, revenue: 800, earnings: 40, status: "inactive", joinDate: "2024-04-01", payoutMethod: "PayPal" },
  { id: "6", name: "فاطمة السالم", email: "fatima@blog.com", code: "FATIMA30", commission: 30, commissionType: "percentage", clicks: 3200, conversions: 210, revenue: 21000, earnings: 6300, status: "active", joinDate: "2023-12-01", payoutMethod: "تحويل بنكي" },
  { id: "7", name: "عمر الدوسري", email: "omar@social.com", code: "OMAR12", commission: 12, commissionType: "percentage", clicks: 670, conversions: 45, revenue: 4500, earnings: 540, status: "pending", joinDate: "2024-04-10", payoutMethod: "تحويل بنكي" },
  { id: "8", name: "مريم العنزي", email: "mariam@course.com", code: "MARIAM18", commission: 18, commissionType: "percentage", clicks: 1800, conversions: 112, revenue: 11200, earnings: 2016, status: "active", joinDate: "2024-02-01", payoutMethod: "PayPal" },
];

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
  { value: "pending", label: "قيد المراجعة" },
];

function getStatusBadge(s: Affiliate["status"]) {
  if (s === "active") return <Badge variant="success" dot>نشط</Badge>;
  if (s === "inactive") return <Badge variant="default" dot>غير نشط</Badge>;
  return <Badge variant="warning" dot>قيد المراجعة</Badge>;
}

export default function AffiliatesPage() {
  const { success, error: showError, info } = useToast();
  const [viewModal, setViewModal] = useState<Affiliate | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Affiliate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Affiliate | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCommission, setFormCommission] = useState(0);
  const [formCommissionType, setFormCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [formPayoutMethod, setFormPayoutMethod] = useState("تحويل بنكي");

  const {
    data: affiliates,
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
    add,
    update,
    remove,
    totalItems,
    totalPages,
  } = useCrud<Affiliate>({
    initialData: initialAffiliates,
    searchFields: ["name", "email", "code"],
    itemsPerPage: 10,
    defaultSortKey: "earnings",
    defaultSortDir: "desc",
  });

  const totalEarnings = useMemo(() => affiliates.reduce((s, a) => s + a.earnings, 0), [affiliates]);
  const totalConversions = useMemo(() => affiliates.reduce((s, a) => s + a.conversions, 0), [affiliates]);
  const activeAffiliates = useMemo(() => affiliates.filter((a) => a.status === "active").length, [affiliates]);
  const totalClicks = useMemo(() => affiliates.reduce((s, a) => s + a.clicks, 0), [affiliates]);

  const openAdd = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormEmail("");
    setFormCommission(0);
    setFormCommissionType("percentage");
    setFormPayoutMethod("تحويل بنكي");
    setAddModal(true);
  }, []);

  const openEdit = useCallback((a: Affiliate) => {
    setEditTarget(a);
    setFormName(a.name);
    setFormEmail(a.email);
    setFormCommission(a.commission);
    setFormCommissionType(a.commissionType);
    setFormPayoutMethod(a.payoutMethod);
    setAddModal(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) {
      showError("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    const code = formName.replace(/\s+/g, "").toUpperCase().substring(0, 8) + Math.floor(Math.random() * 100);
    if (editTarget) {
      update(editTarget.id, { name: formName, email: formEmail, commission: formCommission, commissionType: formCommissionType, payoutMethod: formPayoutMethod });
      success("تم التحديث", `تم تحديث بيانات المسوق "${formName}" بنجاح`);
    } else {
      add({ id: generateId(), name: formName, email: formEmail, code, commission: formCommission, commissionType: formCommissionType, clicks: 0, conversions: 0, revenue: 0, earnings: 0, status: "pending", joinDate: new Date().toISOString().split("T")[0], payoutMethod: formPayoutMethod });
      success("تمت الإضافة", `تم إضافة المسوق "${formName}" بنجاح`);
    }
    setAddModal(false);
    setEditTarget(null);
  }, [formName, formEmail, formCommission, formCommissionType, formPayoutMethod, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف المسوق "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    info("تم النسخ", "تم نسخ الرابط إلى الحافظة");
  }, [info]);

  const columns = useMemo(() => [
    {
      key: "name" as const, label: "المسوق", sortable: true,
      render: (_: unknown, row: Affiliate) => (
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="text-xs text-text-muted" dir="ltr">{row.email}</p>
        </div>
      ),
    },
    {
      key: "code" as const, label: "الكود", sortable: true,
      render: (v: unknown) => (
        <div className="flex items-center gap-2">
          <code className="text-xs bg-bg px-2 py-1 rounded border border-border font-mono">{String(v)}</code>
          <button onClick={() => handleCopy(String(v))} className="text-text-muted hover:text-primary cursor-pointer"><Copy size={12} /></button>
        </div>
      ),
    },
    {
      key: "commission" as const, label: "العمولة", sortable: true,
      render: (_: unknown, row: Affiliate) => (
        <span className="font-semibold text-primary">{row.commissionType === "percentage" ? `${row.commission}%` : formatCurrency(row.commission)}</span>
      ),
    },
    { key: "clicks" as const, label: "الزيارات", sortable: true },
    { key: "conversions" as const, label: "التحويلات", sortable: true },
    { key: "earnings" as const, label: "الأرباح", sortable: true, render: (v: unknown) => <span className="font-semibold text-success">{formatCurrency(Number(v))}</span> },
    { key: "status" as const, label: "الحالة", sortable: true, render: (v: unknown) => getStatusBadge(v as Affiliate["status"]) },
    {
      key: "actions" as const, label: "الإجراءات", className: "w-24",
      render: (_: unknown, row: Affiliate) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setViewModal(row)} />
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ], [openEdit, handleCopy]);

  return (
    <div className="space-y-6">
      <PageHeader title="نظام الأفلييت" subtitle="إدارة المسوقين بالعمولة وتتبع أرباحهم" actions={<Button icon={<Plus size={16} />} onClick={openAdd}>إضافة مسوق</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Users size={20} className="text-primary" /></div><div><p className="text-2xl font-bold text-text">{activeAffiliates}</p><p className="text-xs text-text-muted">مسوق نشط</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><TrendingUp size={20} className="text-info" /></div><div><p className="text-2xl font-bold text-text">{totalClicks.toLocaleString("ar")}</p><p className="text-xs text-text-muted">إجمالي الزيارات</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><Badge variant="success" className="text-lg">{totalConversions}</Badge></div><div><p className="text-2xl font-bold text-text">{totalConversions}</p><p className="text-xs text-text-muted">التحويلات</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><DollarSign size={20} className="text-warning" /></div><div><p className="text-2xl font-bold text-text">{formatCurrency(totalEarnings)}</p><p className="text-xs text-text-muted">إجمالي أرباح المسوقين</p></div></div></Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالاسم أو البريد أو الكود..." value={search} onChange={setSearch} className="w-72" />
        <Select options={statusOptions} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا يوجد مسوقين"
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
        striped
      />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف المسوق" message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {(addModal || editTarget) && (
        <Modal open onClose={() => { setAddModal(false); setEditTarget(null); }} title={editTarget ? "تعديل المسوق" : "إضافة مسوق جديد"} size="md">
          <div className="space-y-4">
            <Input label="الاسم" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="أدخل اسم المسوق" required />
            <Input label="البريد الإلكتروني" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" dir="ltr" required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="نوع العمولة" options={[{ value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }]} value={formCommissionType} onChange={(e) => setFormCommissionType(e.target.value as "percentage" | "fixed")} />
              <Input label="العمولة" type="number" value={formCommission} onChange={(e) => setFormCommission(Number(e.target.value))} placeholder="0" />
            </div>
            <Select label="طريقة الدفع" options={[{ value: "تحويل بنكي", label: "تحويل بنكي" }, { value: "PayPal", label: "PayPal" }]} value={formPayoutMethod} onChange={(e) => setFormPayoutMethod(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setAddModal(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      {viewModal && (
        <Modal open onClose={() => setViewModal(null)} title={`تفاصيل المسوق — ${viewModal.name}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-text-muted">الاسم</p><p className="font-medium">{viewModal.name}</p></div>
              <div><p className="text-text-muted">البريد</p><p className="font-medium" dir="ltr">{viewModal.email}</p></div>
              <div><p className="text-text-muted">كود الإحالة</p><code className="bg-bg px-2 py-1 rounded border border-border font-mono">{viewModal.code}</code></div>
              <div><p className="text-text-muted">العمولة</p><p className="font-semibold text-primary">{viewModal.commissionType === "percentage" ? `${viewModal.commission}%` : formatCurrency(viewModal.commission)}</p></div>
              <div><p className="text-text-muted">الزيارات</p><p>{viewModal.clicks.toLocaleString("ar")}</p></div>
              <div><p className="text-text-muted">التحويلات</p><p>{viewModal.conversions}</p></div>
              <div><p className="text-text-muted">الإيرادات المحققة</p><p>{formatCurrency(viewModal.revenue)}</p></div>
              <div><p className="text-text-muted">الأرباح</p><p className="font-semibold text-success">{formatCurrency(viewModal.earnings)}</p></div>
              <div><p className="text-text-muted">تاريخ الانضمام</p><p>{viewModal.joinDate}</p></div>
              <div><p className="text-text-muted">طريقة الدفع</p><p>{viewModal.payoutMethod}</p></div>
              <div><p className="text-text-muted">الحالة</p>{getStatusBadge(viewModal.status)}</div>
              <div>
                <p className="text-text-muted">رابط الإحالة</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-bg px-2 py-1 rounded border border-border font-mono">store.com/ref/{viewModal.code}</code>
                  <Button variant="ghost" size="sm" icon={<Copy size={12} />} onClick={() => handleCopy(`https://store.com/ref/${viewModal.code}`)} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewModal(null)}>إغلاق</Button>
              <Button onClick={() => { setViewModal(null); openEdit(viewModal); }}>تعديل</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
