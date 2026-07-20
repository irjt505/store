"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Package,
  AlertTriangle,
  ShoppingCart,
  Layers,
  Archive,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, generateId, cn } from "@/lib/utils";

type ProductType =
  | "physical"
  | "digital"
  | "service"
  | "subscription"
  | "bundle"
  | "codes"
  | "food"
  | "booking";

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
  physical: "فيزيائي",
  digital: "رقمي",
  service: "خدمة",
  subscription: "اشتراك",
  bundle: "حزمة",
  codes: "أكواد",
  food: "غذائي",
  booking: "حجز",
};

const typeFullLabels: Record<ProductType, string> = {
  physical: "منتج فيزيائي",
  digital: "منتج رقمي",
  service: "خدمة",
  subscription: "اشتراك",
  bundle: "حزمة منتجات",
  codes: "أكواد / رواتب",
  food: "منتج غذائي",
  booking: "حجز / مواعيد",
};

const typeBadgeVariant: Record<
  ProductType,
  "default" | "success" | "warning" | "danger" | "info" | "purple"
> = {
  physical: "info",
  digital: "purple",
  service: "success",
  subscription: "warning",
  bundle: "default",
  codes: "danger",
  food: "success",
  booking: "info",
};

const typeIconColor: Record<ProductType, string> = {
  physical: "bg-blue-500/10 text-blue-600",
  digital: "bg-purple-500/10 text-purple-600",
  service: "bg-green-500/10 text-green-600",
  subscription: "bg-amber-500/10 text-amber-600",
  bundle: "bg-gray-500/10 text-gray-600",
  codes: "bg-red-500/10 text-red-600",
  food: "bg-emerald-500/10 text-emerald-600",
  booking: "bg-sky-500/10 text-sky-600",
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "قميص رجالي قطني",
    type: "physical",
    price: 149,
    salePrice: 129,
    sku: "PHS-001",
    stock: 250,
    lowStockThreshold: 20,
    status: "published",
    category: "أزياء رجالية",
    brand: "Nike",
    images: 5,
    sales: 342,
    rating: 4.5,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "حذاء رياضي آير ماكس",
    type: "physical",
    price: 499,
    sku: "PHS-002",
    stock: 85,
    lowStockThreshold: 15,
    status: "published",
    category: "أحذية رياضية",
    brand: "Nike",
    images: 8,
    sales: 201,
    rating: 4.8,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "سماعات لاسلكية بلوتوث",
    type: "physical",
    price: 299,
    salePrice: 249,
    sku: "PHS-003",
    stock: 0,
    lowStockThreshold: 10,
    status: "published",
    category: "إلكترونيات",
    brand: "Sony",
    images: 6,
    sales: 156,
    rating: 4.3,
    createdAt: "2024-03-05",
  },
  {
    id: "4",
    name: "كتاب البرمجة بلغة TypeScript",
    type: "digital",
    price: 49,
    sku: "DIG-001",
    stock: 9999,
    lowStockThreshold: 0,
    status: "published",
    category: "كتب رقمية",
    brand: "TechBooks",
    images: 1,
    sales: 342,
    rating: 4.7,
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "دورة تطوير تطبيقات الويب",
    type: "digital",
    price: 199,
    salePrice: 149,
    sku: "DIG-002",
    stock: 9999,
    lowStockThreshold: 0,
    status: "published",
    category: "دورات تعليمية",
    brand: "LearnHub",
    images: 3,
    sales: 128,
    rating: 4.9,
    createdAt: "2024-02-01",
  },
  {
    id: "6",
    name: "خدمة تصميم شعار احترافي",
    type: "service",
    price: 599,
    sku: "SRV-001",
    stock: 9999,
    lowStockThreshold: 0,
    status: "published",
    category: "تصميم",
    brand: "DesignPro",
    images: 4,
    sales: 89,
    rating: 4.6,
    createdAt: "2024-03-15",
  },
  {
    id: "7",
    name: "اشتراك شهري - الخطة الذهبية",
    type: "subscription",
    price: 79,
    sku: "SUB-001",
    stock: 9999,
    lowStockThreshold: 0,
    status: "published",
    category: "اشتراكات",
    brand: "SaaS",
    images: 2,
    sales: 456,
    rating: 4.4,
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "حزمة المطور الشاملة",
    type: "bundle",
    price: 399,
    salePrice: 349,
    sku: "BND-001",
    stock: 500,
    lowStockThreshold: 50,
    status: "published",
    category: "حزم",
    brand: "DevPack",
    images: 3,
    sales: 78,
    rating: 4.2,
    createdAt: "2024-02-15",
  },
  {
    id: "9",
    name: "ساعة يد كلاسيكية",
    type: "physical",
    price: 899,
    sku: "PHS-004",
    stock: 12,
    lowStockThreshold: 5,
    status: "draft",
    category: "إكسسوارات",
    brand: "Casio",
    images: 6,
    sales: 0,
    rating: 0,
    createdAt: "2024-04-15",
  },
  {
    id: "10",
    name: "وجبة سوشي يابانية",
    type: "food",
    price: 89,
    salePrice: 79,
    sku: "FOD-002",
    stock: 5,
    lowStockThreshold: 8,
    status: "published",
    category: "وجبات",
    brand: "SushiHub",
    images: 5,
    sales: 234,
    rating: 4.7,
    createdAt: "2024-04-20",
  },
];

const typeOptions = [
  { value: "", label: "جميع الأنواع" },
  { value: "physical", label: "فيزيائي" },
  { value: "digital", label: "رقمي" },
  { value: "service", label: "خدمة" },
  { value: "subscription", label: "اشتراك" },
  { value: "bundle", label: "حزمة" },
  { value: "codes", label: "أكواد" },
  { value: "food", label: "غذائي" },
  { value: "booking", label: "حجز" },
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
  { value: "إكسسوارات", label: "إكسسوارات" },
  { value: "وجبات", label: "وجبات" },
];

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function getStatusBadge(status: Product["status"]) {
  if (status === "published")
    return (
      <Badge variant="success" dot>
        منشور
      </Badge>
    );
  if (status === "draft")
    return (
      <Badge variant="warning" dot>
        مسودة
      </Badge>
    );
  return (
    <Badge variant="default" dot>
      مؤرشف
    </Badge>
  );
}

function getStockDisplay(stock: number, threshold: number) {
  if (stock === 0)
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
        <span className="text-sm font-medium text-[#DC2626]">نفد</span>
      </div>
    );
  if (stock <= threshold)
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
        <span className="text-sm font-medium text-[#F59E0B]">
          {stock.toLocaleString("ar")}
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
      <span className="text-sm font-medium text-[#111827]">
        {stock.toLocaleString("ar")}
      </span>
    </div>
  );
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

  const handleDuplicate = useCallback(
    (product: Product) => {
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
    },
    [success]
  );

  const totalPublished = useMemo(
    () => products.filter((p) => p.status === "published").length,
    [products]
  );
  const draftCount = useMemo(
    () => products.filter((p) => p.status === "draft").length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stock === 0).length,
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
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                typeIconColor[row.type]
              )}
            >
              <Package size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#111827] truncate max-w-[200px]">
                {row.name}
              </p>
              <p className="text-xs text-[#9CA3AF] font-mono" dir="ltr">
                {row.sku}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "type" as const,
        label: "النوع",
        sortable: true,
        render: (value: unknown) => (
          <Badge variant={typeBadgeVariant[value as ProductType]} size="sm">
            {typeLabels[value as ProductType]}
          </Badge>
        ),
      },
      {
        key: "price" as const,
        label: "السعر",
        sortable: true,
        render: (_: unknown, row: Product) => (
          <div>
            {row.salePrice ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#111827]">
                  {formatCurrency(row.salePrice)}
                </span>
                <span className="text-xs text-[#9CA3AF] line-through">
                  {formatCurrency(row.price)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-[#111827]">
                {formatCurrency(row.price)}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "stock" as const,
        label: "المخزون",
        sortable: true,
        render: (_: unknown, row: Product) =>
          getStockDisplay(row.stock, row.lowStockThreshold),
      },
      {
        key: "status" as const,
        label: "الحالة",
        sortable: true,
        render: (value: unknown) =>
          getStatusBadge(value as Product["status"]),
      },
      {
        key: "actions" as const,
        label: "",
        className: "w-12",
        render: (_: unknown, row: Product) => (
          <Dropdown
            align="start"
            trigger={
              <button
                type="button"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <ChevronDown size={16} />
              </button>
            }
          >
            <DropdownItem onClick={() => setViewModal(row)}>
              <Eye size={14} />
              عرض التفاصيل
            </DropdownItem>
            <Link href={`/admin/products/${row.id}/edit`}>
              <DropdownItem>
                <Pencil size={14} />
                تعديل
              </DropdownItem>
            </Link>
            <DropdownItem onClick={() => handleDuplicate(row)}>
              <Copy size={14} />
              نسخ المنتج
            </DropdownItem>
            <DropdownItem onClick={() => setDeleteTarget(row)} danger>
              <Trash2 size={14} />
              حذف
            </DropdownItem>
          </Dropdown>
        ),
      },
    ],
    [handleDuplicate]
  );

  const bulkActions = [
    {
      label: "حذف المحدد",
      icon: <Trash2 size={14} />,
      onClick: () => setBulkDeleteOpen(true),
      variant: "danger" as const,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          title="المنتجات"
          subtitle="إدارة منتجات متجرك"
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => setTypeSelectorOpen(true)}
            >
              إضافة منتج
            </Button>
          }
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={fadeUp}
      >
        <div className="bg-surface rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
              <Package size={20} className="text-[#2563EB]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">
              {products.length}
            </p>
            <p className="text-sm text-[#6B7280] mt-0.5">إجمالي المنتجات</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
              <ShoppingCart size={20} className="text-[#16A34A]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">
              {totalPublished}
            </p>
            <p className="text-sm text-[#6B7280] mt-0.5">منشور</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
              <Layers size={20} className="text-[#F59E0B]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">
              {draftCount}
            </p>
            <p className="text-sm text-[#6B7280] mt-0.5">مسودة</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF2F2]">
              <AlertTriangle size={20} className="text-[#DC2626]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">
              {outOfStockCount}
            </p>
            <p className="text-sm text-[#6B7280] mt-0.5">منتهي المخزون</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card padding="sm">
          <div className="flex flex-wrap items-center gap-3 p-1">
            <SearchInput
              placeholder="بحث بالاسم، SKU، العلامة التجارية..."
              value={search}
              onChange={setSearch}
              className="w-72"
            />
            <Select
              options={statusOptions}
              value={filters.status || ""}
              onChange={(e) => setFilter("status", e.target.value)}
            />
            <Select
              options={typeOptions}
              value={filters.type || ""}
              onChange={(e) => setFilter("type", e.target.value)}
            />
            <Select
              options={categoryOptions}
              value={filters.category || ""}
              onChange={(e) => setFilter("category", e.target.value)}
            />
            {Object.keys(filters).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  Object.keys(filters).forEach((k) => setFilter(k, ""));
                }}
                className="text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
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
        />
      </motion.div>

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
        <Modal
          open
          onClose={() => setViewModal(null)}
          title="تفاصيل المنتج"
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F8FA]">
              <div
                className={cn(
                  "h-14 w-14 rounded-xl flex items-center justify-center shrink-0",
                  typeIconColor[viewModal.type]
                )}
              >
                <Package size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#111827] text-lg">
                  {viewModal.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={typeBadgeVariant[viewModal.type]}
                    size="sm"
                  >
                    {typeFullLabels[viewModal.type]}
                  </Badge>
                  {getStatusBadge(viewModal.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">السعر</p>
                {viewModal.salePrice ? (
                  <div>
                    <p className="font-semibold text-[#111827]">
                      {formatCurrency(viewModal.salePrice)}
                    </p>
                    <p className="text-xs text-[#9CA3AF] line-through">
                      {formatCurrency(viewModal.price)}
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-[#111827]">
                    {formatCurrency(viewModal.price)}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">المخزون</p>
                {getStockDisplay(viewModal.stock, viewModal.lowStockThreshold)}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">المبيعات</p>
                <p className="font-semibold text-[#111827]">
                  {viewModal.sales.toLocaleString("ar")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">التصنيف</p>
                <p className="font-medium text-[#111827]">
                  {viewModal.category}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">العلامة التجارية</p>
                <p className="font-medium text-[#111827]">
                  {viewModal.brand}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">SKU</p>
                <p className="font-medium text-[#111827] font-mono" dir="ltr">
                  {viewModal.sku}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">التقييم</p>
                <p className="font-medium text-[#111827]">
                  {viewModal.rating > 0
                    ? `${viewModal.rating} / 5`
                    : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">الصور</p>
                <p className="font-medium text-[#111827]">
                  {viewModal.images} صور
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">تاريخ الإنشاء</p>
                <p className="font-medium text-[#111827]">
                  {new Intl.DateTimeFormat("ar-SA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(viewModal.createdAt))}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
              <Link href={`/admin/products/${viewModal.id}/edit`}>
                <Button variant="primary" icon={<Pencil size={14} />}>
                  تعديل
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setViewModal(null)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        title="اختر نوع المنتج"
        size="md"
      >
        <p className="text-sm text-[#6B7280] mb-4">
          اختر نوع المنتج الذي تريد إضافته
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(typeFullLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/admin/products/new?type=${key}`}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl border border-[#E5E7EB]",
                "hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-150 cursor-pointer group"
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                  "group-hover:scale-105",
                  typeIconColor[key as ProductType]
                )}
              >
                <Package size={16} />
              </div>
              <span className="text-sm font-medium text-[#111827] group-hover:text-[#2563EB] transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </Modal>
    </motion.div>
  );
}
