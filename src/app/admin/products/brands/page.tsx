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

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  [key: string]: unknown;
}

const mockBrands: Brand[] = [
  { id: "1", name: "Apple", slug: "apple", description: "أجهزة إلكترونية ومعدات تقنية", productCount: 24 },
  { id: "2", name: "Samsung", slug: "samsung", description: "أجهزة إلكترونية ومعدات تقنية", productCount: 18 },
  { id: "3", name: "Nike", slug: "nike", description: "ملابس ومعدات رياضية", productCount: 15 },
  { id: "4", name: "Adidas", slug: "adidas", description: "ملابس ومعدات رياضية", productCount: 12 },
  { id: "5", name: "Sony", slug: "sony", description: "أجهزة إلكترونية وترفيهية", productCount: 20 },
  { id: "6", name: "LG", slug: "lg", description: "أجهزة كهربائية وإلكترونية", productCount: 14 },
  { id: "7", name: "Dyson", slug: "dyson", description: "أجهزة منزلية مبتكرة", productCount: 8 },
  { id: "8", name: "Bosch", slug: "bosch", description: "أدوات ومعدات منزلية", productCount: 10 },
];

const brandColors = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-red-100 text-red-700",
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
];

export default function BrandsPage() {
  const { success, error: showError } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const {
    filteredData,
    search,
    setSearch,
    add,
    update,
    remove,
  } = useCrud<Brand>({
    initialData: mockBrands,
    searchFields: ["name", "description"],
    itemsPerPage: 100,
  });

  const openAdd = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormDescription("");
    setShowModal(true);
  }, []);

  const openEdit = useCallback((brand: Brand) => {
    setEditTarget(brand);
    setFormName(brand.name);
    setFormDescription(brand.description);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم العلامة التجارية");
      return;
    }
    if (editTarget) {
      update(editTarget.id, {
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        description: formDescription,
      });
      success("تم التحديث", `تم تحديث "${formName}" بنجاح`);
    } else {
      add({
        id: generateId(),
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        description: formDescription,
        productCount: 0,
      });
      success("تمت الإضافة", `تم إضافة "${formName}" بنجاح`);
    }
    setShowModal(false);
    setEditTarget(null);
  }, [formName, formDescription, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="العلامات التجارية"
        subtitle="إدارة العلامات التجارية"
        actions={
          <Button icon={<Plus size={16} />} onClick={openAdd}>
            إضافة علامة تجارية
          </Button>
        }
      />

      <SearchInput placeholder="بحث في العلامات التجارية..." value={search} onChange={setSearch} className="w-64" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredData.map((brand, index) => (
          <Card key={brand.id} padding="md">
            <div className="flex flex-col items-center text-center">
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold mb-3 ${brandColors[index % brandColors.length]}`}
              >
                {brand.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-text">{brand.name}</h3>
              <p className="text-xs text-text-muted mt-1 line-clamp-2">{brand.description}</p>
              <p className="text-sm text-text-secondary mt-2">{brand.productCount} منتج</p>
              <div className="flex items-center gap-1 mt-3">
                <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(brand)} />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  className="text-danger hover:text-danger"
                  onClick={() => setDeleteTarget(brand)}
                />
              </div>
            </div>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted">لا توجد علامات تجارية</div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف العلامة التجارية"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditTarget(null); }} title={editTarget ? "تعديل العلامة التجارية" : "إضافة علامة تجارية جديدة"}>
        <div className="space-y-4">
          <Input
            label="اسم العلامة التجارية"
            placeholder="أدخل اسم العلامة التجارية"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <Textarea
            label="الوصف"
            placeholder="أدخل وصف العلامة التجارية..."
            rows={3}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditTarget(null); }}>إلغاء</Button>
            <Button onClick={handleSave}>{editTarget ? "تحديث" : "إضافة"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
