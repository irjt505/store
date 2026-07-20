"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const dailyRevenue = [
  { day: "١", current: 4200, last: 3800 },
  { day: "٢", current: 5100, last: 4200 },
  { day: "٣", current: 4800, last: 3900 },
  { day: "٤", current: 6200, last: 5100 },
  { day: "٥", current: 5800, last: 4800 },
  { day: "٦", current: 7100, last: 5500 },
  { day: "٧", current: 6500, last: 5200 },
  { day: "٨", current: 8200, last: 6100 },
  { day: "٩", current: 7800, last: 5800 },
  { day: "١٠", current: 9100, last: 6500 },
  { day: "١١", current: 8500, last: 6200 },
  { day: "١٢", current: 10200, last: 7100 },
  { day: "١٣", current: 9800, last: 6800 },
  { day: "١٤", current: 11500, last: 7500 },
  { day: "١٥", current: 10800, last: 7200 },
  { day: "١٦", current: 12400, last: 8100 },
  { day: "١٧", current: 11900, last: 7800 },
  { day: "١٨", current: 13200, last: 8500 },
  { day: "١٩", current: 12800, last: 8200 },
  { day: "٢٠", current: 14500, last: 9100 },
];

const weeklyRevenue = [
  { week: "الأسبوع ١", current: 42000, last: 35000 },
  { week: "الأسبوع ٢", current: 48500, last: 38000 },
  { week: "الأسبوع ٣", current: 51200, last: 41000 },
  { week: "الأسبوع ٤", current: 55800, last: 44000 },
];

const monthlyRevenue = [
  { month: "يناير", current: 68000, last: 52000 },
  { month: "فبراير", current: 72000, last: 58000 },
  { month: "مارس", current: 85000, last: 63000 },
  { month: "أبريل", current: 78000, last: 71000 },
  { month: "مايو", current: 95000, last: 76000 },
  { month: "يونيو", current: 88000, last: 82000 },
  { month: "يوليو", current: 102000, last: 85000 },
  { month: "أغسطس", current: 115000, last: 91000 },
  { month: "سبتمبر", current: 108000, last: 97000 },
  { month: "أكتوبر", current: 125000, last: 102000 },
  { month: "نوفمبر", current: 138000, last: 110000 },
  { month: "ديسمبر", current: 142000, last: 118000 },
];

const ordersByStatus = [
  { name: "مكتملة", value: 542 },
  { name: "قيد المعالجة", value: 231 },
  { name: "قيد الشحن", value: 187 },
  { name: "ملغية", value: 98 },
];

const hourlyVisitors = [
  { hour: "٦ص", visitors: 12 },
  { hour: "٧ص", visitors: 28 },
  { hour: "٨ص", visitors: 45 },
  { hour: "٩ص", visitors: 78 },
  { hour: "١٠ص", visitors: 112 },
  { hour: "١١ص", visitors: 156 },
  { hour: "١٢م", visitors: 189 },
  { hour: "١م", visitors: 167 },
  { hour: "٢م", visitors: 198 },
  { hour: "٣م", visitors: 234 },
  { hour: "٤م", visitors: 212 },
  { hour: "٥م", visitors: 245 },
  { hour: "٦م", visitors: 198 },
  { hour: "٧م", visitors: 178 },
  { hour: "٨م", visitors: 145 },
  { hour: "٩م", visitors: 98 },
  { hour: "١٠م", visitors: 56 },
];

const trafficSources = [
  { name: "بحث مباشر", value: 35 },
  { name: "وسائل التواصل", value: 28 },
  { name: "إعلانات", value: 20 },
  { name: "إحالات", value: 12 },
  { name: "بريد إلكتروني", value: 5 },
];

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold text-text">
          {entry.name === "current" ? "هذا العام" : "العام الماضي"}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function VisitorsTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text">{payload[0].value} زائر</p>
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-text">{payload[0].name}: {payload[0].value}</p>
    </div>
  );
}

type RevenuePeriod = "daily" | "weekly" | "monthly";

export default function DashboardCharts() {
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("daily");

  const revenueDataMap: Record<RevenuePeriod, Array<Record<string, string | number>>> = {
    daily: dailyRevenue,
    weekly: weeklyRevenue,
    monthly: monthlyRevenue,
  };

  const revenueData = revenueDataMap[revenuePeriod];
  const revenueKey = revenuePeriod === "daily" ? "day" : revenuePeriod === "weekly" ? "week" : "month";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Revenue Area Chart */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">تحليل الإيرادات</h3>
            <div className="flex items-center gap-1 bg-bg rounded-lg p-0.5">
              {(
                [
                  { key: "daily", label: "يومي" },
                  { key: "weekly", label: "أسبوعي" },
                  { key: "monthly", label: "شهري" },
                ] as const
              ).map((period) => (
                <button
                  key={period.key}
                  onClick={() => setRevenuePeriod(period.key)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    revenuePeriod === period.key
                      ? "bg-white text-primary shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGradLast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey={revenueKey} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}k`} />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                formatter={(value: string) => (value === "current" ? "هذا العام" : "العام الماضي")}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area type="monotone" dataKey="last" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 4" fill="url(#revenueGradLast)" />
              <Area type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGradCurrent)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Orders Donut Chart */}
      <Card header={<h3 className="font-semibold text-text">الطلبات حسب الحالة</h3>}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {ordersByStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {ordersByStatus.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm text-text-muted">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }} />
              {item.name}: <span className="font-semibold text-text">{item.value.toLocaleString("ar-SA")}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Visitor Line Chart */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">الزيارات_hourly</h3>
            <Badge variant="info">اليوم</Badge>
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyVisitors} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<VisitorsTooltip />} />
              <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2.5} fill="url(#visitorGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Traffic Sources Pie */}
      <Card header={<h3 className="font-semibold text-text">مصادر الزيارات</h3>}>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {trafficSources.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "النسبة"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-2">
          {trafficSources.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {item.name}
              </div>
              <span className="font-semibold text-text">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
