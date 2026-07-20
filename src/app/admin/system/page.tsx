"use client";

import { useCallback } from "react";
import { Server, Database, HardDrive, Mail, RefreshCw, Download, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const services = [
  { name: "API", icon: <Server size={18} />, status: "متصل" },
  { name: "قاعدة البيانات", icon: <Database size={18} />, status: "متصلة" },
  { name: "التخزين", icon: <HardDrive size={18} />, status: "متصل" },
  { name: "البريد الإلكتروني", icon: <Mail size={18} />, status: "متصل" },
];

export default function SystemPage() {
  const { success, info } = useToast();

  const handleBackup = useCallback(() => {
    info("جاري النسخ", "تم بدء إنشاء نسخة احتياطية...");
    setTimeout(() => success("تم", "تم إنشاء النسخة الاحتياطية بنجاح"), 1500);
  }, [info, success]);

  const handleRefresh = useCallback(() => {
    info("جاري التحديث", "تم تحديث حالة النظام");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="النظام" subtitle="مراقبة حالة النظام والمعلومات التقنية" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card header={<h3 className="font-semibold text-text">حالة النظام</h3>} padding="md">
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3"><span className="text-text-secondary">{service.icon}</span><span className="text-sm font-medium text-text">{service.name}</span></div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /><span className="text-sm text-success">{service.status}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card header={<h3 className="font-semibold text-text">معلومات النظام</h3>} padding="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">الإصدار</span><Badge variant="purple">v3.2.1</Badge></div>
            <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">آخر تحديث</span><span className="text-sm text-text">18 يوليو 2026</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">إصدار Node</span><span className="text-sm text-text">22.x</span></div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5"><span className="text-sm text-text-secondary">استخدام مساحة القرص</span><span className="text-sm font-medium text-text">62%</span></div>
              <div className="h-2 w-full rounded-full bg-surface-hover"><div className="h-2 w-[62%] rounded-full bg-primary" /></div>
              <p className="mt-1 text-xs text-text-muted">12.4 GB من 20 GB مستخدمة</p>
            </div>
          </div>
        </Card>
        <Card header={<h3 className="font-semibold text-text">السحوبات</h3>} padding="md">
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-hover p-4 space-y-3">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /><span className="text-sm font-medium text-text">آخر نسخة احتياطية</span></div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">التاريخ</span><span className="text-sm text-text">18 يوليو 2026 - 3:00 ص</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">الحجم</span><span className="text-sm text-text">856 MB</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">الحالة</span><Badge variant="success" dot>ناجح</Badge></div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" fullWidth icon={<Download size={14} />} onClick={handleBackup}>نسخة احتياطية جديدة</Button>
              <Button variant="secondary" size="sm" fullWidth icon={<RefreshCw size={14} />} onClick={handleRefresh}>تحديث</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
