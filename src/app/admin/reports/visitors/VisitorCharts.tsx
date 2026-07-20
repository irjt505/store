"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const pageViewsData = [
  { day: "1", views: 1200 }, { day: "2", views: 1450 }, { day: "3", views: 1100 },
  { day: "4", views: 1800 }, { day: "5", views: 1650 }, { day: "6", views: 2100 },
  { day: "7", views: 1900 }, { day: "8", views: 2300 }, { day: "9", views: 2050 },
  { day: "10", views: 2500 }, { day: "11", views: 2200 }, { day: "12", views: 2800 },
  { day: "13", views: 2600 }, { day: "14", views: 3100 }, { day: "15", views: 2900 },
  { day: "16", views: 3200 }, { day: "17", views: 3050 }, { day: "18", views: 3400 },
  { day: "19", views: 3150 }, { day: "20", views: 3600 }, { day: "21", views: 3350 },
  { day: "22", views: 3800 }, { day: "23", views: 3500 }, { day: "24", views: 4000 },
  { day: "25", views: 3750 }, { day: "26", views: 4200 }, { day: "27", views: 3900 },
  { day: "28", views: 4500 }, { day: "29", views: 4100 }, { day: "30", views: 4520 },
];

const sourcesData = [
  { name: "بحث مباشر", value: 42 },
  { name: "وسائل التواصل", value: 28 },
  { name: "إعلانات مدفوعة", value: 18 },
  { name: "إحالات", value: 8 },
  { name: "بريد إلكتروني", value: 4 },
];

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface VisitorChartsProps {
  type: "pageviews" | "sources";
}

export default function VisitorCharts({ type }: VisitorChartsProps) {
  if (type === "pageviews") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text mb-4">المشاهدات اليومية</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pageViewsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px" }} formatter={(value) => [Number(value).toLocaleString("ar-SA"), "المشاهدات"]} />
              <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="font-semibold text-text mb-4">مصادر الزيارات</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={sourcesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
              {sourcesData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => [`${value}%`, "النسبة"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
