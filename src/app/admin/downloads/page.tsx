"use client";

import { useState, useCallback, useMemo } from "react";
import { Download, Eye, Trash2, RefreshCw, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";

type DownloadRecord = {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  fileName: string;
  fileSize: string;
  downloads: number;
  maxDownloads: number;
  lastDownloaded: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
  ip: string;
};

const initialDownloads: DownloadRecord[] = [
  { id: "1", customerName: "أحمد محمد", customerEmail: "ahmed@example.com", productName: "دورة TypeScript المتقدمة", fileName: "typescript-advanced.zip", fileSize: "450 ميجا", downloads: 3, maxDownloads: 5, lastDownloaded: "2024-04-15", expiresAt: "2024-07-15", status: "active", ip: "192.168.1.1" },
  { id: "2", customerName: "سارة العلي", customerEmail: "sara@example.com", productName: "قالب موقع تجاري", fileName: "ecommerce-template.zip", fileSize: "28 ميجا", downloads: 1, maxDownloads: 3, lastDownloaded: "2024-04-14", expiresAt: null, status: "active", ip: "10.0.0.1" },
  { id: "3", customerName: "خالد الشمري", customerEmail: "khalid@example.com", productName: "كتاب تسويق المحتوى", fileName: "content-marketing.pdf", fileSize: "5.2 ميجا", downloads: 5, maxDownloads: 5, lastDownloaded: "2024-04-10", expiresAt: "2024-04-10", status: "expired", ip: "172.16.0.1" },
  { id: "4", customerName: "نورة السعيد", customerEmail: "noura@example.com", productName: "حزمة أيقونات SVG", fileName: "svg-icons-pack.zip", fileSize: "12 ميجا", downloads: 2, maxDownloads: 10, lastDownloaded: "2024-04-12", expiresAt: "2025-01-01", status: "active", ip: "192.168.2.5" },
  { id: "5", customerName: "عبدالله الحربي", customerEmail: "abdullah@example.com", productName: "مشروع React كامل", fileName: "react-project.zip", fileSize: "89 ميجا", downloads: 1, maxDownloads: 3, lastDownloaded: "2024-03-20", expiresAt: null, status: "revoked", ip: "10.10.10.1" },
  { id: "6", customerName: "فاطمة الزهراء", customerEmail: "fatima@example.com", productName: "كورس التسويق الرقمي", fileName: "digital-marketing.zip", fileSize: "1.2 جيجا", downloads: 7, maxDownloads: 15, lastDownloaded: "2024-04-16", expiresAt: "2024-12-31", status: "active", ip: "192.168.3.10" },
  { id: "7", customerName: "عمر بن سعود", customerEmail: "omar@example.com", productName: "أداة إدارة المهام", fileName: "task-manager.dmg", fileSize: "45 ميجا", downloads: 0, maxDownloads: 3, lastDownloaded: "—", expiresAt: "2024-06-01", status: "active", ip: "—" },
  { id: "8", customerName: "مريم الفهد", customerEmail: "mariam@example.com", productName: "بودكاست ريادة الأعمال", fileName: "entrepreneurship-podcast.zip", fileSize: "320 ميجا", downloads: 4, maxDownloads: 20, lastDownloaded: "2024-04-13", expiresAt: null, status: "active", ip: "172.16.1.5" },
];

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "active", label: "نشط" },
  { value: "expired", label: "منتهي" },
  { value: "revoked", label: "ملغى" },
];

function getStatusBadge(status: DownloadRecord["status"]) {
  if (status === "active") return <Badge variant="success" dot>نشط</Badge>;
  if (status === "expired") return <Badge variant="warning" dot>منتهي</Badge>;
  return <Badge variant="danger" dot>ملغى</Badge>;
}

export default function DownloadsPage() {
  const { success } = useToast();
  const [detailModal, setDetailModal] = useState<DownloadRecord | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<DownloadRecord | null>(null);

  const {
    data: downloads,
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
    update,
    remove,
    totalItems,
    totalPages,
  } = useCrud<DownloadRecord>({
    initialData: initialDownloads,
    searchFields: ["customerName", "productName", "fileName"],
    itemsPerPage: 10,
    defaultSortKey: "lastDownloaded",
    defaultSortDir: "desc",
  });

  const totalDownloadCount = useMemo(() => downloads.reduce((s, d) => s + d.downloads, 0), [downloads]);
  const activeCount = useMemo(() => downloads.filter((d) => d.status === "active").length, [downloads]);
  const expiredCount = useMemo(() => downloads.filter((d) => d.status === "expired").length, [downloads]);

  const handleRevoke = useCallback(() => {
    if (!revokeTarget) return;
    update(revokeTarget.id, { status: "revoked" });
    success("تم الإلغاء", `تم إلغاء وصول التحميل للعميل "${revokeTarget.customerName}"`);
    setRevokeTarget(null);
  }, [revokeTarget, update, success]);

  const handleReset = useCallback((record: DownloadRecord) => {
    update(record.id, { downloads: 0, status: "active" });
    success("تم إعادة التعيين", `تم إعادة تعيين عداد التحميلات للعميل "${record.customerName}"`);
  }, [update, success]);

  const columns = useMemo(() => [
    {
      key: "customerName" as const,
      label: "العميل",
      sortable: true,
      render: (_: unknown, row: DownloadRecord) => (
        <div>
          <p className="font-medium text-text">{row.customerName}</p>
          <p className="text-xs text-text-muted">{row.customerEmail}</p>
        </div>
      ),
    },
    { key: "productName" as const, label: "المنتج", sortable: true },
    {
      key: "fileName" as const,
      label: "الملف",
      render: (value: unknown, row: DownloadRecord) => (
        <div>
          <p className="text-sm font-mono text-text">{String(value)}</p>
          <p className="text-xs text-text-muted">{row.fileSize}</p>
        </div>
      ),
    },
    {
      key: "downloads" as const,
      label: "التحميلات",
      sortable: true,
      render: (value: unknown, row: DownloadRecord) => (
        <span className={Number(value) >= row.maxDownloads ? "text-danger font-semibold" : "text-text"}>
          {String(value)} / {row.maxDownloads}
        </span>
      ),
    },
    { key: "lastDownloaded" as const, label: "آخر تحميل", sortable: true },
    {
      key: "expiresAt" as const,
      label: "الانتهاء",
      render: (value: unknown) =>
        value ? <span className="text-text-secondary">{String(value)}</span> : <Badge variant="info">دائم</Badge>,
    },
    {
      key: "status" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as DownloadRecord["status"]),
    },
    {
      key: "actions" as const,
      label: "الإجراءات",
      className: "w-24",
      render: (_: unknown, row: DownloadRecord) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setDetailModal(row)} />
          <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => handleReset(row)} title="إعادة تعيين" />
          {row.status === "active" && (
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setRevokeTarget(row)} title="إلغاء الوصول" />
          )}
        </div>
      ),
    },
  ], [handleReset]);

  return (
    <div className="space-y-6">
      <PageHeader title="التحميلات" subtitle="تتبع جميع تحميلات المنتجات الرقمية" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Download size={20} className="text-primary" /></div>
            <div><p className="text-2xl font-bold text-text">{totalDownloadCount}</p><p className="text-xs text-text-muted">إجمالي التحميلات</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><Badge variant="success" className="text-lg">{activeCount}</Badge></div>
            <div><p className="text-2xl font-bold text-text">{activeCount}</p><p className="text-xs text-text-muted">روابط نشطة</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><Clock size={20} className="text-warning" /></div>
            <div><p className="text-2xl font-bold text-text">{expiredCount}</p><p className="text-xs text-text-muted">روابط منتهية</p></div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالعميل أو المنتج أو الملف..." value={search} onChange={setSearch} className="w-72" />
        <Select options={statusOptions} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا توجد سجلات تحميل"
        rowKey="id"
        sortable
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: perPage,
          onPageChange: setPage,
          onItemsPerPageChange: setPerPage,
        }}
        striped
      />

      <ConfirmDialog
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevoke}
        title="إلغاء الوصول"
        message={`هل أنت متأكد من إلغاء وصول التحميل للعميل "${revokeTarget?.customerName}"؟ لن يتمكن من تحميل الملفات.`}
        confirmLabel="إلغاء الوصول"
        cancelLabel="تراجع"
        variant="danger"
      />

      {detailModal && (
        <Modal open onClose={() => setDetailModal(null)} title="تفاصيل التحميل" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-text-muted">العميل</p><p className="font-medium">{detailModal.customerName}</p></div>
              <div><p className="text-sm text-text-muted">البريد الإلكتروني</p><p className="font-medium" dir="ltr">{detailModal.customerEmail}</p></div>
              <div><p className="text-sm text-text-muted">المنتج</p><p className="font-medium">{detailModal.productName}</p></div>
              <div><p className="text-sm text-text-muted">الملف</p><p className="font-medium font-mono">{detailModal.fileName}</p></div>
              <div><p className="text-sm text-text-muted">الحجم</p><p className="font-medium">{detailModal.fileSize}</p></div>
              <div><p className="text-sm text-text-muted">التحميلات</p><p className="font-medium">{detailModal.downloads}/{detailModal.maxDownloads}</p></div>
              <div><p className="text-sm text-text-muted">الحالة</p>{getStatusBadge(detailModal.status)}</div>
              <div><p className="text-sm text-text-muted">عنوان IP</p><p className="font-medium font-mono">{detailModal.ip}</p></div>
              <div><p className="text-sm text-text-muted">آخر تحميل</p><p className="font-medium">{detailModal.lastDownloaded}</p></div>
              <div><p className="text-sm text-text-muted">تاريخ الانتهاء</p><p className="font-medium">{detailModal.expiresAt || "دائم"}</p></div>
            </div>
            <div className="flex justify-end gap-3">
              {detailModal.status === "active" && (
                <Button variant="danger" size="sm" onClick={() => { setDetailModal(null); setRevokeTarget(detailModal); }}>إلغاء الوصول</Button>
              )}
              <Button variant="secondary" onClick={() => setDetailModal(null)}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
