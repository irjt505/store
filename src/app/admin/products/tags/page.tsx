"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

type TagItem = {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  [key: string]: unknown;
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#84CC16"];

const initialTags: TagItem[] = [
  { id: "1", name: "مميز", slug: "featured", color: "#6366F1", productCount: 15 },
  { id: "2", name: "جديد", slug: "new", color: "#10B981", productCount: 8 },
  { id: "3", name: "الأكثر مبيعاً", slug: "bestseller", color: "#F59E0B", productCount: 12 },
  { id: "4", name: "تخفيض", slug: "sale", color: "#EF4444", productCount: 20 },
  { id: "5", name: "مجاني", slug: "free", color: "#3B82F6", productCount: 5 },
  { id: "6", name: "محدود", slug: "limited", color: "#8B5CF6", productCount: 3 },
  { id: "7", name: "محدث", slug: "updated", color: "#06B6D4", productCount: 10 },
  { id: "8", name: "حصري", slug: "exclusive", color: "#EC4899", productCount: 7 },
];

export default function TagsPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TagItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TagItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formColor, setFormColor] = useState("#6366F1");

  const {
    filteredData,
    search,
    setSearch,
    add,
    update,
    remove,
  } = useCrud<TagItem>({
    initialData: initialTags,
    searchFields: ["name"],
    itemsPerPage: 100,
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormSlug("");
    setFormColor("#6366F1");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((tag: TagItem) => {
    setEditTarget(tag);
    setFormName(tag.name);
    setFormSlug(tag.slug);
    setFormColor(tag.color);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم الوسم");
      return;
    }
    if (editTarget) {
      update(editTarget.id, { name: formName, slug: formSlug, color: formColor });
      success("تم التحديث", `تم تحديث وسم "${formName}" بنجاح`);
    } else {
      add({ id: generateId(), name: formName, slug: formSlug, color: formColor, productCount: 0 });
      success("تمت الإضافة", `تم إضافة وسم "${formName}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formName, formSlug, formColor, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف وسم "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الوسوم"
        subtitle="إدارة وسوم المنتجات للتصنيف والبحث"
        actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة وسم</Button>}
      />

      <SearchInput placeholder="بحث في الوسوم..." value={search} onChange={setSearch} className="w-64" />

      <div className="flex flex-wrap gap-3">
        {filteredData.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 hover:shadow-sm transition-shadow"
          >
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
            <div>
              <p className="font-medium text-text">{tag.name}</p>
              <p className="text-xs text-text-muted">/{tag.slug} · {tag.productCount} منتج</p>
            </div>
            <div className="flex gap-1 mr-2">
              <Button variant="ghost" size="sm" icon={<Pencil size={12} />} onClick={() => openEdit(tag)} />
              <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(tag)} />
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary">لا توجد وسوم</p>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف الوسم"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل الوسم" : "إضافة وسم"} size="sm">
        <div className="space-y-4">
          <Input
            label="اسم الوسم"
            value={formName}
            onChange={(e) => {
              const name = e.target.value;
              setFormName(name);
              setFormSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""));
            }}
            placeholder="مثال: مميز"
          />
          <Input label="الرابط المختصر" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} dir="ltr" />
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">اللون</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className={`h-8 w-8 rounded-lg cursor-pointer transition-all ${formColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
            <Button onClick={handleSave}>{editTarget ? "حفظ" : "إضافة"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
