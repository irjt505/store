"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Settings2, Copy, Activity, Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const initialEndpoints = [
  { method: "GET", path: "/api/products", description: "جلب جميع المنتجات", active: true },
  { method: "POST", path: "/api/products", description: "إضافة منتج جديد", active: true },
  { method: "GET", path: "/api/orders", description: "جلب جميع الطلبات", active: true },
  { method: "PUT", path: "/api/orders/:id", description: "تحديث حالة الطلب", active: true },
  { method: "DELETE", path: "/api/products/:id", description: "حذف منتج", active: false },
  { method: "GET", path: "/api/customers", description: "جلب جميع العملاء", active: true },
  { method: "POST", path: "/api/webhooks", description: "إنشاء webhook جديد", active: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-success-light text-success", POST: "bg-info-light text-info", PUT: "bg-warning-light text-warning", DELETE: "bg-danger-light text-danger",
};

const usageStats = [
  { label: "طلبات اليوم", value: "12,450", change: "+8%" },
  { label: "متوسط الاستجابة", value: "42ms", change: "-12%" },
  { label: "معدل الخطأ", value: "0.02%", change: "-5%" },
  { label: "نقاط النهاية النشطة", value: "6/7", change: "" },
];

export default function APIManagerPage() {
  const { success, info } = useToast();
  const [ratePerMinute, setRatePerMinute] = useState(60);
  const [ratePerHour, setRatePerHour] = useState(1000);
  const [ratePerDay, setRatePerDay] = useState(10000);

  const handleSaveRateLimit = useCallback(() => {
    success("تم الحفظ", "تم حفظ إعدادات معدل الطلبات");
  }, [success]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    info("تم النسخ", "تم نسخ الرابط");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="مدير API" subtitle="إدارة نقاط النهاية وتكوين واجهة برمجة التطبيقات" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {usageStats.map((stat, idx) => (
          <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: idx * 0.04 }}>
            <Card padding="sm">
              <p className="text-xs text-text-muted mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold text-text">{stat.value}</p>
                {stat.change && <p className={cn("text-xs font-medium mb-0.5", stat.change.startsWith("+") ? "text-success" : stat.change.startsWith("-") ? "text-success" : "text-text-muted")}>{stat.change}</p>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }} className="xl:col-span-2">
          <Card header={<div className="flex items-center gap-2"><Activity size={16} className="text-primary" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">نقاط النهاية</h3></div>} padding="md">
            <div className="space-y-2">
              {initialEndpoints.map((ep, idx) => (
                <motion.div key={idx} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 + idx * 0.03 }}
                  className={cn("flex items-center justify-between rounded-xl border border-border p-3 transition-colors", !ep.active && "opacity-50")}>
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold", methodColors[ep.method])}>{ep.method}</span>
                    <code className="text-sm font-mono text-text">{ep.path}</code>
                    <span className="text-sm text-text-secondary hidden sm:inline">{ep.description}</span>
                  </div>
                  <Badge variant={ep.active ? "success" : "default"} dot>{ep.active ? "نشط" : "معطّل"}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.25 }}>
          <Card header={<div className="flex items-center gap-2"><Gauge size={16} className="text-primary" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">معدل الطلبات</h3></div>} padding="md">
            <div className="space-y-4">
              <Input label="الحد الأقصى للطلبات في الدقيقة" type="number" value={ratePerMinute} onChange={(e) => setRatePerMinute(Number(e.target.value))} />
              <Input label="الحد الأقصى للطلبات في الساعة" type="number" value={ratePerHour} onChange={(e) => setRatePerHour(Number(e.target.value))} />
              <Input label="الحد الأقصى للطلبات في اليوم" type="number" value={ratePerDay} onChange={(e) => setRatePerDay(Number(e.target.value))} />
              <Button variant="secondary" size="sm" icon={<Settings2 size={14} />} onClick={handleSaveRateLimit}>حفظ الإعدادات</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
          <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">التوثيق</h3>} padding="md">
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">تابع التوثيق الكامل لواجهة برمجة التطبيقات لإدارة المنتجات والطلبات والعملاء.</p>
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer"><ExternalLink size={14} />واجهه REST API - التوثيق الكامل</span>
                <span className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer"><ExternalLink size={14} />دليل البدء السريع</span>
              </div>
              <div className="rounded-xl bg-surface-hover p-4">
                <p className="text-xs font-mono text-text-secondary">Base URL: https://api.mystore.com/v1</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-xs font-mono text-text bg-bg px-2 py-1 rounded-lg">Authorization: Bearer sk_live_***</code>
                  <button className="text-text-muted hover:text-text transition-colors cursor-pointer" onClick={() => handleCopy("Authorization: Bearer sk_live_***")}><Copy size={14} /></button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
