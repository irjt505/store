"use client";

import { useState, useCallback, useRef } from "react";
import { Save, FileText, Eye, Printer, Settings2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";

export default function InvoicesPage() {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [companyName, setCompanyName] = useState("متجري");
  const [taxNumber, setTaxNumber] = useState("310123456700003");
  const [crNumber, setCrNumber] = useState("1010123456");
  const [companyEmail, setCompanyEmail] = useState("info@mystore.com");
  const [companyPhone, setCompanyPhone] = useState("+966501234567");
  const [companyAddress, setCompanyAddress] = useState("الرياض، حي العليا، شارع التحلية، مبنى رقم 123");
  const [customNotes, setCustomNotes] = useState("شكراً لثقتكم بنا. نتطلع لخدمتكم مرة أخرى.");
  const [terms, setTerms] = useState("جميع المبيعات نهائية ولا يمكن استرجاعها. للشكاوى يرجى التواصل معنا خلال 7 أيام.");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(1001);
  const [invoiceDigits, setInvoiceDigits] = useState("5");
  const [showTaxOnInvoice, setShowTaxOnInvoice] = useState(true);
  const [showCompanyLogo, setShowCompanyLogo] = useState(true);
  const [includePaymentInfo, setIncludePaymentInfo] = useState(true);
  const [footerText, setFooterText] = useState("متجري — وجهتك الأولى للمنتجات الإلكترونية");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1048576) { success("خطأ", "حجم الملف يتجاوز 2 ميجا"); return; }
    const reader = new FileReader();
    reader.onload = () => { setLogoPreview(reader.result as string); success("تم الرفع", "تم رفع الشعار بنجاح"); };
    reader.readAsDataURL(file);
  }, [success]);

  const handleSave = useCallback(() => {
    if (!companyName.trim()) { success("خطأ", "يرجى إدخال اسم الشركة"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); success("تم الحفظ", "تم حفظ إعدادات الفاتورة بنجاح"); }, 500);
  }, [companyName, success]);

  const sampleInvoice = {
    number: `${invoicePrefix}-${String(invoiceStartNumber).padStart(Number(invoiceDigits), "0")}`,
    date: new Date().toLocaleDateString("ar-SA"),
    items: [
      { name: "سماعات لاسلكية برو", qty: 1, price: 371, total: 371 },
      { name: "شاحن لاسلكي سريع", qty: 2, price: 150, total: 300 },
    ],
    subtotal: 671,
    tax: showTaxOnInvoice ? 100.65 : 0,
    total: showTaxOnInvoice ? 771.65 : 671,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="إعدادات الفاتورة" subtitle="تخصيص شكل الفاتورة والمعلومات" actions={
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Eye size={16} />} onClick={() => setShowPreview(!showPreview)}>معاينة</Button>
          <Button onClick={handleSave} loading={loading} icon={<Save size={16} />}>حفظ</Button>
        </div>
      } />

      {showPreview && (
        <Card padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-border bg-bg">
            <h3 className="font-semibold text-text flex items-center gap-2"><FileText size={18} /> معاينة الفاتورة</h3>
          </div>
          <div className="p-8 bg-white" dir="rtl">
            <div className="flex justify-between items-start mb-8">
              <div>
                {showCompanyLogo && logoPreview && <img src={logoPreview} alt="شعار الشركة" className="h-16 mb-3" />}
                <h2 className="text-xl font-bold text-gray-900">{companyName}</h2>
                <p className="text-sm text-gray-600 mt-1">{companyAddress}</p>
                <p className="text-sm text-gray-600">{companyPhone} — {companyEmail}</p>
                {taxNumber && <p className="text-sm text-gray-600 mt-1">الرقم الضريبي: {taxNumber}</p>}
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">فاتورة</h3>
                <p className="text-sm text-gray-600 mt-1">رقم: {sampleInvoice.number}</p>
                <p className="text-sm text-gray-600">التاريخ: {sampleInvoice.date}</p>
              </div>
            </div>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-2 font-semibold text-gray-700">المنتج</th>
                  <th className="text-center py-2 font-semibold text-gray-700">الكمية</th>
                  <th className="text-left py-2 font-semibold text-gray-700">السعر</th>
                  <th className="text-left py-2 font-semibold text-gray-700">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {sampleInvoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.name}</td>
                    <td className="py-3 text-center text-gray-600">{item.qty}</td>
                    <td className="py-3 text-left text-gray-600">{item.price} ر.س</td>
                    <td className="py-3 text-left text-gray-900 font-medium">{item.total} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-start">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">المجموع الفرعي</span><span className="text-gray-900">{sampleInvoice.subtotal} ر.س</span></div>
                {showTaxOnInvoice && <div className="flex justify-between text-sm"><span className="text-gray-600">ضريبة القيمة المضافة (15%)</span><span className="text-gray-900">{sampleInvoice.tax} ر.س</span></div>}
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2"><span className="text-gray-900">الإجمالي</span><span className="text-gray-900">{sampleInvoice.total} ر.س</span></div>
              </div>
            </div>

            {includePaymentInfo && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">معلومات الدفع</p>
                <p className="text-sm text-gray-600">البنك: الراجحي — الحساب: SA03 8000 0000 6080 1016 7519</p>
              </div>
            )}

            {customNotes && <p className="mt-4 text-sm text-gray-600">{customNotes}</p>}
            {terms && <p className="mt-2 text-xs text-gray-500">{terms}</p>}
            {footerText && <p className="mt-4 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">{footerText}</p>}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card header={<div className="flex items-center gap-2"><FileText size={18} className="text-primary" /><h3 className="font-semibold text-text">معلومات الشركة</h3></div>} padding="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">شعار الشركة</label>
              <div className="flex items-center gap-4">
                <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-hover overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="شعار الشركة" className="h-full w-full object-cover" /> : <Upload size={24} className="text-text-muted" />}
                </div>
                <div>
                  <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => logoInputRef.current?.click()}>رفع شعار</Button>
                  <p className="mt-1.5 text-xs text-text-muted">PNG أو SVG، الحد الأقصى 2 ميجا</p>
                </div>
              </div>
            </div>
            <Input label="اسم الشركة" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="الرقم الضريبي" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} dir="ltr" />
            <Input label="رقم السجل التجاري" value={crNumber} onChange={(e) => setCrNumber(e.target.value)} dir="ltr" />
            <Input label="البريد الإلكتروني" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            <Input label="رقم الهاتف" type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
            <Textarea label="العنوان" rows={2} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </div>
        </Card>

        <Card header={<div className="flex items-center gap-2"><Settings2 size={18} className="text-primary" /><h3 className="font-semibold text-text">إعدادات الفاتورة</h3></div>} padding="md">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="بادئة الرقم" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} dir="ltr" />
              <Input label="الرقم الابتدائي" type="number" value={invoiceStartNumber} onChange={(e) => setInvoiceStartNumber(Number(e.target.value))} />
              <Select label="عدد الأرقام" options={[{ value: "4", label: "4 أرقام" }, { value: "5", label: "5 أرقام" }, { value: "6", label: "6 أرقام" }]} value={invoiceDigits} onChange={(e) => setInvoiceDigits(e.target.value)} />
            </div>
            <div className="p-3 rounded-lg bg-bg border border-border">
              <p className="text-xs text-text-muted mb-1">معاينة رقم الفاتورة</p>
              <p className="font-mono text-lg font-bold text-primary">{sampleInvoice.number}</p>
            </div>
            <Toggle checked={showTaxOnInvoice} onChange={setShowTaxOnInvoice} label="إظهار الضريبة" description="عرض ضريبة القيمة المضافة في الفاتورة" />
            <Toggle checked={showCompanyLogo} onChange={setShowCompanyLogo} label="إظهار الشعار" description="عرض شعار الشركة في الفاتورة" />
            <Toggle checked={includePaymentInfo} onChange={setIncludePaymentInfo} label="معلومات الدفع" description="عرض تفاصيل الحساب البنكي في الفاتورة" />
          </div>
        </Card>

        <Card header={<div className="flex items-center gap-2"><FileText size={18} className="text-primary" /><h3 className="font-semibold text-text">الملاحظات والشروط</h3></div>} padding="md" className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Textarea label="ملاحظات مخصصة" rows={3} value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} placeholder="ملاحظات تظهر في أسفل الفاتورة" />
            <Textarea label="الشروط والأحكام" rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="الشروط والأحكام" />
          </div>
          <div className="mt-4">
            <Input label="نص التذييل" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="نص يظهر في أسفل الفاتورة" />
          </div>
        </Card>
      </div>
    </div>
  );
}
