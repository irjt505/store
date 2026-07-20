"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Image, ExternalLink, Wrench, Store, Mail, Globe, Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function SectionLabel({ icon: Icon, label }: { icon: typeof Store; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon size={16} className="text-primary" />
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{label}</h3>
    </div>
  );
}

export default function GeneralSettingsPage() {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("متجري");
  const [storeDesc, setStoreDesc] = useState("متجر إلكتروني متخصص في بيع المنتجات الإلكترونية بأفضل الأسعار");
  const [contactEmail, setContactEmail] = useState("info@mystore.com");
  const [phone, setPhone] = useState("+966501234567");
  const [commercialReg, setCommercialReg] = useState("1010123456");
  const [taxNumber, setTaxNumber] = useState("310123456700003");
  const [crNumber, setCrNumber] = useState("1010123456");
  const [country, setCountry] = useState("SA");
  const [city, setCity] = useState("الرياض");
  const [timezone, setTimezone] = useState("Asia/Riyadh");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [currency, setCurrency] = useState("SAR");
  const [currencyFormat, setCurrencyFormat] = useState("after");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("المتجر في وضع الصيانة حالياً. سنعود قريباً!");
  const [twitter, setTwitter] = useState("https://twitter.com/mystore");
  const [instagram, setInstagram] = useState("https://instagram.com/mystore");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [whatsapp, setWhatsapp] = useState("+966501234567");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1048576) { success("خطأ", "حجم الملف يتجاوز 2 ميجا"); return; }
    const reader = new FileReader();
    reader.onload = () => { setLogoPreview(reader.result as string); success("تم الرفع", "تم رفع الشعار بنجاح"); };
    reader.readAsDataURL(file);
  }, [success]);

  const handleFaviconUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setFaviconPreview(reader.result as string); success("تم الرفع", "تم رفع الأيقونة بنجاح"); };
    reader.readAsDataURL(file);
  }, [success]);

  const handleSave = useCallback(() => {
    if (!storeName.trim()) { success("خطأ", "يرجى إدخال اسم المتجر"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); success("تم الحفظ", "تم حفظ الإعدادات العامة بنجاح"); }, 500);
  }, [storeName, success]);

  return (
    <div className="space-y-6">
      <PageHeader title="الإعدادات العامة" subtitle="إعدادات المتجر الأساسية والمعلومات العامة" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}>
          <Card header={<SectionLabel icon={Store} label="معلومات المتجر" />} padding="md">
            <div className="space-y-4">
              <Input label="اسم المتجر" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              <Textarea label="وصف المتجر" rows={3} value={storeDesc} onChange={(e) => setStoreDesc(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">شعار المتجر</label>
                <div className="flex items-center gap-4">
                  <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-hover overflow-hidden transition-colors hover:border-primary/40">
                    {logoPreview ? <img src={logoPreview} alt="شعار المتجر" className="h-full w-full object-cover" /> : <Image size={24} className="text-text-muted" />}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => logoInputRef.current?.click()}>رفع شعار</Button>
                    <p className="mt-1.5 text-xs text-text-muted">PNG أو SVG، الحد الأقصى 2 ميجا</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">الأيقونة المفضلة (Favicon)</label>
                <div className="flex items-center gap-4">
                  <input ref={faviconInputRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFaviconUpload} />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-hover overflow-hidden transition-colors hover:border-primary/40">
                    {faviconPreview ? <img src={faviconPreview} alt="أيقونة" className="h-full w-full object-cover" /> : <Image size={18} className="text-text-muted" />}
                  </div>
                  <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => faviconInputRef.current?.click()}>رفع أيقونة</Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
          <Card header={<SectionLabel icon={Mail} label="معلومات الاتصال" />} padding="md">
            <div className="space-y-4">
              <Input label="البريد الإلكتروني للتواصل" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              <Input label="رقم الهاتف" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="الرقم التجاري" value={commercialReg} onChange={(e) => setCommercialReg(e.target.value)} dir="ltr" />
              <Input label="الرقم الضريبي" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} dir="ltr" />
              <Input label="رقم السجل التجاري (CR)" value={crNumber} onChange={(e) => setCrNumber(e.target.value)} dir="ltr" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }}>
          <Card header={<SectionLabel icon={Globe} label="المنطقة والعملة" />} padding="md">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select label="الدولة" options={[{ value: "SA", label: "السعودية" }, { value: "AE", label: "الإمارات" }, { value: "EG", label: "مصر" }, { value: "KW", label: "الكويت" }, { value: "BH", label: "البحرين" }, { value: "QA", label: "قطر" }, { value: "OM", label: "عمان" }]} value={country} onChange={(e) => setCountry(e.target.value)} />
                <Input label="المدينة" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <Select label="المنطقة الزمنية" options={[{ value: "Asia/Riyadh", label: "الرياض (GMT+3)" }, { value: "Asia/Dubai", label: "دبي (GMT+4)" }, { value: "Asia/Bahrain", label: "البحرين (GMT+3)" }, { value: "Asia/Kuwait", label: "الكويت (GMT+3)" }, { value: "Africa/Cairo", label: "القاهرة (GMT+2)" }]} value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="تنسيق التاريخ" options={[{ value: "dd/mm/yyyy", label: "DD/MM/YYYY" }, { value: "mm/dd/yyyy", label: "MM/DD/YYYY" }, { value: "yyyy-mm-dd", label: "YYYY-MM-DD" }]} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} />
                <Select label="تنسيق الوقت" options={[{ value: "12h", label: "12 ساعة" }, { value: "24h", label: "24 ساعة" }]} value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} />
              </div>
              <div className="h-px bg-border my-2" />
              <Select label="العملة الافتراضية" options={[{ value: "SAR", label: "ريال سعودي (SAR)" }, { value: "AED", label: "درهم إماراتي (AED)" }, { value: "EGP", label: "جنيه مصري (EGP)" }, { value: "KWD", label: "دينار كويتي (KWD)" }, { value: "USD", label: "دولار أمريكي (USD)" }, { value: "EUR", label: "يورو (EUR)" }]} value={currency} onChange={(e) => setCurrency(e.target.value)} />
              <Select label="موضع العملة" options={[{ value: "after", label: "بعد المبلغ (371 ر.س)" }, { value: "before", label: "قبل المبلغ (ر.س 371)" }]} value={currencyFormat} onChange={(e) => setCurrencyFormat(e.target.value)} />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <Card header={<SectionLabel icon={Link2} label="وسائل التواصل الاجتماعي" />} padding="md">
            <div className="space-y-3">
              <Input label="Twitter / X" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." dir="ltr" icon={<ExternalLink size={14} />} />
              <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." dir="ltr" icon={<ExternalLink size={14} />} />
              <Input label="Facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." dir="ltr" icon={<ExternalLink size={14} />} />
              <Input label="TikTok" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/..." dir="ltr" icon={<ExternalLink size={14} />} />
              <Input label="Snapchat" value={snapchat} onChange={(e) => setSnapchat(e.target.value)} placeholder="https://snapchat.com/..." dir="ltr" icon={<ExternalLink size={14} />} />
              <Input label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+9665XXXXXXX" dir="ltr" icon={<ExternalLink size={14} />} />
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.25 }} className="xl:col-span-2">
          <Card header={<div className="flex items-center gap-2"><Wrench size={16} className="text-warning" /><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">وضع الصيانة</h3></div>} padding="md">
            <div className="space-y-4">
              <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} label="تفعيل وضع الصيانة" description="إظهار صفحة صيانة للزوار بدلاً من المتجر" />
              {maintenanceMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-warning/30 bg-warning-light p-4">
                  <p className="text-sm font-medium text-warning mb-2">وضع الصيانة مفعّل</p>
                  <Textarea label="رسالة الصيانة" rows={3} value={maintenanceMsg} onChange={(e) => setMaintenanceMsg(e.target.value)} />
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="flex justify-end sticky bottom-4 z-10">
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-xl p-3 shadow-lg">
          <Button onClick={handleSave} loading={loading} icon={<Save size={16} />}>حفظ التغييرات</Button>
        </div>
      </motion.div>
    </div>
  );
}
