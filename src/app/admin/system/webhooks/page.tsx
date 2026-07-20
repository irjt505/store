"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, RotateCw, ExternalLink } from "lucide-react";
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

type Webhook = {
  id: string; url: string; events: string; active: boolean; lastSent: string;   secret: string;
};

const initialWebhooks: Webhook[] = [
  { id: "1", url: "https://hooks.example.com/order-created", events: "order.created, order.updated", active: true, lastSent: "2026-07-18T10:30:00", secret: "whsec_abc123" },
  { id: "2", url: "https://erp.company.com/inventory", events: "product.updated, stock.changed", active: true, lastSent: "2026-07-18T09:15:00", secret: "whsec_def456" },
  { id: "3", url: "https://analytics.example.com/events", events: "order.completed, payment.received", active: false, lastSent: "2026-07-15T14:00:00", secret: "" },
  { id: "4", url: "https://slack.company.com/incoming", events: "order.created", active: true, lastSent: "2026-07-18T10:00:00", secret: "whsec_ghi789" },
];

const eventOptions = [
  { value: "order.created", label: "طلب جديد" }, { value: "order.updated", label: "تحديث الطلب" }, { value: "order.completed", label: "إتمام الطلب" },
  { value: "product.updated", label: "تحديث المنتج" }, { value: "stock.changed", label: "تغيير المخزون" }, { value: "payment.received", label: "استلام الدفع" },
];

export default function WebhooksPage() {
  const { success, error: showError, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Webhook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null);
  const [formUrl, setFormUrl] = useState("");
  const [formEvents, setFormEvents] = useState("");
  const [formSecret, setFormSecret] = useState("");

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
  } = useCrud<Webhook>({
    initialData: initialWebhooks,
    searchFields: ["url", "events"],
    itemsPerPage: 10,
    defaultSortKey: "lastSent",
    defaultSortDir: "desc",
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormUrl(""); setFormEvents(""); setFormSecret("");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((w: Webhook) => {
    setEditTarget(w);
    setFormUrl(w.url); setFormEvents(w.events); setFormSecret(w.secret);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formUrl.trim()) { showError("خطأ", "يرجى إدخال رابط الـ webhook"); return; }
    if (!formEvents.trim()) { showError("خطأ", "يرجى إدخال الأحداث"); return; }
    if (editTarget) {
      update(editTarget.id, { url: formUrl, events: formEvents, secret: formSecret });
      success("تم التحديث", "تم تحديث الـ webhook");
    } else {
      add({ id: generateId(), url: formUrl, events: formEvents, active: true, lastSent: "", secret: formSecret });
      success("تمت الإضافة", "تم إنشاء الـ webhook بنجاح");
    }
    setModalOpen(false); setEditTarget(null);
  }, [formUrl, formEvents, formSecret, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", "تم حذف الـ webhook");
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleTest = useCallback((w: Webhook) => {
    info("جاري الإرسال", `جاري إرسال طلب اختباري إلى ${w.url}`);
  }, []);

  const columns = [
    { key: "url" as const, label: "الرابط", sortable: true, render: (v: unknown) => <div className="flex items-center gap-2"><span className="font-mono text-xs text-text truncate max-w-[250px]">{String(v)}</span><ExternalLink size={12} className="text-text-muted" /></div> },
    { key: "events" as const, label: "الأحداث", render: (v: unknown) => <div className="flex flex-wrap gap-1">{String(v).split(", ").map((evt) => <Badge key={evt} variant="purple">{evt}</Badge>)}</div> },
    { key: "active" as const, label: "الحالة", sortable: true, render: (v: unknown) => <Badge variant={v ? "success" : "default"} dot>{v ? "نشط" : "معطّل"}</Badge> },
    { key: "lastSent" as const, label: "آخر إرسال", sortable: true, render: (v: unknown) => <span className="text-text-secondary">{v ? formatDateTime(String(v)) : "—"}</span> },
    { key: "id" as const, label: "الإجراءات", className: "w-28", render: (_v: unknown, row: Webhook) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" icon={<RotateCw size={14} />} onClick={() => handleTest(row)} title="اختبار" />
        <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
        <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Webhooks" subtitle="إدارة روابط الاستدعاء التلقائي للأنظمة الخارجية" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة webhook</Button>} />
      <Card padding="none">
        <div className="p-4">
          <DataTable columns={columns} data={paginatedData} emptyMessage="لا توجد webhooks" rowKey="id" sortable pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }} />
        </div>
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف Webhook" message="هل أنت متأكد من حذف هذا الـ webhook؟ لا يمكن التراجع." confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل Webhook" : "إضافة webhook جديد"} size="md">
          <div className="space-y-4">
            <Input label="الرابط" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://example.com/webhook" dir="ltr" />
            <Input label="الأحداث" value={formEvents} onChange={(e) => setFormEvents(e.target.value)} placeholder="order.created, order.updated" dir="ltr" helperText="افصل بين الأحداث بفاصلة" />
            <Input label="المفتاح السري (اختياري)" value={formSecret} onChange={(e) => setFormSecret(e.target.value)} placeholder="whsec_..." dir="ltr" helperText="يُستخدم للتحقق من صحة الطلبات" />
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
