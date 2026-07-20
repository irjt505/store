"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Plus, Trash2, ExternalLink, ChevronDown, ChevronRight, Save, Pencil, FolderTree } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { cn, generateId } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  url: string;
  type: "page" | "category" | "custom";
  visible?: boolean;
  order?: number;
  children?: MenuItem[];
};

const initialMenu: MenuItem[] = [
  { id: "1", label: "الرئيسية", url: "/", type: "page", visible: true, order: 1 },
  {
    id: "2", label: "المنتجات", url: "/products", type: "category", visible: true, order: 2,
    children: [
      { id: "2-1", label: "إلكترونيات", url: "/products/electronics", type: "category", visible: true, order: 1 },
      { id: "2-2", label: "أزياء", url: "/products/fashion", type: "category", visible: true, order: 2 },
      { id: "2-3", label: "عروض", url: "/products/offers", type: "category", visible: true, order: 3 },
    ],
  },
  { id: "3", label: "من نحن", url: "/about-us", type: "page", visible: true, order: 3 },
  { id: "4", label: "تواصل معنا", url: "/contact-us", type: "page", visible: true, order: 4 },
];

const typeConfig: Record<MenuItem["type"], { label: string; variant: "info" | "purple" | "default" }> = {
  page: { label: "صفحة", variant: "info" },
  category: { label: "تصنيف", variant: "purple" },
  custom: { label: "مخصص", variant: "default" },
};

function MenuItemRow({
  item, depth = 0, onDelete, onEdit, onAddChild,
}: {
  item: MenuItem; depth?: number; onDelete: (id: string) => void; onEdit: (item: MenuItem) => void; onAddChild: (parentId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 border-b border-border-light hover:bg-surface-hover transition-colors group",
          depth > 0 && "bg-bg/30"
        )}
        style={{ paddingRight: `${(depth * 28) + 16}px` }}
      >
        <GripVertical size={16} className="text-text-muted cursor-grab shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="shrink-0 text-text-muted hover:text-text transition-colors cursor-pointer">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="font-medium text-text text-sm flex-1 min-w-0 truncate">{item.label}</span>
        <code className="text-xs text-text-muted bg-bg px-2 py-0.5 rounded font-mono shrink-0">{item.url}</code>
        <Badge variant={typeConfig[item.type].variant} size="sm">{typeConfig[item.type].label}</Badge>
        <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => onAddChild(item.id)} title="إضافة فرعي" />
        <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => onEdit(item)} title="تعديل" />
        <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />} title="فتح" onClick={() => window.open(item.url, "_blank")} />
        <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => onDelete(item.id)} title="حذف" />
      </div>
      <AnimatePresence>
        {hasChildren && expanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children.map((child) => (
              <MenuItemRow key={child.id} item={child} depth={depth + 1} onDelete={onDelete} onEdit={onEdit} onAddChild={onAddChild} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MenusPage() {
  const { success, error: showError } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formType, setFormType] = useState<"page" | "category" | "custom">("page");

  const countItems = (items: MenuItem[]): number =>
    items.reduce((sum, item) => sum + 1 + (item.children ? countItems(item.children) : 0), 0);

  const handleDelete = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const removeItem = (items: MenuItem[]): MenuItem[] =>
      items.filter((item) => item.id !== deleteTarget).map((item) => item.children ? { ...item, children: removeItem(item.children) } : item);
    setMenu((prev) => removeItem(prev));
    success("تم الحذف", "تم حذف العنصر بنجاح");
    setDeleteTarget(null);
  }, [deleteTarget, success]);

  const openEdit = useCallback((item: MenuItem) => {
    setEditTarget(item);
    setParentId(null);
    setFormLabel(item.label);
    setFormUrl(item.url);
    setFormType(item.type);
    setModalOpen(true);
  }, []);

  const openCreate = useCallback((pId: string | null = null) => {
    setEditTarget(null);
    setParentId(pId);
    setFormLabel("");
    setFormUrl("");
    setFormType("page");
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formLabel.trim()) {
      showError("خطأ", "يرجى إدخال اسم العنصر");
      return;
    }
    const url = formUrl.trim() || "/" + formLabel.replace(/\s+/g, "-").toLowerCase();

    if (editTarget) {
      const updateItem = (items: MenuItem[]): MenuItem[] =>
        items.map((item) => {
          if (item.id === editTarget.id) return { ...item, label: formLabel, url, type: formType };
          if (item.children) return { ...item, children: updateItem(item.children) };
          return item;
        });
      setMenu((prev) => updateItem(prev));
      success("تم التحديث", `تم تحديث "${formLabel}" بنجاح`);
    } else {
      const newItem: MenuItem = { id: generateId(), label: formLabel, url, type: formType, visible: true };
      if (parentId) {
        const addToParent = (items: MenuItem[]): MenuItem[] =>
          items.map((item) => {
            if (item.id === parentId) return { ...item, children: [...(item.children || []), newItem] };
            if (item.children) return { ...item, children: addToParent(item.children) };
            return item;
          });
        setMenu((prev) => addToParent(prev));
      } else {
        setMenu((prev) => [...prev, newItem]);
      }
      success("تمت الإضافة", `تم إضافة "${formLabel}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
    setParentId(null);
  }, [formLabel, formUrl, formType, editTarget, parentId, success, showError]);

  const handleSaveMenu = useCallback(() => {
    success("تم الحفظ", "تم حفظ التغييرات على القائمة بنجاح");
  }, [success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="القوائم"
        subtitle="بناء وتنظيم قوائم التنقل في الموقع"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Plus size={16} />} onClick={() => openCreate(null)}>إضافة قائمة</Button>
            <Button icon={<Save size={16} />} onClick={handleSaveMenu}>حفظ</Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card padding="none">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
                <FolderTree size={16} className="text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text">القائمة الرئيسية</span>
                <p className="text-xs text-text-muted">{countItems(menu)} عنصر</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => openCreate(null)}>إضافة عنصر</Button>
          </div>
          {menu.length > 0 ? (
            <div>
              {menu.map((item) => (
                <MenuItemRow key={item.id} item={item} onDelete={handleDelete} onEdit={openEdit} onAddChild={openCreate} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FolderTree size={24} />}
              title="القائمة فارغة"
              description="أضف عناصر للبدء في بناء قائمة التنقل"
              action={<Button icon={<Plus size={16} />} onClick={() => openCreate(null)}>إضافة عنصر</Button>}
            />
          )}
        </Card>
      </motion.div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} title="حذف العنصر" message="هل أنت متأكد من حذف هذا العنصر وجميع عناصره الفرعية؟ لا يمكن التراجع." confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); setParentId(null); }} title={editTarget ? "تعديل العنصر" : parentId ? "إضافة عنصر فرعي" : "إضافة عنصر جديد"} size="md">
          <div className="space-y-5">
            <Input label="اسم العنصر" value={formLabel} onChange={(e) => setFormLabel(e.target.value)} placeholder="مثال: المنتجات" />
            <Input label="الرابط (URL)" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="يتم إنشاؤه تلقائياً" dir="ltr" />
            <Select label="النوع" options={[{ value: "page", label: "صفحة" }, { value: "category", label: "تصنيف" }, { value: "custom", label: "مخصص" }]} value={formType} onChange={(e) => setFormType(e.target.value as "page" | "category" | "custom")} />
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); setParentId(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
