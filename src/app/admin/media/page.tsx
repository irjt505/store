"use client";

import { useState, useCallback } from "react";
import { Upload, Trash2, FileImage, Film, FileText, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const mediaItems = [
  { id: 1, name: "product-hero.jpg", type: "image", size: "2.4 MB", date: "2026-07-15", color: "bg-primary-light" },
  { id: 2, name: "banner-winter.png", type: "image", size: "1.8 MB", date: "2026-07-14", color: "bg-info-light" },
  { id: 3, name: "product-video.mp4", type: "video", size: "15.2 MB", date: "2026-07-14", color: "bg-warning-light" },
  { id: 4, name: "catalog-2026.pdf", type: "document", size: "4.5 MB", date: "2026-07-13", color: "bg-danger-light" },
  { id: 5, name: "logo-dark.svg", type: "image", size: "12 KB", date: "2026-07-12", color: "bg-success-light" },
  { id: 6, name: "testimonial-1.jpg", type: "image", size: "890 KB", date: "2026-07-12", color: "bg-primary-light" },
  { id: 7, name: "demo-unboxing.mp4", type: "video", size: "28.7 MB", date: "2026-07-11", color: "bg-warning-light" },
  { id: 8, name: "user-guide.pdf", type: "document", size: "1.2 MB", date: "2026-07-10", color: "bg-danger-light" },
  { id: 9, name: "category-icon.svg", type: "image", size: "8 KB", date: "2026-07-10", color: "bg-info-light" },
  { id: 10, name: "social-share.jpg", type: "image", size: "560 KB", date: "2026-07-09", color: "bg-success-light" },
];

const typeIcons: Record<string, React.ReactNode> = {
  image: <FileImage size={28} className="text-primary" />,
  video: <Film size={28} className="text-warning" />,
  document: <FileText size={28} className="text-danger" />,
};

const filterTabs = [
  { key: "all", label: "الكل" },
  { key: "image", label: "الصور" },
  { key: "video", label: "الفيديو" },
  { key: "document", label: "المستندات" },
];

export default function MediaPage() {
  const { success, info } = useToast();
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState("all");
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const filtered = filter === "all" ? mediaItems : mediaItems.filter((m) => m.type === filter);

  const toggleSelect = useCallback((id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.length === filtered.length) { setSelected([]); } else { setSelected(filtered.map((m) => m.id)); }
  }, [selected, filtered]);

  const handleBulkDelete = useCallback(() => {
    success("تم الحذف", `تم حذف ${selected.length} ملفات`);
    setSelected([]);
    setBulkDeleteOpen(false);
  }, [selected, success]);

  return (
    <div className="space-y-6">
      <PageHeader title="مدير الوسائط" subtitle="إدارة ملفات الوسائط والصور والمستندات" actions={<Button icon={<Upload size={16} />} onClick={() => info("الرفع", "تم فتح نافذة رفع الملفات")}>رفع ملفات</Button>} />
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-10 transition-colors hover:border-primary/40 hover:bg-primary-light/10 cursor-pointer" onClick={() => info("الرفع", "تم فتح نافذة رفع الملفات")}>
        <div className="text-center">
          <Upload size={36} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm font-medium text-text">اسحب الملفات هنا أو انقر للرفع</p>
          <p className="mt-1 text-xs text-text-muted">PNG, JPG, GIF, PDF, MP4 - الحد الأقصى 50 ميجا</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Tabs tabs={filterTabs} onChange={setFilter}><div /></Tabs>
        {selected.length > 0 && <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setBulkDeleteOpen(true)}>حذف المحدد ({selected.length})</Button>}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <div key={item.id} className={cn("group relative rounded-xl border bg-surface overflow-hidden transition-all", selected.includes(item.id) ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-border/80")}>
            <button onClick={() => toggleSelect(item.id)} className="absolute top-2 left-2 z-10 cursor-pointer">
              {selected.includes(item.id) ? <CheckSquare size={20} className="text-primary" /> : <Square size={20} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
            <div className={cn("flex h-36 items-center justify-center", item.color)}>{typeIcons[item.type]}</div>
            <div className="p-3">
              <p className="text-sm font-medium text-text truncate">{item.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-text-muted">{item.size}</span>
                <Badge variant={item.type === "image" ? "info" : item.type === "video" ? "warning" : "danger"}>{item.type === "image" ? "صورة" : item.type === "video" ? "فيديو" : "مستند"}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} onConfirm={handleBulkDelete} title="حذف المحدد" message={`هل أنت متأكد من حذف ${selected.length} ملفات؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
    </div>
  );
}
