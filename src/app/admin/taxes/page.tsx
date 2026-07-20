"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Calculator, Percent, DollarSign } from "lucide-react";
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
import { Toggle } from "@/components/ui/Toggle";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";

type TaxRate = {
  id: string;
  name: string;
  rate: number;
  type: "percentage" | "fixed";
  appliesTo: "all" | "product" | "category" | "region" | "customer_group";
  targetName: string;
  inclusive: boolean;
  country: string;
  exemptProducts: boolean;
  exemptCustomers: boolean;
  status: "active" | "inactive";
  [key: string]: unknown;
};

const initialData: TaxRate[] = [
  { id: "1", name: "ضريبة القيمة المضافة (VAT)", rate: 15, type: "percentage", appliesTo: "all", targetName: "الكل", inclusive: false, country: "SA", exemptProducts: false, exemptCustomers: false, status: "active" },
  { id: "2", name: "ضريبة المنتجات الرقمية", rate: 15, type: "percentage", appliesTo: "all", targetName: "الكل", inclusive: true, country: "SA", exemptProducts: false, exemptCustomers: false, status: "active" },
  { id: "3", name: "ضريبة الخدمات التعليمية", rate: 5, type: "percentage", appliesTo: "category", targetName: "تعليم", inclusive: false, country: "SA", exemptProducts: false, exemptCustomers: false, status: "active" },
  { id: "4", name: "رسوم إدارية ثابتة", rate: 10, type: "fixed", appliesTo: "all", targetName: "الكل", inclusive: false, country: "SA", exemptProducts: false, exemptCustomers: false, status: "inactive" },
  { id: "5", name: "ضريبة الإمارات", rate: 5, type: "percentage", appliesTo: "all", targetName: "الكل", inclusive: true, country: "AE", exemptProducts: false, exemptCustomers: false, status: "active" },
  { id: "6", name: "ضريبة مصر", rate: 14, type: "percentage", appliesTo: "all", targetName: "الكل", inclusive: true, country: "EG", exemptProducts: false, exemptCustomers: false, status: "active" },
];

const appliesToLabels: Record<string, string> = { all: "الكل", product: "منتج", category: "تصنيف", region: "منطقة", customer_group: "مجموعة عملاء" };
const countryLabels: Record<string, string> = { SA: "🇸🇦 السعودية", AE: "🇦🇪 الإمارات", EG: "🇪🇬 مصر", KW: "🇰🇼 الكويت", BH: "🇧🇭 البحرين", QA: "🇶🇦 قطر", OM: "🇴🇲 عمان" };

export default function TaxesPage() {
  const crud = useCrud<TaxRate>({ initialData, searchFields: ["name", "targetName"], defaultSortKey: "name" });
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", rate: 0, type: "percentage" as TaxRate["type"], appliesTo: "all" as TaxRate["appliesTo"], targetName: "", inclusive: false, country: "SA", exemptProducts: false, exemptCustomers: false });
  const [taxCalc, setTaxCalc] = useState({ amount: 100, taxId: "1" });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const openCreate = () => { setEditing(null); setForm({ name: "", rate: 0, type: "percentage", appliesTo: "all", targetName: "", inclusive: false, country: "SA", exemptProducts: false, exemptCustomers: false }); setShowModal(true); };
  const openEdit = (t: TaxRate) => { setEditing(t); setForm({ name: t.name, rate: t.rate, type: t.type, appliesTo: t.appliesTo, targetName: t.targetName, inclusive: t.inclusive, country: t.country, exemptProducts: t.exemptProducts, exemptCustomers: t.exemptCustomers }); setShowModal(true); };

  const handleSave = useCallback(() => {
    if (!form.name.trim()) { toast.error("خطأ", "اسم الضريبة مطلوب"); return; }
    if (form.rate <= 0) { toast.error("خطأ", "النسبة/المبلغ يجب أن يكون أكبر من صفر"); return; }
    if (editing) { crud.update(editing.id, form); toast.success("تم التعديل", "تم تعديل الضريبة بنجاح"); }
    else { crud.add({ id: Date.now().toString(), ...form, status: "active" }); toast.success("تمت الإضافة", "تم إضافة الضريبة بنجاح"); }
    setShowModal(false);
  }, [form, editing, crud, toast]);

  const handleDelete = useCallback(() => {
    if (!deletingId) return;
    crud.remove(deletingId);
    toast.success("تم الحذف", "تم حذف الضريبة بنجاح");
    setShowDelete(false);
    setDeletingId(null);
  }, [deletingId, crud, toast]);

  const handleToggleStatus = (t: TaxRate) => { crud.update(t.id, { status: t.status === "active" ? "inactive" : "active" }); toast.success("تم التحديث", `تم تغيير حالة "${t.name}"`); };

  const calculateTax = () => {
    const tax = crud.data.find((t) => t.id === taxCalc.taxId);
    if (!tax) return;
    if (tax.type === "percentage") setCalcResult((taxCalc.amount * tax.rate) / 100);
    else setCalcResult(tax.rate);
  };

  const activeCount = crud.data.filter((t) => t.status === "active").length;
  const activeTaxes = crud.data.filter((t) => t.status === "active" && t.type === "percentage");
  const avgRate = activeTaxes.length > 0 ? activeTaxes.reduce((s, t) => s + t.rate, 0) / activeTaxes.length : 0;

  const columns = [
    { key: "name" as const, label: "اسم الضريبة", sortable: true },
    { key: "rate" as const, label: "النسبة", sortable: true, render: (_: unknown, row: TaxRate) => <span className="font-semibold text-primary">{row.type === "percentage" ? `${row.rate}%` : `${row.rate} ر.س`}</span> },
    { key: "appliesTo" as const, label: "تنطبق على", render: (_: unknown, row: TaxRate) => <Badge variant="info">{appliesToLabels[row.appliesTo]}{row.appliesTo !== "all" ? `: ${row.targetName}` : ""}</Badge> },
    { key: "country" as const, label: "الدولة", sortable: true, render: (v: unknown) => <span>{countryLabels[String(v)] || String(v)}</span> },
    { key: "inclusive" as const, label: "شامل", render: (v: unknown) => v ? <Badge variant="success">شامل</Badge> : <Badge variant="default">غير شامل</Badge> },
    { key: "status" as const, label: "الحالة", render: (_: unknown, row: TaxRate) => <Toggle checked={row.status === "active"} onChange={() => handleToggleStatus(row)} /> },
    { key: "id" as const, label: "الإجراءات", className: "w-20", render: (_: unknown, row: TaxRate) => <div className="flex items-center gap-1"><Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} /><Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => { setDeletingId(row.id); setShowDelete(true); }} /></div> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="الضرائب" subtitle="إدارة نسب وقواعد الضرائب" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة ضريبة</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<DollarSign size={20} />} label="إجمالي الضرائب" value={crud.data.length} color="primary" />
        <StatCard icon={<Percent size={20} />} label="الضرائب النشطة" value={activeCount} color="success" />
        <StatCard icon={<Calculator size={20} />} label="متوسط النسبة" value={`${avgRate.toFixed(1)}%`} color="info" />
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-text mb-4">حاسبة الضرائب</h3>
        <div className="flex flex-wrap items-end gap-4">
          <Input label="المبلغ" type="number" value={taxCalc.amount.toString()} onChange={(e) => setTaxCalc((p) => ({ ...p, amount: Number(e.target.value) }))} className="w-40" />
          <Select label="نوع الضريبة" options={crud.data.filter((t) => t.status === "active").map((t) => ({ value: t.id, label: `${t.name} (${t.type === "percentage" ? t.rate + "%" : t.rate + " ر.س"})` }))} value={taxCalc.taxId} onChange={(e) => setTaxCalc((p) => ({ ...p, taxId: e.target.value }))} />
          <Button onClick={calculateTax} icon={<Calculator size={14} />}>حساب</Button>
          {calcResult !== null && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-text-muted">الضريبة</p>
              <p className="text-xl font-bold text-primary">{calcResult.toFixed(2)} ر.س</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث في الضرائب..." onChange={crud.setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الأنواع" }, { value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }]} value={crud.filters.type || ""} onChange={(e) => crud.setFilter("type", e.target.value)} />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "active", label: "نشط" }, { value: "inactive", label: "غير نشط" }]} value={crud.filters.status || ""} onChange={(e) => crud.setFilter("status", e.target.value)} />
      </div>

      <DataTable columns={columns} data={crud.paginatedData} rowKey="id" emptyMessage="لا توجد ضرائب" sortable exportable striped
        pagination={{ currentPage: crud.page, totalPages: crud.totalPages, totalItems: crud.totalItems, itemsPerPage: crud.perPage, onPageChange: crud.setPage, onItemsPerPageChange: crud.setPerPage }} />

      {showModal && (
        <Modal open onClose={() => setShowModal(false)} title={editing ? "تعديل الضريبة" : "إضافة ضريبة"} size="md">
          <div className="space-y-4">
            <Input label="اسم الضريبة" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="مثال: ضريبة القيمة المضافة" />
            <div className="grid grid-cols-2 gap-4">
              <Select label="النوع" options={[{ value: "percentage", label: "نسبة مئوية" }, { value: "fixed", label: "مبلغ ثابت" }]} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as TaxRate["type"] }))} />
              <Input label={form.type === "percentage" ? "النسبة المئوية (%)" : "المبلغ الثابت"} type="number" value={form.rate.toString()} onChange={(e) => setForm((p) => ({ ...p, rate: Number(e.target.value) }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="تنطبق على" options={[{ value: "all", label: "الكل" }, { value: "product", label: "منتج" }, { value: "category", label: "تصنيف" }, { value: "region", label: "منطقة" }, { value: "customer_group", label: "مجموعة عملاء" }]} value={form.appliesTo} onChange={(e) => setForm((p) => ({ ...p, appliesTo: e.target.value as TaxRate["appliesTo"] }))} />
              <Select label="الدولة" options={Object.entries(countryLabels).map(([v, l]) => ({ value: v, label: l }))} value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
            </div>
            {form.appliesTo !== "all" && <Input label="الهدف المحدد" value={form.targetName} onChange={(e) => setForm((p) => ({ ...p, targetName: e.target.value }))} placeholder="اسم التصنيف أو المنطقة" />}
            <div className="grid grid-cols-3 gap-4">
              <Toggle checked={form.inclusive} onChange={(v) => setForm((p) => ({ ...p, inclusive: v }))} label="شاملة للسعر" description="السعر يشمل الضريبة" />
              <Toggle checked={form.exemptProducts} onChange={(v) => setForm((p) => ({ ...p, exemptProducts: v }))} label="إعفاء منتجات" description="بعض المنتجات معفاة" />
              <Toggle checked={form.exemptCustomers} onChange={(v) => setForm((p) => ({ ...p, exemptCustomers: v }))} label="إعفاء عملاء" description="بعض العملاء معفيون" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إضافة الضريبة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={showDelete} onClose={() => { setShowDelete(false); setDeletingId(null); }} onConfirm={handleDelete} title="حذف الضريبة" message="هل أنت متأكد من حذف هذه الضريبة؟ لا يمكن التراجع عن هذا الإجراء." confirmLabel="حذف" variant="danger" />
    </div>
  );
}
