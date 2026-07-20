"use client";

import { useState, useMemo } from "react";
import { Search, Download, Shield, AlertTriangle, AlertCircle, Info, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";

type AuditLog = {
  id: string;
  user: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
  level: "info" | "warning" | "critical";
  [key: string]: unknown;
};

const initialLogs: AuditLog[] = [
  { id: "1", user: "أحمد المدير", action: "تسجيل دخول", target: "النظام", details: "تسجيل دخول ناجح من متصفح Chrome", ip: "192.168.1.10", timestamp: "2024-04-16 14:30", level: "info" },
  { id: "2", user: "سارة المحررة", action: "إنشاء منتج", target: "دورة TypeScript", details: "تم إنشاء منتج رقمي جديد بسعر 199﷼", ip: "10.0.0.5", timestamp: "2024-04-16 14:15", level: "info" },
  { id: "3", user: "النظام", action: "تنبيه أمني", target: "نظام تسجيل الدخول", details: "5 محاولات تسجيل دخول فاشلة من IP واحد", ip: "45.33.12.88", timestamp: "2024-04-16 13:45", level: "critical" },
  { id: "4", user: "خالد المشاهد", action: "تصدير بيانات", target: "تقرير المبيعات", details: "تصدير تقرير المبيعات كملف CSV", ip: "192.168.1.20", timestamp: "2024-04-16 13:30", level: "warning" },
  { id: "5", user: "أحمد المدير", action: "تعديل الإعدادات", target: "إعدادات الدفع", details: "تفعيل طريقة الدفع Apple Pay", ip: "192.168.1.10", timestamp: "2024-04-16 12:00", level: "warning" },
  { id: "6", user: "نورة المسوقة", action: "إرسال حملة", target: "حملة البريد الإلكتروني", details: "إرسال 500 رسالة ترويجية للعملاء", ip: "172.16.0.5", timestamp: "2024-04-16 11:30", level: "info" },
  { id: "7", user: "النظام", action: "نسخ احتياطي", target: "قاعدة البيانات", details: "تم إنشاء نسخة احتياطية تلقائية بنجاح (45 ميجا)", ip: "—", timestamp: "2024-04-16 03:00", level: "info" },
  { id: "8", user: "أحمد المدير", action: "حذف منتج", target: "قالب قديم", details: "حذف منتج 'قالب موقع قديم' نهائياً", ip: "192.168.1.10", timestamp: "2024-04-15 18:00", level: "warning" },
  { id: "9", user: "سارة المحررة", action: "تغيير كلمة المرور", target: "حسابها الشخصي", details: "تم تغيير كلمة المرور بنجاح", ip: "10.0.0.5", timestamp: "2024-04-15 16:30", level: "info" },
  { id: "10", user: "النظام", action: "فشل الدفع", target: "طلب #1230", details: "فشلت معالجة الدفع عبر Stripe — insufficient_funds", ip: "—", timestamp: "2024-04-15 15:00", level: "critical" },
  { id: "11", user: "أحمد المدير", action: "تعديل صلاحيات", target: "دور المشاهد", details: "إضافة صلاحية 'قراءة التقارير' لدور المشاهد", ip: "192.168.1.10", timestamp: "2024-04-15 14:00", level: "warning" },
  { id: "12", user: "النظام", action: "انتهاء الترخيص", target: "رخصة #LIC-45", details: "انتهت صلاحية الترخيص لعميل 'خالد الشمري'", ip: "—", timestamp: "2024-04-15 12:00", level: "info" },
  { id: "13", user: "نورة المسوقة", action: "إنشاء كوبون", target: "خصم الصيف 2024", details: "إنشاء كوبون خصم 20% بحد أقصى 100 استخدام", ip: "172.16.0.5", timestamp: "2024-04-15 10:00", level: "info" },
  { id: "14", user: "النظام", action: "تنبيه أمني", target: "ملف الإعدادات", details: "محاولة تعديل ملف الإعدادات من مصدر غير مصرح", ip: "203.0.113.42", timestamp: "2024-04-14 22:00", level: "critical" },
  { id: "15", user: "أحمد المدير", action: "تسجيل خروج", target: "حساب 'عمر المستخدم'", details: "تسجيل خروج إجباري لحساب مستخدم", ip: "192.168.1.10", timestamp: "2024-04-14 20:00", level: "warning" },
  { id: "16", user: "سارة المحررة", action: "نشر مقال", target: "مقال التسويق", details: "نشر مقال 'أساسيات التسويق الرقمي' في المدونة", ip: "10.0.0.5", timestamp: "2024-04-14 16:00", level: "info" },
  { id: "17", user: "النظام", action: "تحديث النظام", target: "الإصدار 2.5.0", details: "تم تحديث النظام بنجاح مع إصلاح 12 خللاً", ip: "—", timestamp: "2024-04-14 02:00", level: "info" },
  { id: "18", user: "أحمد المدير", action: "تفعيل ملحق", target: "ملحق Stripe", details: "تفعيل وتكوين ملحق الدفع عبر Stripe", ip: "192.168.1.10", timestamp: "2024-04-13 14:00", level: "warning" },
];

const levelConfig: Record<string, { label: string; variant: "info" | "warning" | "danger"; icon: typeof Info }> = {
  info: { label: "معلومات", variant: "info", icon: Info },
  warning: { label: "تنبيه", variant: "warning", icon: AlertTriangle },
  critical: { label: "حرج", variant: "danger", icon: AlertCircle },
};

const actionTypes = [
  { value: "", label: "جميع الإجراءات" },
  { value: "تسجيل دخول", label: "تسجيل دخول" },
  { value: "إنشاء منتج", label: "إنشاء منتج" },
  { value: "تنبيه أمني", label: "تنبيه أمني" },
  { value: "تصدير بيانات", label: "تصدير بيانات" },
  { value: "تعديل الإعدادات", label: "تعديل الإعدادات" },
  { value: "إرسال حملة", label: "إرسال حملة" },
  { value: "حذف منتج", label: "حذف منتج" },
  { value: "تغيير كلمة المرور", label: "تغيير كلمة المرور" },
  { value: "فشل الدفع", label: "فشل الدفع" },
  { value: "نسخ احتياطي", label: "نسخ احتياطي" },
];

const levelOptions = [
  { value: "", label: "جميع المستويات" },
  { value: "info", label: "معلومات" },
  { value: "warning", label: "تنبيه" },
  { value: "critical", label: "حرج" },
];

export default function AuditLogsPage() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const ms = !search || l.user.includes(search) || l.action.includes(search) || l.target.includes(search) || l.details.includes(search);
      const ma = !actionFilter || l.action === actionFilter;
      const ml = !levelFilter || l.level === levelFilter;
      return ms && ma && ml;
    });
  }, [logs, search, actionFilter, levelFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const todayLogs = logs.filter((l) => l.timestamp.startsWith("2024-04-16")).length;
  const warningCount = logs.filter((l) => l.level === "warning").length;
  const criticalCount = logs.filter((l) => l.level === "critical").length;

  const columns = [
    {
      key: "timestamp" as const, label: "التاريخ والوقت",
      render: (v: unknown) => <span className="text-xs text-text-muted font-mono">{String(v)}</span>,
    },
    {
      key: "user" as const, label: "المستخدم",
      render: (v: unknown) => <span className="font-medium text-text">{String(v)}</span>,
    },
    { key: "action" as const, label: "الإجراء" },
    { key: "target" as const, label: "الهدف" },
    {
      key: "details" as const, label: "التفاصيل",
      render: (v: unknown) => <span className="text-xs text-text-secondary max-w-xs block truncate">{String(v)}</span>,
    },
    {
      key: "level" as const, label: "المستوى",
      render: (v: unknown) => {
        const config = levelConfig[String(v)];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "ip" as const, label: "IP",
      render: (v: unknown) => <span className="text-xs font-mono text-text-muted">{String(v)}</span>,
    },
  ];

  const handleExport = () => {
    const csv = filtered.map((l) => `${l.timestamp},${l.user},${l.action},${l.target},${l.details},${l.level},${l.ip}`).join("\n");
    const blob = new Blob([`التاريخ,المستخدم,الإجراء,الهدف,التفاصيل,المستوى,IP\n${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="سجل التدقيق" subtitle="تتبع جميع الإجراءات والتعديلات على النظام" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={handleExport}>تصدير السجل</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Info size={20} className="text-primary" /></div><div><p className="text-2xl font-bold text-text">{todayLogs}</p><p className="text-xs text-text-muted">إجراءات اليوم</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><AlertTriangle size={20} className="text-warning" /></div><div><p className="text-2xl font-bold text-text">{warningCount}</p><p className="text-xs text-text-muted">تنبيهات</p></div></div></Card>
        <Card padding="sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10"><AlertCircle size={20} className="text-danger" /></div><div><p className="text-2xl font-bold text-text">{criticalCount}</p><p className="text-xs text-text-muted">أحداث حرجة</p></div></div></Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث في السجلات..." onChange={setSearch} className="w-64" />
        <Select options={actionTypes} value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} />
        <Select options={levelOptions} value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }} />
        <Badge variant="info">{filtered.length} سجل</Badge>
      </div>

      <DataTable columns={columns} data={paginated} emptyMessage="لا توجد سجلات" rowKey="id" />
      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={perPage} onPageChange={setPage} />}
    </div>
  );
}
