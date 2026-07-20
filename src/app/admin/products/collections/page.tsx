"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  status: "active" | "inactive";
  [key: string]: unknown;
};

const initialCollections: Collection[] = [
  { id: "1", name: "热门数字产品", slug: "popular-digital", description: " الأكثر مبيعاً من المنتجات الرقمية", productCount: 24, status: "active" },
  { id: "2", name: "الدورات التعليمية", slug: "courses", description: "جميع الدورات التعليمية المتاحة", productCount: 12, status: "active" },
  { id: "3", name: "القوالب الاحترافية", slug: "templates", description: "قوالب جاهزة للاستخدام", productCount: 35, status: "active" },
  { id: "4", name: "البرمجيات والأدوات", slug: "software", description: "برامج وأدوات مفيدة", productCount: 8, status: "active" },
  { id: "5", name: "الكتب الإلكترونية", slug: "ebooks", description: "مجموعة الكتب والمراجع", productCount: 18, status: "active" },
  { id: "6", name: "حزم المطورين", slug: "dev-bundles", description: "حزم شاملة للمطورين", productCount: 5, status: "inactive" },
];

export default function CollectionsPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<Collection["status"]>("active");

  const {
    filteredData,
    search,
    setSearch,
    add,
    update,
    remove,
  } = useCrud<Collection>({
    initialData: initialCollections,
    searchFields: ["name", "description"],
    itemsPerPage: 100,
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormStatus("active");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((col: Collection) => {
    setEditTarget(col);
    setFormName(col.name);
    setFormSlug(col.slug);
    setFormDescription(col.description);
    setFormStatus(col.status);
    setModalOpen(true);
  }, []);

  const handleAutoSlug = useCallback((name: string) => {
    setFormName(name);
    setFormSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم المجموعة");
      return;
    }
    if (editTarget) {
      update(editTarget.id, { name: formName, slug: formSlug, description: formDescription, status: formStatus });
      success("تم التحديث", `تم تحديث مجموعة "${formName}" بنجاح`);
    } else {
      add({ id: generateId(), name: formName, slug: formSlug, description: formDescription, productCount: 0, status: formStatus });
      success("تمت الإضافة", `تم إضافة مجموعة "${formName}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formName, formSlug, formDescription, formStatus, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مجموعة "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleToggleStatus = useCallback((col: Collection) => {
    const newStatus = col.status === "active" ? "inactive" : "active";
    update(col.id, { status: newStatus });
    success("تم التغيير", `تم ${newStatus === "active" ? "تفعيل" : "إيقاف"} مجموعة "${col.name}"`);
  }, [update, success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="المجموعات"
        subtitle="تنظيم المنتجات في مجموعات"
        actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة مجموعة</Button>}
      />

      <SearchInput placeholder="بحث في المجموعات..." value={search} onChange={setSearch} className="w-64" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((col) => (
          <Card key={col.id} className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">{col.name}</h3>
                  <p className="text-xs text-text-muted">/{col.slug}</p>
                </div>
              </div>
              <button onClick={() => handleToggleStatus(col)}>
                <Badge variant={col.status === "active" ? "success" : "default"} className="cursor-pointer">
                  {col.status === "active" ? "نشطة" : "غير نشطة"}
                </Badge>
              </button>
            </div>
            <p className="mt-3 text-sm text-text-secondary">{col.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="info">{col.productCount} منتج</Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(col)} />
                <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(col)} />
              </div>
            </div>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted">لا توجد مجموعات</div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المجموعة"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل المجموعة" : "إضافة مجموعة"} size="md">
        <div className="space-y-4">
          <Input label="اسم المجموعة" value={formName} onChange={(e) => handleAutoSlug(e.target.value)} placeholder="مثال: المنتجات الجديدة" />
          <Input label="الرابط المختصر" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="new-products" dir="ltr" />
          <Input label="الوصف" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف المجموعة" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">الحالة</label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formStatus === "active" ? "bg-success/10 text-success ring-1 ring-success/30" : "bg-surface-hover text-text-muted"
                }`}
              >
                نشطة
              </button>
              <button
                onClick={() => setFormStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formStatus === "inactive" ? "bg-danger/10 text-danger ring-1 ring-danger/30" : "bg-surface-hover text-text-muted"
                }`}
              >
                غير نشطة
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
            <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إضافة"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
