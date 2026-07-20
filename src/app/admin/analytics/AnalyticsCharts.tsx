"use client";

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
  ResponsiveContainer,
} from "recharts";

const dailyRevenue = [
  { date: "1 يوليو", revenue: 1200, orders: 12 }, { date: "2 يوليو", revenue: 1800, orders: 18 },
  { date: "3 يوليو", revenue: 900, orders: 9 }, { date: "4 يوليو", revenue: 2400, orders: 24 },
  { date: "5 يوليو", revenue: 1600, orders: 16 }, { date: "6 يوليو", revenue: 2100, orders: 21 },
  { date: "7 يوليو", revenue: 2800, orders: 28 }, { date: "8 يوليو", revenue: 1400, orders: 14 },
  { date: "9 يوليو", revenue: 1900, orders: 19 }, { date: "10 يوليو", revenue: 2200, orders: 22 },
  { date: "11 يوليو", revenue: 1700, orders: 17 }, { date: "12 يوليو", revenue: 2600, orders: 26 },
  { date: "13 يوليو", revenue: 3100, orders: 31 }, { date: "14 يوليو", revenue: 2000, orders: 20 },
];

const trafficSources = [
  { name: "بحث جوجل", value: 4200, color: "#6366F1" },
  { name: "وسائل التواصل", value: 2800, color: "#10B981" },
  { name: "إعلانات مدفوعة", value: 1800, color: "#F59E0B" },
  { name: "بريد إلكتروني", value: 1200, color: "#EC4899" },
  { name: "مباشر", value: 800, color: "#3B82F6" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`, visitors: Math.floor(Math.random() * 200 + 50),
}));

const deviceData = [
  { name: "موبايل", value: 55, color: "#6366F1" },
  { name: "ديسكتوب", value: 35, color: "#10B981" },
  { name: "تابلت", value: 10, color: "#F59E0B" },
];

export default function AnalyticsCharts() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">الإيرادات والزيارات</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="#6366F1" fillOpacity={0.1} name="الإيرادات (﷼)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">مصادر الزيارات</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={trafficSources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {trafficSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {trafficSources.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-sm text-text">{s.name}</span></div>
                  <span className="text-sm font-medium text-text">{s.value.toLocaleString("ar")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">الزيارات حسب الساعة</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="visitors" fill="#6366F1" name="الزوار" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">الأجهزة</h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                  {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {deviceData.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1"><span className="text-sm text-text">{d.name}</span><span className="text-sm font-medium">{d.value}%</span></div>
                  <div className="h-2 rounded-full bg-border overflow-hidden"><div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
