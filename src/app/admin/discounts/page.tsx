"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, Tag, BarChart3, Zap, Percent, DollarSign, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toggle } from "@/components/ui/Toggle";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";

type Discount = {
  id: string;
  name: string;
  type: "automatic" | "coupon" | "flash_sale" | "bundle";
  ruleType: "percentage" | "fixed" | "buy_x_get_y" | "volume" | "tiered" | "category";
  value: number;
  buyQuantity: number;
  getQuantity: number;
  minPurchase: number;
  minQuantity: number;
  maxUses: number | null;
  usedCount: number;
  priority: number;
  stackable: boolean;
  startDate: string;
  endDate: string | null;
  recurring: boolean;
  recurringType: "daily" | "weekly" | "monthly";
  status: "active" | "scheduled" | "expired" | "disabled";
  appliesTo: "all" | "category" | "product" | "collection";
  targetName: string;
};

const typeLabels: Record<string, string> = { automatic: "تلقائي", coupon: "كوبون", flash_sale: "عرض لحظي", bundle: "حزمة" };
const typeBadge: Record<string, "info" | "success" | "purple" | "warning"> = { automatic: "info", coupon: "success", flash_sale: "warning", bundle: "purple" };
const ruleLabels: Record<string, string> = { percentage: "نسبة مئوية", fixed: "مبلغ ثابت", buy_x_get_y: "اشترِ X احصل على Y", volume: "كمي", tiered: "تسعير تدريجي", category: "خصم تصنيف" };
const statusLabels: Record<string, string> = { active: "نشط", scheduled: "مجدول", expired: "منتهي", disabled: "معطل" };
const statusBadge: Record<string, "success" | "info" | "warning" | "danger" | "default"> = { active: "success", scheduled: "info", expired: "warning", disabled: "danger" };
const appliesToLabels: Record<string, string> = { all: "الكل", category: "تصنيف", product: "منتج", collection: "مجموعة" };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const initialDiscounts: Discount[] = [
  { id: "1", name: "خصم المنتجات الجديدة 20%", type: "automatic", ruleType: "percentage", value: 20, buyQuantity: 0, getQuantity: 0, minPurchase: 50, minQuantity: 0, maxUses: 100, usedCount: 45, priority: 1, stackable: false, startDate: "2026-04-01", endDate: "2026-05-01", recurring: false, recurringType: "monthly", status: "active", appliesTo: "all", targetName: "الكل" },
  { id: "2", name: "خصم الحزم الكبرى", type: "coupon", ruleType: "fixed", value: 50, buyQuantity: 0, getQuantity: 0, minPurchase: 200, minQuantity: 0, maxUses: null, usedCount: 89, priority: 2, stackable: true, startDate: "2026-01-01", endDate: null, recurring: false, recurringType: "monthly", status: "active", appliesTo: "collection", targetName: "الحزم" },
  { id: "3", name: "اشترِ 3 احصل على 1 مجاناً", type: "automatic", ruleType: "buy_x_get_y", value: 1, buyQuantity: 3, getQuantity: 1, minPurchase: 0, minQuantity: 3, maxUses: 50, usedCount: 12, priority: 3, stackable: false, startDate: "2026-03-15", endDate: "2026-06-15", recurring: false, recurringType: "monthly", status: "active", appliesTo: "category", targetName: "الكتب" },
  { id: "4", name: "خصم الكمية الكبيرة", type: "automatic", ruleType: "volume", value: 15, buyQuantity: 0, getQuantity: 0, minPurchase: 0, minQuantity: 10, maxUses: null, usedCount: 203, priority: 1, stackable: true, startDate: "2026-01-01", endDate: null, recurring: false, recurringType: "monthly", status: "active", appliesTo: "all", targetName: "الكل" },
  { id: "5", name: "حزمة المطور المخفضة", type: "bundle", ruleType: "percentage", value: 30, buyQuantity: 0, getQuantity: 0, minPurchase: 0, minQuantity: 0, maxUses: 30, usedCount: 30, priority: 1, stackable: false, startDate: "2026-02-01", endDate: "2026-03-01", recurring: false, recurringType: "monthly", status: "expired", appliesTo: "collection", targetName: "حزم المطورين" },
  { id: "6", name: "عرض دورات الفيديو 10%", type: "flash_sale", ruleType: "percentage", value: 10, buyQuantity: 0, getQuantity: 0, minPurchase: 100, minQuantity: 0, maxUses: 200, usedCount: 0, priority: 1, stackable: false, startDate: "2026-08-01", endDate: "2026-08-07", recurring: false, recurringType: "monthly", status: "scheduled", appliesTo: "category", targetName: "فيديوهات" },
  { id: "7", name: "تسعير تدريجي للإلكترونيات", type: "automatic", ruleType: "tiered", value: 10, buyQuantity: 0, getQuantity: 0, minPurchase: 0, minQuantity: 0, maxUses: null, usedCount: 67, priority: 2, stackable: true, startDate: "2026-01-01", endDate: null, recurring: false, recurringType: "monthly", status: "active", appliesTo: "category", targetName: "إلكترونيات" },
  { id: "8", name: "عرض خاص للقوالب", type: "coupon", ruleType: "category", value: 40, buyQuantity: 0, getQuantity: 0, minPurchase: 0, minQuantity: 0, maxUses: null, usedCount: 0, priority: 1, stackable: false, startDate: "2026-06-01", endDate: null, recurring: true, recurringType: "weekly", status: "disabled", appliesTo: "category", targetName: "قوالب" },
];

export default function DiscountsPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);
  const [viewModal, setViewModal] = useState<Discount | null>(null);

  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<Discount["type"]>("automatic");
  const [formRuleType, setFormRuleType] = useState<Discount["ruleType"]>("percentage");
  const [formValue, setFormValue] = useState(0);
  const [formBuyQty, setFormBuyQty] = useState(0);
  const [formGetQty, setFormGetQty] = useState(0);
  const [formMinPurchase, setFormMinPurchase] = useState(0);
  const [formMinQuantity, setFormMinQuantity] = useState(0);
  const [formMaxUses, setFormMaxUses] = useState<number | null>(null);
  const [formAppliesTo, setFormAppliesTo] = useState<Discount["appliesTo"]>("all");
  const [formTargetName, setFormTargetName] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState<string | null>(null);
  const [formPriority, setFormPriority] = useState(1);
  const [formStackable, setFormStackable] = useState(false);
  const [formRecurring, setFormRecurring] = useState(false);
  const [formRecurringType, setFormRecurringType] = useState<Discount["recurringType"]>("monthly");

  const {
    data: discounts,
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
  } = useCrud<Discount>({
    initialData: initialDiscounts,
    searchFields: ["name"],
    itemsPerPage: 10,
    defaultSortKey: "startDate",
    defaultSortDir: "desc",
  });

  const activeCount = useMemo(() => discounts.filter((d) => d.status === "active").length, [discounts]);
  const totalSavings = useMemo(() => discounts.reduce((s, d) => s + d.usedCount * (d.ruleType === "fixed" ? d.value : 10), 0), [discounts]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormName("");
    setFormType("automatic");
    setFormRuleType("percentage");
    setFormValue(0);
    setFormBuyQty(0);
    setFormGetQty(0);
    setFormMinPurchase(0);
    setFormMinQuantity(0);
    setFormMaxUses(null);
    setFormAppliesTo("all");
    setFormTargetName("");
    setFormStartDate("");
    setFormEndDate(null);
    setFormPriority(1);
    setFormStackable(false);
    setFormRecurring(false);
    setFormRecurringType("monthly");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((d: Discount) => {
    setEditing(d);
    setFormName(d.name);
    setFormType(d.type);
    setFormRuleType(d.ruleType);
    setFormValue(d.value);
    setFormBuyQty(d.buyQuantity);
    setFormGetQty(d.getQuantity);
    setFormMinPurchase(d.minPurchase);
    setFormMinQuantity(d.minQuantity);
    setFormMaxUses(d.maxUses);
    setFormAppliesTo(d.appliesTo);
    setFormTargetName(d.targetName);
    setFormStartDate(d.startDate);
    setFormEndDate(d.endDate);
    setFormPriority(d.priority);
    setFormStackable(d.stackable);
    setFormRecurring(d.recurring);
    setFormRecurringType(d.recurringType);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم الخصم");
      return;
    }
    if (formValue <= 0 && formRuleType !== "buy_x_get_y") {
      showError("خطأ", "قيمة الخصم يجب أن أكبر من صفر");
      return;
    }
    const data = {
      name: formName, type: formType, ruleType: formRuleType, value: formValue,
      buyQuantity: formBuyQty, getQuantity: formGetQty,
      minPurchase: formMinPurchase, minQuantity: formMinQuantity,
      maxUses: formMaxUses, appliesTo: formAppliesTo, targetName: formTargetName,
      startDate: formStartDate, endDate: formEndDate,
      priority: formPriority, stackable: formStackable,
      recurring: formRecurring, recurringType: formRecurringType, status: "active" as const,
    };
    if (editing) {
      update(editing.id, data);
      success("تم التحديث", `تم تحديث خصم "${formName}" بنجاح`);
    } else {
      add({ id: generateId(), ...data, usedCount: 0 } as Discount);
      success("تمت الإضافة", `تم إضافة خصم "${formName}" بنجاح`);
    }
    setModalOpen(false);
    setEditing(null);
  }, [formName, formType, formRuleType, formValue, formBuyQty, formGetQty, formMinPurchase, formMinQuantity, formMaxUses, formAppliesTo, formTargetName, formStartDate, formEndDate, formPriority, formStackable, formRecurring, formRecurringType, editing, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف خصم "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const formatValue = (d: Discount) => {
    if (d.ruleType === "percentage") return `${d.value}%`;
    if (d.ruleType === "fixed") return formatCurrency(d.value);
    if (d.ruleType === "buy_x_get_y") return `اشترِ ${d.buyQuantity} احصل على ${d.getQuantity}`;
    if (d.ruleType === "volume") return `${d.value}% خصم كمي`;
    if (d.ruleType === "tiered") return `تسعير تدريجي ${d.value}%`;
    return `${d.value}% خصم`;
  };

  const columns = useMemo(() => [
    { key: "name" as const, label: "اسم الخصم", sortable: true },
    { key: "type" as const, label: "النوع", sortable: true, render: (v: unknown) => <Badge variant={typeBadge[String(v)]}>{typeLabels[String(v)]}</Badge> },
    { key: "ruleType" as const, label: "القاعدة", sortable: true, render: (v: unknown) => <Badge variant="default">{ruleLabels[String(v)]}</Badge> },
    { key: "value" as const, label: "القيمة", sortable: true, render: (_: unknown, row: Discount) => <span className="font-semibold text-primary">{formatValue(row)}</span> },
    { key: "priority" as const, label: "الأولوية", sortable: true, render: (v: unknown) => <Badge variant="info">{String(v)}</Badge> },
    { key: "appliesTo" as const, label: "ينطبق على", sortable: true, render: (_: unknown, row: Discount) => <div><span className="text-sm">{appliesToLabels[row.appliesTo]}</span>{row.appliesTo !== "all" && <span className="text-xs text-text-muted block">{row.targetName}</span>}</div> },
    { key: "usedCount" as const, label: "الاستخدام", sortable: true, render: (_: unknown, row: Discount) => <span className={row.maxUses && row.usedCount >= row.maxUses ? "text-danger font-semibold" : "text-text"}>{row.usedCount}{row.maxUses ? `/${row.maxUses}` : ""}</span> },
    { key: "status" as const, label: "الحالة", sortable: true, render: (v: unknown) => <Badge variant={statusBadge[String(v)]} dot>{statusLabels[String(v)]}</Badge> },
    {
      key: "id" as const, label: "الإجراءات", className: "w-24",
      render: (_: unknown, row: Discount) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setViewModal(row)} />
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ], [openEdit]);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <PageHeader title="الخصومات المتقدمة" subtitle="إدارة قواعد الخصومات والعروض الترويجية" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة خصم</Button>} />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Tag size={20} />} label="إجمالي الخصومات" value={totalItems} color="primary" />
        <StatCard icon={<Zap size={20} />} label="خصومات نشطة" value={activeCount} color="success" />
        <StatCard icon={<DollarSign size={20} />} label="إجمالي التخفيضات" value={formatCurrency(totalSavings)} color="warning" />
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث عن خصم..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الأنواع" }, { value: "automatic", label: "تلقائي" }, { value: "coupon", label: "كوبون" }, { value: "flash_sale", label: "عرض لحظي" }, { value: "bundle", label: "حزمة" }]} value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)} />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "active", label: "نشط" }, { value: "scheduled", label: "مجدول" }, { value: "expired", label: "منتهي" }, { value: "disabled", label: "معطل" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </motion.div>

      <motion.div variants={item}>
        <DataTable columns={columns} data={paginatedData} emptyMessage="لا توجد خصومات" rowKey="id" sortable
          pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }}
          striped />
      </motion.div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الخصم" message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "تعديل الخصم" : "إضافة خصم جديد"} size="lg">
          <div className="space-y-4">
            <Input label="اسم الخصم" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: خصم 20%" />

            <div className="grid grid-cols-2 gap-4">
              <Select label="نوع العرض" options={[{ value: "automatic", label: "تلقائي" }, { value: "coupon", label: "كوبون" }, { value: "flash_sale", label: "عرض لحظي" }, { value: "bundle", label: "حزمة" }]} value={formType} onChange={(e) => setFormType(e.target.value as Discount["type"])} />
              <Select label="نوع القاعدة" options={[{ value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }, { value: "buy_x_get_y", label: "اشترِ X احصل على Y" }, { value: "volume", label: "كمي" }, { value: "tiered", label: "تسعير تدريجي" }, { value: "category", label: "خصم تصنيف" }]} value={formRuleType} onChange={(e) => setFormRuleType(e.target.value as Discount["ruleType"])} />
            </div>

            {formRuleType === "buy_x_get_y" ? (
              <div className="grid grid-cols-2 gap-4">
                <Input label="اشترِ (الكمية)" type="number" value={formBuyQty} onChange={(e) => setFormBuyQty(Number(e.target.value))} />
                <Input label="احصل على (الكمية)" type="number" value={formGetQty} onChange={(e) => setFormGetQty(Number(e.target.value))} />
              </div>
            ) : (
              <Input label={formRuleType === "percentage" ? "النسبة المئوية (%)" : "قيمة الخصم"} type="number" value={formValue} onChange={(e) => setFormValue(Number(e.target.value))} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input label="الحد الأدنى للشراء" type="number" value={formMinPurchase} onChange={(e) => setFormMinPurchase(Number(e.target.value))} />
              <Input label="الحد الأدنى للكمية" type="number" value={formMinQuantity} onChange={(e) => setFormMinQuantity(Number(e.target.value))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label="ينطبق على" options={[{ value: "all", label: "الكل" }, { value: "category", label: "تصنيف" }, { value: "product", label: "منتج" }, { value: "collection", label: "مجموعة" }]} value={formAppliesTo} onChange={(e) => setFormAppliesTo(e.target.value as Discount["appliesTo"])} />
              <Input label="الحد الأقصى للاستخدام" type="number" value={formMaxUses?.toString() || ""} onChange={(e) => setFormMaxUses(e.target.value ? Number(e.target.value) : null)} placeholder="بدون حد" />
            </div>

            {formAppliesTo !== "all" && <Input label="الهدف" value={formTargetName} onChange={(e) => setFormTargetName(e.target.value)} placeholder="اسم التصنيف أو المنتج" />}

            <div className="grid grid-cols-2 gap-4">
              <Input label="تاريخ البداية" type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
              <Input label="تاريخ النهاية" type="date" value={formEndDate || ""} onChange={(e) => setFormEndDate(e.target.value || null)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input label="الأولوية" type="number" value={formPriority} onChange={(e) => setFormPriority(Number(e.target.value))} />
              <Toggle checked={formStackable} onChange={setFormStackable} label="قابل للجمع" description="السماح بالجمع مع خصومات أخرى" />
              <Toggle checked={formRecurring} onChange={setFormRecurring} label="متكرر" description="تطبيق بشكل دوري" />
            </div>

            {formRecurring && (
              <Select label="نوع التكرار" options={[{ value: "daily", label: "يومي" }, { value: "weekly", label: "أسبوعي" }, { value: "monthly", label: "شهري" }]} value={formRecurringType} onChange={(e) => setFormRecurringType(e.target.value as Discount["recurringType"])} />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditing(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      {viewModal && (
        <Modal open onClose={() => setViewModal(null)} title="تفاصيل الخصم" size="lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-text-muted">الاسم</p><p className="font-medium">{viewModal.name}</p></div>
            <div><p className="text-text-muted">النوع</p><Badge variant={typeBadge[viewModal.type]}>{typeLabels[viewModal.type]}</Badge></div>
            <div><p className="text-text-muted">القاعدة</p><Badge variant="default">{ruleLabels[viewModal.ruleType]}</Badge></div>
            <div><p className="text-text-muted">القيمة</p><p className="font-semibold text-primary">{formatValue(viewModal)}</p></div>
            <div><p className="text-text-muted">الأولوية</p><p>{viewModal.priority}</p></div>
            <div><p className="text-text-muted">الحالة</p><Badge variant={statusBadge[viewModal.status]}>{statusLabels[viewModal.status]}</Badge></div>
            <div><p className="text-text-muted">ينطبق على</p><p>{appliesToLabels[viewModal.appliesTo]}{viewModal.appliesTo !== "all" ? ` — ${viewModal.targetName}` : ""}</p></div>
            <div><p className="text-text-muted">الاستخدام</p><p>{viewModal.usedCount}{viewModal.maxUses ? `/${viewModal.maxUses}` : ""}</p></div>
            <div><p className="text-text-muted">قابل للجمع</p><p>{viewModal.stackable ? "نعم" : "لا"}</p></div>
            <div><p className="text-text-muted">متكرر</p><p>{viewModal.recurring ? `نعم — ${viewModal.recurringType === "daily" ? "يومي" : viewModal.recurringType === "weekly" ? "أسبوعي" : "شهري"}` : "لا"}</p></div>
            <div><p className="text-text-muted">تاريخ البداية</p><p>{formatDate(viewModal.startDate)}</p></div>
            <div><p className="text-text-muted">تاريخ النهاية</p><p>{viewModal.endDate ? formatDate(viewModal.endDate) : "دائم"}</p></div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setViewModal(null)}>إغلاق</Button>
            <Button onClick={() => { setViewModal(null); openEdit(viewModal); }}>تعديل</Button>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}
