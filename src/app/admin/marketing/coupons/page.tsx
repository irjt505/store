"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Copy, BarChart3, Ticket, Percent, DollarSign, Truck, Gift } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
  value: number;
  buyQuantity: number;
  getQuantity: number;
  minOrderAmount: number;
  maxUses: number;
  maxUsesPerCustomer: number;
  usage: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "disabled";
  appliesTo: "all" | "products" | "categories" | "customers";
  targetNames: string;
  firstOrderOnly: boolean;
  description: string;
};

const mockCoupons: Coupon[] = [
  { id: "1", code: "SUMMER30", type: "percentage", value: 30, buyQuantity: 0, getQuantity: 0, minOrderAmount: 100, maxUses: 500, maxUsesPerCustomer: 2, usage: 245, startDate: "2026-06-01", endDate: "2026-08-31", status: "active", appliesTo: "all", targetNames: "", firstOrderOnly: false, description: "خصم الصيف" },
  { id: "2", code: "WELCOME50", type: "percentage", value: 50, buyQuantity: 0, getQuantity: 0, minOrderAmount: 200, maxUses: 200, maxUsesPerCustomer: 1, usage: 189, startDate: "2026-01-01", endDate: "2026-12-31", status: "active", appliesTo: "all", targetNames: "", firstOrderOnly: true, description: "خصم الترحيب للعملاء الجدد" },
  { id: "3", code: "FLAT100", type: "fixed", value: 100, buyQuantity: 0, getQuantity: 0, minOrderAmount: 300, maxUses: 150, maxUsesPerCustomer: 1, usage: 67, startDate: "2026-07-01", endDate: "2026-12-31", status: "active", appliesTo: "all", targetNames: "", firstOrderOnly: false, description: "خصم ثابت 100 ريال" },
  { id: "4", code: "FREESHIP", type: "free_shipping", value: 0, buyQuantity: 0, getQuantity: 0, minOrderAmount: 150, maxUses: 500, maxUsesPerCustomer: 5, usage: 312, startDate: "2026-01-01", endDate: "2026-12-31", status: "active", appliesTo: "all", targetNames: "", firstOrderOnly: false, description: "شحن مجاني" },
  { id: "5", code: "BUY3GET1", type: "buy_x_get_y", value: 1, buyQuantity: 3, getQuantity: 1, minOrderAmount: 0, maxUses: 100, maxUsesPerCustomer: 3, usage: 43, startDate: "2026-03-01", endDate: "2026-09-30", status: "active", appliesTo: "categories", targetNames: "إلكترونيات, أزياء", firstOrderOnly: false, description: "اشترِ 3 واحصل على 1 مجاناً" },
  { id: "6", code: "VIP2024", type: "percentage", value: 25, buyQuantity: 0, getQuantity: 0, minOrderAmount: 500, maxUses: 100, maxUsesPerCustomer: 1, usage: 100, startDate: "2024-01-01", endDate: "2024-12-31", status: "expired", appliesTo: "customers", targetNames: "VIP", firstOrderOnly: false, description: "خصم كبار العملاء" },
  { id: "7", code: "EID200", type: "fixed", value: 200, buyQuantity: 0, getQuantity: 0, minOrderAmount: 800, maxUses: 100, maxUsesPerCustomer: 1, usage: 88, startDate: "2026-03-01", endDate: "2026-04-15", status: "expired", appliesTo: "products", targetNames: "لابتوب, تابلت", firstOrderOnly: false, description: "خصم العيد" },
  { id: "8", code: "FLASH15", type: "percentage", value: 15, buyQuantity: 0, getQuantity: 0, minOrderAmount: 50, maxUses: 300, maxUsesPerCustomer: 1, usage: 0, startDate: "2026-06-01", endDate: "2026-06-30", status: "disabled", appliesTo: "all", targetNames: "", firstOrderOnly: false, description: "عرض لحظي" },
  { id: "9", code: "BULK20", type: "percentage", value: 20, buyQuantity: 0, getQuantity: 0, minOrderAmount: 0, maxUses: null as unknown as number, maxUsesPerCustomer: 10, usage: 156, startDate: "2026-01-01", endDate: "2026-12-31", status: "active", appliesTo: "all", targetNames: "", firstOrderOnly: false, description: "خصم الكمية" },
];

const statusConfig: Record<Coupon["status"], { label: string; variant: "success" | "danger" | "default" }> = {
  active: { label: "نشط", variant: "success" },
  expired: { label: "منتهي", variant: "danger" },
  disabled: { label: "معطّل", variant: "default" },
};

const typeConfig: Record<Coupon["type"], { label: string; variant: "success" | "info" | "purple" | "warning"; icon: typeof Percent }> = {
  percentage: { label: "نسبة مئوية", variant: "purple", icon: Percent },
  fixed: { label: "مبلغ ثابت", variant: "info", icon: DollarSign },
  free_shipping: { label: "شحن مجاني", variant: "success", icon: Truck },
  buy_x_get_y: { label: "اشترِ X احصل على Y", variant: "warning", icon: Gift },
};

export default function CouponsPage() {
  const { success, error: showError, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<Coupon["type"]>("percentage");
  const [formValue, setFormValue] = useState(0);
  const [formBuyQty, setFormBuyQty] = useState(0);
  const [formGetQty, setFormGetQty] = useState(0);
  const [formMinOrder, setFormMinOrder] = useState(0);
  const [formMaxUses, setFormMaxUses] = useState(0);
  const [formMaxPerCustomer, setFormMaxPerCustomer] = useState(0);
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formAppliesTo, setFormAppliesTo] = useState<Coupon["appliesTo"]>("all");
  const [formTargetNames, setFormTargetNames] = useState("");
  const [formFirstOrder, setFormFirstOrder] = useState(false);
  const [formDescription, setFormDescription] = useState("");

  const {
    data: coupons,
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
    totalItems,
    totalPages,
  } = useCrud<Coupon>({
    initialData: mockCoupons,
    searchFields: ["code", "description"],
    itemsPerPage: 10,
    defaultSortKey: "startDate",
    defaultSortDir: "desc",
  });

  const activeCount = useMemo(() => coupons.filter((c) => c.status === "active").length, [coupons]);
  const expiredCount = useMemo(() => coupons.filter((c) => c.status === "expired").length, [coupons]);
  const totalRevenue = useMemo(() => coupons.reduce((sum, c) => sum + c.usage * (c.type === "fixed" ? c.value : c.type === "percentage" ? 15 : 20), 0) + 15430, [coupons]);

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue(0);
    setFormBuyQty(0);
    setFormGetQty(0);
    setFormMinOrder(0);
    setFormMaxUses(0);
    setFormMaxPerCustomer(1);
    setFormStartDate("");
    setFormEndDate("");
    setFormAppliesTo("all");
    setFormTargetNames("");
    setFormFirstOrder(false);
    setFormDescription("");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((c: Coupon) => {
    setEditTarget(c);
    setFormCode(c.code);
    setFormType(c.type);
    setFormValue(c.value);
    setFormBuyQty(c.buyQuantity);
    setFormGetQty(c.getQuantity);
    setFormMinOrder(c.minOrderAmount);
    setFormMaxUses(c.maxUses);
    setFormMaxPerCustomer(c.maxUsesPerCustomer);
    setFormStartDate(c.startDate);
    setFormEndDate(c.endDate);
    setFormAppliesTo(c.appliesTo);
    setFormTargetNames(c.targetNames);
    setFormFirstOrder(c.firstOrderOnly);
    setFormDescription(c.description);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formCode.trim()) {
      showError("خطأ", "يرجى إدخال كود الخصم");
      return;
    }
    if (formType === "percentage" && (formValue <= 0 || formValue > 100)) {
      showError("خطأ", "النسبة المئوية يجب أن تكون بين 1 و 100");
      return;
    }
    if (formType === "fixed" && formValue <= 0) {
      showError("خطأ", "قيمة الخصم يجب أن أكبر من صفر");
      return;
    }
    if (formStartDate && formEndDate && new Date(formStartDate) > new Date(formEndDate)) {
      showError("خطأ", "تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      return;
    }

    const couponData: Coupon = {
      id: editTarget?.id || generateId(),
      code: formCode.toUpperCase(),
      type: formType,
      value: formValue,
      buyQuantity: formBuyQty,
      getQuantity: formGetQty,
      minOrderAmount: formMinOrder,
      maxUses: formMaxUses,
      maxUsesPerCustomer: formMaxPerCustomer,
      usage: editTarget?.usage || 0,
      startDate: formStartDate,
      endDate: formEndDate,
      status: "active",
      appliesTo: formAppliesTo,
      targetNames: formTargetNames,
      firstOrderOnly: formFirstOrder,
      description: formDescription,
    };

    if (editTarget) {
      update(editTarget.id, couponData);
      success("تم التحديث", `تم تحديث كود "${formCode}" بنجاح`);
    } else {
      add(couponData);
      success("تمت الإضافة", `تم إنشاء كود "${formCode}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formCode, formType, formValue, formBuyQty, formGetQty, formMinOrder, formMaxUses, formMaxPerCustomer, formStartDate, formEndDate, formAppliesTo, formTargetNames, formFirstOrder, formDescription, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف كود "${deleteTarget.code}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    info("تم النسخ", `تم نسخ الكود "${code}"`);
  }, [info]);

  const handleToggleStatus = useCallback((c: Coupon) => {
    const newStatus = c.status === "active" ? "disabled" : "active";
    update(c.id, { status: newStatus });
    success("تم التغيير", `تم ${newStatus === "active" ? "تفعيل" : "تعطيل"} كود "${c.code}"`);
  }, [update, success]);

  const formatDiscount = (c: Coupon) => {
    if (c.type === "percentage") return `${c.value}%`;
    if (c.type === "fixed") return formatCurrency(c.value);
    if (c.type === "free_shipping") return "مجاني";
    return `اشترِ ${c.buyQuantity} احصل على ${c.getQuantity}`;
  };

  const columns = useMemo(() => [
    {
      key: "code" as const, label: "الكود", sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold bg-bg px-2 py-1 rounded">{String(value)}</span>
          <Button variant="ghost" size="sm" icon={<Copy size={12} />} onClick={(e) => { e.stopPropagation(); handleCopy(String(value)); }} />
        </div>
      ),
    },
    {
      key: "type" as const, label: "النوع", sortable: true,
      render: (value: unknown) => {
        const cfg = typeConfig[value as Coupon["type"]];
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    { key: "value" as const, label: "الخصم", sortable: true, render: (_: unknown, row: Coupon) => <span className="font-semibold text-primary">{formatDiscount(row)}</span> },
    { key: "minOrderAmount" as const, label: "الحد الأدنى", sortable: true, render: (value: unknown) => Number(value) > 0 ? formatCurrency(Number(value)) : <span className="text-text-muted">—</span> },
    {
      key: "usage" as const, label: "الاستخدامات", sortable: true,
      render: (_: unknown, row: Coupon) => (
        <span className="text-sm">
          <span className="font-medium text-text">{row.usage}</span>
          <span className="text-text-muted"> / {row.maxUses || "∞"}</span>
        </span>
      ),
    },
    {
      key: "status" as const, label: "الحالة", sortable: true,
      render: (value: unknown, row: Coupon) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}>
          <Badge variant={statusConfig[value as Coupon["status"]].variant} dot className="cursor-pointer">{statusConfig[value as Coupon["status"]].label}</Badge>
        </button>
      ),
    },
    { key: "startDate" as const, label: "من", sortable: true, render: (value: unknown) => formatDate(String(value)) },
    { key: "endDate" as const, label: "إلى", sortable: true, render: (value: unknown) => formatDate(String(value)) },
    {
      key: "id" as const, label: "الإجراءات", className: "w-24",
      render: (_: unknown, row: Coupon) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={(e) => { e.stopPropagation(); openEdit(row); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} />
        </div>
      ),
    },
  ], [openEdit, handleCopy, handleToggleStatus]);

  return (
    <div className="space-y-6">
      <PageHeader title="الكوبونات" subtitle="إدارة كوبونات الخصم والعروض" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إنشاء كوبون</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Ticket size={20} />} label="إجمالي الكوبونات" value={totalItems} color="primary" />
        <StatCard icon={<BarChart3 size={20} />} label="نشط" value={activeCount} change="" changeType="up" color="success" />
        <StatCard icon={<BarChart3 size={20} />} label="منتهي" value={expiredCount} color="danger" />
        <StatCard icon={<DollarSign size={20} />} label="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} change="" changeType="up" color="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالكود أو الوصف..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "active", label: "نشط" }, { value: "expired", label: "منتهي" }, { value: "disabled", label: "معطّل" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
        <Select options={[{ value: "", label: "جميع الأنواع" }, { value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }, { value: "free_shipping", label: "شحن مجاني" }, { value: "buy_x_get_y", label: "اشترِ X احصل على Y" }]} value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا توجد كوبونات"
        rowKey="id"
        sortable
        pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }}
        striped
      />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الكوبون" message={`هل أنت متأكد من حذف كود "${deleteTarget?.code}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل الكوبون" : "إنشاء كوبون جديد"} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="كود الخصم" value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} placeholder="مثال: SUMMER30" dir="ltr" />
              <Input label="وصف الكوبون" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف مختصر للكوبون" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label="نوع الخصم" options={[{ value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }, { value: "free_shipping", label: "شحن مجاني" }, { value: "buy_x_get_y", label: "اشترِ X احصل على Y" }]} value={formType} onChange={(e) => setFormType(e.target.value as Coupon["type"])} />
              {formType !== "free_shipping" && (
                <Input label={formType === "percentage" ? "النسبة المئوية (%)" : "قيمة الخصم"} type="number" value={formValue} onChange={(e) => setFormValue(Number(e.target.value))} placeholder={formType === "percentage" ? "30" : "100"} />
              )}
            </div>

            {formType === "buy_x_get_y" && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="اشترِ (الكمية)" type="number" value={formBuyQty} onChange={(e) => setFormBuyQty(Number(e.target.value))} />
                <Input label="احصل على (الكمية)" type="number" value={formGetQty} onChange={(e) => setFormGetQty(Number(e.target.value))} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input label="الحد الأدنى للطلب" type="number" value={formMinOrder} onChange={(e) => setFormMinOrder(Number(e.target.value))} helperText="0 للحد الأدنى" />
              <Input label="الحد الأقصى للاستخدام الكلي" type="number" value={formMaxUses} onChange={(e) => setFormMaxUses(Number(e.target.value))} helperText="0 للاستخدام غير المحدود" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="الحد الأقصى لكل عميل" type="number" value={formMaxPerCustomer} onChange={(e) => setFormMaxPerCustomer(Number(e.target.value))} />
              <Select label="ينطبق على" options={[{ value: "all", label: "الكل" }, { value: "products", label: "منتجات محددة" }, { value: "categories", label: "تصنيفات محددة" }, { value: "customers", label: "عملاء محددين" }]} value={formAppliesTo} onChange={(e) => setFormAppliesTo(e.target.value as Coupon["appliesTo"])} />
            </div>

            {formAppliesTo !== "all" && (
              <Input label="الأهداف المحددة" value={formTargetNames} onChange={(e) => setFormTargetNames(e.target.value)} placeholder="افصل بين الأسماء بفاصلة" helperText={formAppliesTo === "products" ? "أسماء المنتجات" : formAppliesTo === "categories" ? "أسماء التصنيفات" : "أسماء العملاء أو مجموعاتهم"} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input label="تاريخ البداية" type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
              <Input label="تاريخ النهاية" type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
            </div>

            <Toggle checked={formFirstOrder} onChange={setFormFirstOrder} label="الطلب الأول فقط" description="limit this coupon to customers' first order" />

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إنشاء الكوبون"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
