"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, DollarSign, Star, RotateCcw } from "lucide-react";
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

type Currency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  autoUpdate: boolean;
  displayFormat: string;
  status: "active" | "inactive";
  [key: string]: unknown;
};

const initialData: Currency[] = [
  { id: "1", code: "SAR", name: "الريال السعودي", symbol: "ر.س", exchangeRate: 1, isDefault: true, autoUpdate: true, displayFormat: "371 ر.س", status: "active" },
  { id: "2", code: "AED", name: "الدرهم الإماراتي", symbol: "د.إ", exchangeRate: 0.99, isDefault: false, autoUpdate: true, displayFormat: "367 د.إ", status: "active" },
  { id: "3", code: "EGP", name: "الجنيه المصري", symbol: "ج.م", exchangeRate: 8.3, isDefault: false, autoUpdate: true, displayFormat: "3,079 ج.م", status: "active" },
  { id: "4", code: "KWD", name: "الدينار الكويتي", symbol: "د.ك", exchangeRate: 0.083, isDefault: false, autoUpdate: true, displayFormat: "30.8 د.ك", status: "active" },
  { id: "5", code: "BHD", name: "الدينار البحريني", symbol: "د.ب", exchangeRate: 0.101, isDefault: false, autoUpdate: false, displayFormat: "37.5 د.ب", status: "active" },
  { id: "6", code: "OMR", name: "الريال العماني", symbol: "ر.ع", exchangeRate: 0.103, isDefault: false, autoUpdate: false, displayFormat: "38.2 ر.ع", status: "active" },
  { id: "7", code: "QAR", name: "الريال القطري", symbol: "ر.ق", exchangeRate: 0.98, isDefault: false, autoUpdate: true, displayFormat: "363 ر.ق", status: "active" },
  { id: "8", code: "USD", name: "الدولار الأمريكي", symbol: "$", exchangeRate: 0.27, isDefault: false, autoUpdate: true, displayFormat: "$99.8", status: "active" },
  { id: "9", code: "EUR", name: "اليورو", symbol: "€", exchangeRate: 0.25, isDefault: false, autoUpdate: true, displayFormat: "€92.4", status: "active" },
];

export default function CurrenciesPage() {
  const crud = useCrud<Currency>({ initialData, searchFields: ["name", "code", "symbol"], defaultSortKey: "code" });
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", name: "", symbol: "", exchangeRate: 1, displayFormat: "" });

  const activeCount = crud.data.filter((c) => c.status === "active").length;
  const defaultCurrency = crud.data.find((c) => c.isDefault);

  const openCreate = () => { setEditing(null); setForm({ code: "", name: "", symbol: "", exchangeRate: 1, displayFormat: "" }); setShowModal(true); };
  const openEdit = (c: Currency) => { setEditing(c); setForm({ code: c.code, name: c.name, symbol: c.symbol, exchangeRate: c.exchangeRate, displayFormat: c.displayFormat }); setShowModal(true); };

  const handleSave = useCallback(() => {
    if (!form.name.trim()) { toast.error("خطأ", "اسم العملة مطلوب"); return; }
    if (!form.code.trim()) { toast.error("خطأ", "كود العملة مطلوب"); return; }
    if (editing) { crud.update(editing.id, form); toast.success("تم التعديل", "تم تعديل العملة بنجاح"); }
    else { crud.add({ id: Date.now().toString(), ...form, isDefault: false, autoUpdate: false, status: "active" }); toast.success("تمت الإضافة", "تم إضافة العملة بنجاح"); }
    setShowModal(false);
  }, [form, editing, crud, toast]);

  const handleDelete = useCallback(() => {
    if (!deletingId) return;
    const currency = crud.getById(deletingId);
    if (currency?.isDefault) { toast.error("خطأ", "لا يمكن حذف العملة الافتراضية"); setShowDelete(false); return; }
    crud.remove(deletingId);
    toast.success("تم الحذف", "تم حذف العملة بنجاح");
    setShowDelete(false);
    setDeletingId(null);
  }, [deletingId, crud, toast]);

  const setDefault = (id: string) => { crud.data.forEach((c) => crud.update(c.id, { isDefault: c.id === id })); toast.success("تم التحديث", "تم تغيير العملة الافتراضية بنجاح"); };
  const toggleStatus = (id: string) => { const c = crud.getById(id); if (c) crud.update(id, { status: c.status === "active" ? "inactive" : "active" }); };
  const toggleAutoUpdate = (id: string) => { const c = crud.getById(id); if (c) crud.update(id, { autoUpdate: !c.autoUpdate }); };

  const columns = [
    { key: "code" as const, label: "الكود", sortable: true, render: (v: unknown) => <code className="font-mono font-bold text-primary">{String(v)}</code> },
    { key: "name" as const, label: "العملة", sortable: true },
    { key: "symbol" as const, label: "الرمز", render: (v: unknown) => <span className="text-lg">{String(v)}</span> },
    { key: "exchangeRate" as const, label: "سعر الصرف", sortable: true, render: (v: unknown, row: Currency) => <span className="font-mono">{String(v)} {row.code !== "SAR" ? "SAR" : ""}</span> },
    { key: "displayFormat" as const, label: "شكل العرض", render: (v: unknown) => <span className="text-sm text-text-secondary">{String(v)}</span> },
    { key: "autoUpdate" as const, label: "تحديث تلقائي", render: (_: unknown, row: Currency) => <Toggle checked={!!row.autoUpdate} onChange={() => toggleAutoUpdate(row.id)} /> },
    { key: "isDefault" as const, label: "الافتراضي", render: (v: unknown, row: Currency) => v ? <Badge variant="info"><Star size={10} className="ml-1" />افتراضي</Badge> : <Button variant="ghost" size="sm" icon={<Star size={12} />} onClick={() => setDefault(row.id)}>تعيين</Button> },
    { key: "status" as const, label: "الحالة", render: (_: unknown, row: Currency) => <Toggle checked={row.status === "active"} onChange={() => toggleStatus(row.id)} /> },
    { key: "id" as const, label: "الإجراءات", className: "w-20", render: (_: unknown, row: Currency) => <div className="flex items-center gap-1"><Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />{!row.isDefault && <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => { setDeletingId(row.id); setShowDelete(true); }} />}</div> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="العملات" subtitle="إدارة العملات وأسعار الصرف" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة عملة</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<DollarSign size={20} />} label="إجمالي العملات" value={crud.data.length} color="primary" />
        <StatCard icon={<RotateCcw size={20} />} label="العملات النشطة" value={activeCount} color="success" />
        <StatCard icon={<Star size={20} />} label="العملة الافتراضية" value={defaultCurrency?.code || "—"} color="info" />
      </div>

      {defaultCurrency && (
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><DollarSign size={20} className="text-primary" /></div>
            <div>
              <p className="text-sm text-text-muted">العملة الافتراضية</p>
              <p className="text-xl font-bold text-text">{defaultCurrency.name} ({defaultCurrency.code}) — {defaultCurrency.symbol}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث في العملات..." onChange={crud.setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "active", label: "نشط" }, { value: "inactive", label: "غير نشط" }]} value={crud.filters.status || ""} onChange={(e) => crud.setFilter("status", e.target.value)} />
      </div>

      <DataTable columns={columns} data={crud.paginatedData} rowKey="id" emptyMessage="لا توجد عملات" sortable exportable striped
        pagination={{ currentPage: crud.page, totalPages: crud.totalPages, totalItems: crud.totalItems, itemsPerPage: crud.perPage, onPageChange: crud.setPage, onItemsPerPageChange: crud.setPerPage }} />

      {showModal && (
        <Modal open onClose={() => setShowModal(false)} title={editing ? "تعديل العملة" : "إضافة عملة"} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="كود العملة" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="مثال: SAR" dir="ltr" maxLength={3} />
              <Input label="الرمز" value={form.symbol} onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))} placeholder="مثال: ر.س" />
            </div>
            <Input label="اسم العملة" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="مثال: الريال السعودي" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="سعر الصرف (نسبة للريال)" type="number" value={form.exchangeRate.toString()} onChange={(e) => setForm((p) => ({ ...p, exchangeRate: Number(e.target.value) }))} />
              <Input label="شكل العرض" value={form.displayFormat} onChange={(e) => setForm((p) => ({ ...p, displayFormat: e.target.value }))} placeholder="مثال: 371 ر.س" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إضافة العملة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={showDelete} onClose={() => { setShowDelete(false); setDeletingId(null); }} onConfirm={handleDelete} title="حذف العملة" message="هل أنت متأكد من حذف هذه العملة؟ لا يمكن التراجع عن هذا الإجراء." confirmLabel="حذف" variant="danger" />
    </div>
  );
}
