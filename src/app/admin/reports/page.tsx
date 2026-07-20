"use client";

import { useState, useCallback, useMemo } from "react";
import { Download, TrendingUp, Package, Users, Tag, CreditCard, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

const ReportCharts = dynamic(() => import("./ReportCharts"), {
  loading: () => <div className="h-80 animate-pulse bg-border rounded-xl" />,
  ssr: false,
});

const topProducts = [
  { product: "سماعات لاسلكية برو", quantity: 342, revenue: 127140 },
  { product: "شاحن لاسلكي سريع", quantity: 289, revenue: 43350 },
  { product: "كفر هاتف سيليكون", quantity: 567, revenue: 28350 },
  { product: "سماعات أذن بلوتوث", quantity: 198, revenue: 55440 },
  { product: "حافظة آيباد بلوتوث", quantity: 156, revenue: 62400 },
];

const revenueByCategory = [
  { category: "إلكترونيات", revenue: 285000 },
  { category: "أزياء", revenue: 145000 },
  { category: "_home", revenue: 98000 },
  { category: "رياضة", revenue: 67000 },
  { category: "كتب", revenue: 42000 },
];

const orderStatusData = [
  { status: "مكتمل", count: 890, percentage: 72 },
  { status: "قيد التنفيذ", count: 145, percentage: 12 },
  { status: "قيد الشحن", count: 89, percentage: 7 },
  { status: "ملغي", count: 65, percentage: 5 },
  { status: "مرتجع", count: 45, percentage: 4 },
];

const customerData = [
  { name: "أحمد العلي", email: "ahmed@email.com", orders: 28, totalSpent: 12500, lastOrder: "2026-07-18" },
  { name: "فاطمة الراشد", email: "fatima@email.com", orders: 22, totalSpent: 9800, lastOrder: "2026-07-19" },
  { name: "خالد السعيد", email: "khalid@email.com", orders: 19, totalSpent: 8200, lastOrder: "2026-07-17" },
  { name: "نورة المطيري", email: "noura@email.com", orders: 15, totalSpent: 7500, lastOrder: "2026-07-16" },
  { name: "عبدالله العمري", email: "abdullah@email.com", orders: 12, totalSpent: 6300, lastOrder: "2026-07-15" },
];

const marketingData = [
  { campaign: "عرض الصيف", impressions: 45000, clicks: 3200, conversions: 180, spend: 5400, revenue: 27000 },
  { campaign: "العودة للمدارس", impressions: 32000, clicks: 2800, conversions: 150, spend: 4200, revenue: 22500 },
  { campaign: "عرض الأعضاء VIP", impressions: 12000, clicks: 1500, conversions: 95, spend: 1800, revenue: 19000 },
  { campaign: "كوبونات Ramadan", impressions: 28000, clicks: 2100, conversions: 120, spend: 3500, revenue: 18000 },
];

const paymentData = [
  { method: "بطاقة ائتمان", transactions: 520, amount: 245000, failed: 12, refunded: 8 },
  { method: "مدى", transactions: 310, amount: 128000, failed: 5, refunded: 3 },
  { method: "الدفع عند الاستلام", transactions: 180, amount: 89000, failed: 0, refunded: 15 },
  { method: "STC Pay", transactions: 95, amount: 42000, failed: 2, refunded: 1 },
  { method: "تحويل بنكي", transactions: 65, amount: 38000, failed: 3, refunded: 0 },
];

const productAnalytics = [
  { category: "إلكترونيات", views: 45200, conversions: 3200 },
  { category: "أزياء", views: 38100, conversions: 2800 },
  { category: "منزل", views: 29400, conversions: 1950 },
  { category: "رياضة", views: 22800, conversions: 1600 },
  { category: "كتب", views: 18500, conversions: 1100 },
];

const reportTabs = [
  { key: "sales", label: "المبيعات", icon: <TrendingUp size={14} /> },
  { key: "orders", label: "الطلبات", icon: <Package size={14} /> },
  { key: "customers", label: "العملاء", icon: <Users size={14} /> },
  { key: "products", label: "المنتجات", icon: <Package size={14} /> },
  { key: "marketing", label: "التسويق", icon: <Tag size={14} /> },
  { key: "payments", label: "المدفوعات", icon: <CreditCard size={14} /> },
];

function SalesTab() {
  const productColumns = [
    { key: "product" as const, label: "المنتج", sortable: true },
    { key: "quantity" as const, label: "الكمية المباعة", sortable: true },
    { key: "revenue" as const, label: "الإيراد", sortable: true, render: (value: unknown) => formatCurrency(value as number) },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<TrendingUp size={20} />} label="إجمالي المبيعات" value="456,789 ر.س" change="+18.2%" changeType="up" color="primary" />
        <StatCard icon={<TrendingUp size={20} />} label="متوسط الطلب" value="370 ر.س" change="+5.3%" changeType="up" color="success" />
        <StatCard icon={<TrendingUp size={20} />} label="إجمالي الخصومات" value="23,456 ر.س" change="+12.1%" changeType="up" color="warning" />
        <StatCard icon={<TrendingUp size={20} />} label="الإيراد الصافي" value="433,333 ر.س" change="+15.4%" changeType="up" color="info" />
      </div>
      <ReportCharts activeTab="sales" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h3 className="font-semibold text-text">أكثر المنتجات مبيعاً</h3>}>
          <DataTable columns={productColumns} data={topProducts} rowKey="product" emptyMessage="لا توجد بيانات" />
        </Card>
        <Card header={<h3 className="font-semibold text-text">الإيرادات حسب التصنيف</h3>}>
          <DataTable columns={[{ key: "category" as const, label: "التصنيف", sortable: true }, { key: "revenue" as const, label: "الإيراد", sortable: true, render: (value: unknown) => formatCurrency(value as number) }]} data={revenueByCategory} rowKey="category" emptyMessage="لا توجد بيانات" />
        </Card>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<Package size={20} />} label="إجمالي الطلبات" value="1,234" change="+8.2%" changeType="up" color="primary" />
        <StatCard icon={<Package size={20} />} label="طلبات قيد التنفيذ" value="45" change="-12%" changeType="down" color="warning" />
        <StatCard icon={<Package size={20} />} label="متوسط قيمة الطلب" value="370 ر.س" change="+5.3%" changeType="up" color="success" />
        <StatCard icon={<Package size={20} />} label="معدل الإلغاء" value="2.1%" change="-0.5%" changeType="down" color="danger" />
      </div>
      <ReportCharts activeTab="orders" />
      <Card header={<h3 className="font-semibold text-text">حالة الطلبات</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {orderStatusData.map((item) => (
            <div key={item.status} className="p-4 rounded-xl border border-border text-center">
              <p className="text-2xl font-bold text-text">{item.count}</p>
              <p className="text-sm text-text-secondary mt-1">{item.status}</p>
              <p className="text-xs text-text-muted mt-1">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CustomersTab() {
  const customerColumns = [
    { key: "name" as const, label: "العميل", sortable: true },
    { key: "email" as const, label: "البريد" },
    { key: "orders" as const, label: "الطلبات", sortable: true },
    { key: "totalSpent" as const, label: "إجمالي المشتريات", sortable: true, render: (value: unknown) => formatCurrency(value as number) },
    { key: "lastOrder" as const, label: "آخر طلب", sortable: true },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<Users size={20} />} label="إجمالي العملاء" value="5,678" change="+15.3%" changeType="up" color="primary" />
        <StatCard icon={<Users size={20} />} label="العملاء النشطون" value="3,240" change="+8.1%" changeType="up" color="success" />
        <StatCard icon={<Users size={20} />} label="عملاء جدد" value="420" change="+22%" changeType="up" color="info" />
        <StatCard icon={<Users size={20} />} label="متوسط القيمةlifetime" value="520 ر.س" change="+3.2%" changeType="up" color="warning" />
      </div>
      <ReportCharts activeTab="customers" />
      <Card header={<h3 className="font-semibold text-text">أكثر العملاء إنفاقاً</h3>}>
        <DataTable columns={customerColumns} data={customerData} rowKey="email" emptyMessage="لا توجد بيانات" />
      </Card>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<Package size={20} />} label="إجمالي المنتجات" value="342" change="+12" changeType="up" color="primary" />
        <StatCard icon={<Package size={20} />} label="مخزون منخفض" value="18" change="+3" changeType="up" color="warning" />
        <StatCard icon={<Package size={20} />} label="نفذ من المخزون" value="5" change="+1" changeType="up" color="danger" />
        <StatCard icon={<Package size={20} />} label="معدل التحويل" value="3.2%" change="+0.5%" changeType="up" color="success" />
      </div>
      <Card header={<h3 className="font-semibold text-text">تحليل المنتجات حسب التصنيف</h3>}>
        <DataTable columns={[{ key: "category" as const, label: "الفئة", sortable: true }, { key: "views" as const, label: "المشاهدات", sortable: true }, { key: "conversions" as const, label: "التحويلات", sortable: true }]} data={productAnalytics} rowKey="category" emptyMessage="لا توجد بيانات" />
      </Card>
    </div>
  );
}

function MarketingTab() {
  const campaignColumns = [
    { key: "campaign" as const, label: "الحملة", sortable: true },
    { key: "impressions" as const, label: "المشاهدات", sortable: true, render: (v: unknown) => Number(v).toLocaleString("ar-SA") },
    { key: "clicks" as const, label: "النقرات", sortable: true, render: (v: unknown) => Number(v).toLocaleString("ar-SA") },
    { key: "conversions" as const, label: "التحويلات", sortable: true },
    { key: "spend" as const, label: "المصروف", sortable: true, render: (v: unknown) => formatCurrency(v as number) },
    { key: "revenue" as const, label: "الإيراد", sortable: true, render: (v: unknown) => <span className="font-semibold text-success">{formatCurrency(v as number)}</span> },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<Tag size={20} />} label="الحملات النشطة" value="4" color="primary" />
        <StatCard icon={<Tag size={20} />} label="إجمالي المشاهدات" value="117,000" color="info" />
        <StatCard icon={<Tag size={20} />} label="إجمالي النقرات" value="9,600" color="success" />
        <StatCard icon={<Tag size={20} />} label="معدل التحويل" value="3.8%" change="+0.8%" changeType="up" color="warning" />
      </div>
      <ReportCharts activeTab="marketing" />
      <Card header={<h3 className="font-semibold text-text">أداء الحملات</h3>}>
        <DataTable columns={campaignColumns} data={marketingData} rowKey="campaign" emptyMessage="لا توجد بيانات" />
      </Card>
    </div>
  );
}

function PaymentsTab() {
  const paymentColumns = [
    { key: "method" as const, label: "الطريقة", sortable: true },
    { key: "transactions" as const, label: "المعاملات", sortable: true },
    { key: "amount" as const, label: "المبلغ", sortable: true, render: (v: unknown) => formatCurrency(v as number) },
    { key: "failed" as const, label: "فاشلة", sortable: true, render: (v: unknown) => <span className={Number(v) > 0 ? "text-danger" : "text-success"}>{String(v)}</span> },
    { key: "refunded" as const, label: "مرتجعة", sortable: true, render: (v: unknown) => <span className={Number(v) > 0 ? "text-warning" : "text-success"}>{String(v)}</span> },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<CreditCard size={20} />} label="إجمالي المعاملات" value="1,170" color="primary" />
        <StatCard icon={<CreditCard size={20} />} label="إجمالي المبلغ" value="542,000 ر.س" color="success" />
        <StatCard icon={<CreditCard size={20} />} label="معاملات فاشلة" value="22" color="danger" />
        <StatCard icon={<CreditCard size={20} />} label="مرتجعات" value="27" color="warning" />
      </div>
      <Card header={<h3 className="font-semibold text-text">تفصيل طرق الدفع</h3>}>
        <DataTable columns={paymentColumns} data={paymentData} rowKey="method" emptyMessage="لا توجد بيانات" />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <h4 className="font-semibold text-text mb-3">المدفوعات المعلقة</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">تحويل بنكي معلق</span><span className="font-medium">{formatCurrency(12500)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">دفعة Stripe معلقة</span><span className="font-medium">{formatCurrency(8900)}</span></div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2"><span>الإجمالي</span><span className="text-primary">{formatCurrency(21400)}</span></div>
          </div>
        </Card>
        <Card padding="md">
          <h4 className="font-semibold text-text mb-3">المرتجعات الأخيرة</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">مرتجع #ORD-1234</span><span className="text-danger font-medium">-{formatCurrency(371)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">مرتجع #ORD-1228</span><span className="text-danger font-medium">-{formatCurrency(150)}</span></div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2"><span>الإجمالي</span><span className="text-danger">{formatCurrency(521)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { info } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState("month");

  const handleExport = useCallback(() => {
    info("جاري التصدير", "تم بدء تصدير التقرير بصيغة CSV...");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="التقارير" subtitle="تحليل البيانات وإعداد التقارير الشاملة" actions={
        <div className="flex gap-2">
          <Select options={[{ value: "today", label: "اليوم" }, { value: "week", label: "هذا الأسبوع" }, { value: "month", label: "هذا الشهر" }, { value: "quarter", label: "هذا الربع" }, { value: "year", label: "هذا العام" }, { value: "custom", label: "فترة مخصصة" }]} value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
          <Button variant="secondary" icon={<Download size={16} />} onClick={handleExport}>تصدير CSV</Button>
        </div>
      } />
      <Tabs tabs={reportTabs} onChange={setActiveTab}>
        <div>
          {activeTab === "sales" && <SalesTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "marketing" && <MarketingTab />}
          {activeTab === "payments" && <PaymentsTab />}
        </div>
      </Tabs>
    </div>
  );
}
