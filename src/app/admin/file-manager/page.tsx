"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FolderPlus, Grid, List, Trash2, Download, Eye, Copy, HardDrive, Folder } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { cn, generateId } from "@/lib/utils";

type FileManagerFile = { id: string; name: string; type: "image" | "video" | "audio" | "document" | "archive" | "code" | "other"; size: number; folder: string; uploadedBy: string; uploadedAt: string; downloads: number; [key: string]: unknown };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}

const fileColors: Record<string, string> = { image: "text-blue-500", video: "text-purple-500", audio: "text-pink-500", document: "text-red-500", archive: "text-yellow-500", code: "text-green-500", other: "text-text-muted" };

const initialFiles: FileManagerFile[] = [
  { id: "1", name: "typescript-advanced.zip", type: "archive", size: 450 * 1048576, folder: "/دورات", uploadedBy: "أحمد", uploadedAt: "2026-04-15", downloads: 342 },
  { id: "2", name: "ecommerce-template.zip", type: "archive", size: 28 * 1048576, folder: "/قوالب", uploadedBy: "سارة", uploadedAt: "2026-04-14", downloads: 89 },
  { id: "3", name: "content-marketing.pdf", type: "document", size: 5 * 1048576, folder: "/كتب", uploadedBy: "خالد", uploadedAt: "2026-04-10", downloads: 156 },
  { id: "4", name: "digital-marketing.mp4", type: "video", size: 1200 * 1048576, folder: "/فيديوهات", uploadedBy: "فاطمة", uploadedAt: "2026-04-16", downloads: 201 },
  { id: "5", name: "store-logo.png", type: "image", size: 250 * 1024, folder: "/صور", uploadedBy: "أحمد", uploadedAt: "2026-01-01", downloads: 0 },
  { id: "6", name: "api-documentation.pdf", type: "document", size: 8 * 1048576, folder: "/وثائق", uploadedBy: "خالد", uploadedAt: "2026-04-01", downloads: 89 },
];

const folders = ["الكل", "/دورات", "/قوالب", "/كتب", "/تصميم", "/فيديوهات", "/صور", "/وثائق"];
const typeOptions = ["الكل", "image", "video", "audio", "document", "archive", "code", "other"];
const typeLabels: Record<string, string> = { image: "صور", video: "فيديو", audio: "صوت", document: "مستند", archive: "أرشيف", code: "شفرة", other: "أخرى" };

export default function FileManagerPage() {
  const { success, info } = useToast();
  const [files, setFiles] = useState(initialFiles);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileManagerFile | null>(null);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FileManagerFile | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const newFiles: FileManagerFile[] = Array.from(uploadedFiles).map((file) => ({
      id: generateId(),
      name: file.name,
      type: (["image", "video", "audio", "document", "archive", "code"].find((t) => file.type.startsWith(t)) || "other") as FileManagerFile["type"],
      size: file.size,
      folder: activeFolder === "الكل" ? "/" : activeFolder,
      uploadedBy: "أنت",
      uploadedAt: new Date().toISOString().split("T")[0],
      downloads: 0,
    }));
    setFiles((prev) => [...newFiles, ...prev]);
    success("تم الرفع", `تم رفع ${uploadedFiles.length} ملف بنجاح`);
    e.target.value = "";
  }, [activeFolder, success]);

  const filtered = files.filter((f) => {
    const ms = !search || f.name.includes(search);
    const mf = activeFolder === "الكل" || f.folder === activeFolder;
    const mt = typeFilter === "الكل" || f.type === typeFilter;
    return ms && mf && mt;
  });

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setSelectedFiles((prev) => prev.filter((id) => id !== deleteTarget.id));
    success("تم الحذف", `تم حذف "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, success]);

  const handleBulkDelete = useCallback(() => {
    setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
    success("تم الحذف", `تم حذف ${selectedFiles.length} ملفات`);
    setSelectedFiles([]);
    setBulkDeleteOpen(false);
  }, [selectedFiles, success]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    info("تم الإنشاء", `تم إنشاء مجلد "/${newFolderName}"`);
    setNewFolderModal(false);
    setNewFolderName("");
  }, [newFolderName, info]);

  const handleCopyLink = useCallback((file: FileManagerFile) => {
    navigator.clipboard.writeText(`https://store.com/files/${file.name}`);
    info("تم النسخ", "تم نسخ رابط الملف");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="مدير الملفات" subtitle="إدارة جميع الملفات والمجلدات" actions={<div className="flex gap-2"><input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} /><Button variant="secondary" icon={<FolderPlus size={16} />} onClick={() => setNewFolderModal(true)}>مجلد جديد</Button><Button icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>رفع ملفات</Button></div>} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><HardDrive size={20} className="text-primary" /></div><div><p className="text-2xl font-bold text-text">{files.length}</p><p className="text-xs text-text-muted">إجمالي الملفات</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><Folder size={20} className="text-info" /></div><div><p className="text-2xl font-bold text-text">{folders.length - 1}</p><p className="text-xs text-text-muted">المجلدات</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><HardDrive size={20} className="text-warning" /></div><div><p className="text-2xl font-bold text-text">{formatSize(totalSize)}</p><p className="text-xs text-text-muted">الحجم الإجمالي</p></div></div></Card>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث عن ملف..." value={search} onChange={setSearch} className="w-64" />
        <select className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text" value={activeFolder} onChange={(e) => setActiveFolder(e.target.value)}>
          {folders.map((f) => <option key={f} value={f}>{f === "الكل" ? "جميع المجلدات" : f}</option>)}
        </select>
        <select className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {typeOptions.map((t) => <option key={t} value={t}>{t === "الكل" ? "جميع الأنواع" : typeLabels[t] || t}</option>)}
        </select>
        <Button variant={viewMode === "grid" ? "primary" : "ghost"} size="sm" icon={<Grid size={14} />} onClick={() => setViewMode("grid")} />
        <Button variant={viewMode === "list" ? "primary" : "ghost"} size="sm" icon={<List size={14} />} onClick={() => setViewMode("list")} />
        <Badge variant="info">{filtered.length} ملف</Badge>
      </div>
      {selectedFiles.length > 0 && (
        <Card padding="sm"><div className="flex items-center gap-3"><span className="text-sm text-text-secondary">تم تحديد {selectedFiles.length} ملف</span><Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>حذف المحدد</Button><Button variant="secondary" size="sm" onClick={() => setSelectedFiles([])}>إلغاء التحديد</Button></div></Card>
      )}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((file) => (
            <div key={file.id} className={cn("group relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md", selectedFiles.includes(file.id) ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/50")} onClick={() => toggleSelect(file.id)} onDoubleClick={() => setPreviewFile(file)}>
              {selectedFiles.includes(file.id) && <div className="absolute top-2 left-2"><Badge variant="success" className="text-[10px]">✓</Badge></div>}
              <div className="flex flex-col items-center gap-2">
                <span className={cn("text-2xl", fileColors[file.type])}>●</span>
                <p className="text-xs text-text text-center font-medium truncate w-full">{file.name}</p>
                <p className="text-[10px] text-text-muted">{formatSize(file.size)}</p>
                <p className="text-[10px] text-text-muted">{file.folder}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }} className="p-1 rounded bg-surface hover:bg-surface-hover cursor-pointer"><Eye size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(file); }} className="p-1 rounded bg-surface hover:bg-danger/10 text-danger cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-right px-4 py-3 font-medium text-text-secondary">الاسم</th><th className="text-right px-4 py-3 font-medium text-text-secondary">النوع</th><th className="text-right px-4 py-3 font-medium text-text-secondary">الحجم</th><th className="text-right px-4 py-3 font-medium text-text-secondary">المجلد</th><th className="text-right px-4 py-3 font-medium text-text-secondary">إجراءات</th></tr></thead>
              <tbody>
                {filtered.map((file) => (
                  <tr key={file.id} className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><input type="checkbox" checked={selectedFiles.includes(file.id)} onChange={() => toggleSelect(file.id)} className="h-4 w-4 rounded cursor-pointer" /><span className="font-medium text-text">{file.name}</span></div></td>
                    <td className="px-4 py-3"><Badge variant="default">{typeLabels[file.type]}</Badge></td>
                    <td className="px-4 py-3 text-text-secondary">{formatSize(file.size)}</td>
                    <td className="px-4 py-3 text-text-muted font-mono text-xs">{file.folder}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setPreviewFile(file)} /><Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(file)} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {previewFile && (
        <Modal open onClose={() => setPreviewFile(null)} title={`تفاصيل — ${previewFile.name}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-text-muted">المجلد</p><p className="font-mono">{previewFile.folder}</p></div>
              <div><p className="text-text-muted">رفعه</p><p>{previewFile.uploadedBy}</p></div>
              <div><p className="text-text-muted">الحجم</p><p>{formatSize(previewFile.size)}</p></div>
              <div><p className="text-text-muted">التحميلات</p><p>{previewFile.downloads}</p></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => handleCopyLink(previewFile)} icon={<Copy size={14} />}>نسخ الرابط</Button>
              <Button variant="secondary" icon={<Download size={14} />} onClick={() => info("جاري التحميل", `جاري تحميل ${previewFile.name}`)}>تحميل</Button>
            </div>
            <div className="flex justify-end"><Button variant="secondary" onClick={() => setPreviewFile(null)}>إغلاق</Button></div>
          </div>
        </Modal>
      )}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الملف" message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} onConfirm={handleBulkDelete} title="حذف المحدد" message={`هل أنت متأكد من حذف ${selectedFiles.length} ملفات؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
      {newFolderModal && (
        <Modal open onClose={() => setNewFolderModal(false)} title="إنشاء مجلد جديد" size="sm">
          <div className="space-y-4">
            <Input label="اسم المجلد" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="مثال: مشاريع" dir="ltr" />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setNewFolderModal(false)}>إلغاء</Button>
              <Button onClick={handleCreateFolder}>إنشاء</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
