"use client";

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const monthlyRevenue = [
  { month: "يناير", revenue: 68000 },
  { month: "فبراير", revenue: 72000 },
  { month: "مارس", revenue: 85000 },
  { month: "أبريل", revenue: 78000 },
  { month: "مايو", revenue: 95000 },
  { month: "يونيو", revenue: 88000 },
  { month: "يوليو", revenue: 102000 },
  { month: "أغسطس", revenue: 115000 },
  { month: "سبتمبر", revenue: 108000 },
  { month: "أكتوبر", revenue: 125000 },
  { month: "نوفمبر", revenue: 138000 },
  { month: "ديسمبر", revenue: 142000 },
];

const ordersByStatus = [
  { name: "مكتملة", value: 542 },
  { name: "قيد المعالجة", value: 231 },
  { name: "قيد الشحن", value: 187 },
  { name: "ملغية", value: 98 },
];

const DONUT_COLORS = ["#16A34A", "#2563EB", "#F59E0B", "#DC2626"];

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="mb-0.5 text-xs text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-semibold text-text">
        {payload[0].name}: {payload[0].value.toLocaleString("ar-SA")}
      </p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v / 1000}k`}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563EB"
          strokeWidth={2}
          fill="url(#revenueAreaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrdersChart() {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={ordersByStatus}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {ordersByStatus.map((_, index) => (
              <Cell key={index} fill={DONUT_COLORS[index]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-1">
        {ordersByStatus.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: DONUT_COLORS[index] }}
            />
            <span className="text-text-muted">{item.name}</span>
            <span className="font-semibold text-text mr-auto">
              {item.value.toLocaleString("ar-SA")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
