"use client";

import {
  DollarSign,
  ShoppingCart,
  Eye,
  Percent,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  CreditCard,
  UserPlus,
  Package,
  ArrowUpRight,
  Activity,
  Target,
  Star,
  Users,
  ShoppingCartIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";

const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  loading: () => <div className="h-80 animate-pulse bg-border rounded-xl" />,
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const keyMetrics = [
  {
    icon: DollarSign,
    label: "مبيعات اليوم",
    value: "12,450",
    unit: "ر.س",
    change: "+15%",
    changeType: "up" as const,
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: ShoppingCart,
    label: "طلبات اليوم",
    value: "48",
    unit: "",
    change: "+8",
    changeType: "up" as const,
    color: "text-success",
    bg: "bg-success-light",
  },
  {
    icon: Eye,
    label: "زوار مباشر",
    value: "234",
    unit: "",
    change: undefined,
    changeType: "neutral" as const,
    color: "text-info",
    bg: "bg-info-light",
  },
  {
    icon: Percent,
    label: "معدل التحويل",
    value: "3.2",
    unit: "%",
    change: "+0.4%",
    changeType: "up" as const,
    color: "text-warning",
    bg: "bg-warning-light",
  },
  {
    icon: ShoppingBag,
    label: "سلة متروكة",
    value: "12",
    unit: "",
    change: "فرص بيع",
    changeType: "neutral" as const,
    color: "text-danger",
    bg: "bg-danger-light",
  },
];

const recentOrders = [
  { id: "#ORD-7841", customer: "أحمد محمد علي", product: "آيفون 15 برو", status: "تم التسليم", total: 4999, statusVariant: "success" as const, time: "منذ 5 دقائق" },
  { id: "#ORD-7840", customer: "سارة العلي", product: "سماعات أبل لاسلكية", status: "قيد الشحن", total: 899, statusVariant: "info" as const, time: "منذ 12 دقيقة" },
  { id: "#ORD-7839", customer: "خالد الشمري", product: "ساعة سامسونج الذكية", status: "قيد المعالجة", total: 1299, statusVariant: "warning" as const, time: "منذ 25 دقيقة" },
  { id: "#ORD-7838", customer: "نورة الحربي", product: "حقيبة نايكي رياضية", status: "تم التسليم", total: 350, statusVariant: "success" as const, time: "منذ 40 دقيقة" },
  { id: "#ORD-7837", customer: "عبدالله السعيد", product: "دورة تسويق رقمي", status: "ملغي", total: 599, statusVariant: "danger" as const, time: "منذ ساعة" },
];

const topProducts = [
  { name: "آيفون 15 برو ماكس", sales: 156, revenue: 780000, icon: "📱" },
  { name: "سماعات أبل برو", sales: 234, revenue: 210600, icon: "🎧" },
  { name: "ساعة سامسونج الذكية", sales: 89, revenue: 115600, icon: "⌚" },
  { name: "دورة التسويق الرقمي", sales: 312, revenue: 93600, icon: "📚" },
  { name: "حقيبة نايكي الرياضية", sales: 67, revenue: 23450, icon: "🎒" },
];

const abandonedCarts = [
  { customer: "محمد العلي", items: 3, total: 2450, time: "منذ 15 دقيقة", product: "آيفون 15 + سماعات" },
  { customer: "فاطمة الزهراء", items: 1, total: 899, time: "منذ 30 دقيقة", product: "سماعات لاسلكية" },
  { customer: "عمر بن سعود", items: 2, total: 1580, time: "منذ 45 دقيقة", product: "ساعة ذكية + شاحن" },
  { customer: "ريم الحربي", items: 1, total: 599, time: "منذ ساعة", product: "دورة تصميم" },
];

const activityItems = [
  { icon: Package, text: "تم إضافة منتج جديد: آيفون 15 برو", time: "منذ 5 دقائق", color: "text-info", bg: "bg-info-light" },
  { icon: CheckCircle2, text: "تم تأكيد الطلب #ORD-7841", time: "منذ 12 دقيقة", color: "text-success", bg: "bg-success-light" },
  { icon: UserPlus, text: "عميل جديد: سارة العلي", time: "منذ 25 دقيقة", color: "text-primary", bg: "bg-primary-light" },
  { icon: CreditCard, text: "تم استلام دفعة بقيمة 4,999 ر.س", time: "منذ 40 دقيقة", color: "text-success", bg: "bg-success-light" },
  { icon: AlertCircle, text: "تم إرجاع الطلب #ORD-7832", time: "منذ ساعة", color: "text-warning", bg: "bg-warning-light" },
  { icon: Truck, text: "تم شحن 3 طلبات", time: "منذ ساعتين", color: "text-info", bg: "bg-info-light" },
];

const mostVisitedPages = [
  { page: "/products/iphone-15-pro", views: 1245, bounce: "24%" },
  { page: "/categories/electronics", views: 892, bounce: "31%" },
  { page: "/offers/summer-sale", views: 756, bounce: "18%" },
  { page: "/products/samsung-galaxy", views: 634, bounce: "28%" },
  { page: "/blog/buying-guide", views: 423, bounce: "42%" },
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">مرحباً، المدير 👋</h1>
            <p className="mt-1 text-sm text-text-muted">{today} — آخر دخول: اليوم ٠٨:٣٠ ص</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors self-start"
          >
            <Package size={16} />
            إضافة منتج
          </Link>
        </div>
      </motion.div>

      {/* Row 2: Key Metrics Bar */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-surface rounded-xl border border-border p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", metric.bg)}>
                    <Icon size={20} className={metric.color} />
                  </div>
                  {metric.changeType === "up" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-success">
                      <TrendingUp size={14} />
                      {metric.change}
                    </span>
                  )}
                  {metric.changeType === "neutral" && metric.change && (
                    <span className="text-xs font-medium text-text-muted">
                      {metric.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-text">
                  {metric.value}
                  {metric.unit && <span className="text-sm font-normal text-text-muted mr-1">{metric.unit}</span>}
                </p>
                <p className="text-xs text-text-muted mt-1">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Row 3: Monthly Goal Tracker */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                <Target size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">هدف المبيعات الشهرية</p>
                <p className="text-xs text-text-muted">المتوقع: 500,000 ر.س</p>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">المحقق: 375,000 ر.س</span>
                <span className="text-sm font-bold text-primary">75%</span>
              </div>
              <Progress value={75} size="lg" color="primary" />
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="text-lg font-bold text-text">1,234</p>
                <p className="text-xs text-text-muted">إجمالي الطلبات</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">↑ 18%</p>
                <p className="text-xs text-text-muted">مقارنة بالشهر السابق</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Row 4: Charts Section */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
        <DashboardCharts />
      </motion.div>

      {/* Row 5: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">آخر الطلبات</h3>
                <Link href="/admin/orders" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
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
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">رقم الطلب</th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">العميل</th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">المنتج</th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">الحالة</th>
                    <th className="pb-3 text-right font-medium text-text-muted text-xs">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border-light last:border-0">
                      <td className="py-3 text-text font-medium">{order.id}</td>
                      <td className="py-3 text-text">{order.customer}</td>
                      <td className="py-3 text-text-muted text-xs max-w-[120px] truncate">{order.product}</td>
                      <td className="py-3">
                        <Badge variant={order.statusVariant} dot>{order.status}</Badge>
                      </td>
                      <td className="py-3 text-text font-medium">{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">المنتجات الأكثر مبيعاً</h3>
                <Badge variant="success">Top 5</Badge>
              </div>
            }
          >
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="text-lg">{product.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text truncate">{product.name}</p>
                      <span className="text-sm font-bold text-text shrink-0">{formatCurrency(product.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-text-muted">{product.sales} مبيعة</span>
                      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(product.sales / 312) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 6: Abandoned Carts + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Abandoned Carts */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">السلة المتروكة</h3>
                <Badge variant="danger">{abandonedCarts.length} فرص</Badge>
              </div>
            }
          >
            <div className="space-y-3">
              {abandonedCarts.map((cart, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-light shrink-0">
                    <ShoppingBag size={18} className="text-danger" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text">{cart.customer}</p>
                      <span className="text-sm font-bold text-text shrink-0">{formatCurrency(cart.total)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{cart.product} — {cart.items} منتجات</p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {cart.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">سجل النشاطات</h3>
                <Activity size={16} className="text-text-muted" />
              </div>
            }
          >
            <div className="space-y-4">
              {activityItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", item.bg)}>
                      <Icon size={16} className={item.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text leading-snug">{item.text}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                        <Clock size={12} />
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

      {/* Row 7: Most Visited Pages */}
      <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
        <Card header={<h3 className="font-semibold text-text">الصفحات الأكثر زيارة</h3>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-right font-medium text-text-muted text-xs">الصفحة</th>
                  <th className="pb-3 text-right font-medium text-text-muted text-xs">الزيارات</th>
                  <th className="pb-3 text-right font-medium text-text-muted text-xs">معدل الارتداد</th>
                  <th className="pb-3 text-right font-medium text-text-muted text-xs">الشعبية</th>
                </tr>
              </thead>
              <tbody>
                {mostVisitedPages.map((page) => {
                  const maxViews = mostVisitedPages[0].views;
                  return (
                    <tr key={page.page} className="border-b border-border-light last:border-0">
                      <td className="py-3 text-text font-medium font-mono text-xs">{page.page}</td>
                      <td className="py-3 text-text">{page.views.toLocaleString("ar-SA")}</td>
                      <td className="py-3 text-text-muted">{page.bounce}</td>
                      <td className="py-3">
                        <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(page.views / maxViews) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
