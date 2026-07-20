"use client";

import { useState, useCallback } from "react";
import { CreditCard, Smartphone, Wallet, Banknote, Building2, Settings2, Send, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: typeof CreditCard;
  active: boolean;
  color: string;
  bg: string;
  config: { apiKey?: string; secretKey?: string; webhookUrl?: string; testMode?: boolean; merchantId?: string };
  currencies: string[];
};

const defaultMethods: PaymentMethod[] = [
  { id: "stripe", name: "Stripe", description: "البطاقات الائتمانية: Visa, MasterCard, AMEX", icon: CreditCard, active: true, color: "text-primary", bg: "bg-primary-light", config: { apiKey: "", secretKey: "", webhookUrl: "https://mystore.com/api/webhooks/stripe", testMode: true }, currencies: ["SAR", "USD", "EUR"] },
  { id: "tap", name: "Tap Payments", description: "بوابة دفع متكاملة للمنطقة العربية", icon: CreditCard, active: false, color: "text-success", bg: "bg-success-light", config: { apiKey: "", secretKey: "", testMode: true }, currencies: ["SAR", "AED", "KWD", "BHD", "QAR", "OMR", "EGP"] },
  { id: "hyperpay", name: "HyperPay", description: "حلول الدفع الإلكترونية المتقدمة", icon: CreditCard, active: false, color: "text-info", bg: "bg-info-light", config: { merchantId: "", apiKey: "", testMode: true }, currencies: ["SAR", "AED"] },
  { id: "paytabs", name: "PayTabs", description: "بوابة دفع آمنة وسريعة", icon: CreditCard, active: false, color: "text-warning", bg: "bg-warning-light", config: { apiKey: "", merchantId: "", testMode: true }, currencies: ["SAR", "AED", "EGP", "KWD"] },
  { id: "mada", name: "مدى", description: "الدفع عبر بطاقات مدى السعودية", icon: Wallet, active: true, color: "text-success", bg: "bg-success-light", config: { apiKey: "" }, currencies: ["SAR"] },
  { id: "stc-pay", name: "STC Pay", description: "الدفع عبر محفظة STC Pay", icon: Smartphone, active: true, color: "text-info", bg: "bg-info-light", config: { apiKey: "" }, currencies: ["SAR"] },
  { id: "apple-pay", name: "Apple Pay", description: "الدفع عبر Apple Pay للأجهزة المتوافقة", icon: Smartphone, active: false, color: "text-text-secondary", bg: "bg-surface-hover", config: {}, currencies: ["SAR", "USD", "EUR"] },
  { id: "cod", name: "الدفع عند الاستلام", description: "الدفع نقداً عند استلام الطلب", icon: Banknote, active: true, color: "text-warning", bg: "bg-warning-light", config: {}, currencies: ["SAR", "AED", "EGP"] },
  { id: "bank", name: "تحويل بنكي", description: "التحويل المباشر إلى الحساب البنكي", icon: Building2, active: false, color: "text-text-secondary", bg: "bg-surface-hover", config: {}, currencies: ["SAR", "AED", "USD"] },
];

export default function PaymentSettingsPage() {
  const { success, info } = useToast();
  const [methods, setMethods] = useState(defaultMethods);
  const [configModal, setConfigModal] = useState<PaymentMethod | null>(null);
  const [configForm, setConfigForm] = useState<{ apiKey: string; secretKey: string; webhookUrl: string; testMode: boolean; merchantId: string }>({ apiKey: "", secretKey: "", webhookUrl: "", testMode: true, merchantId: "" });

  const toggleMethod = useCallback((id: string) => {
    setMethods((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
    const method = methods.find((m) => m.id === id);
    success("تم التغيير", `تم ${method?.active ? "تعطيل" : "تفعيل"} ${method?.name}`);
  }, [methods, success]);

  const openConfig = useCallback((m: PaymentMethod) => {
    setConfigModal(m);
    setConfigForm({ apiKey: m.config.apiKey || "", secretKey: m.config.secretKey || "", webhookUrl: m.config.webhookUrl || "", testMode: m.config.testMode ?? true, merchantId: m.config.merchantId || "" });
  }, []);

  const handleSaveConfig = useCallback(() => {
    if (!configModal) return;
    setMethods((prev) => prev.map((m) => m.id === configModal.id ? { ...m, config: { ...configForm } } : m));
    success("تم الحفظ", `تم حفظ إعدادات ${configModal.name}`);
    setConfigModal(null);
  }, [configModal, configForm, success]);

  const handleTestPayment = useCallback(() => {
    info("جاري الاختبار", "تم إرسال طلب اختباري لبوابة الدفع...");
  }, [info]);

  const activeCount = methods.filter((m) => m.active).length;

  return (
    <div className="space-y-6">
      <PageHeader title="طرق الدفع" subtitle={`إدارة وتكوين طرق الدفع المتاحة (${activeCount} نشطة)`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.id} padding="md" className={cn("transition-all", method.active ? "border-border" : "opacity-70")}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", method.bg)}><span className={method.color}><Icon size={24} /></span></div>
                <Toggle checked={method.active} onChange={() => toggleMethod(method.id)} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text">{method.name}</h3>
                  <Badge variant={method.active ? "success" : "default"} dot>{method.active ? "نشط" : "معطّل"}</Badge>
                </div>
                <p className="text-sm text-text-secondary">{method.description}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {method.currencies.map((c) => <Badge key={c} variant="default" className="text-[10px]">{c}</Badge>)}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="secondary" size="sm" fullWidth icon={<Settings2 size={14} />} onClick={() => openConfig(method)}>تكوين</Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card header={<h3 className="font-semibold text-text">طرق الدفع المتاحة للعملاء</h3>} padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["بطاقة ائتمان", "تحويل بنكي", "الدفع عند الاستلام", "محفظة إلكترونية"].map((method) => (
            <div key={method} className="flex items-center gap-2 p-3 rounded-lg border border-border">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><CreditCard size={14} className="text-primary" /></div>
              <span className="text-sm font-medium text-text">{method}</span>
            </div>
          ))}
        </div>
      </Card>

      {configModal && (
        <Modal open onClose={() => setConfigModal(null)} title={`تكوين — ${configModal.name}`} size="md">
          <div className="space-y-4">
            {configModal.id === "stripe" && (
              <>
                <Input label="Stripe Publishable Key" value={configForm.apiKey} onChange={(e) => setConfigForm((p) => ({ ...p, apiKey: e.target.value }))} placeholder="pk_live_..." dir="ltr" />
                <Input label="Stripe Secret Key" value={configForm.secretKey} onChange={(e) => setConfigForm((p) => ({ ...p, secretKey: e.target.value }))} placeholder="sk_live_..." dir="ltr" type="password" />
                <Input label="Webhook URL" value={configForm.webhookUrl} onChange={(e) => setConfigForm((p) => ({ ...p, webhookUrl: e.target.value }))} dir="ltr" />
                <Toggle checked={configForm.testMode} onChange={(v) => setConfigForm((p) => ({ ...p, testMode: v }))} label="وضع الاختبار" description="استخدام مفاتيح الاختبار بدلاً من الإنتاج" />
              </>
            )}
            {(configModal.id === "tap" || configModal.id === "paytabs") && (
              <>
                <Input label="Merchant ID" value={configForm.merchantId} onChange={(e) => setConfigForm((p) => ({ ...p, merchantId: e.target.value }))} dir="ltr" />
                <Input label="API Key" value={configForm.apiKey} onChange={(e) => setConfigForm((p) => ({ ...p, apiKey: e.target.value }))} dir="ltr" />
                <Input label="Secret Key" value={configForm.secretKey} onChange={(e) => setConfigForm((p) => ({ ...p, secretKey: e.target.value }))} dir="ltr" type="password" />
                <Toggle checked={configForm.testMode} onChange={(v) => setConfigForm((p) => ({ ...p, testMode: v }))} label="وضع الاختبار" description="استخدام مفاتيح الاختبار بدلاً من الإنتاج" />
              </>
            )}
            {configModal.id === "hyperpay" && (
              <>
                <Input label="Merchant ID" value={configForm.merchantId} onChange={(e) => setConfigForm((p) => ({ ...p, merchantId: e.target.value }))} dir="ltr" />
                <Input label="Entity ID" value={configForm.apiKey} onChange={(e) => setConfigForm((p) => ({ ...p, apiKey: e.target.value }))} dir="ltr" />
                <Toggle checked={configForm.testMode} onChange={(v) => setConfigForm((p) => ({ ...p, testMode: v }))} label="وضع الاختبار" description="استخدام مفاتيح الاختبار بدلاً من الإنتاج" />
              </>
            )}
            {!["stripe", "tap", "paytabs", "hyperpay"].includes(configModal.id) && (
              <Input label="API Key" value={configForm.apiKey} onChange={(e) => setConfigForm((p) => ({ ...p, apiKey: e.target.value }))} placeholder="أدخل مفتاح API" dir="ltr" />
            )}

            {configForm.testMode && configModal.id !== "cod" && configModal.id !== "bank" && (
              <div className="flex justify-start pt-2">
                <Button variant="outline" size="sm" icon={<Send size={14} />} onClick={handleTestPayment}>إرسال دفعة اختبارية</Button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setConfigModal(null)}>إلغاء</Button>
              <Button onClick={handleSaveConfig}>حفظ الإعدادات</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
