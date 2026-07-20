"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  icon: string;
  [key: string]: unknown;
}

const mockCategories: Category[] = [
  { id: "1", name: "إلكترونيات", slug: "electronics", description: "أجهزة إلكترونية ومعدات تقنية", productCount: 45, icon: "💻" },
  { id: "2", name: "أزياء", slug: "fashion", description: "ملابس وإكسسوارات عصرية", productCount: 32, icon: "👔" },
  { id: "3", name: "منزل ومطبخ", slug: "home-kitchen", description: "أثاث وأدوات منزلية ومطبخية", productCount: 28, icon: "🏠" },
  { id: "4", name: "رياضة", slug: "sports", description: "معدات رياضية ومعدات لياقة", productCount: 19, icon: "⚽" },
  { id: "5", name: "جمال وصحة", slug: "beauty-health", description: "منتجات العناية بالبشرة والجسم", productCount: 15, icon: "✨" },
  { id: "6", name: "كتب وتعليم", slug: "books-education", description: "كتب تعليمية وأدوات مكتبية", productCount: 12, icon: "📚" },
];

const iconOptions = ["📁", "💻", "👔", "🏠", "⚽", "✨", "📚", "🎮", "🎵", "📷", "🚗", "🎁"];

export default function CategoriesPage() {
  const { success, error: showError } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("📁");

  const {
    filteredData,
    search,
    setSearch,
    add,
    update,
    remove,
  } = useCrud<Category>({
    initialData: mockCategories,
    searchFields: ["name", "description"],
    itemsPerPage: 100,
  });

  const openAddModal = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormDescription("");
    setFormIcon("📁");
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((cat: Category) => {
    setEditTarget(cat);
    setFormName(cat.name);
    setFormDescription(cat.description);
    setFormIcon(cat.icon);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم التصنيف");
      return;
    }
    if (editTarget) {
      update(editTarget.id, {
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        description: formDescription,
        icon: formIcon,
      });
      success("تم التحديث", `تم تحديث تصنيف "${formName}" بنجاح`);
    } else {
      add({
        id: generateId(),
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        description: formDescription,
        productCount: 0,
        icon: formIcon,
      });
      success("تمت الإضافة", `تم إضافة تصنيف "${formName}" بنجاح`);
    }
    setShowModal(false);
    setFormName("");
    setFormDescription("");
    setFormIcon("📁");
    setEditTarget(null);
  }, [formName, formDescription, formIcon, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف تصنيف "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="التصنيفات"
        subtitle="إدارة تصنيفات المنتجات"
        actions={
          <Button icon={<Plus size={16} />} onClick={openAddModal}>
            إضافة تصنيف
          </Button>
        }
      />

      <SearchInput placeholder="بحث في التصنيفات..." value={search} onChange={setSearch} className="w-64" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((category) => (
          <Card key={category.id} padding="md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-surface-hover flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-text">{category.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{category.description}</p>
                  <p className="text-xs text-text-secondary mt-1">{category.productCount} منتج</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEditModal(category)} />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  className="text-danger hover:text-danger"
                  onClick={() => setDeleteTarget(category)}
                />
              </div>
            </div>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted">
            لا توجد تصنيفات
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف التصنيف"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditTarget(null); }} title={editTarget ? "تعديل التصنيف" : "إضافة تصنيف جديد"}>
        <div className="space-y-4">
          <Input
            label="اسم التصنيف"
            placeholder="أدخل اسم التصنيف"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <Textarea
            label="الوصف"
            placeholder="أدخل وصف التصنيف..."
            rows={3}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setFormIcon(icon)}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                    formIcon === icon ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-hover hover:bg-border-light"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditTarget(null); }}>إلغاء</Button>
            <Button onClick={handleSave}>{editTarget ? "تحديث" : "إضافة"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
