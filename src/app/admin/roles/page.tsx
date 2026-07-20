"use client";

import { useState, useMemo, useCallback } from "react";
import { Shield, Plus, Pencil, Trash2, Lock, Users, Key } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Permission = { id: string; category: string; name: string; key: string };

type Role = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  [key: string]: unknown;
};

const allPermissions: Permission[] = [
  { id: "p1", category: "products", name: "عرض المنتجات", key: "products.read" },
  { id: "p2", category: "products", name: "إضافة منتج", key: "products.create" },
  { id: "p3", category: "products", name: "تعديل منتج", key: "products.update" },
  { id: "p4", category: "products", name: "حذف منتج", key: "products.delete" },
  { id: "p5", category: "orders", name: "عرض الطلبات", key: "orders.read" },
  { id: "p6", category: "orders", name: "تعديل الطلبات", key: "orders.update" },
  { id: "p7", category: "orders", name: "حذف الطلبات", key: "orders.delete" },
  { id: "p8", category: "customers", name: "عرض العملاء", key: "customers.read" },
  { id: "p9", category: "customers", name: "تعديل العملاء", key: "customers.update" },
  { id: "p10", category: "customers", name: "حذف العملاء", key: "customers.delete" },
  { id: "p11", category: "marketing", name: "إدارة الحملات", key: "marketing.manage" },
  { id: "p12", category: "marketing", name: "إدارة الكوبونات", key: "marketing.coupons" },
  { id: "p13", category: "marketing", name: "إدارة الخصومات", key: "marketing.discounts" },
  { id: "p14", category: "settings", name: "عرض الإعدادات", key: "settings.read" },
  { id: "p15", category: "settings", name: "تعديل الإعدادات", key: "settings.update" },
  { id: "p16", category: "reports", name: "عرض التقارير", key: "reports.read" },
  { id: "p17", category: "reports", name: "تصدير التقارير", key: "reports.export" },
  { id: "p18", category: "staff", name: "عرض الموظفين", key: "staff.read" },
  { id: "p19", category: "staff", name: "إضافة موظف", key: "staff.create" },
  { id: "p20", category: "staff", name: "تعديل موظف", key: "staff.update" },
  { id: "p21", category: "staff", name: "حذف موظف", key: "staff.delete" },
];

const categoryLabels: Record<string, string> = {
  products: "المنتجات",
  orders: "الطلبات",
  customers: "العملاء",
  marketing: "التسويق",
  settings: "الإعدادات",
  reports: "التقارير",
  staff: "الموظفين",
};

const initialRoles: Role[] = [
  { id: "r1", name: "مدير عام", description: "صلاحيات كاملة لإدارة جميع جوانب المتجر", userCount: 2, permissions: allPermissions.map((p) => p.key), isSystem: true },
  { id: "r2", name: "مدير مبيعات", description: "إدارة الطلبات والعملاء والمبيعات", userCount: 3, permissions: ["orders.read", "orders.update", "customers.read", "customers.update", "reports.read", "marketing.manage"], isSystem: false },
  { id: "r3", name: "محاسب", description: "إدارة التقارير المالية والمدفوعات", userCount: 1, permissions: ["reports.read", "reports.export", "orders.read", "settings.read"], isSystem: false },
  { id: "r4", name: "مخزن", description: "إدارة المنتجات والمخزون", userCount: 2, permissions: ["products.read", "products.create", "products.update", "products.delete"], isSystem: false },
  { id: "r5", name: "مسوق", description: "إدارة الحملات التسويقية والكوبونات", userCount: 2, permissions: ["marketing.manage", "marketing.coupons", "marketing.discounts", "reports.read", "customers.read"], isSystem: false },
  { id: "r6", name: "دعم فني", description: "دعم العملاء ومتابعة الطلبات", userCount: 3, permissions: ["orders.read", "customers.read", "customers.update"], isSystem: false },
];

export default function RolesPage() {
  const { success, error: showError } = useToast();
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<Role | null>(null);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, []);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormName("");
    setFormDescription("");
    setFormPermissions([]);
    setCreateEditModal(true);
  }, []);

  const openEdit = useCallback((role: Role) => {
    setEditing(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormPermissions([...role.permissions]);
    setCreateEditModal(true);
  }, []);

  const togglePermission = useCallback((key: string) => {
    setFormPermissions((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }, []);

  const toggleCategory = useCallback((category: string) => {
    const catKeys = allPermissions.filter((p) => p.category === category).map((p) => p.key);
    const allSelected = catKeys.every((k) => formPermissions.includes(k));
    if (allSelected) {
      setFormPermissions((prev) => prev.filter((k) => !catKeys.includes(k)));
    } else {
      setFormPermissions((prev) => [...new Set([...prev, ...catKeys])]);
    }
  }, [formPermissions]);

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      showError("خطأ", "يرجى إدخال اسم الدور");
      return;
    }
    if (editing) {
      setRoles((prev) => prev.map((r) => r.id === editing.id ? { ...r, name: formName, description: formDescription, permissions: formPermissions } : r));
      success("تم التحديث", `تم تحديث دور "${formName}" بنجاح`);
    } else {
      setRoles((prev) => [{ id: Date.now().toString(), name: formName, description: formDescription, userCount: 0, permissions: formPermissions, isSystem: false }, ...prev]);
      success("تمت الإضافة", `تم إنشاء دور "${formName}" بنجاح`);
    }
    setCreateEditModal(false);
    setEditing(null);
  }, [formName, formDescription, formPermissions, editing, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteModal) return;
    if (deleteModal.userCount > 0) {
      showError("خطأ", `لا يمكن حذف دور "${deleteModal.name}" لارتباط ${deleteModal.userCount} موظفين`);
      setDeleteModal(null);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== deleteModal.id));
    success("تم الحذف", `تم حذف دور "${deleteModal.name}" بنجاح`);
    setDeleteModal(null);
  }, [deleteModal, success, showError]);

  return (
    <div className="space-y-6">
      <PageHeader title="الأدوار والصلاحيات" subtitle="إدارة أدوار المستخدمين وصلاحياتهم" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة دور</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Shield size={20} className="text-primary" /></div><div><p className="text-2xl font-bold text-text">{roles.length}</p><p className="text-xs text-text-muted">إجمالي الأدوار</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><Users size={20} className="text-success" /></div><div><p className="text-2xl font-bold text-text">{roles.reduce((s, r) => s + r.userCount, 0)}</p><p className="text-xs text-text-muted">إجمالي المستخدمين</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><Key size={20} className="text-info" /></div><div><p className="text-2xl font-bold text-text">{allPermissions.length}</p><p className="text-xs text-text-muted">إجمالي الصلاحيات</p></div></div></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} padding="none" className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => openEdit(role)}>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {role.isSystem ? <Lock size={18} className="text-primary" /> : <Shield size={18} className="text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{role.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{role.description}</p>
                  </div>
                </div>
                {role.isSystem && <Badge variant="info" dot>نظام</Badge>}
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary pt-1 border-t border-border-light">
                <span className="flex items-center gap-1"><Users size={12} />{role.userCount} مستخدم</span>
                <span className="flex items-center gap-1"><Key size={12} />{role.permissions.length} صلاحية</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1 space-x-reverse">
                  {role.permissions.slice(0, 5).map((perm) => (
                    <span key={perm} className="inline-block h-6 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-medium leading-6">{perm.split(".")[0]}</span>
                  ))}
                  {role.permissions.length > 5 && <span className="inline-block h-6 w-6 rounded-full bg-surface-hover text-text-muted text-[10px] font-medium leading-6 text-center">+{role.permissions.length - 5}</span>}
                </div>
                <div className="flex items-center gap-1">
                  {!role.isSystem && (
                    <>
                      <Button variant="ghost" size="sm" icon={<Pencil size={12} />} onClick={(e) => { e.stopPropagation(); openEdit(role); }} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} className="text-danger hover:text-danger" onClick={(e) => { e.stopPropagation(); setDeleteModal(role); }} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {createEditModal && (
        <Modal open onClose={() => setCreateEditModal(false)} title={editing ? `تعديل الدور: ${editing.name}` : "إضافة دور جديد"} size="xl">
          <div className="space-y-5">
            <Input label="اسم الدور" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: مدير مبيعات" />
            <Input label="الوصف" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف مختصر للدور وصلاحياته" />

            <div>
              <p className="text-sm font-medium text-text mb-3">الصلاحيات</p>
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                {Object.entries(groupedPermissions).map(([category, perms]) => {
                  const allCatSelected = perms.every((p) => formPermissions.includes(p.key));
                  const someCatSelected = perms.some((p) => formPermissions.includes(p.key));
                  return (
                    <div key={category} className="border border-border rounded-lg p-3">
                      <label className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" checked={allCatSelected} ref={(el) => { if (el) el.indeterminate = someCatSelected && !allCatSelected; }} onChange={() => toggleCategory(category)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                        <span className="text-sm font-semibold text-text">{categoryLabels[category] || category}</span>
                        <Badge variant="default" className="text-[10px]">{perms.length}</Badge>
                      </label>
                      <div className="grid grid-cols-2 gap-1 mr-6">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                            <input type="checkbox" checked={formPermissions.includes(perm.key)} onChange={() => togglePermission(perm.key)} className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                            <span className="text-xs text-text-secondary">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setCreateEditModal(false)}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إضافة الدور"}</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title="حذف الدور" message={`هل أنت متأكد من حذف دور "${deleteModal?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
    </div>
  );
}
