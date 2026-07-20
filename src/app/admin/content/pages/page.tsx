"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, LayoutTemplate, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime, generateId } from "@/lib/utils";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
  publishedAt: string;
  updatedAt: string;
  views?: number;
};

const mockPages: PageItem[] = [
  { id: "1", title: "الرئيسية", slug: "/", content: "مرحباً بكم في متجرنا", status: "published", publishedAt: "2026-01-01T00:00:00", updatedAt: "2026-07-10T14:30:00", views: 12500 },
  { id: "2", title: "من نحن", slug: "/about-us", content: "نحن متجر إلكتروني...", status: "published", publishedAt: "2026-01-05T10:00:00", updatedAt: "2026-06-20T09:15:00", views: 3200 },
  { id: "3", title: "تواصل معنا", slug: "/contact-us", content: "يمكنكم التواصل معنا عبر...", status: "published", publishedAt: "2026-01-05T10:00:00", updatedAt: "2026-07-01T11:45:00", views: 1800 },
  { id: "4", title: "سياسة الخصوصية", slug: "/privacy-policy", content: "سياسة الخصوصية...", status: "published", publishedAt: "2026-01-10T08:00:00", updatedAt: "2026-03-15T16:20:00", views: 950 },
  { id: "5", title: "الشروط والأحكام", slug: "/terms-and-conditions", content: "الشروط والأحكام...", status: "published", publishedAt: "2026-01-10T08:00:00", updatedAt: "2026-03-15T16:20:00", views: 720 },
  { id: "6", title: "الشحن والتوصيل", slug: "/shipping-delivery", content: "olicies الشحن...", status: "published", publishedAt: "2026-01-15T12:00:00", updatedAt: "2026-07-08T10:30:00", views: 2100 },
  { id: "7", title: "سياسة الإرجاع", slug: "/return-policy", content: "سياسة الإرجاع...", status: "draft", publishedAt: "", updatedAt: "2026-07-12T09:00:00", views: 0 },
  { id: "8", title: "الأسئلة الشائعة", slug: "/faq", content: "الأسئلة الشائعة...", status: "draft", publishedAt: "", updatedAt: "2026-07-15T13:00:00", views: 0 },
];

const statusConfig: Record<PageItem["status"], { label: string; variant: "success" | "default" }> = {
  published: { label: "منشور", variant: "success" },
  draft: { label: "مسودة", variant: "default" },
};

export default function PagesPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PageItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");

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
  } = useCrud<PageItem>({
    initialData: mockPages,
    searchFields: ["title", "slug"],
    itemsPerPage: 10,
    defaultSortKey: "updatedAt",
    defaultSortDir: "desc",
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormTitle("");
    setFormSlug("");
    setFormContent("");
    setFormStatus("draft");
    setFormMetaTitle("");
    setFormMetaDesc("");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((p: PageItem) => {
    setEditTarget(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormContent(p.content);
    setFormStatus(p.status);
    setFormMetaTitle("");
    setFormMetaDesc("");
    setModalOpen(true);
  }, []);

  const handleSlugFromTitle = useCallback((t: string) => {
    return "/" + t.replace(/\s+/g, "-").toLowerCase();
  }, []);

  const handleSave = useCallback(() => {
    if (!formTitle.trim()) {
      showError("خطأ", "يرجى إدخال عنوان الصفحة");
      return;
    }
    const slug = formSlug.trim() || handleSlugFromTitle(formTitle);
    const now = new Date().toISOString();
    if (editTarget) {
      update(editTarget.id, { title: formTitle, slug, content: formContent, status: formStatus, updatedAt: now, ...(formStatus === "published" && !editTarget.publishedAt ? { publishedAt: now } : {}) });
      success("تم التحديث", `تم تحديث صفحة "${formTitle}" بنجاح`);
    } else {
      add({ id: generateId(), title: formTitle, slug, content: formContent, status: formStatus, publishedAt: formStatus === "published" ? now : "", updatedAt: now, views: 0 });
      success("تمت الإضافة", `تم إنشاء صفحة "${formTitle}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formTitle, formSlug, formContent, formStatus, editTarget, add, update, success, showError, handleSlugFromTitle]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف صفحة "${deleteTarget.title}"`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const columns = [
    {
      key: "title" as const, label: "العنوان", sortable: true,
      render: (value: unknown, row: PageItem) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-text text-sm">{String(value)}</p>
            <p className="text-xs text-text-muted font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status" as const, label: "الحالة", sortable: true,
      render: (value: unknown) => {
        const config = statusConfig[value as PageItem["status"]];
        return <Badge variant={config.variant} dot>{config.label}</Badge>;
      },
    },
    { key: "publishedAt" as const, label: "تاريخ النشر", sortable: true, render: (value: unknown) => value ? <span className="text-sm text-text-secondary">{formatDateTime(String(value))}</span> : <span className="text-sm text-text-muted">—</span> },
    { key: "views" as const, label: "المشاهدات", sortable: true, render: (value: unknown) => <span className="text-sm text-text-secondary">{Number(value ?? 0).toLocaleString("ar-SA")}</span> },
    {
      key: "id" as const, label: "الإجراءات", className: "w-36",
      render: (_: unknown, row: PageItem) => (
        <div className="flex items-center gap-1">
          {row.status === "published" && <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />} title="فتح" onClick={() => window.open(row.slug, "_blank")} />}
          <Link href={`/admin/page-builder/${row.id}`}><Button variant="ghost" size="sm" icon={<LayoutTemplate size={14} />} title="المحرر البصري" /></Link>
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الصفحات"
        subtitle="إدارة صفحات الموقع الثابتة"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/page-builder/new"><Button variant="secondary" icon={<LayoutTemplate size={16} />}>إنشاء بالمحرر</Button></Link>
            <Button icon={<Plus size={16} />} onClick={openCreate}>إنشاء صفحة</Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <SearchInput placeholder="بحث في الصفحات..." value={search} onChange={setSearch} className="w-64" />
        <Badge variant="info">{totalItems} صفحة</Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={paginatedData}
          emptyMessage="لا توجد صفحات"
          rowKey="id"
          sortable
          pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }}
        />
      </motion.div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الصفحة" message={`هل أنت متأكد من حذف صفحة "${deleteTarget?.title}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل الصفحة" : "إنشاء صفحة جديدة"} size="lg">
          <div className="space-y-5">
            <Input label="عنوان الصفحة" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="مثال: من نحن" />
            <Input label="Slug (اختياري)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="يتم إنشاؤه تلقائياً من العنوان" dir="ltr" />
            <Textarea label="المحتوى" value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={8} placeholder="محتوى الصفحة..." />
            <Select label="الحالة" options={[{ value: "draft", label: "مسودة" }, { value: "published", label: "منشور" }]} value={formStatus} onChange={(e) => setFormStatus(e.target.value as "published" | "draft")} />
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-text mb-3">تحسين محركات البحث (SEO)</p>
              <div className="space-y-3">
                <Input label="عنوان Meta" value={formMetaTitle} onChange={(e) => setFormMetaTitle(e.target.value)} placeholder="عنوان لمحركات البحث" />
                <Textarea label="وصف Meta" value={formMetaDesc} onChange={(e) => setFormMetaDesc(e.target.value)} rows={2} placeholder="وصف مختصر لمحركات البحث" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إنشاء الصفحة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
