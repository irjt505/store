"use client";

import {
  DollarSign,
  ShoppingCart,
  UserPlus,
  TrendingUp,
  Users,
  Target,
  Package,
  Clock,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Truck,
  ArrowUpRight,
  Activity,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";

const DashboardCharts = dynamic(
  () =>
    import("./DashboardCharts").then((mod) => ({
      default: function ChartsWrapper() {
        return (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <Card
                header={
                  <h3 className="text-lg font-semibold text-text">
                    الإيرادات الشهرية
                  </h3>
                }
              >
                <mod.RevenueChart />
              </Card>
            </div>
            <div className="xl:col-span-2">
              <Card
                header={
                  <h3 className="text-lg font-semibold text-text">
                    حالة الطلبات
                  </h3>
                }
              >
                <mod.OrdersChart />
              </Card>
            </div>
          </div>
        );
      },
    })),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Card>
            <div className="h-[380px] animate-pulse rounded-lg bg-surface-hover" />
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card>
            <div className="h-[380px] animate-pulse rounded-lg bg-surface-hover" />
          </Card>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: "easeOut" as const,
    },
  }),
};

const kpiData = [
  {
    icon: <DollarSign size={20} />,
    label: "الإيرادات",
    value: "١٢٣,٤٥٦ ر.س",
    change: "+15.2%",
    changeType: "up" as const,
    color: "primary" as const,
  },
  {
    icon: <ShoppingCart size={20} />,
    label: "الطلبيات",
    value: "٣٤٢",
    change: "+8.5%",
    changeType: "up" as const,
    color: "success" as const,
  },
  {
    icon: <UserPlus size={20} />,
    label: "العملاء الجدد",
    value: "٨٩",
    change: "+22.1%",
    changeType: "up" as const,
    color: "info" as const,
  },
  {
    icon: <TrendingUp size={20} />,
    label: "متوسط الطلب",
    value: "٨٩٢ ر.س",
    change: "+3.1%",
    changeType: "up" as const,
    color: "primary" as const,
  },
  {
    icon: <Target size={20} />,
    label: "نسبة التحويل",
    value: "٣.٢٪",
    change: "-0.5%",
    changeType: "down" as const,
    color: "warning" as const,
  },
  {
    icon: <DollarSign size={20} />,
    label: "صافي الربح",
    value: "٤٥,٦٧٨ ر.س",
    change: "+12.3%",
    changeType: "up" as const,
    color: "success" as const,
  },
];

const recentOrders = [
  {
    id: "#ORD-7841",
    customer: "أحمد محمد علي",
    product: "آيفون 15 برو",
    status: "تم التسليم",
    total: 4999,
    statusVariant: "success" as const,
    time: "منذ ٥ دقائق",
  },
  {
    id: "#ORD-7840",
    customer: "سارة العلي",
    product: "سماعات أبل لاسلكية",
    status: "قيد الشحن",
    total: 899,
    statusVariant: "info" as const,
    time: "منذ ١٢ دقيقة",
  },
  {
    id: "#ORD-7839",
    customer: "خالد الشمري",
    product: "ساعة سامسونج الذكية",
    status: "قيد المعالجة",
    total: 1299,
    statusVariant: "warning" as const,
    time: "منذ ٢٥ دقيقة",
  },
  {
    id: "#ORD-7838",
    customer: "نورة الحربي",
    product: "حقيبة نايكي رياضية",
    status: "تم التسليم",
    total: 350,
    statusVariant: "success" as const,
    time: "منذ ٤٠ دقيقة",
  },
  {
    id: "#ORD-7837",
    customer: "عبدالله السعيد",
    product: "دورة تسويق رقمي",
    status: "ملغي",
    total: 599,
    statusVariant: "danger" as const,
    time: "منذ ساعة",
  },
];

const topProducts = [
  { name: "آيفون 15 برو ماكس", sales: 156, revenue: 780000, icon: "📱" },
  { name: "سماعات أبل برو", sales: 234, revenue: 210600, icon: "🎧" },
  { name: "ساعة سامسونج الذكية", sales: 89, revenue: 115600, icon: "⌚" },
  { name: "دورة التسويق الرقمي", sales: 312, revenue: 93600, icon: "📚" },
  { name: "حقيبة نايكي الرياضية", sales: 67, revenue: 23450, icon: "🎒" },
];

const inventoryAlerts = [
  {
    product: "آيفون 15 برو - ١٢٨ جيجا",
    sku: "IPH-15-128",
    stock: 3,
    threshold: 10,
    variant: "danger" as const,
  },
  {
    product: "سماعات أبل برو",
    sku: "APL-AIRPODS-PRO",
    stock: 5,
    threshold: 15,
    variant: "danger" as const,
  },
  {
    product: "شاحن لاسلكي أبل",
    sku: "APL-CHRG-WRLS",
    stock: 8,
    threshold: 20,
    variant: "warning" as const,
  },
  {
    product: "غلاف سيليكون آيفون",
    sku: "ACC-CASE-SIL",
    stock: 12,
    threshold: 25,
    variant: "warning" as const,
  },
  {
    product: "كابل USB-C سريع",
    sku: "CBL-USBC-FAST",
    stock: 15,
    threshold: 30,
    variant: "warning" as const,
  },
];

const activityItems = [
  {
    icon: Package,
    text: "تم إضافة منتج جديد: آيفون 15 برو",
    time: "منذ ٥ دقائق",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: CheckCircle2,
    text: "تم تأكيد الطلب #ORD-7841",
    time: "منذ ١٢ دقيقة",
    color: "text-success",
    bg: "bg-success-light",
  },
  {
    icon: UserPlus,
    text: "عميل جديد: سارة العلي",
    time: "منذ ٢٥ دقيقة",
    color: "text-info",
    bg: "bg-info-light",
  },
  {
    icon: CreditCard,
    text: "تم استلام دفعة بقيمة ٤,٩٩٩ ر.س",
    time: "منذ ٤٠ دقيقة",
    color: "text-success",
    bg: "bg-success-light",
  },
  {
    icon: AlertCircle,
    text: "تنبيه: مخزون منخفض للمنتج #IPH-15-128",
    time: "منذ ساعة",
    color: "text-warning",
    bg: "bg-warning-light",
  },
  {
    icon: Truck,
    text: "تم شحن ٣ طلبات",
    time: "منذ ساعتين",
    color: "text-info",
    bg: "bg-info-light",
  },
];

const quickActions = [
  { icon: Package, label: "إضافة منج", href: "/admin/products/new", color: "bg-primary-light text-primary" },
  { icon: BarChart3, label: "التقارير", href: "/admin/reports", color: "bg-success-light text-success" },
  { icon: FileText, label: "الطلبات", href: "/admin/orders", color: "bg-info-light text-info" },
  { icon: Users, label: "العملاء", href: "/admin/customers", color: "bg-warning-light text-warning" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings", color: "bg-surface-hover text-text-secondary" },
  { icon: MessageSquare, label: "التواصل", href: "/admin/messages", color: "bg-primary-light text-primary" },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Row 1: Welcome + Quick Stats */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              مرحباً، المدير
            </h1>
            <p className="mt-1 text-sm text-text-muted">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Package size={16} />
              إضافة منتج
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 6 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpiData.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <StatCard
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              changeType={kpi.changeType}
              color={kpi.color}
            />
          </motion.div>
        ))}
      </div>

      {/* Row 2: Charts */}
      <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
        <DashboardCharts />
      </motion.div>

      {/* Row 3: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders - 2/3 */}
        <motion.div
          custom={8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="xl:col-span-2"
        >
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">آخر الطلبات</h3>
                <Link
                  href="/admin/orders"
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  عرض الكل
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">
                      رقم الطلب
                    </th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">
                      العميل
                    </th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs hidden sm:table-cell">
                      المنتج
                    </th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">
                      الحالة
                    </th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">
                      المبلغ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="py-3 text-text font-medium">{order.id}</td>
                      <td className="py-3 text-text">{order.customer}</td>
                      <td className="py-3 text-text-muted text-xs max-w-[120px] truncate hidden sm:table-cell">
                        {order.product}
                      </td>
                      <td className="py-3">
                        <Badge variant={order.statusVariant} dot size="sm">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-text font-medium">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Top Products - 1/3 */}
        <motion.div
          custom={9}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="xl:col-span-1"
        >
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">
                  الأكثر مبيعاً
                </h3>
                <Badge variant="success" size="sm">
                  Top 5
                </Badge>
              </div>
            }
          >
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{product.icon}</span>
                      <p className="text-sm font-medium text-text truncate">
                        {product.name}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-text shrink-0 mr-3">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted shrink-0">
                      {product.sales} مبيعة
                    </span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{
                          width: `${(product.sales / 312) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 4: Inventory Alerts + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Inventory Alerts */}
        <motion.div
          custom={10}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">
                  تنبيهات المخزون
                </h3>
                <Badge variant="danger" size="sm">
                  {inventoryAlerts.filter((a) => a.variant === "danger").length}{" "}
                  حرجة
                </Badge>
              </div>
            }
          >
            <div className="space-y-2">
              {inventoryAlerts.map((alert) => (
                <div
                  key={alert.sku}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover/50 transition-colors"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                      alert.variant === "danger"
                        ? "bg-danger-light"
                        : "bg-warning-light"
                    )}
                  >
                    <AlertCircle
                      size={16}
                      className={
                        alert.variant === "danger"
                          ? "text-danger"
                          : "text-warning"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text truncate">
                        {alert.product}
                      </p>
                      <span
                        className={cn(
                          "text-sm font-bold shrink-0 mr-2",
                          alert.variant === "danger"
                            ? "text-danger"
                            : "text-warning"
                        )}
                      >
                        {alert.stock}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-text-muted">
                        {alert.sku}
                      </span>
                      <span className="text-xs text-text-muted">
                        الحد الأدنى: {alert.threshold}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          custom={11}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">
                  سجل النشاطات
                </h3>
                <Activity size={18} className="text-text-muted" />
              </div>
            }
          >
            <div className="space-y-4">
              {activityItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          item.bg
                        )}
                      >
                        <Icon size={14} className={item.color} />
                      </div>
                      {idx < activityItems.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-4 bg-border" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm text-text leading-snug">
                        {item.text}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                        <Clock size={11} />
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 5: Monthly Goal + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly Goal Tracker */}
        <motion.div
          custom={12}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card
            header={
              <h3 className="text-lg font-semibold text-text">
                هدف المبيعات الشهري
              </h3>
            }
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">المحقق</p>
                  <p className="text-2xl font-bold text-text mt-0.5">
                    {formatCurrency(375000)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-text-muted">المتوقع</p>
                  <p className="text-2xl font-bold text-text-muted mt-0.5">
                    {formatCurrency(500000)}
                  </p>
                </div>
              </div>
              <Progress value={75} size="md" color="primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  متبقي {formatCurrency(125000)}
                </span>
                <Badge variant="primary" size="sm">
                  ٧٥٪
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-xl font-bold text-text">١,٢٣٤</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    إجمالي الطلبات
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-success">↑ ١٨٪</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    مقارنة بالشهر السابق
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          custom={13}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card
            header={
              <h3 className="text-lg font-semibold text-text">إجراءات سريعة</h3>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border hover:bg-surface-hover/50 hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                        action.color
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-medium text-text-secondary text-center">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
