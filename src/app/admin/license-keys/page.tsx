"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Copy, Eye, EyeOff, Trash2, CheckCircle, XCircle, Key, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

type LicenseKey = {
  id: string;
  key: string;
  product: string;
  customer: string;
  email: string;
  type: "single" | "subscription" | "enterprise";
  status: "active" | "expired" | "revoked" | "unused";
  activations: number;
  maxActivations: number;
  createdAt: string;
  expiresAt: string | null;
};

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
  return segments.join("-");
}

const initialLicenses: LicenseKey[] = [
  { id: "1", key: "AX7KM-9NPQR-2TWYZ-4BCDE", product: "دورة TypeScript المتقدمة", customer: "أحمد محمد", email: "ahmed@example.com", type: "single", status: "active", activations: 1, maxActivations: 2, createdAt: "2024-04-01", expiresAt: "2025-04-01" },
  { id: "2", key: "BX8LN-3PQRS-5UVWX-6FGHI", product: "أداة إدارة المهام", customer: "سارة العلي", email: "sara@example.com", type: "subscription", status: "active", activations: 2, maxActivations: 5, createdAt: "2024-03-15", expiresAt: "2024-09-15" },
  { id: "3", key: "CY9MP-4QRST-7WXYZ-8GHIJ", product: "مشروع React كامل", customer: "خالد الشمري", email: "khalid@example.com", type: "enterprise", status: "active", activations: 3, maxActivations: 10, createdAt: "2024-02-20", expiresAt: "2026-02-20" },
  { id: "4", key: "DZ0NQ-5RSTU-9ABCD-0HIJK", product: "دورة التسويق الرقمي", customer: "نورة السعيد", email: "noura@example.com", type: "single", status: "expired", activations: 1, maxActivations: 1, createdAt: "2023-06-01", expiresAt: "2024-06-01" },
  { id: "5", key: "EA1OR-6STUV-0BCDE-1IJKL", product: "حزمة المطور الشاملة", customer: "عبدالله الحربي", email: "abdullah@example.com", type: "enterprise", status: "revoked", activations: 0, maxActivations: 10, createdAt: "2024-01-10", expiresAt: null },
  { id: "6", key: "FB2PS-7TUVW-1CDEF-2JKLM", product: "كتاب فن البرمجة", customer: "فاطمة الزهراء", email: "fatima@example.com", type: "single", status: "unused", activations: 0, maxActivations: 1, createdAt: "2024-04-10", expiresAt: "2025-04-10" },
  { id: "7", key: "GC3QT-8UVWX-2DEFG-3KLMN", product: "قالب موقع تجاري", customer: "عمر بن سعود", email: "omar@example.com", type: "single", status: "active", activations: 1, maxActivations: 3, createdAt: "2024-03-20", expiresAt: "2025-03-20" },
  { id: "8", key: "HD4RU-9VWXY-3EFGH-4LMNO", product: "أداة إدارة المهام", customer: "مريم الفهد", email: "mariam@example.com", type: "subscription", status: "active", activations: 1, maxActivations: 3, createdAt: "2024-04-05", expiresAt: "2024-10-05" },
];

const typeOptions = [
  { value: "", label: "جميع الأنواع" },
  { value: "single", label: "مفردة" },
  { value: "subscription", label: "اشتراك" },
  { value: "enterprise", label: "مؤسسات" },
];

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "active", label: "نشط" },
  { value: "expired", label: "منتهي" },
  { value: "revoked", label: "ملغى" },
  { value: "unused", label: "غير مستخدم" },
];

function getStatusBadge(status: LicenseKey["status"]) {
  const map = {
    active: <Badge variant="success" dot>نشط</Badge>,
    expired: <Badge variant="warning" dot>منتهي</Badge>,
    revoked: <Badge variant="danger" dot>ملغى</Badge>,
    unused: <Badge variant="default" dot>غير مستخدم</Badge>,
  };
  return map[status];
}

function getTypeBadge(type: LicenseKey["type"]) {
  const map = {
    single: <Badge variant="info">مفردة</Badge>,
    subscription: <Badge variant="purple">اشتراك</Badge>,
    enterprise: <Badge variant="warning">مؤسسات</Badge>,
  };
  return map[type];
}

export default function LicenseKeysPage() {
  const { success, info } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [revokeTarget, setRevokeTarget] = useState<LicenseKey | null>(null);
  const [generateModal, setGenerateModal] = useState(false);
  const [newKeyProduct, setNewKeyProduct] = useState("");

  const {
    data: licenses,
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
    totalItems,
    totalPages,
  } = useCrud<LicenseKey>({
    initialData: initialLicenses,
    searchFields: ["customer", "product", "key"],
    itemsPerPage: 10,
    defaultSortKey: "createdAt",
    defaultSortDir: "desc",
  });

  const activeCount = useMemo(() => licenses.filter((l) => l.status === "active").length, [licenses]);
  const unusedCount = useMemo(() => licenses.filter((l) => l.status === "unused").length, [licenses]);

  const toggleKeyVisibility = useCallback((id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    info("تم النسخ", "تم نسخ المفتاح إلى الحافظة");
  }, [info]);

  const handleRevoke = useCallback(() => {
    if (!revokeTarget) return;
    update(revokeTarget.id, { status: "revoked" });
    success("تم الإلغاء", `تم إلغاء تفعيل المفتاح "${revokeTarget.key}" بنجاح`);
    setRevokeTarget(null);
  }, [revokeTarget, update, success]);

  const handleGenerate = useCallback(() => {
    if (!newKeyProduct.trim()) return;
    add({
      id: generateId(),
      key: generateKey(),
      product: newKeyProduct,
      customer: "—",
      email: "—",
      type: "single",
      status: "unused",
      activations: 0,
      maxActivations: 1,
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: null,
    });
    success("تم الإنشاء", `تم إنشاء مفتاح ترخيص جديد للمنتج "${newKeyProduct}"`);
    setGenerateModal(false);
    setNewKeyProduct("");
  }, [newKeyProduct, add, success]);

  const columns = useMemo(() => [
    {
      key: "key" as const,
      label: "المفتاح",
      sortable: true,
      render: (value: unknown, row: LicenseKey) => (
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-bg px-2 py-1 rounded border border-border">
            {showKeys[row.id] ? String(value) : "••••-••••-••••-••••"}
          </code>
          <button onClick={() => toggleKeyVisibility(row.id)} className="text-text-muted hover:text-text cursor-pointer">
            {showKeys[row.id] ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => handleCopy(String(value))} className="text-text-muted hover:text-primary cursor-pointer">
            <Copy size={14} />
          </button>
        </div>
      ),
    },
    { key: "product" as const, label: "المنتج", sortable: true },
    {
      key: "customer" as const,
      label: "العميل",
      sortable: true,
      render: (_: unknown, row: LicenseKey) => (
        <div>
          <p className="text-sm">{row.customer}</p>
          <p className="text-xs text-text-muted" dir="ltr">{row.email}</p>
        </div>
      ),
    },
    { key: "type" as const, label: "النوع", sortable: true, render: (value: unknown) => getTypeBadge(value as LicenseKey["type"]) },
    { key: "status" as const, label: "الحالة", sortable: true, render: (value: unknown) => getStatusBadge(value as LicenseKey["status"]) },
    {
      key: "activations" as const,
      label: "التفعيلات",
      sortable: true,
      render: (value: unknown, row: LicenseKey) => (
        <span className={Number(value) >= row.maxActivations ? "text-danger font-semibold" : "text-text"}>
          {String(value)}/{row.maxActivations}
        </span>
      ),
    },
    {
      key: "actions" as const,
      label: "الإجراءات",
      className: "w-20",
      render: (_: unknown, row: LicenseKey) => (
        <div className="flex items-center gap-1">
          {row.status === "active" && (
            <Button variant="ghost" size="sm" icon={<XCircle size={14} />} className="text-danger hover:text-danger" onClick={() => setRevokeTarget(row)} />
          )}
        </div>
      ),
    },
  ], [showKeys, toggleKeyVisibility, handleCopy]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="مفاتيح الترخيص"
        subtitle="إدارة ترخيصات المنتجات الرقمية وتفعيلاتها"
        actions={<Button icon={<Key size={16} />} onClick={() => setGenerateModal(true)}>إنشاء مفتاح جديد</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Key size={20} className="text-primary" /></div>
            <div><p className="text-2xl font-bold text-text">{totalItems}</p><p className="text-xs text-text-muted">إجمالي المفاتيح</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><CheckCircle size={20} className="text-success" /></div>
            <div><p className="text-2xl font-bold text-text">{activeCount}</p><p className="text-xs text-text-muted">مفاتيح نشطة</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><Key size={20} className="text-info" /></div>
            <div><p className="text-2xl font-bold text-text">{unusedCount}</p><p className="text-xs text-text-muted">مفاتيح غير مستخدمة</p></div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالعميل أو المنتج أو المفتاح..." value={search} onChange={setSearch} className="w-72" />
        <Select options={typeOptions} value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)} />
        <Select options={statusOptions} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا توجد مفاتيح ترخيص"
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
        title="إلغاء تفعيل المفتاح"
        message={`هل أنت متأكد من إلغاء تفعيل المفتاح "${revokeTarget?.key}"؟ لن يتمكن العميل من استخدامه.`}
        confirmLabel="إلغاء التفعيل"
        cancelLabel="تراجع"
        variant="danger"
      />

      {generateModal && (
        <Modal open onClose={() => setGenerateModal(false)} title="إنشاء مفتاح ترخيص جديد" size="md">
          <div className="space-y-4">
            <Input label="اسم المنتج" value={newKeyProduct} onChange={(e) => setNewKeyProduct(e.target.value)} placeholder="أدخل اسم المنتج" />
            <div className="bg-bg rounded-lg p-3 border border-border">
              <p className="text-xs text-text-muted">سيتم إنشاء مفتاح جديد بصيغة XXXXX-XXXXX-XXXXX-XXXXX</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setGenerateModal(false)}>إلغاء</Button>
              <Button onClick={handleGenerate} icon={<RefreshCw size={14} />}>إنشاء مفتاح</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
