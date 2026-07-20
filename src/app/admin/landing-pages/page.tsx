"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Copy, ExternalLink, Eye, Layout, TestTube, BarChart3, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDate, generateId } from "@/lib/utils";

type LandingPage = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "published" | "draft" | "archived";
  views: number;
  conversionRate: number;
  associatedType: "product" | "category" | "none";
  associatedName: string;
  hasABTest: boolean;
  variantA: string;
  variantB: string;
  trafficSplit: number;
  createdAt: string;
  updatedAt: string;
};

const mockPages: LandingPage[] = [
  { id: "1", title: "عرض الصيف الكبير", slug: "summer-sale", description: "صفحة عرض الصيف مع خصومات تصل إلى 50%", status: "published", views: 12500, conversionRate: 4.2, associatedType: "category", associatedName: "إلكترونيات", hasABTest: true, variantA: "تصميم أزرق", variantB: "تصميم أحمر", trafficSplit: 50, createdAt: "2026-06-01", updatedAt: "2026-06-15" },
  { id: "2", title: "إطلاق المنتج الجديد", slug: "new-product-launch", description: "صفحة إطلاق سماعات Pro Max", status: "published", views: 8900, conversionRate: 6.1, associatedType: "product", associatedName: "سماعات Pro Max", hasABTest: false, variantA: "", variantB: "", trafficSplit: 0, createdAt: "2026-05-20", updatedAt: "2026-06-10" },
  { id: "3", title: "حزمة المطورين", slug: "dev-bundle", description: "عرض خاص على حزم المطورين", status: "draft", views: 0, conversionRate: 0, associatedType: "category", associatedName: "قوالب", hasABTest: false, variantA: "", variantB: "", trafficSplit: 0, createdAt: "2026-06-10", updatedAt: "2026-06-10" },
  { id: "4", title: "العودة للمدارس", slug: "back-to-school", description: "عروض العودة للمدارس على الأجهزة التعليمية", status: "published", views: 15200, conversionRate: 3.8, associatedType: "category", associatedName: "تعليم", hasABTest: true, variantA: "تصميم كرتوني", variantB: "تصميم احترافي", trafficSplit: 60, createdAt: "2026-03-01", updatedAt: "2026-04-01" },
  { id: "5", title: "عرض الأعضاء VIP", slug: "vip-offer", description: "عرض حصري لعملاء VIP", status: "archived", views: 5600, conversionRate: 8.5, associatedType: "none", associatedName: "", hasABTest: false, variantA: "", variantB: "", trafficSplit: 0, createdAt: "2026-01-15", updatedAt: "2026-02-28" },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  published: { label: "منشور", variant: "success" },
  draft: { label: "مسودة", variant: "warning" },
  archived: { label: "مؤرشف", variant: "default" },
};

export default function LandingPagesPage() {
  const { success, error: showError, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LandingPage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingPage | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAssocType, setFormAssocType] = useState<LandingPage["associatedType"]>("none");
  const [formAssocName, setFormAssocName] = useState("");
  const [formHasAB, setFormHasAB] = useState(false);
  const [formVariantA, setFormVariantA] = useState("");
  const [formVariantB, setFormVariantB] = useState("");
  const [formTrafficSplit, setFormTrafficSplit] = useState(50);

  const {
    data: pages,
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
    totalItems,
    totalPages,
  } = useCrud<LandingPage>({
    initialData: mockPages,
    searchFields: ["title", "slug", "description"],
    itemsPerPage: 10,
    defaultSortKey: "updatedAt",
    defaultSortDir: "desc",
  });

  const publishedCount = useMemo(() => pages.filter((p) => p.status === "published").length, [pages]);
  const totalViews = useMemo(() => pages.reduce((sum, p) => sum + p.views, 0), [pages]);
  const avgConversion = useMemo(() => {
    const published = pages.filter((p) => p.status === "published");
    return published.length > 0 ? (published.reduce((sum, p) => sum + p.conversionRate, 0) / published.length).toFixed(1) : "0";
  }, [pages]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormAssocType("none");
    setFormAssocName("");
    setFormHasAB(false);
    setFormVariantA("");
    setFormVariantB("");
    setFormTrafficSplit(50);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((lp: LandingPage) => {
    setEditing(lp);
    setFormTitle(lp.title);
    setFormSlug(lp.slug);
    setFormDescription(lp.description);
    setFormAssocType(lp.associatedType);
    setFormAssocName(lp.associatedName);
    setFormHasAB(lp.hasABTest);
    setFormVariantA(lp.variantA);
    setFormVariantB(lp.variantB);
    setFormTrafficSplit(lp.trafficSplit);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formTitle.trim()) {
      showError("خطأ", "يرجى إدخال عنوان الصفحة");
      return;
    }
    const now = new Date().toISOString();
    const data: LandingPage = {
      id: editing?.id || generateId(),
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/\s+/g, "-"),
      description: formDescription,
      status: editing?.status || "draft",
      views: editing?.views || 0,
      conversionRate: editing?.conversionRate || 0,
      associatedType: formAssocType,
      associatedName: formAssocName,
      hasABTest: formHasAB,
      variantA: formVariantA,
      variantB: formVariantB,
      trafficSplit: formTrafficSplit,
      createdAt: editing?.createdAt || now,
      updatedAt: now,
    };
    if (editing) {
      update(editing.id, data);
      success("تم التحديث", `تم تحديث صفحة "${formTitle}" بنجاح`);
    } else {
      add(data);
      success("تمت الإضافة", `تم إنشاء صفحة "${formTitle}" بنجاح`);
    }
    setModalOpen(false);
    setEditing(null);
  }, [formTitle, formSlug, formDescription, formAssocType, formAssocName, formHasAB, formVariantA, formVariantB, formTrafficSplit, editing, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف صفحة "${deleteTarget.title}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleDuplicate = useCallback((lp: LandingPage) => {
    const duplicated = { ...lp, id: generateId(), title: `${lp.title} (نسخة)`, slug: `${lp.slug}-copy`, status: "draft" as const, views: 0, conversionRate: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    add(duplicated);
    success("تم النسخ", `تم نسخ صفحة "${lp.title}" بنجاح`);
  }, [add, success]);

  const handlePublish = useCallback((lp: LandingPage) => {
    const newStatus = lp.status === "published" ? "draft" : "published";
    update(lp.id, { status: newStatus });
    success("تم التغيير", `تم ${newStatus === "published" ? "نشر" : "إلغاء نشر"} صفحة "${lp.title}"`);
  }, [update, success]);

  const statItems = [
    { icon: <Layout size={20} />, label: "إجمالي الصفحات", value: totalItems, color: "primary" as const },
    { icon: <Layout size={20} />, label: "منشورة", value: publishedCount, color: "success" as const },
    { icon: <Eye size={20} />, label: "إجمالي المشاهدات", value: totalViews.toLocaleString("ar-SA"), color: "info" as const },
    { icon: <BarChart3 size={20} />, label: "معدل التحويل", value: `${avgConversion}%`, color: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="صفحات الهبوط" subtitle="إدارة صفحات الهبوط وتجربة A/B" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إنشاء صفحة هبوط</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
          >
            <StatCard icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="flex flex-wrap items-center gap-3"
      >
        <SearchInput placeholder="بحث في الصفحات..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع الحالات" }, { value: "published", label: "منشور" }, { value: "draft", label: "مسودة" }, { value: "archived", label: "مؤرشف" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {paginatedData.map((lp, i) => (
          <motion.div
            key={lp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text text-sm truncate">{lp.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">/{lp.slug}</p>
                </div>
                <button onClick={() => handlePublish(lp)}>
                  <Badge variant={statusConfig[lp.status].variant} dot className="cursor-pointer">{statusConfig[lp.status].label}</Badge>
                </button>
              </div>
              <p className="text-xs text-text-secondary mb-3 line-clamp-2">{lp.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-bg p-2.5 text-center">
                  <p className="text-lg font-bold text-text">{lp.views.toLocaleString("ar-SA")}</p>
                  <p className="text-[10px] text-text-muted">مشاهدة</p>
                </div>
                <div className="rounded-lg bg-bg p-2.5 text-center">
                  <p className="text-lg font-bold text-primary">{lp.conversionRate}%</p>
                  <p className="text-[10px] text-text-muted">تحويل</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] text-text-muted">آخر تعديل: {formatDate(lp.updatedAt)}</span>
                <div className="flex items-center gap-1">
                  {lp.hasABTest && <Badge variant="purple" size="sm"><TestTube size={10} className="ml-1" />A/B</Badge>}
                  <Button variant="ghost" size="sm" icon={<Copy size={14} />} onClick={() => handleDuplicate(lp)} title="نسخ" />
                  <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(lp)} title="تعديل" />
                  <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(lp)} title="حذف" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {paginatedData.length === 0 && (
        <EmptyState
          icon={<Layout size={24} />}
          title="لا توجد صفحات هبوط"
          description="ابدأ بإنشاء صفحة هبوط جديدة"
          action={<Button icon={<Plus size={16} />} onClick={openCreate}>إنشاء صفحة</Button>}
        />
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف صفحة الهبوط" message={`هل أنت متأكد من حذف "${deleteTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "تعديل صفحة الهبوط" : "إنشاء صفحة هبوط جديدة"} size="lg">
          <div className="space-y-5">
            <Input label="عنوان الصفحة" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="مثال: عرض الصيف" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="الرابط (Slug)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="summer-sale" dir="ltr" />
              <Select label="الارتباط" options={[{ value: "none", label: "بدون ارتباط" }, { value: "product", label: "منتج" }, { value: "category", label: "تصنيف" }]} value={formAssocType} onChange={(e) => setFormAssocType(e.target.value as LandingPage["associatedType"])} />
            </div>
            {formAssocType !== "none" && <Input label="اسم المنتج أو التصنيف" value={formAssocName} onChange={(e) => setFormAssocName(e.target.value)} placeholder="اسم المنتج أو التصنيف" />}
            <Textarea label="الوصف" rows={3} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف مختصر لصفحة الهبوط" />

            <div className="border-t border-border pt-4">
              <Toggle checked={formHasAB} onChange={setFormHasAB} label="تفعيل اختبار A/B" description="اختبار تصميمين مختلفين لنفس الصفحة" />
            </div>

            {formHasAB && (
              <div className="grid grid-cols-3 gap-4">
                <Input label="التصميم A" value={formVariantA} onChange={(e) => setFormVariantA(e.target.value)} placeholder="وصف التصميم أ" />
                <Input label="التصميم B" value={formVariantB} onChange={(e) => setFormVariantB(e.target.value)} placeholder="وصف التصميم ب" />
                <Input label="نسبة التوزيع (%)" type="number" value={formTrafficSplit} onChange={(e) => setFormTrafficSplit(Number(e.target.value))} helperText={`أ: ${formTrafficSplit}% — ب: ${100 - formTrafficSplit}%`} />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditing(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editing ? "حفظ التعديلات" : "إنشاء الصفحة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
