"use client";

import { useState, useCallback } from "react";
import { Plus, Copy, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime, generateId } from "@/lib/utils";

type ApiKeyRow = {
  id: string; name: string; key: string; permissions: string; createdAt: string; lastUsed: string;   active: boolean;
};

const initialKeys: ApiKeyRow[] = [
  { id: "1", name: "تطبيق الموبايل", key: "sk_live_••••••••••••••••••••••••", permissions: "قراءة + كتابة", createdAt: "2026-01-01T10:00:00", lastUsed: "2026-01-15T09:30:00", active: true },
  { id: "2", name: "تطبيق الويب", key: "sk_live_••••••••••••••••••••••••", permissions: "قراءة + كتابة + حذف", createdAt: "2025-12-15T14:00:00", lastUsed: "2026-01-15T10:00:00", active: true },
  { id: "3", name: "نظام المحاسبة", key: "sk_live_••••••••••••••••••••••••", permissions: "قراءة فقط", createdAt: "2025-11-20T08:00:00", lastUsed: "2026-01-14T16:00:00", active: true },
  { id: "4", name: "التكامل مع Shopify", key: "sk_live_••••••••••••••••••••••••", permissions: "قراءة + كتابة", createdAt: "2025-10-05T12:00:00", lastUsed: "2025-12-28T11:00:00", active: false },
  { id: "5", name: "أداة التحليلات", key: "sk_live_••••••••••••••••••••••••", permissions: "قراءة فقط", createdAt: "2025-09-01T09:00:00", lastUsed: "2026-01-15T08:00:00", active: true },
];

export default function APIKeysPage() {
  const { success, info, error: showError } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiKeyRow | null>(null);
  const [formName, setFormName] = useState("");
  const [formPerms, setFormPerms] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

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
  } = useCrud<ApiKeyRow>({
    initialData: initialKeys,
    searchFields: ["name", "permissions"],
    itemsPerPage: 10,
    defaultSortKey: "createdAt",
    defaultSortDir: "desc",
  });

  const toggleVisible = useCallback((id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    info("تم النسخ", "تم نسخ المفتاح");
  }, [info]);

  const handleCreate = useCallback(() => {
    if (!formName.trim()) { showError("خطأ", "يرجى إدخال اسم المفتاح"); return; }
    if (formPerms.length === 0) { showError("خطأ", "يرجى اختيار صلاحية واحدة على الأقل"); return; }
    const newKey = `sk_${generateId()}${generateId()}`;
    const perms = formPerms.join(" + ");
    add({ id: generateId(), name: formName, key: newKey, permissions: perms, createdAt: new Date().toISOString(), lastUsed: "", active: true });
    success("تم الإنشاء", `تم إنشاء مفتاح "${formName}" بنجاح. انسخه الآن!`);
    setCreateModal(false); setFormName(""); setFormPerms([]);
  }, [formName, formPerms, add, success, showError]);

  const handleRevoke = useCallback((row: ApiKeyRow) => {
    update(row.id, { active: !row.active });
    success("تم التغيير", `تم ${row.active ? "إلغاء تفعيل" : "تفعيل"} مفتاح "${row.name}"`);
  }, [update, success]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مفتاح "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const togglePerm = useCallback((perm: string) => {
    setFormPerms((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);
  }, []);

  const columns = [
    { key: "name" as const, label: "الاسم", sortable: true, render: (v: unknown) => <span className="font-medium">{String(v)}</span> },
    { key: "key" as const, label: "المفتاح", render: (v: unknown, row: ApiKeyRow) => {
      const visible = visibleKeys[row.id];
      const masked = String(v).slice(0, 10) + "****" + String(v).slice(-4);
      return (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>{visible ? String(v) : masked}</span>
          <button onClick={() => toggleVisible(row.id)} className="text-text-muted hover:text-text cursor-pointer">{visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
          <button onClick={() => handleCopy(String(v))} className="text-text-muted hover:text-text cursor-pointer"><Copy size={14} /></button>
        </div>
      );
    }},
    { key: "permissions" as const, label: "الصلاحيات", sortable: true, render: (v: unknown) => <Badge variant="purple">{String(v)}</Badge> },
    { key: "createdAt" as const, label: "تاريخ الإنشاء", sortable: true, render: (v: unknown) => <span className="text-text-secondary">{formatDateTime(String(v))}</span> },
    { key: "lastUsed" as const, label: "آخر استخدام", sortable: true, render: (v: unknown) => <span className="text-text-secondary">{v ? formatDateTime(String(v)) : "—"}</span> },
    { key: "active" as const, label: "الحالة", sortable: true, render: (v: unknown) => <Badge variant={v ? "success" : "default"} dot>{v ? "نشط" : "معطّل"}</Badge> },
    { key: "id" as const, label: "الإجراءات", className: "w-24", render: (_v: unknown, row: ApiKeyRow) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => handleRevoke(row)} title={row.active ? "إلغاء التفعيل" : "تفعيل"} />
        <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="مفاتيح API" subtitle="إدارة مفاتيح API للتكامل مع الأنظمة الخارجية" actions={<Button icon={<Plus size={16} />} onClick={() => setCreateModal(true)}>إنشاء مفتاح جديد</Button>} />
      <Card padding="none">
        <div className="p-4">
          <DataTable columns={columns} data={filteredData} emptyMessage="لا توجد مفاتيح API" rowKey="id" sortable />
        </div>
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف مفتاح API" message={`هل أنت متأكد من حذف مفتاح "${deleteTarget?.name}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {createModal && (
        <Modal open onClose={() => setCreateModal(false)} title="إنشاء مفتاح API جديد" size="md">
          <div className="space-y-4">
            <Input label="اسم المفتاح" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: تطبيق الموبايل" />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">الصلاحيات</label>
              <div className="space-y-2">
                {["قراءة", "كتابة", "حذف"].map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formPerms.includes(perm)} onChange={() => togglePerm(perm)} className="rounded border-border text-primary focus:ring-primary/20" />
                    <span className="text-sm text-text">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-warning-light p-4"><p className="text-sm text-warning">سيتم عرض المفتاح مرة واحدة فقط. تأكد من حفظه في مكان آمن.</p></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setCreateModal(false)}>إلغاء</Button>
              <Button onClick={handleCreate}>إنشاء</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
