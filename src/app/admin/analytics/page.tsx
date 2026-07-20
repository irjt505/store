"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Users, Eye, ShoppingCart, TrendingUp, Download } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const AnalyticsCharts = dynamic(() => import("./AnalyticsCharts"), {
  loading: () => <div className="h-[600px] animate-pulse bg-border rounded-xl" />,
  ssr: false,
});

const topProducts = [
  { name: "دورة TypeScript", views: 2400, sales: 342 },
  { name: "كورس التسويق", views: 1800, sales: 201 },
  { name: "مشروع React", views: 1500, sales: 145 },
  { name: "قالب ويب تجاري", views: 1200, sales: 89 },
  { name: "حزمة المطور", views: 900, sales: 78 },
];

const countryData = [
  { country: "السعودية", visitors: 3200, revenue: 15600 },
  { country: "الإمارات", visitors: 1800, revenue: 8900 },
  { country: "مصر", visitors: 1200, revenue: 3400 },
  { country: "الكويت", visitors: 800, revenue: 4200 },
  { country: "قطر", visitors: 600, revenue: 3100 },
];

export default function AnalyticsPage() {
  const { info } = useToast();
  const [period, setPeriod] = useState("7d");

  const handleExport = useCallback(() => {
    info("جاري التصدير", "تم بدء تصدير التقرير...");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="التحليلات" subtitle="نظرة شاملة على أداء المتجر والزيارات" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={handleExport}>تصدير التقرير</Button>} />
      <div className="flex items-center gap-3">
        <ToggleGroup options={[{ value: "24h", label: "اليوم" }, { value: "7d", label: "7 أيام" }, { value: "30d", label: "30 يوم" }, { value: "90d", label: "90 يوم" }]} value={period} onChange={setPeriod} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Eye size={20} />} label="الزيارات" value="8,420" change="+15.3%" changeType="up" />
        <StatCard icon={<Users size={20} />} label="الزوار الفريدون" value="5,840" change="+8.7%" changeType="up" />
        <StatCard icon={<ShoppingCart size={20} />} label="الطلبات" value="342" change="+12.1%" changeType="up" />
        <StatCard icon={<TrendingUp size={20} />} label="معدل التحويل" value="4.1%" change="-0.3%" changeType="down" />
      </div>
      <AnalyticsCharts />
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">المنتجات الأكثر زيارة</h3>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors">
              <span className="text-lg font-bold text-text-muted w-6">{i + 1}</span>
              <div className="flex-1"><p className="font-medium text-text">{p.name}</p><p className="text-xs text-text-muted">{p.views.toLocaleString("ar")} زيارة · {p.sales} مبيعة</p></div>
              <div className="h-2 w-32 rounded-full bg-border overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(p.views / topProducts[0].views) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">الزيارات حسب الدولة</h3>
        <DataTable
          data={countryData.map((c) => ({ ...c, percentage: Math.round((c.visitors / countryData[0].visitors) * 100) }))}
          rowKey="country"
          columns={[
            { key: "country", label: "الدولة", render: (v: unknown) => <span className="font-medium text-text">{String(v)}</span> },
            { key: "visitors", label: "الزيارات", render: (v: unknown) => <span className="text-text-secondary">{Number(v).toLocaleString("ar")}</span> },
            { key: "revenue", label: "الإيرادات", render: (v: unknown) => <span className="font-semibold">{Number(v).toLocaleString("ar-SA")} ر.س</span> },
            { key: "percentage", label: "النسبة", render: (v: unknown) => <div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-border overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${v}%` }} /></div><span className="text-xs text-text-muted">{String(v)}%</span></div> },
          ]}
        />
      </Card>
    </div>
  );
}
