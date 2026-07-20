"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, MessageCircle, Tag } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDate, generateId } from "@/lib/utils";

type BlogPost = {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  status: "published" | "draft";
  publishedAt: string;
  comments: number;
  views: number;
  tags?: string;
};

const mockPosts: BlogPost[] = [
  { id: "1", title: "أفضل 10 نصائح لتجربة تسوق إلكتروني سلسة", author: "أحمد محمد", category: "نصائح", content: "محتوى المقال...", status: "published", publishedAt: "2026-07-10", comments: 24, views: 1850, tags: "نصائح,تسوق" },
  { id: "2", title: "كيف تختار المنتج المناسب عبر الإنترنت", author: "سارة العلي", category: "دليل المشتري", content: "محتوى المقال...", status: "published", publishedAt: "2026-07-05", comments: 18, views: 2340, tags: "دليل,منتجات" },
  { id: "3", title: "أحدث صيحات الموضة في 2026", author: "نورة الخليفة", category: "أزياء", content: "محتوى المقال...", status: "published", publishedAt: "2026-06-28", comments: 31, views: 4200, tags: "موضة,أزياء" },
  { id: "4", title: "دليل شامل للعناية بالأجهزة الإلكترونية", author: "خالد الراشد", category: "تكنولوجيا", content: "محتوى المقال...", status: "published", publishedAt: "2026-06-20", comments: 12, views: 1560, tags: "تكنولوجيا,إلكترونيات" },
  { id: "5", title: "أسرار العناية بالبشرة في فصل الصيف", author: "منى الحربي", category: "جمال وصحة", content: "محتوى المقال...", status: "draft", publishedAt: "", comments: 0, views: 0, tags: "جمال,صحة" },
  { id: "6", title: "كيف تبني علامة تجارية ناجحة", author: "عمر السعيد", category: "أعمال", content: "محتوى المقال...", status: "draft", publishedAt: "", comments: 0, views: 0, tags: "أعمال,علامات تجارية" },
];

const statusConfig: Record<BlogPost["status"], { label: string; variant: "success" | "default" }> = {
  published: { label: "منشور", variant: "success" },
  draft: { label: "مسودة", variant: "default" },
};

const categories = ["نصائح", "دليل المشتري", "أزياء", "تكنولوجيا", "جمال وصحة", "أعمال", "تقنية", "تعليم"];

export default function BlogPage() {
  const { success, error: showError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCategory, setFormCategory] = useState("نصائح");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");
  const [formTags, setFormTags] = useState("");
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  const {
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
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
  } = useCrud<BlogPost>({
    initialData: mockPosts,
    searchFields: ["title", "author", "category"],
    itemsPerPage: 10,
    defaultSortKey: "publishedAt",
    defaultSortDir: "desc",
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormTitle("");
    setFormAuthor("");
    setFormCategory("نصائح");
    setFormContent("");
    setFormStatus("draft");
    setFormTags("");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((p: BlogPost) => {
    setEditTarget(p);
    setFormTitle(p.title);
    setFormAuthor(p.author);
    setFormCategory(p.category);
    setFormContent(p.content);
    setFormStatus(p.status);
    setFormTags(p.tags || "");
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formTitle.trim() || !formAuthor.trim()) {
      showError("خطأ", "يرجى إدخال عنوان المقال والمؤلف");
      return;
    }
    const now = new Date().toISOString().split("T")[0];
    if (editTarget) {
      update(editTarget.id, { title: formTitle, author: formAuthor, category: formCategory, content: formContent, status: formStatus, tags: formTags, ...(formStatus === "published" && !editTarget.publishedAt ? { publishedAt: now } : {}) });
      success("تم التحديث", `تم تحديث مقال "${formTitle}" بنجاح`);
    } else {
      add({ id: generateId(), title: formTitle, author: formAuthor, category: formCategory, content: formContent, status: formStatus, publishedAt: formStatus === "published" ? now : "", comments: 0, views: 0, tags: formTags });
      success("تمت الإضافة", `تم إنشاء مقال "${formTitle}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formTitle, formAuthor, formCategory, formContent, formStatus, formTags, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف مقال "${deleteTarget.title}"`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const columns = [
    {
      key: "title" as const, label: "العنوان", sortable: true,
      render: (value: unknown) => <span className="font-medium text-text">{String(value)}</span>,
    },
    {
      key: "author" as const, label: "الكاتب", sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Avatar name={String(value)} size="sm" />
          <span className="text-sm text-text-secondary">{String(value)}</span>
        </div>
      ),
    },
    { key: "category" as const, label: "التصنيف", sortable: true, render: (value: unknown) => <Badge variant="purple">{String(value)}</Badge> },
    {
      key: "status" as const, label: "الحالة", sortable: true,
      render: (value: unknown) => { const config = statusConfig[value as BlogPost["status"]]; return <Badge variant={config.variant} dot>{config.label}</Badge>; },
    },
    { key: "publishedAt" as const, label: "تاريخ النشر", sortable: true, render: (value: unknown) => value ? <span className="text-sm text-text-secondary">{formatDate(String(value))}</span> : <span className="text-sm text-text-muted">—</span> },
    { key: "comments" as const, label: "التعليقات", sortable: true, render: (value: unknown) => <div className="flex items-center gap-1.5 text-text-secondary"><MessageCircle size={14} /><span className="text-sm">{Number(value)}</span></div> },
    {
      key: "id" as const, label: "الإجراءات", className: "w-28",
      render: (_: unknown, row: BlogPost) => (
        <div className="flex items-center gap-1">
          {row.status === "published" && <Button variant="ghost" size="sm" icon={<Eye size={14} />} title="عرض" onClick={() => setPreviewPost(row)} />}
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="المدونة" subtitle="إدارة مقالات المدونة" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إضافة مقال</Button>} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <SearchInput placeholder="بحث في المقالات..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "published", label: "منشور" }, { value: "draft", label: "مسودة" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
        <Badge variant="info">{totalItems} مقال</Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable columns={columns} data={paginatedData} emptyMessage="لا توجد مقالات" rowKey="id" sortable pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }} />
      </motion.div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف المقال" message={`هل أنت متأكد من حذف مقال "${deleteTarget?.title}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {previewPost && (
        <Modal open onClose={() => setPreviewPost(null)} title="معاينة المقال" size="lg">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text">{previewPost.title}</h2>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Avatar name={previewPost.author} size="sm" />
                <span>{previewPost.author}</span>
              </div>
              <Badge variant="purple">{previewPost.category}</Badge>
              <Badge variant={statusConfig[previewPost.status].variant} dot>{statusConfig[previewPost.status].label}</Badge>
            </div>
            {previewPost.publishedAt && <p className="text-sm text-text-muted">نُشر في: {formatDate(previewPost.publishedAt)}</p>}
            {previewPost.tags && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-text-muted" />
                {previewPost.tags.split(",").map((tag, i) => (
                  <Badge key={i} variant="default" size="sm">{tag.trim()}</Badge>
                ))}
              </div>
            )}
            <div className="border-t border-border pt-4">
              <p className="text-text leading-relaxed whitespace-pre-wrap">{previewPost.content}</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted border-t border-border pt-4">
              <span className="flex items-center gap-1.5"><Eye size={14} />{previewPost.views} مشاهدة</span>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} />{previewPost.comments} تعليق</span>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setPreviewPost(null)}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل المقال" : "إضافة مقال جديد"} size="lg">
          <div className="space-y-5">
            <Input label="عنوان المقال" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="عنوان المقال" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="المؤلف" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="اسم المؤلف" />
              <Select label="التصنيف" options={categories.map((c) => ({ value: c, label: c }))} value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
            </div>
            <Textarea label="المحتوى" value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={8} placeholder="محتوى المقال..." />
            <Input label="الوسوم" value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="مفصولة بفواصل: نصائح,تسوق,منتجات" />
            <Select label="الحالة" options={[{ value: "draft", label: "مسودة" }, { value: "published", label: "منشور" }]} value={formStatus} onChange={(e) => setFormStatus(e.target.value as "published" | "draft")} />
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "نشر المقال"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
