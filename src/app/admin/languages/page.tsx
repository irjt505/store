"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, Edit, Trash2, Star, Globe, Languages as LanguagesIcon, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type Language = {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isDefault: boolean;
  isRtl: boolean;
  completion: number;
  status: "active" | "inactive" | "draft";
  [key: string]: unknown;
};

const initialLanguages: Language[] = [
  { id: "1", code: "ar", name: "العربية", nativeName: "العربية", flag: "🇸🇦", isDefault: true, isRtl: true, completion: 100, status: "active" },
  { id: "2", code: "en", name: "الإنجليزية", nativeName: "English", flag: "🇺🇸", isDefault: false, isRtl: false, completion: 85, status: "active" },
];

const statusConfig: Record<string, { label: string; variant: "success" | "default" | "warning" }> = {
  active: { label: "نشطة", variant: "success" },
  inactive: { label: "غير نشطة", variant: "default" },
  draft: { label: "مسودة", variant: "warning" },
};

export default function LanguagesPage() {
  const { success, error: showError } = useToast();
  const [languages, setLanguages] = useState(initialLanguages);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Language | null>(null);
  const [form, setForm] = useState({ code: "", name: "", nativeName: "", flag: "", isRtl: false });
  const [deleteModal, setDeleteModal] = useState<Language | null>(null);

  const openCreate = useCallback(() => { setEditing(null); setForm({ code: "", name: "", nativeName: "", flag: "", isRtl: false }); setModalOpen(true); }, []);
  const openEdit = useCallback((l: Language) => { setEditing(l); setForm({ code: l.code, name: l.name, nativeName: l.nativeName, flag: l.flag, isRtl: l.isRtl }); setModalOpen(true); }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim() || !form.code.trim()) { showError("خطأ", "الاسم والكود مطلوبان"); return; }
    if (form.code.length !== 2) { showError("خطأ", "كود اللغة يجب أن يكون حرفين"); return; }
    if (editing) {
      setLanguages((prev) => prev.map((l) => l.id === editing.id ? { ...l, ...form } : l));
      success("تم التحديث", `تم تحديث اللغة "${form.name}" بنجاح`);
    } else {
      setLanguages((prev) => [...prev, { id: Date.now().toString(), ...form, isDefault: false, completion: 0, status: "draft" as const }]);
      success("تمت الإضافة", `تم إضافة اللغة "${form.name}" بنجاح`);
    }
    setModalOpen(false);
  }, [form, editing, success, showError]);

  const handleDelete = useCallback((l: Language) => {
    if (l.isDefault) { showError("خطأ", "لا يمكن حذف اللغة الافتراضية"); return; }
    setLanguages((prev) => prev.filter((x) => x.id !== l.id));
    setDeleteModal(null);
    success("تم الحذف", `تم حذف اللغة "${l.name}" بنجاح`);
  }, [success, showError]);

  const setDefault = useCallback((id: string) => {
    setLanguages((prev) => prev.map((l) => ({ ...l, isDefault: l.id === id })));
    success("تم التغيير", "تم تغيير اللغة الافتراضية بنجاح");
  }, [success]);

  const toggleStatus = useCallback((id: string) => {
    setLanguages((prev) => prev.map((l) => l.id === id ? { ...l, status: l.status === "active" ? "inactive" : "active" } : l));
  }, []);

  const activeCount = languages.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader title="اللغات" subtitle={`إدارة اللغات والترجمات (${activeCount} نشطة)`} actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة لغة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {languages.map((lang) => (
          <Card key={lang.id} className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text">{lang.name}</h3>
                    {lang.isDefault && <Badge variant="info"><Star size={10} className="ml-1" />افتراضي</Badge>}
                  </div>
                  <p className="text-sm text-text-muted">{lang.nativeName} ({lang.code})</p>
                </div>
              </div>
              <Badge variant={statusConfig[lang.status].variant}>{statusConfig[lang.status].label}</Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">نسبة إكمال الترجمة</span>
                <span className="text-xs font-medium text-text">{lang.completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${lang.completion}%`, backgroundColor: lang.completion === 100 ? "#10B981" : lang.completion >= 50 ? "#6366F1" : "#F59E0B" }} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                {lang.isRtl ? <Badge variant="default">RTL — من اليمين لليسار</Badge> : <Badge variant="default">LTR — من اليسار لليمين</Badge>}
                {lang.completion === 100 && <Badge variant="success"><Check size={10} className="ml-1" />مكتمل</Badge>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => openEdit(lang)} />
                {!lang.isDefault && <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteModal(lang)} />}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(lang.id)}>{lang.status === "active" ? "تعطيل" : "تفعيل"}</Button>
                {!lang.isDefault && <Button variant="ghost" size="sm" onClick={() => setDefault(lang.id)}>تعيين كافتراضي</Button>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modalOpen && (
        <Modal open onClose={() => setModalOpen(false)} title={editing ? "تعديل اللغة" : "إضافة لغة"} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="الكود" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toLowerCase() }))} placeholder="مثال: ar" dir="ltr" maxLength={2} helperText="كود ISO 639-1 (حرفان)" />
              <Input label="العلم (إيموجي)" value={form.flag} onChange={(e) => setForm((p) => ({ ...p, flag: e.target.value }))} placeholder="🇸🇦" />
            </div>
            <Input label="الاسم بالعربية" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="مثال: الإنجليزية" />
            <Input label="الاسم الأصلي" value={form.nativeName} onChange={(e) => setForm((p) => ({ ...p, nativeName: e.target.value }))} placeholder="مثال: English" />
            <Toggle checked={form.isRtl} onChange={(v) => setForm((p) => ({ ...p, isRtl: v }))} label="اللغة من اليمين لليسار (RTL)" description="تفعيل هذا الخيار للغات مثل العربية والعبرية" />
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إضافة اللغة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={() => deleteModal && handleDelete(deleteModal)} title="حذف اللغة" message={`هل أنت متأكد من حذف "${deleteModal?.name}"؟`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
    </div>
  );
}
