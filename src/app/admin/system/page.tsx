"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Server, Database, HardDrive, Mail, RefreshCw, Download, CheckCircle2, Cpu, Activity } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const services = [
  { name: "API", icon: Server, status: "متصل", color: "text-success" },
  { name: "قاعدة البيانات", icon: Database, status: "متصلة", color: "text-success" },
  { name: "التخزين", icon: HardDrive, status: "متصل", color: "text-success" },
  { name: "البريد الإلكتروني", icon: Mail, status: "متصل", color: "text-success" },
  { name: "الخادم", icon: Cpu, status: "يعمل بكفاءة", color: "text-success" },
  { name: "الذاكرة المؤقتة", icon: Activity, status: "نشطة", color: "text-success" },
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

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}>
        <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">حالة الخدمات</h3>} padding="md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.name} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 + idx * 0.03 }}
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary"><Icon size={18} /></span>
                    <span className="text-sm font-medium text-text">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className={`text-sm ${service.color}`}>{service.status}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }}>
          <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">معلومات النظام</h3>} padding="md">
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">الإصدار</span><Badge variant="purple">v3.2.1</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">آخر تحديث</span><span className="text-sm text-text">18 يوليو 2026</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">إصدار Node</span><span className="text-sm text-text">22.x</span></div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5"><span className="text-sm text-text-secondary">استخدام مساحة القرص</span><span className="text-sm font-medium text-text">62%</span></div>
                <div className="h-2 w-full rounded-full bg-surface-hover"><div className="h-2 w-[62%] rounded-full bg-primary transition-all" /></div>
                <p className="mt-1 text-xs text-text-muted">12.4 GB من 20 GB مستخدمة</p>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5"><span className="text-sm text-text-secondary">استخدام الذاكرة</span><span className="text-sm font-medium text-text">45%</span></div>
                <div className="h-2 w-full rounded-full bg-surface-hover"><div className="h-2 w-[45%] rounded-full bg-success transition-all" /></div>
                <p className="mt-1 text-xs text-text-muted">3.6 GB من 8 GB مستخدمة</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">النسخ الاحتياطية</h3>} padding="md">
            <div className="space-y-4">
              <div className="rounded-xl bg-surface-hover p-4 space-y-3">
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
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.25 }}>
          <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">إحصائيات الأداء</h3>} padding="md">
            <div className="space-y-4">
              {[
                { label: "وقت الاستجابة", value: "42ms", color: "text-success" },
                { label: "طلبات/ثانية", value: "1,250", color: "text-primary" },
                { label: "معدل الأخطاء", value: "0.02%", color: "text-success" },
                { label: "وقت التشغيل", value: "99.98%", color: "text-success" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-hover">
                  <span className="text-sm text-text-secondary">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
