"use client";

import { useState, useCallback, useMemo } from "react";
import { Users, Eye, Clock, Monitor, Smartphone, Tablet, Globe, TrendingUp, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

const VisitorCharts = dynamic(() => import("./VisitorCharts"), {
  loading: () => <div className="h-80 animate-pulse bg-border rounded-xl" />,
  ssr: false,
});

const topPages = [
  { page: "/products/wireless-headphones-pro", views: 8920, visitors: 6540, bounceRate: 32, avgTime: "3:45" },
  { page: "/", views: 7650, visitors: 5230, bounceRate: 28, avgTime: "2:15" },
  { page: "/products/usb-charger-fast", views: 5430, visitors: 4120, bounceRate: 35, avgTime: "2:50" },
  { page: "/categories/electronics", views: 4320, visitors: 3560, bounceRate: 42, avgTime: "1:30" },
  { page: "/offers/summer-sale", views: 3980, visitors: 3100, bounceRate: 25, avgTime: "4:10" },
  { page: "/products/phone-case-silicone", views: 3210, visitors: 2800, bounceRate: 38, avgTime: "2:00" },
  { page: "/cart", views: 2890, visitors: 2890, bounceRate: 65, avgTime: "1:45" },
  { page: "/checkout", views: 1650, visitors: 1650, bounceRate: 15, avgTime: "5:30" },
];

const trafficSources = [
  { source: "بحث مباشر", percentage: 42, visitors: 18900, color: "#6366F1" },
  { source: "وسائل التواصل", percentage: 28, visitors: 12600, color: "#10B981" },
  { source: "إعلانات مدفوعة", percentage: 18, visitors: 8100, color: "#F59E0B" },
  { source: "إحالات", percentage: 8, visitors: 3600, color: "#EF4444" },
  { source: "بريد إلكتروني", percentage: 4, visitors: 1800, color: "#8B5CF6" },
];

const geoData = [
  { country: "السعودية", flag: "🇸🇦", visitors: 22500, percentage: 50 },
  { country: "الإمارات", flag: "🇦🇪", visitors: 9000, percentage: 20 },
  { country: "مصر", flag: "🇪🇬", visitors: 5400, percentage: 12 },
  { country: "الكويت", flag: "🇰🇼", visitors: 3150, percentage: 7 },
  { country: "البحرين", flag: "🇧🇭", visitors: 2250, percentage: 5 },
  { country: "قطر", flag: "🇶🇦", visitors: 1800, percentage: 4 },
  { country: "عمان", flag: "🇴🇲", visitors: 900, percentage: 2 },
];

export default function VisitorsPage() {
  const { info } = useToast();
  const [dateRange, setDateRange] = useState("month");

  const realtimeVisitors = 127;
  const todayViews = 4520;
  const totalViews = 45200;
  const avgSession = "3:24";
  const pagesPerSession = 3.2;
  const bounceRate = 35.8;

  const pageColumns = useMemo(() => [
    {
      key: "page" as const, label: "الصفحة", sortable: true,
      render: (v: unknown) => <span className="font-mono text-xs text-primary">{String(v)}</span>,
    },
    { key: "views" as const, label: "المشاهدات", sortable: true, render: (v: unknown) => Number(v).toLocaleString("ar-SA") },
    { key: "visitors" as const, label: "الزوار", sortable: true, render: (v: unknown) => Number(v).toLocaleString("ar-SA") },
    { key: "bounceRate" as const, label: "معدل الارتداد", sortable: true, render: (v: unknown) => <span className={Number(v) > 50 ? "text-danger" : "text-success"}>{String(v)}%</span> },
    { key: "avgTime" as const, label: "متوسط الوقت", sortable: true },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader title="تحليلات الزوار" subtitle="تتبع سلوك الزوار وأداء الموقع" actions={
        <div className="flex gap-2">
          {["today", "week", "month", "quarter", "year"].map((range) => (
            <Button key={range} variant={dateRange === range ? "primary" : "secondary"} size="sm" onClick={() => setDateRange(range)}>
              {range === "today" ? "اليوم" : range === "week" ? "هذا الأسبوع" : range === "month" ? "هذا الشهر" : range === "quarter" ? "هذا الربع" : "هذا العام"}
            </Button>
          ))}
        </div>
      } />

      <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-l from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success animate-pulse">
          <div className="h-3 w-3 rounded-full bg-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-text">الزوار المتصلون الآن</p>
          <p className="text-2xl font-bold text-primary">{realtimeVisitors}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Eye size={20} />} label="مشاهدات اليوم" value={todayViews.toLocaleString("ar-SA")} color="primary" />
        <StatCard icon={<Users size={20} />} label="إجمالي المشاهدات" value={totalViews.toLocaleString("ar-SA")} color="info" />
        <StatCard icon={<Clock size={20} />} label="متوسط مدة الجلسة" value={avgSession} color="success" />
        <StatCard icon={<Eye size={20} />} label="صفحات/جلسة" value={pagesPerSession.toString()} color="warning" />
        <StatCard icon={<ArrowUpRight size={20} />} label="معدل الارتداد" value={`${bounceRate}%`} color="danger" />
        <StatCard icon={<TrendingUp size={20} />} label="معدل التحويل" value="3.2%" color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorCharts type="pageviews" />
        <VisitorCharts type="sources" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card header={<h3 className="font-semibold text-text">الأجهزة</h3>} padding="md" className="lg:col-span-1">
          <div className="space-y-4">
            {[
              { label: "الجوال", icon: Smartphone, percentage: 62, count: 27960, color: "text-primary" },
              { label: "الكمبيوتر", icon: Monitor, percentage: 28, count: 12656, color: "text-success" },
              { label: "الجهاز اللوحي", icon: Tablet, percentage: 10, count: 4520, color: "text-warning" },
            ].map((device) => (
              <div key={device.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <device.icon size={16} className={device.color} />
                    <span className="text-sm font-medium text-text">{device.label}</span>
                  </div>
                  <span className="text-sm text-text-secondary">{device.count.toLocaleString("ar-SA")} ({device.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${device.percentage}%`, backgroundColor: device.color === "text-primary" ? "#6366F1" : device.color === "text-success" ? "#10B981" : "#F59E0B" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card header={<h3 className="font-semibold text-text">مصادر الزيارات</h3>} padding="md" className="lg:col-span-1">
          <div className="space-y-3">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-text">{source.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{source.visitors.toLocaleString("ar-SA")}</span>
                  <Badge variant="default">{source.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card header={<h3 className="font-semibold text-text">التوزيع الجغرافي</h3>} padding="md" className="lg:col-span-1">
          <div className="space-y-3">
            {geoData.map((geo) => (
              <div key={geo.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{geo.flag}</span>
                  <span className="text-sm text-text">{geo.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{geo.visitors.toLocaleString("ar-SA")}</span>
                  <Badge variant="default">{geo.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card header={<h3 className="font-semibold text-text">أكثر الصفحات مشاهدة</h3>}>
        <DataTable columns={pageColumns} data={topPages} rowKey="page" emptyMessage="لا توجد بيانات" striped />
      </Card>
    </div>
  );
}
