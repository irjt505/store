"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Printer,
  Mail,
  CreditCard,
  Truck,
  Package,
  StickyNote,
  Plus,
  User,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { OrderTimeline } from "@/components/ui/OrderTimeline";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type OrderStatus = "review" | "processing" | "shipping" | "delivered" | "completed" | "cancelled" | "returned";
type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
};

type OrderDetail = {
  id: string;
  number: string;
  customer: string;
  customerAvatar?: string;
  email: string;
  phone: string;
  date: string;
  items: OrderItem[];
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  source: string;
  shippingAddress: string;
  shippingMethod: string;
  trackingNumber?: string;
  paymentMethod: string;
  transactionId?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  notes: { id: string; text: string; date: string; author: string }[];
};

const mockOrder: OrderDetail = {
  id: "1",
  number: "#1001",
  customer: "أحمد بن محمد",
  email: "ahmed@example.com",
  phone: "+966501234567",
  date: "2025-07-20T10:30:00",
  items: [
    { id: "1", name: "سماعات لاسلكية بلوتوث", image: "🎧", price: 450, quantity: 2, total: 900 },
    { id: "2", name: "شاحن متنقل 20000 مللي أمبير", image: "🔋", price: 180, quantity: 1, total: 180 },
    { id: "3", name: "كابل شحن USB-C مumuّد", image: "🔌", price: 45, quantity: 3, total: 135 },
    { id: "4", name: "حافظة هاتف سيليكون", image: "📱", price: 75, quantity: 2, total: 150 },
    { id: "5", name: "شاشة حماية زجاجية", image: "🛡️", price: 35, quantity: 4, total: 140 },
  ],
  paymentStatus: "paid",
  status: "completed",
  source: "موقع إلكتروني",
  shippingAddress: "الرياض، حي النسيم، شارع الأمير سلطان 45، مبنى 12، شقة 3",
  shippingMethod: "شحن سريع - أرامكس",
  trackingNumber: "KSA-2025-789456",
  paymentMethod: "بطاقة ائتمان",
  transactionId: "TXN-2025-0789456",
  subtotal: 1505,
  shippingCost: 35,
  discount: 90,
  tax: 212,
  total: 1662,
  notes: [
    { id: "1", text: "العميل يفضل التوصيل في المساء بعد الساعة 6", date: "2025-07-20T11:00:00", author: "محمد" },
    { id: "2", text: "تم التحقق من العنوان مع العميل", date: "2025-07-20T14:30:00", author: "سارة" },
  ],
};

const statusConfig: Record<OrderStatus, { label: string; variant: "warning" | "info" | "success" | "danger" | "default" | "purple" }> = {
  review: { label: "قيد المراجعة", variant: "warning" },
  processing: { label: "قيد التنفيذ", variant: "purple" },
  shipping: { label: "قيد الشحن", variant: "info" },
  delivered: { label: "تم التوصيل", variant: "success" },
  completed: { label: "مكتمل", variant: "success" },
  cancelled: { label: "ملغي", variant: "danger" },
  returned: { label: "مرتجع", variant: "default" },
};

const paymentConfig: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  paid: { label: "مدفوع", variant: "success" },
  pending: { label: "قيد الانتظار", variant: "warning" },
  failed: { label: "فشل", variant: "danger" },
  refunded: { label: "مسترد", variant: "default" },
};

const statusOptions = [
  { value: "review", label: "قيد المراجعة" },
  { value: "processing", label: "قيد التنفيذ" },
  { value: "shipping", label: "قيد الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
  { value: "returned", label: "مرتجع" },
];

const timelineSteps = [
  { status: "review", label: "تم استلام الطلب", icon: "review" },
  { status: "processing", label: "جاري التجهيز", icon: "processing" },
  { status: "shipping", label: "تم الشحن", icon: "shipping" },
  { status: "delivered", label: "تم التوصيل", icon: "delivered" },
  { status: "completed", label: "مكتمل", icon: "completed" },
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const { success } = useToast();
  const [order, setOrder] = useState<OrderDetail>(mockOrder);
  const [editStatusModal, setEditStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [refundModal, setRefundModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addNoteModal, setAddNoteModal] = useState(false);

  const handleUpdateStatus = useCallback(() => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    success("تم التحديث", "تم تحديث حالة الطلب بنجاح");
    setEditStatusModal(false);
  }, [newStatus, success]);

  const handleRefund = useCallback(() => {
    setOrder((prev) => ({ ...prev, paymentStatus: "refunded", status: "returned" }));
    success("تم الاسترداد", "تم استرداد المبلغ بنجاح");
    setRefundModal(false);
  }, [success]);

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;
    const note = {
      id: String(Date.now()),
      text: newNote.trim(),
      date: new Date().toISOString(),
      author: "المدير",
    };
    setOrder((prev) => ({ ...prev, notes: [...prev.notes, note] }));
    success("تمت الإضافة", "تم إضافة الملاحظة بنجاح");
    setNewNote("");
    setAddNoteModal(false);
  }, [newNote, success]);

  const handlePrint = useCallback(() => {
    success("جاري الطباعة", "جاري إعداد الفاتورة للطباعة");
  }, [success]);

  const handleSendEmail = useCallback(() => {
    success("تم الإرسال", "تم إرسال تفاصيل الطلب للعميل");
  }, [success]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
        <Link href="/admin/orders" className="hover:text-primary transition-colors">
          الطلبات
        </Link>
        <ArrowRight size={14} />
        <span className="text-text">{order.number}</span>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text">{order.number}</h1>
          <Badge variant={statusConfig[order.status].variant} dot>{statusConfig[order.status].label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />} onClick={() => window.history.back()}>
            رجوع
          </Button>
          <Button variant="secondary" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>طباعة الفاتورة</Button>
          <Button variant="secondary" size="sm" icon={<Mail size={14} />} onClick={handleSendEmail}>إرسال إيميل</Button>
          <Button size="sm" icon={<CreditCard size={14} />} onClick={() => setEditStatusModal(true)}>تحديث الحالة</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><FileText size={16} /> مسار الطلب</h3>}>
            <OrderTimeline
              steps={timelineSteps.map((s) => ({
                ...s,
                date: order.status === s.status || (timelineSteps.findIndex((t) => t.status === order.status) > timelineSteps.findIndex((t) => t.status === s.status))
                  ? order.date
                  : undefined,
              }))}
              currentStatus={order.status}
            />
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><ShoppingCart size={16} /> المنتجات</h3>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-2 font-medium text-text-secondary">المنتج</th>
                    <th className="text-right py-3 px-2 font-medium text-text-secondary">السعر</th>
                    <th className="text-right py-3 px-2 font-medium text-text-secondary">الكمية</th>
                    <th className="text-right py-3 px-2 font-medium text-text-secondary">المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border-light last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <span className="font-medium text-text">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-text-secondary">{formatCurrency(item.price)}</td>
                      <td className="py-3 px-2 text-text-secondary">{item.quantity}</td>
                      <td className="py-3 px-2 font-semibold text-text">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card header={
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text flex items-center gap-2"><StickyNote size={16} /> الملاحظات</h3>
              <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => setAddNoteModal(true)}>إضافة ملاحظة</Button>
            </div>
          }>
            {order.notes.length === 0 ? (
              <p className="text-text-muted text-sm py-4 text-center">لا توجد ملاحظات</p>
            ) : (
              <div className="space-y-3">
                {order.notes.map((note) => (
                  <div key={note.id} className="bg-surface-hover rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text">{note.author}</span>
                      <span className="text-xs text-text-muted">{formatDateTime(note.date)}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><User size={16} /> معلومات العميل</h3>}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={order.customer} size="lg" />
                <div>
                  <p className="font-medium text-text">{order.customer}</p>
                  <p className="text-xs text-text-muted">{order.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">الهاتف</span>
                  <span className="text-text" dir="ltr">{order.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">البريد الإلكتروني</span>
                  <span className="text-text" dir="ltr">{order.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">المصدر</span>
                  <span className="text-text">{order.source}</span>
                </div>
              </div>
              <Link href={`/admin/customers/1`}>
                <Button variant="outline" size="sm" fullWidth>عرض ملف العميل</Button>
              </Link>
            </div>
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><CreditCard size={16} /> معلومات الدفع</h3>}>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">طريقة الدفع</span>
                <span className="text-text">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">حالة الدفع</span>
                <Badge variant={paymentConfig[order.paymentStatus].variant}>{paymentConfig[order.paymentStatus].label}</Badge>
              </div>
              {order.transactionId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">رقم المعاملة</span>
                  <span className="text-text" dir="ltr">{order.transactionId}</span>
                </div>
              )}
            </div>
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><Truck size={16} /> معلومات الشحن</h3>}>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-text-muted block mb-1">العنوان</span>
                <span className="text-text">{order.shippingAddress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">طريقة الشحن</span>
                <span className="text-text">{order.shippingMethod}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">رقم التتبع</span>
                  <span className="text-text font-mono" dir="ltr">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><Package size={16} /> ملخص الطلب</h3>}>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">المجموع الفرعي</span>
                <span className="text-text">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">الشحن</span>
                <span className="text-text">{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">الخصم</span>
                  <span className="text-danger">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">الضريبة</span>
                <span className="text-text">{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text">الإجمالي</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button variant="danger" size="sm" fullWidth onClick={() => setRefundModal(true)}>
              استرداد المبلغ
            </Button>
          </div>
        </div>
      </div>

      {editStatusModal && (
        <Modal open onClose={() => setEditStatusModal(false)} title="تحديث حالة الطلب" size="md">
          <div className="space-y-4">
            <Select label="الحالة الجديدة" options={statusOptions} value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditStatusModal(false)}>إلغاء</Button>
              <Button onClick={handleUpdateStatus}>تحديث الحالة</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={refundModal}
        onClose={() => setRefundModal(false)}
        onConfirm={handleRefund}
        title="استرداد المبلغ"
        message={`هل أنت متأكد من استرداد مبلغ ${formatCurrency(order.total)}؟ سيتغير حالة الدفع إلى مسترد.`}
        confirmLabel="استرداد"
        cancelLabel="إلغاء"
        variant="danger"
      />

      {addNoteModal && (
        <Modal open onClose={() => { setAddNoteModal(false); setNewNote(""); }} title="إضافة ملاحظة" size="md">
          <div className="space-y-4">
            <Textarea label="الملاحظة" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="اكتب ملاحظتك هنا..." rows={4} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setAddNoteModal(false); setNewNote(""); }}>إلغاء</Button>
              <Button onClick={handleAddNote}>إضافة</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
