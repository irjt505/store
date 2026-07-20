"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Mail,
  MessageCircle,
  Eye,
  CheckCircle,
  Trash2,
  Filter,
  DollarSign,
  TrendingUp,
  Wallet,
  Undo2,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

type AbandonedCart = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  cartValue: number;
  abandonedAt: string;
  recovered: boolean;
  recoveryEmailSent: boolean;
};

const mockCarts: AbandonedCart[] = [
  { id: "1", customerName: "أحمد بن سعيد", customerEmail: "ahmed.s@example.com", items: 3, cartValue: 1250, abandonedAt: "2025-07-20T08:30:00", recovered: false, recoveryEmailSent: false },
  { id: "2", customerName: "سارة المحمد", customerEmail: "sara.m@example.com", items: 5, cartValue: 3400, abandonedAt: "2025-07-20T06:15:00", recovered: false, recoveryEmailSent: true },
  { id: "3", customerName: "خالد العتيبي", customerEmail: "khalid.o@example.com", items: 2, cartValue: 680, abandonedAt: "2025-07-19T22:45:00", recovered: true, recoveryEmailSent: true },
  { id: "4", customerName: "نورة الشمري", customerEmail: "noura.sh@example.com", items: 4, cartValue: 2100, abandonedAt: "2025-07-19T18:20:00", recovered: false, recoveryEmailSent: false },
  { id: "5", customerName: "محمد القحطاني", customerEmail: "mohammed.q@example.com", items: 1, cartValue: 450, abandonedAt: "2025-07-19T14:10:00", recovered: true, recoveryEmailSent: true },
  { id: "6", customerName: "فاطمة الحربي", customerEmail: "fatima.h@example.com", items: 6, cartValue: 5200, abandonedAt: "2025-07-18T20:00:00", recovered: false, recoveryEmailSent: true },
  { id: "7", customerName: "ياسر الدوسري", customerEmail: "yasser.d@example.com", items: 2, cartValue: 890, abandonedAt: "2025-07-18T16:30:00", recovered: false, recoveryEmailSent: false },
  { id: "8", customerName: "هند العنزي", customerEmail: "hind.a@example.com", items: 3, cartValue: 1780, abandonedAt: "2025-07-18T11:45:00", recovered: true, recoveryEmailSent: true },
  { id: "9", customerName: "طارق السبيعي", customerEmail: "tariq.s@example.com", items: 4, cartValue: 2950, abandonedAt: "2025-07-17T21:15:00", recovered: false, recoveryEmailSent: false },
  { id: "10", customerName: "منال الغامدي", customerEmail: "manal.g@example.com", items: 2, cartValue: 560, abandonedAt: "2025-07-17T15:30:00", recovered: false, recoveryEmailSent: true },
  { id: "11", customerName: "عبدالرحمن الزهراني", customerEmail: "abdulrahman.z@example.com", items: 5, cartValue: 4100, abandonedAt: "2025-07-17T09:00:00", recovered: true, recoveryEmailSent: true },
  { id: "12", customerName: "دانة المطيري", customerEmail: "dana.m@example.com", items: 1, cartValue: 320, abandonedAt: "2025-07-16T19:45:00", recovered: false, recoveryEmailSent: false },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function getTimeElapsed(dateStr: string): string {
  const now = new Date();
  const abandoned = new Date(dateStr);
  const diffMs = now.getTime() - abandoned.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays} يوم`;
  if (diffHours > 0) return `${diffHours} ساعة`;
  return "أقل من ساعة";
}

export default function AbandonedCartsPage() {
  const { success } = useToast();
  const [viewCart, setViewCart] = useState<AbandonedCart | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AbandonedCart | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const {
    data: carts,
    paginatedData,
    search,
    setSearch,
    page,
    setPage,
    perPage,
    setPerPage,
    update,
    remove,
    totalItems,
    totalPages,
  } = useCrud<AbandonedCart>({
    initialData: mockCarts,
    searchFields: ["customerName", "customerEmail"],
    itemsPerPage: 10,
    defaultSortKey: "abandonedAt",
    defaultSortDir: "desc",
  });

  const totalValue = useMemo(() => carts.filter((c) => !c.recovered).reduce((s, c) => s + c.cartValue, 0), [carts]);
  const recoveredCount = useMemo(() => carts.filter((c) => c.recovered).length, [carts]);
  const notRecovered = useMemo(() => carts.filter((c) => !c.recovered).length, [carts]);
  const totalCartValue = useMemo(() => carts.reduce((s, c) => s + c.cartValue, 0), [carts]);

  const handleSendRecoveryEmail = useCallback((cart: AbandonedCart) => {
    update(cart.id, { recoveryEmailSent: true });
    success("تم الإرسال", `تم إرسال بريد استرداد إلى ${cart.customerEmail}`);
  }, [update, success]);

  const handleSendWhatsApp = useCallback((cart: AbandonedCart) => {
    success("تم الإرسال", `تم إرسال رسالة واتساب إلى ${cart.customerName}`);
  }, [success]);

  const handleMarkRecovered = useCallback((cart: AbandonedCart) => {
    update(cart.id, { recovered: true });
    success("تم التحديث", `تم تحديد سلة ${cart.customerName} كمستردة`);
  }, [update, success]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", "تم حذف السلة بنجاح");
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const columns = useMemo(() => [
    {
      key: "customerName" as const,
      label: "العميل",
      sortable: true,
      render: (_value: unknown, row: AbandonedCart) => (
        <div>
          <p className="font-medium text-text">{row.customerName}</p>
          <p className="text-xs text-text-muted" dir="ltr">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "items" as const,
      label: "المنتجات",
      sortable: true,
      render: (value: unknown) => (
        <Badge variant="info">{String(value)} منتج</Badge>
      ),
    },
    {
      key: "cartValue" as const,
      label: "القيمة",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: "abandonedAt" as const,
      label: "تاريخ الهجر",
      sortable: true,
      render: (value: unknown) => (
        <div>
          <p className="text-sm text-text">{formatDate(String(value))}</p>
          <p className="text-xs text-text-muted">{getTimeElapsed(String(value))}</p>
        </div>
      ),
    },
    {
      key: "recovered" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown) =>
        value ? (
          <Badge variant="success" dot>مستردة</Badge>
        ) : (
          <Badge variant="warning" dot>غير مستردة</Badge>
        ),
    },
    {
      key: "actions" as const,
      label: "الإجراء",
      className: "w-40",
      render: (_value: unknown, row: AbandonedCart) => (
        <div className="flex items-center gap-1">
          {!row.recovered && (
            <>
              <Button variant="ghost" size="sm" icon={<Mail size={14} />} onClick={(e) => { e.stopPropagation(); handleSendRecoveryEmail(row); }} title="إرسال بريد" />
              <Button variant="ghost" size="sm" icon={<MessageCircle size={14} />} onClick={(e) => { e.stopPropagation(); handleSendWhatsApp(row); }} title="واتساب" />
            </>
          )}
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={(e) => { e.stopPropagation(); setViewCart(row); }} />
          {!row.recovered && (
            <Button variant="ghost" size="sm" icon={<CheckCircle size={14} />} onClick={(e) => { e.stopPropagation(); handleMarkRecovered(row); }} title="تحديد كمستردة" />
          )}
        </div>
      ),
    },
  ], [handleSendRecoveryEmail, handleSendWhatsApp, handleMarkRecovered]);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <PageHeader
          title="السلال المهجورة"
          subtitle="استرداد السلال المهجورة من العملاء وزيادة معدلات التحويل"
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ShoppingCart size={20} />} label="إجمالي السلال" value={totalItems} color="primary" />
        <StatCard icon={<AlertTriangle size={20} />} label="غير مستردة" value={notRecovered} color="danger" />
        <StatCard icon={<Undo2 size={20} />} label="مستردة" value={recoveredCount} color="success" />
        <StatCard icon={<DollarSign size={20} />} label="القيمة الإجمالية" value={formatCurrency(totalCartValue)} color="warning" />
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
        <SearchInput placeholder="بحث بالاسم أو البريد الإلكتروني..." value={search} onChange={setSearch} className="w-80" />
        <Button variant="secondary" size="sm" icon={<Filter size={14} />} onClick={() => setShowFilters(!showFilters)}>
          فلاتر متقدمة
        </Button>
        {(dateFrom || dateTo || minValue || maxValue) && (
          <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); setMinValue(""); setMaxValue(""); }}>
            مسح الفلاتر
          </Button>
        )}
      </motion.div>

      {showFilters && (
        <motion.div variants={item} className="flex items-end gap-3 p-4 bg-surface rounded-xl border border-border">
          <Input label="من تاريخ" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="إلى تاريخ" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Input label="الحد الأدنى للقيمة" type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} placeholder="0" />
          <Input label="الحد الأعلى للقيمة" type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} placeholder="10000" />
        </motion.div>
      )}

      <motion.div variants={item}>
        <DataTable
          columns={columns}
          data={paginatedData}
          emptyMessage="لا توجد سلال مهجورة"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
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
      </motion.div>

      {viewCart && (
        <Modal open onClose={() => setViewCart(null)} title="تفاصيل السلة" size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">العميل</p>
                <p className="font-medium text-text">{viewCart.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">البريد الإلكتروني</p>
                <p className="font-medium text-text" dir="ltr">{viewCart.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">عدد المنتجات</p>
                <p className="font-medium text-text">{viewCart.items} منتج</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">قيمة السلة</p>
                <p className="font-semibold text-primary">{formatCurrency(viewCart.cartValue)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">تاريخ الهجر</p>
                <p className="font-medium text-text">{formatDateTime(viewCart.abandonedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">الحالة</p>
                {viewCart.recovered ? (
                  <Badge variant="success" dot>مستردة</Badge>
                ) : (
                  <Badge variant="warning" dot>غير مستردة</Badge>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewCart(null)}>إغلاق</Button>
              {!viewCart.recovered && (
                <>
                  <Button variant="secondary" icon={<Mail size={14} />} onClick={() => { handleSendRecoveryEmail(viewCart); setViewCart(null); }}>
                    إرسال بريد
                  </Button>
                  <Button variant="secondary" icon={<MessageCircle size={14} />} onClick={() => { handleSendWhatsApp(viewCart); setViewCart(null); }}>
                    واتساب
                  </Button>
                  <Button icon={<CheckCircle size={14} />} onClick={() => { handleMarkRecovered(viewCart); setViewCart(null); }}>
                    تحديد كمستردة
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف السلة"
        message="هل أنت متأكد من حذف هذه السلة المهجورة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />
    </motion.div>
  );
}
