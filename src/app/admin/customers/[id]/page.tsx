"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Banknote,
  TrendingUp,
  Tag,
  StickyNote,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, formatDateTime, generateId } from "@/lib/utils";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  joinDate: string;
  status: "active" | "blocked";
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  lastOrderDate: string;
  emailNotifications: boolean;
  marketingConsent: boolean;
};

type OrderHistory = {
  id: string;
  number: string;
  date: string;
  total: number;
  status: string;
  items: number;
};

type Note = {
  id: string;
  text: string;
  date: string;
  author: string;
};

const mockCustomer: CustomerDetail = {
  id: "1",
  name: "أحمد بن محمد",
  email: "ahmed@example.com",
  phone: "+966501234567",
  city: "الرياض",
  address: "حي النسيم، شارع الأمير سلطان 45",
  joinDate: "2023-06-15",
  status: "active",
  tags: ["VIP", "oyal"],
  totalOrders: 18,
  totalSpent: 12450,
  averageOrder: 692,
  lastOrderDate: "2025-07-20",
  emailNotifications: true,
  marketingConsent: false,
};

const mockOrders: OrderHistory[] = [
  { id: "1", number: "#1001", date: "2025-07-20", total: 2450, status: "مكتمل", items: 5 },
  { id: "2", number: "#987", date: "2025-07-15", total: 890, status: "مكتمل", items: 2 },
  { id: "3", number: "#965", date: "2025-07-08", total: 3200, status: "مكتمل", items: 8 },
  { id: "4", number: "#942", date: "2025-06-28", total: 1560, status: "مكتمل", items: 3 },
  { id: "5", number: "#920", date: "2025-06-15", total: 750, status: "مرتجع", items: 1 },
  { id: "6", number: "#898", date: "2025-05-30", total: 4100, status: "مكتمل", items: 6 },
];

const mockNotes: Note[] = [
  { id: "1", text: "العميل من أفضل العملاء، يفضل التواصل عبر الواتساب", date: "2025-07-20T10:00:00", author: "محمد" },
  { id: "2", text: "طلب سابق: تغيير المقاس من L إلى XL", date: "2025-07-10T14:30:00", author: "سارة" },
];

const monthlySpending = [
  { month: "يناير", amount: 2450 },
  { month: "فبراير", amount: 890 },
  { month: "مارس", amount: 3200 },
  { month: "أبريل", amount: 1560 },
  { month: "مايو", amount: 750 },
  { month: "يونيو", amount: 4100 },
  { month: "يوليو", amount: 2890 },
];

const statusColors: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  "مكتمل": "success",
  "ملغي": "danger",
  "مرتجع": "default",
  "قيد الشحن": "info",
  "قيد التنفيذ": "warning",
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const { success } = useToast();
  const [customer, setCustomer] = useState<CustomerDetail>(mockCustomer);
  const [orders] = useState<OrderHistory[]>(mockOrders);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editEmail, setEditEmail] = useState(customer.email);
  const [editPhone, setEditPhone] = useState(customer.phone);
  const [editCity, setEditCity] = useState(customer.city);

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: generateId(),
      text: newNote.trim(),
      date: new Date().toISOString(),
      author: "المدير",
    };
    setNotes((prev) => [note, ...prev]);
    success("تمت الإضافة", "تم إضافة الملاحظة بنجاح");
    setNewNote("");
    setAddNoteModal(false);
  }, [newNote, success]);

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    success("تم الحذف", "تم حذف الملاحظة بنجاح");
  }, [success]);

  const handleSaveEdit = useCallback(() => {
    if (!editName.trim() || !editEmail.trim()) return;
    setCustomer((prev) => ({ ...prev, name: editName, email: editEmail, phone: editPhone, city: editCity }));
    success("تم التحديث", "تم تحديث بيانات العميل بنجاح");
    setEditModal(false);
  }, [editName, editEmail, editPhone, editCity, success]);

  const handleToggleNotifications = useCallback((checked: boolean) => {
    setCustomer((prev) => ({ ...prev, emailNotifications: checked }));
    success("تم التحديث", `إشعارات البريد الإلكتروني ${checked ? "مفعلة" : "معطلة"}`);
  }, [success]);

  const handleToggleMarketing = useCallback((checked: boolean) => {
    setCustomer((prev) => ({ ...prev, marketingConsent: checked }));
    success("تم التحديث", `الموافقة على التسويق ${checked ? "مفعلة" : "معطلة"}`);
  }, [success]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
        <Link href="/admin/customers" className="hover:text-primary transition-colors">
          العملاء
        </Link>
        <ArrowRight size={14} />
        <span className="text-text">{customer.name}</span>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="xl" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{customer.name}</h1>
              {customer.status === "active" ? (
                <Badge variant="success" dot>نشط</Badge>
              ) : (
                <Badge variant="danger" dot>محظور</Badge>
              )}
            </div>
            <p className="text-text-secondary mt-1">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />} onClick={() => window.history.back()}>
            رجوع
          </Button>
          <Button variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => setEditModal(true)}>
            تعديل
          </Button>
          <Button variant="secondary" size="sm" icon={<Mail size={14} />}>
            إرسال إيميل
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ShoppingCart size={20} />} label="إجمالي الطلبات" value={String(customer.totalOrders)} change="" changeType="up" color="primary" />
        <StatCard icon={<Banknote size={20} />} label="إجمالي المشتريات" value={formatCurrency(customer.totalSpent)} change="" changeType="up" color="success" />
        <StatCard icon={<TrendingUp size={20} />} label="متوسط الطلب" value={formatCurrency(customer.averageOrder)} change="" changeType="up" color="info" />
        <StatCard icon={<Calendar size={20} />} label="آخر طلب" value={formatDate(customer.lastOrderDate)} change="" changeType="up" color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card header={<h3 className="font-semibold text-text flex items-center gap-2">الملف الشخصي</h3>}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">البريد الإلكتروني</p>
                  <p className="text-sm text-text" dir="ltr">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">الهاتف</p>
                  <p className="text-sm text-text" dir="ltr">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">المدينة</p>
                  <p className="text-sm text-text">{customer.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">تاريخ الانضمام</p>
                  <p className="text-sm text-text">{formatDate(customer.joinDate)}</p>
                </div>
              </div>
            </div>
            {customer.address && (
              <div className="mt-4 flex items-start gap-3">
                <MapPin size={16} className="text-text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">العنوان</p>
                  <p className="text-sm text-text">{customer.address}</p>
                </div>
              </div>
            )}
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><ShoppingCart size={16} /> سجل الطلبات</h3>}>
            <DataTable
              data={orders as unknown as Record<string, unknown>[]}
              rowKey="id"
              columns={[
                { key: "number", label: "رقم الطلب", render: (_v: unknown, row: Record<string, unknown>) => <Link href={`/admin/orders/${String(row.id)}`} className="text-primary hover:underline font-medium">{String(row.number)}</Link> },
                { key: "date", label: "التاريخ", render: (v: unknown) => <span className="text-text-secondary">{formatDate(String(v))}</span> },
                { key: "items", label: "المنتجات", render: (v: unknown) => <span className="text-text-secondary">{String(v)} منتج</span> },
                { key: "total", label: "المجموع", render: (v: unknown) => <span className="font-semibold text-text">{formatCurrency(Number(v))}</span> },
                { key: "status", label: "الحالة", render: (v: unknown) => <Badge variant={statusColors[String(v)] || "default"}>{String(v)}</Badge> },
              ]}
            />
          </Card>

          <Card header={
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text flex items-center gap-2"><StickyNote size={16} /> الملاحظات</h3>
              <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => setAddNoteModal(true)}>إضافة</Button>
            </div>
          }>
            {notes.length === 0 ? (
              <p className="text-text-muted text-sm py-4 text-center">لا توجد ملاحظات</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-surface-hover rounded-lg p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">{note.author}</span>
                        <span className="text-xs text-text-muted">{formatDateTime(note.date)}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{note.text}</p>
                    </div>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-text-muted hover:text-danger shrink-0 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><TrendingUp size={16} /> إحصائيات</h3>}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    formatter={(value: unknown) => [formatCurrency(Number(value)), "المبلغ"]}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><Tag size={16} /> التاقات</h3>}>
            {customer.tags.length === 0 ? (
              <p className="text-text-muted text-sm py-2">لا توجد تاقات</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="purple">{tag}</Badge>
                ))}
              </div>
            )}
          </Card>

          <Card header={<h3 className="font-semibold text-text flex items-center gap-2"><Settings size={16} /> الإعدادات</h3>}>
            <div className="space-y-4">
              <Toggle
                checked={customer.emailNotifications}
                onChange={handleToggleNotifications}
                label="إشعارات البريد الإلكتروني"
                description="إرسال تحديثات الطلب عبر البريد"
              />
              <Toggle
                checked={customer.marketingConsent}
                onChange={handleToggleMarketing}
                label="الموافقة على التسويق"
                description="إرسال عروض وترويجات"
              />
            </div>
          </Card>
        </div>
      </div>

      {editModal && (
        <Modal open onClose={() => setEditModal(false)} title="تعديل بيانات العميل" size="md">
          <div className="space-y-4">
            <Input label="الاسم" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            <Input label="البريد الإلكتروني" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} dir="ltr" required />
            <Input label="الهاتف" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} dir="ltr" />
            <Input label="المدينة" value={editCity} onChange={(e) => setEditCity(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit}>حفظ التعديلات</Button>
            </div>
          </div>
        </Modal>
      )}

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
