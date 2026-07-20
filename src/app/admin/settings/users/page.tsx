"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Shield, Eye, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime, generateId } from "@/lib/utils";

type User = {
  id: string; name: string; email: string; role: string; roleVariant: "danger" | "info" | "default"; active: boolean;   lastLogin: string;
};

const initialUsers: User[] = [
  { id: "1", name: "أحمد المدير", email: "admin@mystore.com", role: "مدير", roleVariant: "danger", active: true, lastLogin: "2026-01-15T10:30:00" },
  { id: "2", name: "سارة المحررة", email: "sara@mystore.com", role: "محرر", roleVariant: "info", active: true, lastLogin: "2026-01-15T09:15:00" },
  { id: "3", name: "خالد المشاهد", email: "khaled@mystore.com", role: "مشاهد", roleVariant: "default", active: true, lastLogin: "2026-01-14T16:45:00" },
  { id: "4", name: "نورة المحررة", email: "noura@mystore.com", role: "محرر", roleVariant: "info", active: true, lastLogin: "2026-01-13T14:20:00" },
  { id: "5", name: "عبدالله المشاهد", email: "abdullah@mystore.com", role: "مشاهد", roleVariant: "default", active: false, lastLogin: "2026-01-10T11:00:00" },
  { id: "6", name: "فاطمة المديرة", email: "fatima@mystore.com", role: "مدير", roleVariant: "danger", active: true, lastLogin: "2026-01-15T08:00:00" },
];

const roles = [
  { name: "مدير", description: "صلاحيات كاملة لإدارة المتجر", count: 2, color: "danger" as const },
  { name: "محرر", description: "تعديل المنتجات والمحتوى", count: 2, color: "info" as const },
  { name: "مشاهد", description: "عرض البيانات فقط بدون تعديل", count: 2, color: "default" as const },
];

const roleVariantMap: Record<string, "danger" | "info" | "default"> = { "مدير": "danger", "محرر": "info", "مشاهد": "default" };

const rolePermissions: Record<string, string[]> = {
  "مدير": ["إدارة المنتجات", "إدارة الطلبات", "إدارة المستخدمين", "إدارة الإعدادات", "إدارة المحتوى", "عرض التقارير", "إدارة الحملات التسويقية", "إدارة المدونة", "إدارة النسخ الاحتياطية", "بناء الهيدر والفوتر"],
  "محرر": ["إدارة المنتجات", "إدارة المحتوى", "إدارة المدونة", "عرض الطلبات", "عرض التقارير"],
  "مشاهد": ["عرض المنتجات", "عرض الطلبات", "عرض التقارير", "عرض المحتوى"],
};

export default function UsersSettingsPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("مشاهد");
  const [permissionsRole, setPermissionsRole] = useState<string | null>(null);

  const {
    filteredData,
    paginatedData,
    search,
    setSearch,
    sortKey,
    sortDir,
    setSort,
    page,
    setPage,
    perPage,
    setPerPage,
    add,
    update,
    remove,
    totalItems,
    totalPages,
  } = useCrud<User>({
    initialData: initialUsers,
    searchFields: ["name", "email", "role"],
    itemsPerPage: 10,
    defaultSortKey: "lastLogin",
    defaultSortDir: "desc",
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormName(""); setFormEmail(""); setFormPassword(""); setFormRole("مشاهد");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((u: User) => {
    setEditTarget(u);
    setFormName(u.name); setFormEmail(u.email); setFormPassword(""); setFormRole(u.role);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) { showError("خطأ", "يرجى إدخال الاسم والبريد"); return; }
    const variant = roleVariantMap[formRole] || "default";
    if (editTarget) {
      update(editTarget.id, { name: formName, email: formEmail, role: formRole, roleVariant: variant });
      success("تم التحديث", `تم تحديث مستخدم "${formName}"`);
    } else {
      if (!formPassword.trim()) { showError("خطأ", "يرجى إدخال كلمة المرور"); return; }
      add({ id: generateId(), name: formName, email: formEmail, role: formRole, roleVariant: variant, active: true, lastLogin: "" });
      success("تمت الإضافة", `تم إضافة مستخدم "${formName}"`);
    }
    setModalOpen(false); setEditTarget(null);
  }, [formName, formEmail, formPassword, formRole, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مستخدم "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const toggleActive = useCallback((u: User) => {
    update(u.id, { active: !u.active });
    success("تم التغيير", `تم ${u.active ? "تعطيل" : "تفعيل"} ${u.name}`);
  }, [update, success]);

  const columns = [
    { key: "name" as const, label: "الاسم", sortable: true, render: (_v: unknown, row: User) => <div className="flex items-center gap-3"><Avatar name={row.name} size="sm" online={row.active} /><span className="font-medium">{row.name}</span></div> },
    { key: "email" as const, label: "البريد الإلكتروني", sortable: true },
    { key: "role" as const, label: "الدور", sortable: true, render: (v: unknown) => <Badge variant={roleVariantMap[String(v)] || "default"}>{String(v)}</Badge> },
    { key: "active" as const, label: "الحالة", sortable: true, render: (v: unknown, row: User) => <button onClick={() => toggleActive(row)}><Badge variant={v ? "success" : "default"} dot className="cursor-pointer">{v ? "نشط" : "معطّل"}</Badge></button> },
    { key: "lastLogin" as const, label: "آخر دخول", sortable: true, render: (v: unknown) => <span className="text-text-secondary">{v ? formatDateTime(String(v)) : "—"}</span> },
    { key: "id" as const, label: "الإجراءات", className: "w-24", render: (_v: unknown, row: User) => <div className="flex items-center gap-1"><Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} /><Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} /></div> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="المستخدمين والصلاحيات" subtitle="إدارة مستخدمي لوحة التحكم وصلاحياتهم" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة مستخدم</Button>} />
      <div className="flex items-center gap-3"><input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 px-3 rounded-lg border border-border bg-surface text-sm w-64" /></div>
      <Card padding="none">
        <div className="p-4">
          <DataTable columns={columns} data={paginatedData} emptyMessage="لا يوجد مستخدمون" rowKey="id" sortable pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }} />
        </div>
      </Card>
      <Card header={<h3 className="font-semibold text-text">الأدوار والصلاحيات</h3>} padding="md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {roles.map((role) => (
            <div key={role.name} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Shield size={18} className="text-text-secondary" /><h4 className="font-medium text-text">{role.name}</h4></div>
                <Badge variant={role.color}>{role.count} مستخدم</Badge>
              </div>
              <p className="text-sm text-text-secondary">{role.description}</p>
              <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setPermissionsRole(role.name)}>عرض الصلاحيات</Button>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف المستخدم" message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {permissionsRole && (
        <Modal open onClose={() => setPermissionsRole(null)} title={`صلاحيات دور "${permissionsRole}"`} size="md">
          <div className="space-y-3">
            {(rolePermissions[permissionsRole] || []).map((perm) => (
              <div key={perm} className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span className="text-sm text-text">{perm}</span>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setPermissionsRole(null)}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل المستخدم" : "إضافة مستخدم جديد"} size="md">
          <div className="space-y-4">
            <Input label="الاسم الكامل" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <Input label="البريد الإلكتروني" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            {!editTarget && <Input label="كلمة المرور" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />}
            <Select label="الدور" options={[{ value: "مدير", label: "مدير" }, { value: "محرر", label: "محرر" }, { value: "مشاهد", label: "مشاهد" }]} value={formRole} onChange={(e) => setFormRole(e.target.value)} />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ" : "إضافة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
