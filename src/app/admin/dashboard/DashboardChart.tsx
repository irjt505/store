"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const revenueData = [
  { month: "يناير", revenue: 4000, orders: 240 },
  { month: "فبراير", revenue: 3000, orders: 198 },
  { month: "مارس", revenue: 5000, orders: 312 },
  { month: "أبريل", revenue: 4500, orders: 285 },
  { month: "مايو", revenue: 6000, orders: 380 },
  { month: "يونيو", revenue: 5500, orders: 345 },
  { month: "يوليو", revenue: 7000, orders: 420 },
  { month: "أغسطس", revenue: 8000, orders: 498 },
  { month: "سبتمبر", revenue: 7500, orders: 465 },
  { month: "أكتوبر", revenue: 9000, orders: 534 },
  { month: "نوفمبر", revenue: 10000, orders: 612 },
  { month: "ديسمبر", revenue: 11000, orders: 678 },
];

export default function DashboardChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px" }}
            formatter={(value) => [formatCurrency(Number(value)), "الإيرادات"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revenueGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
