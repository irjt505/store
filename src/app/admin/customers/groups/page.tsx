"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Users,
  Folder,
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
  { value: "#8b5cf6", label: "بنفسجي" },
  { value: "#2563EB", label: "أزرق" },
  { value: "#16A34A", label: "أخضر" },
  { value: "#F59E0B", label: "أصفر" },
  { value: "#DC2626", label: "أحمر" },
  { value: "#EC4899", label: "وردي" },
  { value: "#14B8A6", label: "أزرق فاتح" },
  { value: "#F97316", label: "برتقالي" },
];

const mockGroups: CustomerGroup[] = [
  {
    id: "1",
    name: "VIP",
    description: "العملاء المميزون ذوو المشتريات الكبيرة والتفاعل العالي",
    color: "#8b5cf6",
    customerCount: 2,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "مكررون",
    description: "العملاء الدائمون الذين يشترون بانتظام",
    color: "#2563EB",
    customerCount: 3,
    createdAt: "2024-03-20",
  },
  {
    id: "3",
    name: "جدد",
    description: "العملاء المسجلون حديثاً والجديدون على المتجر",
    color: "#16A34A",
    customerCount: 0,
    createdAt: "2025-01-01",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function CustomerGroupsPage() {
  const { success, error: showError } = useToast();
  const [addModal, setAddModal] = useState(false);
  const [editGroup, setEditGroup] = useState<CustomerGroup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerGroup | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState("#8b5cf6");

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
    setFormColor("#8b5cf6");
    setAddModal(true);
  }, []);

  const openEdit = useCallback((group: CustomerGroup) => {
    setFormName(group.name);
    setFormDescription(group.description);
    setFormColor(group.color);
    setEditGroup(group);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم المجموعة");
      return;
    }
    if (editGroup) {
      update(editGroup.id, {
        name: formName,
        description: formDescription,
        color: formColor,
      });
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
    setFormColor("#8b5cf6");
  }, [
    formName,
    formDescription,
    formColor,
    editGroup,
    add,
    update,
    success,
    showError,
  ]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مجموعة "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link
            href="/admin/customers"
            className="hover:text-primary transition-colors"
          >
            العملاء
          </Link>
          <ArrowRight size={14} />
          <span className="text-text">المجموعات</span>
        </div>
        <PageHeader
          title="مجموعات العملاء"
          subtitle="تنظيم عملاءك في مجموعات"
          actions={
            <Button icon={<Plus size={16} />} onClick={openAdd}>
              إضافة مجموعة
            </Button>
          }
        />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {groups.map((group) => (
          <motion.div key={group.id} variants={item}>
            <Card
              className="relative overflow-hidden group"
              padding="none"
              hover
            >
              <div
                className="absolute top-0 right-0 w-1 h-full transition-all duration-200 group-hover:w-1.5"
                style={{ backgroundColor: group.color }}
              />
              <div className="p-5 pl-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${group.color}15` }}
                    >
                      <Folder
                        size={20}
                        style={{ color: group.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{group.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {group.customerCount} عميل
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Pencil size={14} />}
                      onClick={() => openEdit(group)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      className="text-danger hover:text-danger"
                      onClick={() => setDeleteTarget(group)}
                    />
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {group.description || "لا يوجد وصف"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="default" size="sm">
                    <Users size={12} />
                    {group.customerCount} عميل
                  </Badge>
                  <span className="text-[11px] text-text-muted">
                    {group.createdAt}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <button
            type="button"
            onClick={openAdd}
            className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-transparent hover:bg-primary-light/30 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-hover group-hover:bg-primary-light transition-colors">
              <Plus
                size={20}
                className="text-text-muted group-hover:text-primary transition-colors"
              />
            </div>
            <span className="text-sm font-medium text-text-muted group-hover:text-primary transition-colors">
              إضافة مجموعة جديدة
            </span>
          </button>
        </motion.div>
      </motion.div>

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
        <Modal
          open
          onClose={() => {
            setAddModal(false);
            setEditGroup(null);
          }}
          title={editGroup ? "تعديل المجموعة" : "إضافة مجموعة جديدة"}
          size="md"
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setAddModal(false);
                  setEditGroup(null);
                }}
              >
                إلغاء
              </Button>
              <Button onClick={handleSave}>
                {editGroup ? "حفظ التعديلات" : "إضافة"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="اسم المجموعة"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="أدخل اسم المجموعة"
              required
            />
            <Textarea
              label="الوصف"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="وصف المجموعة (اختياري)"
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                اللون
              </label>
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormColor(opt.value)}
                    className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer ${
                      formColor === opt.value
                        ? "border-text scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: opt.value }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}
