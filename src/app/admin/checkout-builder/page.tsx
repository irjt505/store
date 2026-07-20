"use client";

import { useState, useCallback } from "react";
import { Monitor, Tablet, Smartphone, Save, Eye, Plus, Trash2, GripVertical, ArrowLeft, CreditCard, ShoppingCart, User, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn, generateId } from "@/lib/utils";

type CheckoutField = { id: string; type: "name" | "email" | "phone" | "address" | "city" | "country" | "coupon" | "notes" | "company"; label: string; required: boolean; enabled: boolean };
type CheckoutStep = { id: string; name: string; enabled: boolean; fields: CheckoutField[] };

const defaultSteps: CheckoutStep[] = [
  { id: "info", name: "معلومات العميل", enabled: true, fields: [
    { id: "f1", type: "name", label: "الاسم الكامل", required: true, enabled: true },
    { id: "f2", type: "email", label: "البريد الإلكتروني", required: true, enabled: true },
    { id: "f3", type: "phone", label: "رقم الهاتف", required: false, enabled: true },
    { id: "f4", type: "company", label: "الشركة", required: false, enabled: false },
  ]},
  { id: "payment", name: "الدفع", enabled: true, fields: [
    { id: "f5", type: "coupon", label: "كود الخصم", required: false, enabled: true },
    { id: "f6", type: "notes", label: "ملاحظات الطلب", required: false, enabled: true },
  ]},
  { id: "confirmation", name: "التأكيد", enabled: true, fields: [] },
];

const fieldIcons: Record<string, typeof User> = { name: User, email: Mail, phone: ArrowLeft, address: MapPin, city: MapPin, country: MapPin, coupon: ShoppingCart, notes: Mail, company: User };

export default function CheckoutBuilderPage() {
  const { success } = useToast();
  const [steps, setSteps] = useState(defaultSteps);
  const [activeStep, setActiveStep] = useState("info");
  const [device, setDevice] = useState("desktop");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const currentStep = steps.find((s) => s.id === activeStep);

  const toggleField = useCallback((stepId: string, fieldId: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, fields: s.fields.map((f) => f.id === fieldId ? { ...f, enabled: !f.enabled } : f) } : s));
  }, []);

  const toggleRequired = useCallback((stepId: string, fieldId: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, fields: s.fields.map((f) => f.id === fieldId ? { ...f, required: !f.required } : f) } : s));
  }, []);

  const addField = useCallback((stepId: string) => {
    const newField: CheckoutField = { id: generateId(), type: "notes", label: "حقل جديد", required: false, enabled: true };
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, fields: [...s.fields, newField] } : s));
  }, []);

  const removeField = useCallback((stepId: string, fieldId: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) } : s));
  }, []);

  const toggleStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, enabled: !s.enabled } : s));
  }, []);

  const [showCoupon, setShowCoupon] = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [instantDownload, setInstantDownload] = useState(true);

  const handleSave = useCallback(() => {
    success("تم الحفظ", "تم حفظ تكوين صفحة الدفع بنجاح");
  }, [success]);

  const deviceWidth = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div className="space-y-6">
      <PageHeader title="محرر صفحة الدفع" subtitle="تخصيص تجربة الدفع للعملاء" actions={
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Eye size={16} />} onClick={() => setPreviewOpen(true)}>معاينة</Button>
          <Button icon={<Save size={16} />} onClick={handleSave}>حفظ</Button>
        </div>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="font-semibold text-text mb-3">الخطوات</h3>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={step.id} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all", activeStep === step.id ? "border-primary bg-primary/5" : "border-border hover:bg-surface-hover")} onClick={() => setActiveStep(step.id)}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">{step.name}</p>
                    <p className="text-xs text-text-muted">{step.fields.length} حقول</p>
                  </div>
                  <Toggle checked={step.enabled} onChange={() => toggleStep(step.id)} />
                </div>
              ))}
            </div>
          </Card>

          {currentStep && currentStep.fields.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text">حقول {currentStep.name}</h3>
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => addField(currentStep.id)}>إضافة</Button>
              </div>
              <div className="space-y-2">
                {currentStep.fields.map((field) => {
                  const Icon = fieldIcons[field.type] || User;
                  return (
                    <div key={field.id} className={cn("flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer", selectedField === field.id ? "border-primary bg-primary/5" : "border-border", !field.enabled && "opacity-50")} onClick={() => setSelectedField(field.id)}>
                      <Icon size={14} className="text-text-muted" />
                      <span className="flex-1 text-sm text-text">{field.label}</span>
                      <Toggle checked={field.enabled} onChange={() => toggleField(currentStep.id, field.id)} />
                      {field.enabled && <Button variant="ghost" size="sm" className={cn("text-xs", field.required ? "text-primary" : "text-text-muted")} onClick={(e) => { e.stopPropagation(); toggleRequired(currentStep.id, field.id); }}>{field.required ? "إلزامي" : "اختياري"}</Button>}
                      <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} className="text-danger hover:text-danger" onClick={(e) => { e.stopPropagation(); removeField(currentStep.id, field.id); }} />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="font-semibold text-text mb-3">الإعدادات</h3>
            <div className="space-y-3">
              <Toggle checked={showCoupon} onChange={setShowCoupon} label="إظهار كوبون الخصم" description="السماح للعملاء بإدخال كود خصم" />
              <Toggle checked={autoInvoice} onChange={setAutoInvoice} label="إرسال فاتورة تلقائية" description="إرسال فاتورة بالبريد بعد الشراء" />
              <Toggle checked={showAddress} onChange={setShowAddress} label="حقل العنوان" description="طلب عنوان الفاتورة" />
              <Toggle checked={instantDownload} onChange={setInstantDownload} label="تحميل فوري" description="تقديم الملفات الرقمية فوراً بعد الدفع" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text">معاينة حية</h3>
              <ToggleGroup options={[{ value: "desktop", label: "", icon: <Monitor size={16} /> }, { value: "tablet", label: "", icon: <Tablet size={16} /> }, { value: "mobile", label: "", icon: <Smartphone size={16} /> }]} value={device} onChange={setDevice} />
            </div>

            <div className="flex justify-center">
              <div className="bg-bg rounded-xl border border-border overflow-hidden transition-all" style={{ width: deviceWidth[device as keyof typeof deviceWidth], maxWidth: "100%" }}>
                <div className="bg-gradient-to-l from-primary to-primary/80 p-6 text-white text-center">
                  <h2 className="text-xl font-bold">إتمام الشراء</h2>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {steps.filter((s) => s.enabled).map((s, i) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold", activeStep === s.id ? "bg-white text-primary" : "bg-white/20 text-white")}>{i + 1}</div>
                        <span className={cn("text-xs", activeStep === s.id ? "text-white" : "text-white/60")}>{s.name}</span>
                        {i < steps.filter((s) => s.enabled).length - 1 && <div className="w-8 h-px bg-white/30" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {currentStep?.enabled ? (
                    <>
                      {currentStep.fields.filter((f) => f.enabled).map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-text mb-1.5">{field.label}{field.required && <span className="text-danger mr-1">*</span>}</label>
                          <div className="w-full h-9 rounded-lg border border-border bg-surface px-3 flex items-center text-sm text-text-muted">
                            {field.type === "name" && "أحمد محمد"}
                            {field.type === "email" && "ahmed@example.com"}
                            {field.type === "phone" && "+966 5XX XXX XXXX"}
                            {field.type === "coupon" && "أدخل كود الخصم"}
                            {field.type === "notes" && "ملاحظات إضافية..."}
                            {field.type === "company" && "اسم الشركة"}
                          </div>
                        </div>
                      ))}

                      {activeStep === "info" && (
                        <div className="space-y-3 pt-4 border-t border-border">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                            <div className="flex items-center gap-2"><CreditCard size={16} className="text-success" /><span className="text-sm text-text">Stripe</span></div>
                            <Badge variant="success">متاح</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                            <div className="flex items-center gap-2"><CreditCard size={16} className="text-text-muted" /><span className="text-sm text-text">Apple Pay</span></div>
                            <Badge variant="success">متاح</Badge>
                          </div>
                        </div>
                      )}

                      {activeStep === "confirmation" && (
                        <div className="text-center py-8">
                          <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4"><ShoppingCart size={24} className="text-success" /></div>
                          <h3 className="text-lg font-bold text-text">شكراً لك!</h3>
                          <p className="text-sm text-text-muted mt-2">سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني</p>
                          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20"><p className="text-sm text-primary font-medium">رابط التحميل سيظهر هنا فور اكتمال الدفع</p></div>
                        </div>
                      )}

                      <Button className="w-full" onClick={() => {
                        const stepIds = steps.filter((s) => s.enabled).map((s) => s.id);
                        const idx = stepIds.indexOf(activeStep);
                        if (idx < stepIds.length - 1) setActiveStep(stepIds[idx + 1]);
                        else success("تم الإرسال", "تم إرسال الطلب بنجاح!");
                      }}>
                        {activeStep === "confirmation" ? "تأكيد الطلب" : "التالي"}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-text-muted">هذه الخطوة معطلة</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {previewOpen && (
        <Modal open onClose={() => setPreviewOpen(false)} title="معاينة صفحة الدفع" size="xl">
          <div className="bg-bg rounded-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-l from-primary to-primary/80 p-6 text-white text-center">
              <h2 className="text-xl font-bold">إتمام الشراء</h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                {steps.filter((s) => s.enabled).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white">{i + 1}</div>
                    <span className="text-xs text-white/60">{s.name}</span>
                    {i < steps.filter((s) => s.enabled).length - 1 && <div className="w-8 h-px bg-white/30" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              {steps.filter((s) => s.enabled).map((step) => (
                <div key={step.id}>
                  <h4 className="text-sm font-semibold text-text mb-2">{step.name}</h4>
                  {step.fields.filter((f) => f.enabled).map((field) => (
                    <div key={field.id} className="mb-2">
                      <label className="block text-sm font-medium text-text mb-1">{field.label}{field.required && <span className="text-danger mr-1">*</span>}</label>
                      <div className="w-full h-9 rounded-lg border border-border bg-surface px-3 flex items-center text-sm text-text-muted">—</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>إغلاق</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
