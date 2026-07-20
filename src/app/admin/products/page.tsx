"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Copy, Package, AlertTriangle, ShoppingCart } from "lucide-react";
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
import { formatCurrency, generateId } from "@/lib/utils";

type ProductType = "physical" | "digital" | "service" | "subscription" | "bundle" | "codes" | "food" | "booking";

type Product = {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: "published" | "draft" | "archived";
  category: string;
  brand: string;
  images: number;
  sales: number;
  rating: number;
  createdAt: string;
};

const typeLabels: Record<ProductType, string> = {
  physical: "منتج فيزيائي",
  digital: "منتج رقمي",
  service: "خدمة",
  subscription: "اشتراك",
  bundle: "حزمة منتجات",
  codes: "أكواد / رواتب",
  food: "منتج غذائي",
  booking: "حجز / مواعيد",
};

const typeBadgeVariant: Record<ProductType, "default" | "success" | "warning" | "danger" | "info" | "purple"> = {
  physical: "info",
  digital: "purple",
  service: "success",
  subscription: "warning",
  bundle: "default",
  codes: "danger",
  food: "success",
  booking: "info",
};

const initialProducts: Product[] = [
  { id: "1", name: "قميص رجالي قطني", type: "physical", price: 149, salePrice: 129, sku: "PHS-001", stock: 250, lowStockThreshold: 20, status: "published", category: "أزياء رجالية", brand: "Nike", images: 5, sales: 342, rating: 4.5, createdAt: "2024-01-15" },
  { id: "2", name: "حذاء رياضي آير ماكس", type: "physical", price: 499, sku: "PHS-002", stock: 85, lowStockThreshold: 15, status: "published", category: "أحذية رياضية", brand: "Nike", images: 8, sales: 201, rating: 4.8, createdAt: "2024-02-10" },
  { id: "3", name: "سماعات لاسلكية بلوتوث", type: "physical", price: 299, salePrice: 249, sku: "PHS-003", stock: 0, lowStockThreshold: 10, status: "published", category: "إلكترونيات", brand: "Sony", images: 6, sales: 156, rating: 4.3, createdAt: "2024-03-05" },
  { id: "4", name: "كتاب البرمجة بلغة TypeScript", type: "digital", price: 49, sku: "DIG-001", stock: 9999, lowStockThreshold: 0, status: "published", category: "كتب رقمية", brand: "TechBooks", images: 1, sales: 342, rating: 4.7, createdAt: "2024-01-20" },
  { id: "5", name: "دورة تطوير تطبيقات الويب", type: "digital", price: 199, salePrice: 149, sku: "DIG-002", stock: 9999, lowStockThreshold: 0, status: "published", category: "دورات تعليمية", brand: "LearnHub", images: 3, sales: 128, rating: 4.9, createdAt: "2024-02-01" },
  { id: "6", name: "خدمة تصميم شعار احترافي", type: "service", price: 599, sku: "SRV-001", stock: 9999, lowStockThreshold: 0, status: "published", category: "تصميم", brand: "DesignPro", images: 4, sales: 89, rating: 4.6, createdAt: "2024-03-15" },
  { id: "7", name: "اشتراك شهري - الخطة الذهبية", type: "subscription", price: 79, sku: "SUB-001", stock: 9999, lowStockThreshold: 0, status: "published", category: "اشتراكات", brand: "SaaS", images: 2, sales: 456, rating: 4.4, createdAt: "2024-01-01" },
  { id: "8", name: "حزمة المطور الشاملة", type: "bundle", price: 399, salePrice: 349, sku: "BND-001", stock: 500, lowStockThreshold: 50, status: "published", category: "حزم", brand: "DevPack", images: 3, sales: 78, rating: 4.2, createdAt: "2024-02-15" },
  { id: "9", name: "أكواد PlayStation 5 - 100 ريال", type: "codes", price: 100, sku: "COD-001", stock: 35, lowStockThreshold: 20, status: "published", category: "أكواد رقمية", brand: "Sony", images: 1, sales: 567, rating: 4.8, createdAt: "2024-03-01" },
  { id: "10", name: "وجبة دجاج مشوي مع أرز", type: "food", price: 45, salePrice: 39, sku: "FOD-001", stock: 30, lowStockThreshold: 10, status: "published", category: "وجبات", brand: "FoodKing", images: 4, sales: 890, rating: 4.1, createdAt: "2024-04-01" },
  { id: "11", name: "حجز موعد استشارة قانونية", type: "booking", price: 250, sku: "BKG-001", stock: 10, lowStockThreshold: 3, status: "published", category: "خدمات قانونية", brand: "LawFirm", images: 2, sales: 45, rating: 4.5, createdAt: "2024-04-10" },
  { id: "12", name: "ساعة يد كلاسيكية", type: "physical", price: 899, sku: "PHS-004", stock: 12, lowStockThreshold: 5, status: "draft", category: "إكسسوارات", brand: "Casio", images: 6, sales: 0, rating: 0, createdAt: "2024-04-15" },
  { id: "13", name: "套件 تطوير React المتقدم", type: "bundle", price: 599, sku: "BND-002", stock: 0, lowStockThreshold: 10, status: "archived", category: "حزم", brand: "DevPack", images: 2, sales: 23, rating: 3.9, createdAt: "2024-01-10" },
  { id: "14", name: "وجبة سushi يابانية", type: "food", price: 89, sku: "FOD-002", stock: 5, lowStockThreshold: 8, status: "published", category: "وجبات", brand: "SushiHub", images: 5, sales: 234, rating: 4.7, createdAt: "2024-04-20" },
];

const typeOptions = [
  { value: "", label: "جميع الأنواع" },
  { value: "physical", label: "منتجات فيزيائية" },
  { value: "digital", label: "منتجات رقمية" },
  { value: "service", label: "خدمات" },
  { value: "subscription", label: "اشتراكات" },
  { value: "bundle", label: "حزم منتجات" },
  { value: "codes", label: "أكواد / رواتب" },
  { value: "food", label: "منتجات غذائية" },
  { value: "booking", label: "حجوزات / مواعيد" },
];

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "published", label: "منشور" },
  { value: "draft", label: "مسودة" },
  { value: "archived", label: "مؤرشف" },
];

const categoryOptions = [
  { value: "", label: "جميع التصنيفات" },
  { value: "أزياء رجالية", label: "أزياء رجالية" },
  { value: "أحذية رياضية", label: "أحذية رياضية" },
  { value: "إلكترونيات", label: "إلكترونيات" },
  { value: "كتب رقمية", label: "كتب رقمية" },
  { value: "دورات تعليمية", label: "دورات تعليمية" },
  { value: "تصميم", label: "تصميم" },
  { value: "اشتراكات", label: "اشتراكات" },
  { value: "حزم", label: "حزم" },
  { value: "أكواد رقمية", label: "أكواد رقمية" },
  { value: "وجبات", label: "وجبات" },
  { value: "خدمات قانونية", label: "خدمات قانونية" },
  { value: "إكسسوارات", label: "إكسسوارات" },
];

const brandOptions = [
  { value: "", label: "جميع العلامات التجارية" },
  { value: "Nike", label: "Nike" },
  { value: "Sony", label: "Sony" },
  { value: "TechBooks", label: "TechBooks" },
  { value: "LearnHub", label: "LearnHub" },
  { value: "DesignPro", label: "DesignPro" },
  { value: "SaaS", label: "SaaS" },
  { value: "DevPack", label: "DevPack" },
  { value: "FoodKing", label: "FoodKing" },
  { value: "LawFirm", label: "LawFirm" },
  { value: "Casio", label: "Casio" },
  { value: "SushiHub", label: "SushiHub" },
];

function getStatusBadge(status: Product["status"]) {
  if (status === "published") return <Badge variant="success" dot>منشور</Badge>;
  if (status === "draft") return <Badge variant="default" dot>مسودة</Badge>;
  return <Badge variant="warning" dot>مؤرشف</Badge>;
}

function getStockBadge(stock: number, threshold: number) {
  if (stock === 0) return <Badge variant="danger" dot>نفد المخزون</Badge>;
  if (stock <= threshold) return <Badge variant="warning" dot>مخزون منخفض</Badge>;
  return <Badge variant="success" dot>{stock.toLocaleString("ar")}</Badge>;
}

export default function ProductsPage() {
  const { success } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [viewModal, setViewModal] = useState<Product | null>(null);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  const {
    data: products,
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
    remove,
    removeMany,
    totalItems,
    totalPages,
  } = useCrud<Product>({
    initialData: initialProducts,
    searchFields: ["name", "sku", "brand", "category"],
    itemsPerPage: 10,
    defaultSortKey: "createdAt",
    defaultSortDir: "desc",
  });

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleBulkDelete = useCallback(() => {
    removeMany(selectedIds);
    success("تم الحذف", `تم حذف ${selectedIds.length} منتج بنجاح`);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  }, [selectedIds, removeMany, success, setSelectedIds]);

  const handleDuplicate = useCallback((product: Product) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      name: `${product.name} (نسخة)`,
      sku: `${product.sku}-COPY`,
      status: "draft",
      sales: 0,
      rating: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    success("تم التكرار", `تم نسخ "${product.name}" بنجاح`);
    void newProduct;
  }, [success]);

  const totalSales = useMemo(() => products.reduce((s, p) => s + p.sales, 0), [products]);
  const totalRevenue = useMemo(() => products.reduce((s, p) => s + p.price * p.sales, 0), [products]);
  const publishedCount = useMemo(() => products.filter((p) => p.status === "published").length, [products]);
  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0).length,
    [products]
  );

  const columns = useMemo(
    () => [
      {
        key: "name" as const,
        label: "المنتج",
        sortable: true,
        render: (_: unknown, row: Product) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted shrink-0">
              <Package size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-text truncate">{row.name}</p>
              <p className="text-xs text-text-muted">{row.sku}</p>
            </div>
          </div>
        ),
      },
      {
        key: "type" as const,
        label: "النوع",
        sortable: true,
        render: (value: unknown) => (
          <Badge variant={typeBadgeVariant[value as ProductType]}>
            {typeLabels[value as ProductType]}
          </Badge>
        ),
      },
      {
        key: "price" as const,
        label: "السعر",
        sortable: true,
        render: (_: unknown, row: Product) => (
          <div className="text-left">
            {row.salePrice ? (
              <>
                <p className="font-semibold text-danger">{formatCurrency(row.salePrice)}</p>
                <p className="text-xs text-text-muted line-through">{formatCurrency(row.price)}</p>
              </>
            ) : (
              <p className="font-semibold">{formatCurrency(row.price)}</p>
            )}
          </div>
        ),
      },
      {
        key: "stock" as const,
        label: "المخزون",
        sortable: true,
        render: (_: unknown, row: Product) => getStockBadge(row.stock, row.lowStockThreshold),
      },
      { key: "sales" as const, label: "المبيعات", sortable: true },
      {
        key: "status" as const,
        label: "الحالة",
        sortable: true,
        render: (value: unknown) => getStatusBadge(value as Product["status"]),
      },
      {
        key: "actions" as const,
        label: "الإجراءات",
        className: "w-32",
        render: (_: unknown, row: Product) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setViewModal(row)} />
            <Link href={`/admin/products/${row.id}/edit`}>
              <Button variant="ghost" size="sm" icon={<Pencil size={14} />} />
            </Link>
            <Button variant="ghost" size="sm" icon={<Copy size={14} />} onClick={() => handleDuplicate(row)} />
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
          </div>
        ),
      },
    ],
    [handleDuplicate]
  );

  const bulkActions = [
    { label: "حذف المحدد", icon: <Trash2 size={14} />, onClick: () => setBulkDeleteOpen(true), variant: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="المنتجات"
        subtitle="إدارة جميع المنتجات في متجرك"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setTypeSelectorOpen(true)}>
            إضافة منتج
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{products.length}</p>
              <p className="text-xs text-text-muted">إجمالي المنتجات</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ShoppingCart size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{publishedCount}</p>
              <p className="text-xs text-text-muted">منتجات منشورة</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{lowStockCount}</p>
              <p className="text-xs text-text-muted">مخزون منخفض</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <span className="text-sm font-bold text-info">ر.س</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-text-muted">إجمالي الإيرادات</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث بالاسم، SKU، العلامة التجارية..." value={search} onChange={setSearch} className="w-72" />
        <Select options={typeOptions} value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)} />
        <Select options={statusOptions} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
        <Select options={categoryOptions} value={filters.category || ""} onChange={(e) => setFilter("category", e.target.value)} />
        <Select options={brandOptions} value={filters.brand || ""} onChange={(e) => setFilter("brand", e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="لا توجد منتجات"
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
        title={`المنتجات (${totalItems})`}
        striped
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="حذف المنتجات المحددة"
        message={`هل أنت متأكد من حذف ${selectedIds.length} منتج؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف الكل"
        cancelLabel="إلغاء"
        variant="danger"
      />

      {viewModal && (
        <Modal open onClose={() => setViewModal(null)} title="تفاصيل المنتج" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">الاسم</p>
                <p className="font-medium text-text">{viewModal.name}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">النوع</p>
                <Badge variant={typeBadgeVariant[viewModal.type]}>{typeLabels[viewModal.type]}</Badge>
              </div>
              <div>
                <p className="text-sm text-text-muted">السعر</p>
                <p className="font-semibold text-text">
                  {viewModal.salePrice ? (
                    <>
                      <span className="text-danger">{formatCurrency(viewModal.salePrice)}</span>
                      <span className="text-text-muted line-through mr-2">{formatCurrency(viewModal.price)}</span>
                    </>
                  ) : (
                    formatCurrency(viewModal.price)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">الحالة</p>
                {getStatusBadge(viewModal.status)}
              </div>
              <div>
                <p className="text-sm text-text-muted">المخزون</p>
                {getStockBadge(viewModal.stock, viewModal.lowStockThreshold)}
              </div>
              <div>
                <p className="text-sm text-text-muted">المبيعات</p>
                <p className="font-medium text-text">{viewModal.sales.toLocaleString("ar")}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">التصنيف</p>
                <p className="font-medium text-text">{viewModal.category}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">العلامة التجارية</p>
                <p className="font-medium text-text">{viewModal.brand}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">SKU</p>
                <p className="font-medium text-text" dir="ltr">{viewModal.sku}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">التقييم</p>
                <p className="font-medium text-text">{viewModal.rating > 0 ? `${viewModal.rating} / 5` : "—"}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Link href={`/admin/products/${viewModal.id}/edit`}>
                <Button variant="primary" icon={<Pencil size={14} />}>تعديل</Button>
              </Link>
              <Button variant="secondary" onClick={() => setViewModal(null)}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal open={typeSelectorOpen} onClose={() => setTypeSelectorOpen(false)} title="اختر نوع المنتج" size="md">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(typeLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/admin/products/new?type=${key}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
            >
              <Badge variant={typeBadgeVariant[key as ProductType]}>{label}</Badge>
            </Link>
          ))}
        </div>
      </Modal>
    </div>
  );
}
