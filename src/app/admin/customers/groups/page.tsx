"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Folder,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

type CustomerGroup = {
  id: string;
  name: string;
  description: string;
  color: string;
  customerCount: number;
  createdAt: string;
};

const colorOptions = [
  { value: "#6366f1", label: "أزرق" },
  { value: "#10b981", label: "أخضر" },
  { value: "#f59e0b", label: "أصفر" },
  { value: "#ef4444", label: "أحمر" },
  { value: "#8b5cf6", label: "بنفسجي" },
  { value: "#ec4899", label: "وردي" },
  { value: "#14b8a6", label: "أزرق فاتح" },
  { value: "#f97316", label: "برتقالي" },
];

const mockGroups: CustomerGroup[] = [
  { id: "1", name: "VIP", description: "العملاء المميزون ذوو المشتريات الكبيرة", color: "#f59e0b", customerCount: 12, createdAt: "2023-01-15" },
  { id: "2", name: "oyal", description: "العملاء الدائمون الذين يشترون بانتظام", color: "#6366f1", customerCount: 35, createdAt: "2023-03-20" },
  { id: "3", name: "أعضاء جدد", description: "العملاء المسجلون حديثاً", color: "#10b981", customerCount: 28, createdAt: "2024-01-01" },
  { id: "4", name: "أعضاء ذهبيون", description: "المستوى الأعلى من الولاء", color: "#f59e0b", customerCount: 5, createdAt: "2023-06-10" },
  { id: "5", name: "عملاء ب一総ر", description: "العملاء الذين يتابعون الب総ر", color: "#8b5cf6", customerCount: 18, createdAt: "2024-02-15" },
  { id: "6", name: "عملاء المبيعات", description: "العملاء الذين يشترون أثناء التخفيضات", color: "#ef4444", customerCount: 42, createdAt: "2023-09-01" },
];

export default function CustomerGroupsPage() {
  const { success, error: showError } = useToast();
  const [addModal, setAddModal] = useState(false);
  const [editGroup, setEditGroup] = useState<CustomerGroup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerGroup | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState("#6366f1");

  const {
    data: groups,
    add,
    update,
    remove,
  } = useCrud<CustomerGroup>({
    initialData: mockGroups,
    searchFields: ["name"],
    itemsPerPage: 20,
  });

  const openAdd = useCallback(() => {
    setFormName("");
    setFormDescription("");
    setFormColor("#6366f1");
    setAddModal(true);
  }, []);

  const openEdit = useCallback((group: CustomerGroup) => {
    setEditGroup(group);
    setFormName(group.name);
    setFormDescription(group.description);
    setFormColor(group.color);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم المجموعة");
      return;
    }
    if (editGroup) {
      update(editGroup.id, { name: formName, description: formDescription, color: formColor });
      success("تم التحديث", `تم تحديث مجموعة "${formName}" بنجاح`);
      setEditGroup(null);
    } else {
      add({
        id: generateId(),
        name: formName,
        description: formDescription,
        color: formColor,
        customerCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      });
      success("تمت الإضافة", `تم إضافة مجموعة "${formName}" بنجاح`);
      setAddModal(false);
    }
    setFormName("");
    setFormDescription("");
    setFormColor("#6366f1");
  }, [formName, formDescription, formColor, editGroup, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مجموعة "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
        <Link href="/admin/customers" className="hover:text-primary transition-colors">
          العملاء
        </Link>
        <ArrowRight size={14} />
        <span className="text-text">المجموعات</span>
      </div>

      <PageHeader
        title="مجموعات العملاء"
        subtitle="تنظيم العملاء في مجموعات"
        actions={<Button icon={<Plus size={16} />} onClick={openAdd}>إضافة مجموعة</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full" style={{ backgroundColor: group.color }} />
            <div className="pr-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    <Folder size={20} style={{ color: group.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{group.name}</h3>
                    <p className="text-xs text-text-muted">{group.customerCount} عميل</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(group)} />
                  <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(group)} />
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3">{group.description || "لا يوجد وصف"}</p>
              <div className="flex items-center justify-between">
                <Badge variant="default">
                  <Tag size={12} />
                  {group.customerCount} عميل
                </Badge>
                <span className="text-xs text-text-muted">أنشئ: {group.createdAt}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المجموعة"
        message={`هل أنت متأكد من حذف مجموعة "${deleteTarget?.name}"؟ لن يتم حذف العملاء في هذه المجموعة.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      {(addModal || editGroup) && (
        <Modal open onClose={() => { setAddModal(false); setEditGroup(null); }} title={editGroup ? "تعديل المجموعة" : "إضافة مجموعة جديدة"} size="md">
          <div className="space-y-4">
            <Input label="اسم المجموعة" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="أدخل اسم المجموعة" required />
            <Textarea label="الوصف" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف المجموعة (اختياري)" rows={3} />
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">اللون</label>
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormColor(opt.value)}
                    className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer ${
                      formColor === opt.value ? "border-text scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: opt.value }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setAddModal(false); setEditGroup(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editGroup ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
