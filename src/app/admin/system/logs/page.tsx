"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Filter, Download, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/SearchInput";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

type LogEntry = {
  id: string; timestamp: string; level: string; levelVariant: "info" | "warning" | "danger"; message: string; source: string;
};

const initialLogs: LogEntry[] = [
  { id: "1", timestamp: "2026-07-18T10:30:00", level: "info", levelVariant: "info", message: "تم تسجيل دخول المستخدم admin@mystore.com", source: "auth" },
  { id: "2", timestamp: "2026-07-18T10:25:00", level: "warning", levelVariant: "warning", message: "محاولة دخول فاشلة من IP: 192.168.1.100", source: "security" },
  { id: "3", timestamp: "2026-07-18T10:20:00", level: "error", levelVariant: "danger", message: "فشل في إرسال البريد الإلكتروني للطلب #ORD-7841", source: "email" },
  { id: "4", timestamp: "2026-07-18T10:15:00", level: "info", levelVariant: "info", message: "تم تحديث إعدادات التحميل", source: "settings" },
  { id: "5", timestamp: "2026-07-18T10:10:00", level: "info", levelVariant: "info", message: "تم إنشاء نسخة احتياطية بنجاح", source: "backup" },
  { id: "6", timestamp: "2026-07-18T10:05:00", level: "warning", levelVariant: "warning", message: "مساحة التخزين وصلت إلى 75%", source: "system" },
  { id: "7", timestamp: "2026-07-18T10:00:00", level: "info", levelVariant: "info", message: "تم مزامنة 50 منتج من المخزون", source: "inventory" },
  { id: "8", timestamp: "2026-07-18T09:55:00", level: "error", levelVariant: "danger", message: "خطأ في الاتصال بخدمة الدفع", source: "payment" },
  { id: "9", timestamp: "2026-07-18T09:50:00", level: "info", levelVariant: "info", message: "تم تفعيل إضافة WhatsApp Business", source: "plugins" },
  { id: "10", timestamp: "2026-07-18T09:45:00", level: "warning", levelVariant: "warning", message: "معدل طلبات API تجاوز الحد المسموح", source: "api" },
];

export default function LogsPage() {
  const { info } = useToast();
  const {
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
    totalItems,
    totalPages,
  } = useCrud<LogEntry>({
    initialData: initialLogs,
    searchFields: ["message", "source"],
    itemsPerPage: 10,
    defaultSortKey: "timestamp",
    defaultSortDir: "desc",
  });

  const handleExport = useCallback(() => {
    info("جاري التصدير", "تم بدء تصدير السجلات...");
  }, [info]);

  const columns = [
    { key: "timestamp" as const, label: "التاريخ والوقت", sortable: true, render: (v: unknown) => <span className="text-text-secondary font-mono text-xs">{formatDateTime(String(v))}</span> },
    { key: "level" as const, label: "المستوى", sortable: true, render: (_v: unknown, row: LogEntry) => <Badge variant={row.levelVariant} dot>{row.level === "info" ? "معلومات" : row.level === "warning" ? "تحذير" : "خطأ"}</Badge> },
    { key: "message" as const, label: "الرسالة", sortable: true },
    { key: "source" as const, label: "المصدر", sortable: true, render: (v: unknown) => <Badge variant="default">{String(v)}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="السجلات" subtitle="مراقبة أحداث وسجلات النظام" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={handleExport}>تصدير</Button>} />

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }} className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="بحث في السجلات..." value={search} onChange={setSearch} className="w-64" />
        <Select options={[{ value: "", label: "جميع المستويات" }, { value: "info", label: "معلومات" }, { value: "warning", label: "تحذير" }, { value: "error", label: "خطأ" }]} value={filters.level || ""} onChange={(e) => setFilter("level", e.target.value)} className="w-48" />
        <Badge variant="info">{totalItems} سجل</Badge>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
        <Card padding="none">
          <div className="p-4">
            <DataTable columns={columns} data={paginatedData} emptyMessage="لا توجد سجلات" rowKey="id" sortable pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }} />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
