"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, AlertTriangle, ShoppingCart, Package, ClipboardList, CreditCard, Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function SectionLabel({ icon: Icon, label }: { icon: typeof ShoppingCart; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon size={16} className="text-primary" />
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{label}</h3>
    </div>
  );
}

export default function StoreSettingsPage() {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [storeStatus, setStoreStatus] = useState("active");
  const [maintenanceMsg, setMaintenanceMsg] = useState("المتجر في وضع الصيانة حالياً. سنعود قريباً!");
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [cartExpiration, setCartExpiration] = useState(30);
  const [minOrderAmount, setMinOrderAmount] = useState(50);
  const [allowReviews, setAllowReviews] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [outOfStockBehavior, setOutOfStockBehavior] = useState("hide");
  const [autoApprove, setAutoApprove] = useState(false);
  const [orderPrefix, setOrderPrefix] = useState("ORD");
  const [orderStartNumber, setOrderStartNumber] = useState(1001);
  const [requirePhone, setRequirePhone] = useState(true);
  const [requireAddress, setRequireAddress] = useState(true);
  const [requireTerms, setRequireTerms] = useState(true);
  const [emailOnOrder, setEmailOnOrder] = useState(true);
  const [smsOnOrder, setSmsOnOrder] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState("24");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);

  const handleSave = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setLoading(false); success("تم الحفظ", "تم حفظ إعدادات المتجر بنجاح"); }, 500);
  }, [success]);

  return (
    <div className="space-y-6">
      <PageHeader title="إعدادات المتجر" subtitle="تخصيص إعدادات المتجر وسلوك الموقع" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}>
          <Card header={<SectionLabel icon={ShoppingCart} label="حالة المتجر" />} padding="md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text">حالة المتجر</p>
                  <p className="text-xs text-text-muted">تحديد ما إذا كان المتجر متاحاً للزوار</p>
                </div>
                <Badge variant={storeStatus === "active" ? "success" : "warning"} dot>{storeStatus === "active" ? "نشط" : "صيانة"}</Badge>
              </div>
              <Select label="حالة المتجر" options={[{ value: "active", label: "نشط" }, { value: "maintenance", label: "صيانة" }]} value={storeStatus} onChange={(e) => setStoreStatus(e.target.value)} />
              {storeStatus === "maintenance" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-warning/30 bg-warning-light p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-warning" />
                    <p className="text-sm font-medium text-warning">وضع الصيانة مفعّل</p>
                  </div>
                  <Textarea label="رسالة الصيانة" rows={3} value={maintenanceMsg} onChange={(e) => setMaintenanceMsg(e.target.value)} />
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
          <Card header={<SectionLabel icon={ShoppingCart} label="إعدادات السلة" />} padding="md">
            <div className="space-y-5">
              <Toggle checked={guestCheckout} onChange={setGuestCheckout} label="السماح بالشراء كضيف" description="السماح للعملاء بالشراء بدون إنشاء حساب" />
              <Input label="مدة انتهاء السلة (دقيقة)" type="number" value={cartExpiration} onChange={(e) => setCartExpiration(Number(e.target.value))} helperText="مدة الاحتفاظ بالسلة قبل الحذف التلقائي" />
              <Input label="الحد الأدنى للمبلغ (ر.س)" type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(Number(e.target.value))} />
              <Input label="الحد الأدنى للشحن المجاني (ر.س)" type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} helperText="الطلبات التي تتجاوز هذا المبلغ تحصل على شحن مجاني" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }}>
          <Card header={<SectionLabel icon={Package} label="إعدادات المنتجات" />} padding="md">
            <div className="space-y-5">
              <Toggle checked={allowReviews} onChange={setAllowReviews} label="السماح بالتقييمات" description="السماح للعملاء بتقييم المنتجات" />
              <Toggle checked={showStock} onChange={setShowStock} label="عرض عدد المخزون" description="إظهار عدد القطع المتاحة للعملاء" />
              <Select label="السلوك عند نفاد المخزون" options={[{ value: "hide", label: "إخفاء المنتج" }, { value: "show", label: "عرض المنتج (غير متاح)" }, { value: "preorder", label: "السماح بالطلب المسبق" }]} value={outOfStockBehavior} onChange={(e) => setOutOfStockBehavior(e.target.value)} />
              <Select label="المنتجات في كل صفحة" options={[{ value: "12", label: "12 منتج" }, { value: "24", label: "24 منتج" }, { value: "36", label: "36 منتج" }, { value: "48", label: "48 منتج" }]} value={productsPerPage} onChange={(e) => setProductsPerPage(e.target.value)} />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <Card header={<SectionLabel icon={ClipboardList} label="إعدادات الطلبات" />} padding="md">
            <div className="space-y-5">
              <Toggle checked={autoApprove} onChange={setAutoApprove} label="الموافقة التلقائية على الطلبات" description="قبول الطلبات فوراً بدون مراجعة يدوية" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="بادئة رقم الطلب" value={orderPrefix} onChange={(e) => setOrderPrefix(e.target.value)} dir="ltr" />
                <Input label="الرقم الابتدائي" type="number" value={orderStartNumber} onChange={(e) => setOrderStartNumber(Number(e.target.value))} />
              </div>
              <div className="p-3 rounded-xl bg-bg border border-border">
                <p className="text-xs text-text-muted mb-1">معاينة رقم الطلب</p>
                <p className="font-mono text-lg font-bold text-primary">{orderPrefix}-{String(orderStartNumber).padStart(5, "0")}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.25 }}>
          <Card header={<SectionLabel icon={CreditCard} label="إعدادات الدفع والشحن" />} padding="md">
            <div className="space-y-5">
              <Toggle checked={requirePhone} onChange={setRequirePhone} label="إجبار رقم الهاتف" description="طلب رقم الهاتف أثناء الشراء" />
              <Toggle checked={requireAddress} onChange={setRequireAddress} label="إجبار العنوان" description="طلب العنوان الكامل أثناء الشراء" />
              <Toggle checked={requireTerms} onChange={setRequireTerms} label="إجبار قبول الشروط" description="إجبار العميل على قبول الشروط والأحكام" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
          <Card header={<SectionLabel icon={Bell} label="إعدادات الإشعارات" />} padding="md">
            <div className="space-y-5">
              <Toggle checked={emailOnOrder} onChange={setEmailOnOrder} label="إشعار بالبريد عند الطلب" description="إرسال بريد إلكتروني للمدير عند كل طلب جديد" />
              <Toggle checked={smsOnOrder} onChange={setSmsOnOrder} label="إشعار بالرسائل عند الطلب" description="إرسال رسالة نصية عند كل طلب جديد" />
              <Toggle checked={whatsappNotif} onChange={setWhatsappNotif} label="إشعارات واتساب" description="إرسال إشعارات عبر واتساب للأوامر الجديدة" />
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.35 }} className="flex justify-end sticky bottom-4 z-10">
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-xl p-3 shadow-lg">
          <Button onClick={handleSave} loading={loading} icon={<Save size={16} />}>حفظ التغييرات</Button>
        </div>
      </motion.div>
    </div>
  );
}
