"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Users, UserCheck, UserX, Mail, Key, Shield, LogOut, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDate, formatDateTime, generateId } from "@/lib/utils";

type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  createdAt: string;
  permissions: string[];
};

const roles = ["مدير عام", "مدير مبيعات", "محاسب", "مخزن", "مسوق", "دعم فني"];

const mockStaff: Staff[] = [
  { id: "1", name: "أحمد محمد العلي", email: "ahmed@mystore.com", phone: "+966501234567", role: "مدير عام", status: "active", lastActive: "2026-07-20T10:30:00", createdAt: "2024-01-15", permissions: ["*"] },
  { id: "2", name: "فاطمة عبدالله الراشد", email: "fatima@mystore.com", phone: "+966512345678", role: "مدير مبيعات", status: "active", lastActive: "2026-07-20T09:15:00", createdAt: "2024-03-20", permissions: ["orders.*", "customers.*", "products.read"] },
  { id: "3", name: "خالد عبدالرحمن السعيد", email: "khalid@mystore.com", phone: "+966523456789", role: "محاسب", status: "active", lastActive: "2026-07-19T16:45:00", createdAt: "2024-06-10", permissions: ["reports.*", "orders.read", "payments.*"] },
  { id: "4", name: "نورة سعيد المطيري", email: "noura@mystore.com", phone: "+966534567890", role: "مخزن", status: "active", lastActive: "2026-07-20T08:00:00", createdAt: "2024-08-05", permissions: ["products.*", "inventory.*"] },
  { id: "5", name: "عبدالله فيصل العمري", email: "abdullah@mystore.com", phone: "+966545678901", role: "مسوق", status: "active", lastActive: "2026-07-20T11:00:00", createdAt: "2025-01-10", permissions: ["marketing.*", "reports.read"] },
  { id: "6", name: "ريم خالد الحربي", email: "reem@mystore.com", phone: "+966556789012", role: "دعم فني", status: "active", lastActive: "2026-07-20T07:30:00", createdAt: "2025-03-15", permissions: ["orders.read", "customers.read", "customers.update"] },
  { id: "7", name: "محمد عادل الزهراني", email: "mohammed@mystore.com", phone: "+966567890123", role: "مدير مبيعات", status: "inactive", lastActive: "2026-06-15T14:20:00", createdAt: "2025-05-20", permissions: ["orders.*", "customers.*"] },
  { id: "8", name: "سارة يوسف القحطاني", email: "sara@mystore.com", phone: "+966578901234", role: "محاسب", status: "pending", lastActive: "", createdAt: "2026-07-18", permissions: ["reports.read"] },
  { id: "9", name: "يوسف إبراهيم البلوي", email: "yousef@mystore.com", phone: "+966589012345", role: "مسوق", status: "active", lastActive: "2026-07-19T13:10:00", createdAt: "2026-02-01", permissions: ["marketing.*"] },
];

const statusConfig: Record<Staff["status"], { label: string; variant: "success" | "default" | "warning" }> = {
  active: { label: "نشط", variant: "success" },
  inactive: { label: "غير نشط", variant: "default" },
  pending: { label: "قيد الانتظار", variant: "warning" },
};

const roleConfig: Record<string, string> = {
  "مدير عام": "bg-primary/10 text-primary",
  "مدير مبيعات": "bg-success/10 text-success",
  "محاسب": "bg-info/10 text-info",
  "مخزن": "bg-warning/10 text-warning",
  "مسوق": "bg-purple/10 text-purple",
  "دعم فني": "bg-danger/10 text-danger",
};

export default function StaffPage() {
  const { success, error: showError, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("مدير مبيعات");

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("مدير مبيعات");

  const {
    data: staff,
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    page,
    setPage,
    perPage,
    setPerPage,
    add,
    update,
    remove,
    selectedIds,
    setSelectedIds,
    totalItems,
    totalPages,
  } = useCrud<Staff>({
    initialData: mockStaff,
    searchFields: ["name", "email", "phone"],
    itemsPerPage: 10,
    defaultSortKey: "createdAt",
    defaultSortDir: "desc",
  });

  const activeCount = useMemo(() => staff.filter((s) => s.status === "active").length, [staff]);
  const pendingCount = useMemo(() => staff.filter((s) => s.status === "pending").length, [staff]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("مدير مبيعات");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((s: Staff) => {
    setEditing(s);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormPhone(s.phone);
    setFormRole(s.role);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) { showError("خطأ", "يرجى إدخال اسم الموظف"); return; }
    if (!formEmail.trim()) { showError("خطأ", "يرجى إدخال البريد الإلكتروني"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) { showError("خطأ", "البريد الإلكتروني غير صحيح"); return; }

    const staffData = {
      name: formName, email: formEmail, phone: formPhone, role: formRole,
      permissions: formRole === "مدير عام" ? ["*"] : ["orders.read"],
    };

    if (editing) {
      update(editing.id, staffData);
      success("تم التحديث", `تم تحديث بيانات "${formName}" بنجاح`);
    } else {
      add({
        id: generateId(), ...staffData,
        status: "active" as const,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString().split("T")[0],
      });
      success("تمت الإضافة", `تم إضافة الموظف "${formName}" بنجاح`);
    }
    setModalOpen(false);
    setEditing(null);
  }, [formName, formEmail, formPhone, formRole, editing, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.role === "مدير عام") {
      showError("خطأ", "لا يمكن حذف المدير العام");
      setDeleteTarget(null);
      return;
    }
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف الموظف "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success, showError]);

  const handleToggleStatus = useCallback((s: Staff) => {
    const newStatus = s.status === "active" ? "inactive" : "active";
    update(s.id, { status: newStatus });
    success("تم التغيير", `تم ${newStatus === "active" ? "تفعيل" : "تعطيل"} حساب "${s.name}"`);
  }, [update, success]);

  const handleInvite = useCallback(() => {
    if (!inviteEmail.trim()) { showError("خطأ", "يرجى إدخال البريد الإلكتروني"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) { showError("خطأ", "البريد الإلكتروني غير صحيح"); return; }
    add({
      id: generateId(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      phone: "",
      role: inviteRole,
      status: "pending",
      lastActive: "",
      createdAt: new Date().toISOString().split("T")[0],
      permissions: [],
    });
    success("تم الإرسال", `تم إرسال دعوة إلى "${inviteEmail}"`);
    setInviteModal(false);
    setInviteEmail("");
    setInviteRole("مدير مبيعات");
  }, [inviteEmail, inviteRole, add, success, showError]);

  const handleForceLogout = useCallback((s: Staff) => {
    info("تم", `تم تسجيل خروج "${s.name}" بنجاح`);
  }, [info]);

  const columns = useMemo(() => [
    {
      key: "name" as const, label: "الموظف", sortable: true,
      render: (_: unknown, row: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role" as const, label: "الدور", sortable: true,
      render: (v: unknown) => <Badge className={roleConfig[String(v)] || "bg-surface-hover text-text-secondary"}>{String(v)}</Badge>,
    },
    {
      key: "status" as const, label: "الحالة", sortable: true,
      render: (value: unknown, row: Staff) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}>
          <Badge variant={statusConfig[value as Staff["status"]].variant} dot className="cursor-pointer">{statusConfig[value as Staff["status"]].label}</Badge>
        </button>
      ),
    },
    { key: "lastActive" as const, label: "آخر نشاط", sortable: true, render: (v: unknown) => v ? formatDateTime(String(v)) : <span className="text-text-muted">لم يسجل دخول</span> },
    {
      key: "id" as const, label: "الإجراءات", className: "w-32",
      render: (_: unknown, row: Staff) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={(e) => { e.stopPropagation(); openEdit(row); }} />
          {row.status === "active" && <Button variant="ghost" size="sm" icon={<LogOut size={14} />} onClick={(e) => { e.stopPropagation(); handleForceLogout(row); }} />}
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} />
        </div>
      ),
    },
  ], [openEdit, handleToggleStatus, handleForceLogout]);

  return (
    <div className="space-y-6">
      <PageHeader title="الموظفين" subtitle="إدارة حسابات الموظفين والأدوار" actions={
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Mail size={16} />} onClick={() => setInviteModal(true)}>دعوة موظف</Button>
          <Button icon={<Plus size={16} />} onClick={openCreate}>إضافة موظف</Button>
        </div>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="إجمالي الموظفين" value={totalItems} color="primary" />
        <StatCard icon={<UserCheck size={20} />} label="الموظفين النشطين" value={activeCount} color="success" />
        <StatCard icon={<UserX size={20} />} label="غير النشطين" value={totalItems - activeCount - pendingCount} color="danger" />
        <StatCard icon={<Mail size={20} />} label="بانتظار القبول" value={pendingCount} color="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالاسم أو البريد..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الأدوار" }, ...roles.map((r) => ({ value: r, label: r }))]} value={filters.role || ""} onChange={(e) => setFilter("role", e.target.value)} />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "active", label: "نشط" }, { value: "inactive", label: "غير نشط" }, { value: "pending", label: "قيد الانتظار" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </div>

      <DataTable columns={columns} data={paginatedData} emptyMessage="لا يوجد موظفين" rowKey="id" sortable selectable selectedKeys={selectedIds} onSelectionChange={setSelectedIds}
        pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }}
        striped />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الموظف" message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "تعديل الموظف" : "إضافة موظف جديد"} size="md">
          <div className="space-y-4">
            <Input label="الاسم الكامل" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="الاسم الكامل" />
            <Input label="البريد الإلكتروني" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" />
            <Input label="رقم الهاتف" type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+9665XXXXXXX" />
            <Select label="الدور" options={roles.map((r) => ({ value: r, label: r }))} value={formRole} onChange={(e) => setFormRole(e.target.value)} />
            <div className="p-3 rounded-lg bg-bg border border-border">
              <p className="text-xs text-text-muted mb-1">الصلاحيات المرتبطة بهذا الدور</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {(formRole === "مدير عام" ? ["كل الصلاحيات"] : ["عرض", "تعديل"]).map((p) => (
                  <Badge key={p} variant="success" className="text-[10px]">{p}</Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditing(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إضافة الموظف"}</Button>
            </div>
          </div>
        </Modal>
      )}

      {inviteModal && (
        <Modal open onClose={() => setInviteModal(false)} title="دعوة موظف" size="md">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">أدخل البريد الإلكتروني لإرسال دعوة الانضمام.</p>
            <Input label="البريد الإلكتروني" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com" />
            <Select label="الدور" options={roles.map((r) => ({ value: r, label: r }))} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} />
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setInviteModal(false)}>إلغاء</Button>
              <Button icon={<Mail size={14} />} onClick={handleInvite}>إرسال الدعوة</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
