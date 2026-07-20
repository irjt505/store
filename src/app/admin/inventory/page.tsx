"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Package, AlertTriangle, XCircle, ArrowUpCircle, ArrowDownCircle, History, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";

type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
  type: string;
  category: string;
};

const initialInventory: InventoryProduct[] = [
  { id: "1", name: "قميص رجالي قطني", sku: "PHS-001", stock: 250, lowStockThreshold: 20, status: "in_stock", lastUpdated: "2024-04-15", type: "فيزيائي", category: "أزياء رجالية" },
  { id: "2", name: "حذاء رياضي آير ماكس", sku: "PHS-002", stock: 85, lowStockThreshold: 15, status: "in_stock", lastUpdated: "2024-04-14", type: "فيزيائي", category: "أحذية رياضية" },
  { id: "3", name: "سماعات لاسلكية بلوتوث", sku: "PHS-003", stock: 0, lowStockThreshold: 10, status: "out_of_stock", lastUpdated: "2024-04-13", type: "فيزيائي", category: "إلكترونيات" },
  { id: "4", name: "ساعة يد كلاسيكية", sku: "PHS-004", stock: 12, lowStockThreshold: 5, status: "in_stock", lastUpdated: "2024-04-12", type: "فيزيائي", category: "إكسسوارات" },
  { id: "5", name: "حزمة المطور الشاملة", sku: "BND-001", stock: 500, lowStockThreshold: 50, status: "in_stock", lastUpdated: "2024-04-11", type: "حزمة", category: "حزم" },
  { id: "6", name: "أكواد PlayStation 5", sku: "COD-001", stock: 35, lowStockThreshold: 20, status: "low_stock", lastUpdated: "2024-04-10", type: "أكواد", category: "أكواد رقمية" },
  { id: "7", name: "وجبة دجاج مشوي", sku: "FOD-001", stock: 30, lowStockThreshold: 10, status: "in_stock", lastUpdated: "2024-04-09", type: "غذائي", category: "وجبات" },
  { id: "8", name: "وجبة سushi يابانية", sku: "FOD-002", stock: 5, lowStockThreshold: 8, status: "low_stock", lastUpdated: "2024-04-08", type: "غذائي", category: "وجبات" },
  { id: "9", name: "حجز موعد استشارة قانونية", sku: "BKG-001", stock: 10, lowStockThreshold: 3, status: "in_stock", lastUpdated: "2024-04-07", type: "حجز", category: "خدمات قانونية" },
  { id: "10", name: "套件 تطوير React", sku: "BND-002", stock: 0, lowStockThreshold: 10, status: "out_of_stock", lastUpdated: "2024-04-06", type: "حزمة", category: "حزم" },
  { id: "11", name: "جبس تطوير Flutter", sku: "BND-003", stock: 8, lowStockThreshold: 10, status: "low_stock", lastUpdated: "2024-04-05", type: "حزمة", category: "حزم" },
];

const statusFilterOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "in_stock", label: "متوفر" },
  { value: "low_stock", label: "مخزون منخفض" },
  { value: "out_of_stock", label: "نفد المخزون" },
];

const adjustmentReasonOptions = [
  { value: "", label: "اختر السبب" },
  { value: "restock", label: "إعادة تعبئة" },
  { value: "return", label: "مرتجع من العميل" },
  { value: "damage", label: "تلف / تعطل" },
  { value: "correction", label: "تصحيح خطأ" },
  { value: "other", label: "سبب آخر" },
];

function getStockStatusBadge(status: InventoryProduct["status"]) {
  if (status === "in_stock") return <Badge variant="success" dot>متوفر</Badge>;
  if (status === "low_stock") return <Badge variant="warning" dot>مخزون منخفض</Badge>;
  return <Badge variant="danger" dot>نفد المخزون</Badge>;
}

export default function InventoryPage() {
  const { success, error: showError } = useToast();
  const [adjustModal, setAdjustModal] = useState<InventoryProduct | null>(null);
  const [adjustType, setAdjustType] = useState<"add" | "remove">("add");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [bulkThreshold, setBulkThreshold] = useState("");

  const {
    data: inventory,
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
    selectedIds,
    setSelectedIds,
    update,
    totalItems,
    totalPages,
  } = useCrud<InventoryProduct>({
    initialData: initialInventory,
    searchFields: ["name", "sku", "category"],
    itemsPerPage: 10,
    defaultSortKey: "lastUpdated",
    defaultSortDir: "desc",
  });

  const lowStockProducts = useMemo(
    () => inventory.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0),
    [inventory]
  );

  const outOfStockProducts = useMemo(
    () => inventory.filter((p) => p.stock === 0),
    [inventory]
  );

  const handleAdjust = useCallback(() => {
    if (!adjustModal) return;
    const qty = Number(adjustQty);
    if (!qty || qty <= 0) {
      showError("خطأ", "يرجى إدخال كمية صحيحة");
      return;
    }
    if (!adjustReason) {
      showError("خطأ", "يرجى اختيار سبب التعديل");
      return;
    }
    const newStock = adjustType === "add" ? adjustModal.stock + qty : adjustModal.stock - qty;
    if (newStock < 0) {
      showError("خطأ", "لا يمكن أن يكون المخزون سالباً");
      return;
    }
    const newStatus: InventoryProduct["status"] = newStock === 0 ? "out_of_stock" : newStock <= adjustModal.lowStockThreshold ? "low_stock" : "in_stock";
    update(adjustModal.id, {
      stock: newStock,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    success("تم التعديل", `تم ${adjustType === "add" ? "إضافة" : "خصم"} ${qty} وحدة من "${adjustModal.name}"`);
    setAdjustModal(null);
    setAdjustQty("");
    setAdjustReason("");
    setAdjustNote("");
  }, [adjustModal, adjustType, adjustQty, adjustReason, showError, update, success]);

  const handleBulkThresholdUpdate = useCallback(() => {
    if (!bulkThreshold || Number(bulkThreshold) < 0) {
      showError("خطأ", "يرجى إدخال حد صحيح");
      return;
    }
    selectedIds.forEach((id) => {
      update(id, { lowStockThreshold: Number(bulkThreshold) } as Partial<InventoryProduct>);
    });
    success("تم التحديث", `تم تحديث الحد الأدنى لـ ${selectedIds.length} منتج`);
    setSelectedIds([]);
    setBulkUpdateOpen(false);
    setBulkThreshold("");
  }, [bulkThreshold, selectedIds, showError, update, success, setSelectedIds]);

  const columns = useMemo(
    () => [
      {
        key: "name" as const,
        label: "المنتج",
        sortable: true,
        render: (_: unknown, row: InventoryProduct) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted shrink-0">
              <Package size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-text truncate">{row.name}</p>
              <p className="text-xs text-text-muted" dir="ltr">{row.sku}</p>
            </div>
          </div>
        ),
      },
      {
        key: "stock" as const,
        label: "المخزون الحالي",
        sortable: true,
        render: (_: unknown, row: InventoryProduct) => (
          <span className={`font-bold text-lg ${row.stock === 0 ? "text-danger" : row.stock <= row.lowStockThreshold ? "text-warning" : "text-success"}`}>
            {row.stock.toLocaleString("ar")}
          </span>
        ),
      },
      {
        key: "lowStockThreshold" as const,
        label: "الحد الأدنى",
        sortable: true,
      },
      {
        key: "status" as const,
        label: "الحالة",
        sortable: true,
        render: (value: unknown) => getStockStatusBadge(value as InventoryProduct["status"]),
      },
      { key: "category" as const, label: "التصنيف", sortable: true },
      { key: "lastUpdated" as const, label: "آخر تحديث", sortable: true },
      {
        key: "actions" as const,
        label: "الإجراءات",
        className: "w-28",
        render: (_: unknown, row: InventoryProduct) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowUpCircle size={14} />}
              onClick={() => { setAdjustModal(row); setAdjustType("add"); }}
              title="إضافة مخزون"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowDownCircle size={14} />}
              onClick={() => { setAdjustModal(row); setAdjustType("remove"); }}
              title="خصم مخزون"
              className="text-danger hover:text-danger"
            />
          </div>
        ),
      },
    ],
    []
  );

  const bulkActions = [
    {
      label: "تحديث الحد الأدنى",
      icon: <Package size={14} />,
      onClick: () => setBulkUpdateOpen(true),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة المخزون"
        subtitle="متابعة وتحديث مستويات المخزون"
        actions={
          <Link href="/admin/inventory/log">
            <Button variant="secondary" icon={<History size={16} />}>
              سجل الحركات
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{lowStockProducts.length}</p>
              <p className="text-xs text-text-muted">مخزون منخفض</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
              <XCircle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{outOfStockProducts.length}</p>
              <p className="text-xs text-text-muted">نفد المخزون</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Package size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{inventory.length}</p>
              <p className="text-xs text-text-muted">إجمالي المنتجات</p>
            </div>
          </div>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card header={<h3 className="text-base font-semibold text-warning flex items-center gap-2"><AlertTriangle size={18} /> تنبيهات المخزون المنخفض</h3>}>
          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-warning" />
                  <div>
                    <p className="font-medium text-text">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">{p.stock} وحدة</Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<ArrowUpCircle size={14} />}
                    onClick={() => { setAdjustModal(p); setAdjustType("add"); }}
                  >
                    إعادة تعبئة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالاسم، SKU، التصنيف..." value={search} onChange={setSearch} className="w-72" />
        <Select
          options={statusFilterOptions}
          value={filters.status || ""}
          onChange={(e) => setFilter("status", e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا توجد منتجات في المخزون"
        emptyIcon={<Package size={48} />}
        selectable
        selectedKeys={selectedIds}
        onSelectionChange={setSelectedIds}
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
        bulkActions={bulkActions}
        exportable
        title={`المخزون (${totalItems})`}
        striped
      />

      <Modal
        open={!!adjustModal}
        onClose={() => { setAdjustModal(null); setAdjustQty(""); setAdjustReason(""); setAdjustNote(""); }}
        title={`${adjustType === "add" ? "إضافة" : "خصم"} مخزون - ${adjustModal?.name || ""}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-surface-hover rounded-lg">
            <p className="text-sm text-text-muted">المخزون الحالي</p>
            <p className="text-2xl font-bold text-text">{adjustModal?.stock?.toLocaleString("ar")}</p>
          </div>
          <Input
            label={`الكمية المراد ${adjustType === "add" ? "إضافةها" : "خصمها"}`}
            type="number"
            placeholder="0"
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
          />
          <Select
            label="سبب التعديل"
            options={adjustmentReasonOptions}
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
          />
          <Textarea
            label="ملاحظات (اختياري)"
            placeholder="أضف ملاحظة حول هذا التعديل..."
            rows={3}
            value={adjustNote}
            onChange={(e) => setAdjustNote(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setAdjustModal(null); setAdjustQty(""); setAdjustReason(""); setAdjustNote(""); }}>
              إلغاء
            </Button>
            <Button
              variant={adjustType === "add" ? "primary" : "danger"}
              icon={adjustType === "add" ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
              onClick={handleAdjust}
            >
              {adjustType === "add" ? "إضافة" : "خصم"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={bulkUpdateOpen} onClose={() => setBulkUpdateOpen(false)} title="تحديث الحد الأدنى للمخزون" size="md">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            سيتم تحديث الحد الأدنى لـ {selectedIds.length} منتج محدد
          </p>
          <Input
            label="الحد الأدنى الجديد"
            type="number"
            placeholder="10"
            value={bulkThreshold}
            onChange={(e) => setBulkThreshold(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setBulkUpdateOpen(false)}>إلغاء</Button>
            <Button icon={<Package size={14} />} onClick={handleBulkThresholdUpdate}>تحديث</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
