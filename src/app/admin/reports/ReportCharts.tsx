"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const monthlyRevenue = [
  { month: "يناير", revenue: 35000 }, { month: "فبراير", revenue: 28000 },
  { month: "مارس", revenue: 42000 }, { month: "أبريل", revenue: 38000 },
  { month: "مايو", revenue: 51000 }, { month: "يونيو", revenue: 47000 },
  { month: "يوليو", revenue: 62000 }, { month: "أغسطس", revenue: 55000 },
  { month: "سبتمبر", revenue: 48000 }, { month: "أكتوبر", revenue: 67000 },
  { month: "نوفمبر", revenue: 72000 }, { month: "ديسمبر", revenue: 81000 },
];

const customerData = [
  { name: "العملاء الجدد", value: 1250 },
  { name: "العملاء العائدون", value: 890 },
  { name: "العملاء غير النشطين", value: 340 },
];

const ordersData = [
  { month: "يناير", orders: 175 }, { month: "فبراير", orders: 140 },
  { month: "مارس", orders: 210 }, { month: "أبريل", orders: 190 },
  { month: "مايو", orders: 255 }, { month: "يونيو", orders: 235 },
  { month: "يوليو", orders: 310 }, { month: "أغسطس", orders: 275 },
  { month: "سبتمبر", orders: 240 }, { month: "أكتوبر", orders: 335 },
  { month: "نوفمبر", orders: 360 }, { month: "ديسمبر", orders: 405 },
];

const marketingPieData = [
  { name: "بحث مباشر", value: 42 },
  { name: "وسائل التواصل", value: 28 },
  { name: "إعلانات مدفوعة", value: 18 },
  { name: "إحالات", value: 12 },
];

const PIE_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const chartStyle = { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px" };

interface ReportChartsProps {
  activeTab: string;
}

export default function ReportCharts({ activeTab }: ReportChartsProps) {
  if (activeTab === "sales") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">الإيرادات الشهرية</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} formatter={(value) => [formatCurrency(Number(value)), "الإيرادات"]} />
              <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">الطلبات الشهرية</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} formatter={(value) => [Number(value).toLocaleString("ar-SA"), "الطلبات"]} />
              <Bar dataKey="orders" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (activeTab === "customers") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">توزيع العملاء</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={customerData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {customerData.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [Number(value).toLocaleString("ar-SA"), "العدد"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (activeTab === "revenue") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">الإيرادات الشهرية</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} formatter={(value) => [formatCurrency(Number(value)), "الإيرادات"]} />
              <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (activeTab === "marketing") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">الزيارات حسب المصدر</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={marketingPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {[0, 1, 2, 3].map((index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [`${value}%`, "النسبة"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}
