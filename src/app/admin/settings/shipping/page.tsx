"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, Truck, Package, Globe, Settings2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

type ShippingZone = { id: string; name: string; type: "domestic" | "gcc" | "international"; carriers: string[]; enabled: boolean };
type ShippingCarrier = { id: string; name: string; description: string; enabled: boolean; rateType: "weight" | "price" | "flat"; baseRate: number; perKgRate: number };

const defaultZones: ShippingZone[] = [
  { id: "1", name: "الشحن المحلي", type: "domestic", carriers: ["aramex", "smsa", "local"], enabled: true },
  { id: "2", name: "دول الخليج", type: "gcc", carriers: ["aramex", "dhl", "fedex"], enabled: true },
  { id: "3", name: "الشحن الدولي", type: "international", carriers: ["dhl", "fedex", "aramex"], enabled: true },
];

const defaultCarriers: ShippingCarrier[] = [
  { id: "aramex", name: "Aramex", description: "خدمة الشحن السريع المحلية والدولية", enabled: true, rateType: "weight", baseRate: 15, perKgRate: 5 },
  { id: "smsa", name: "SMSA", description: "خدمة الشحن السعودي السريع", enabled: true, rateType: "flat", baseRate: 20, perKgRate: 0 },
  { id: "dhl", name: "DHL", description: "الشحن الدولي السريع", enabled: true, rateType: "weight", baseRate: 50, perKgRate: 15 },
  { id: "fedex", name: "FedEx", description: "الشحن الدولي الفيدرالي", enabled: false, rateType: "weight", baseRate: 45, perKgRate: 12 },
  { id: "local", name: "التوصيل المحلي", description: "خدمة التوصيل داخل المدينة", enabled: true, rateType: "flat", baseRate: 10, perKgRate: 0 },
];

export default function ShippingSettingsPage() {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState(defaultZones);
  const [carriers, setCarriers] = useState(defaultCarriers);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);
  const [enableFreeShipping, setEnableFreeShipping] = useState(true);
  const [digitalInstantDelivery, setDigitalInstantDelivery] = useState(true);
  const [digitalEmailDelivery, setDigitalEmailDelivery] = useState(true);
  const [showEstimate, setShowEstimate] = useState(true);
  const [configModal, setConfigModal] = useState<ShippingCarrier | null>(null);
  const [configForm, setConfigForm] = useState({ baseRate: 0, perKgRate: 0 });

  const handleSave = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setLoading(false); success("تم الحفظ", "تم حفظ إعدادات الشحن بنجاح"); }, 500);
  }, [success]);

  const toggleCarrier = useCallback((id: string) => {
    setCarriers((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
    const carrier = carriers.find((c) => c.id === id);
    success("تم التغيير", `تم ${carrier?.enabled ? "تعطيل" : "تفعيل"} ${carrier?.name}`);
  }, [carriers, success]);

  const openCarrierConfig = useCallback((c: ShippingCarrier) => {
    setConfigModal(c);
    setConfigForm({ baseRate: c.baseRate, perKgRate: c.perKgRate });
  }, []);

  const handleSaveCarrierConfig = useCallback(() => {
    if (!configModal) return;
    setCarriers((prev) => prev.map((c) => c.id === configModal.id ? { ...c, baseRate: configForm.baseRate, perKgRate: configForm.perKgRate } : c));
    success("تم الحفظ", `تم حفظ أسعار ${configModal.name}`);
    setConfigModal(null);
  }, [configModal, configForm, success]);

  const toggleZone = useCallback((id: string) => {
    setZones((prev) => prev.map((z) => z.id === id ? { ...z, enabled: !z.enabled } : z));
  }, []);

  const zoneTypeLabels: Record<string, string> = { domestic: "محلي", gcc: "خليجي", international: "دولي" };
  const zoneTypeBadge: Record<string, "success" | "info" | "purple"> = { domestic: "success", gcc: "info", international: "purple" };

  return (
    <div className="space-y-6">
      <PageHeader title="إعدادات الشحن والتوصيل" subtitle="إدارة مناطق الشحن وشركات التوصيل" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}>
          <Card header={<div className="flex items-center gap-2"><Truck size={16} className="text-primary" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">الشحن المجاني</h3></div>} padding="md">
            <div className="space-y-4">
              <Toggle checked={enableFreeShipping} onChange={setEnableFreeShipping} label="تفعيل الشحن المجاني" description="توفير شحن مجاني للطلبات التي تتجاوز حد معين" />
              {enableFreeShipping && (
                <Input label="الحد الأدنى للشحن المجاني (ر.س)" type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} helperText="الطلبات التي تتجاوز هذا المبلغ تحصل على شحن مجاني" />
              )}
              <Toggle checked={showEstimate} onChange={setShowEstimate} label="عرض وقت التوصيل التقديري" description="إظهار وقت التوصيل المتوقع للعملاء" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
          <Card header={<div className="flex items-center gap-2"><Package size={16} className="text-primary" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">المنتجات الرقمية</h3></div>} padding="md">
            <div className="space-y-4">
              <Toggle checked={digitalInstantDelivery} onChange={setDigitalInstantDelivery} label="تسليم فوري" description="تقديم الملفات الرقمية فوراً بعد الدفع" />
              <Toggle checked={digitalEmailDelivery} onChange={setDigitalEmailDelivery} label="إرسال بالبريد الإلكتروني" description="إرسال رابط التحميل عبر البريد بعد الشراء" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }} className="xl:col-span-2">
          <Card header={<div className="flex items-center gap-2"><MapPin size={16} className="text-primary" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">مناطق الشحن</h3></div>} padding="md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {zones.map((zone, idx) => (
                <motion.div key={zone.id} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 + idx * 0.05 }}
                  className={cn("p-4 rounded-xl border transition-all", zone.enabled ? "border-border bg-surface" : "border-border bg-surface-hover opacity-60")}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-primary" />
                      <h4 className="font-semibold text-text">{zone.name}</h4>
                    </div>
                    <Toggle checked={zone.enabled} onChange={() => toggleZone(zone.id)} />
                  </div>
                  <Badge variant={zoneTypeBadge[zone.type]} className="mb-2">{zoneTypeLabels[zone.type]}</Badge>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {zone.carriers.map((cId) => {
                      const carrier = carriers.find((ca) => ca.id === cId);
                      return carrier ? <Badge key={cId} variant="default" className="text-[10px]">{carrier.name}</Badge> : null;
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.25 }} className="xl:col-span-2">
          <Card header={<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">شركات الشحن</h3>} padding="md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {carriers.map((carrier, idx) => (
                <motion.div key={carrier.id} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 + idx * 0.04 }}
                  className={cn("p-4 rounded-xl border transition-all", carrier.enabled ? "border-border" : "border-border opacity-60")}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-text">{carrier.name}</h4>
                    <Toggle checked={carrier.enabled} onChange={() => toggleCarrier(carrier.id)} />
                  </div>
                  <p className="text-xs text-text-muted mb-3">{carrier.description}</p>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <p>نوع التسعير: {carrier.rateType === "weight" ? "حسب الوزن" : carrier.rateType === "price" ? "حسب السعر" : "سعر ثابت"}</p>
                    <p>السعر الأساسي: {carrier.baseRate} ر.س</p>
                    {carrier.rateType === "weight" && <p>لكل كجم: {carrier.perKgRate} ر.س</p>}
                  </div>
                  <Button variant="secondary" size="sm" fullWidth className="mt-3" icon={<Settings2 size={14} />} onClick={() => openCarrierConfig(carrier)}>تعديل الأسعار</Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {configModal && (
        <Modal open onClose={() => setConfigModal(null)} title={`تسعير — ${configModal.name}`} size="sm">
          <div className="space-y-4">
            <Input label="السعر الأساسي (ر.س)" type="number" value={configForm.baseRate} onChange={(e) => setConfigForm((p) => ({ ...p, baseRate: Number(e.target.value) }))} />
            {configModal.rateType === "weight" && (
              <Input label="السعر لكل كجم (ر.س)" type="number" value={configForm.perKgRate} onChange={(e) => setConfigForm((p) => ({ ...p, perKgRate: Number(e.target.value) }))} />
            )}
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setConfigModal(null)}>إلغاء</Button>
              <Button onClick={handleSaveCarrierConfig}>حفظ</Button>
            </div>
          </div>
        </Modal>
      )}

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.35 }} className="flex justify-end sticky bottom-4 z-10">
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-xl p-3 shadow-lg">
          <Button onClick={handleSave} loading={loading} icon={<Save size={16} />}>حفظ التغييرات</Button>
        </div>
      </motion.div>
    </div>
  );
}
