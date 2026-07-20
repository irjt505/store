"use client";

import { useState, useCallback } from "react";
import { Save, Pencil, Trash2, Plus, GripVertical, Mail, Phone, MapPin, Globe, Share2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { cn, generateId } from "@/lib/utils";

type FooterColumn = { id: string; title: string; enabled: boolean; editing: boolean };
type FooterConfig = {
  columns: FooterColumn[];
  storeInfo: { name: string; description: string; address: string; phone: string; email: string };
  social: { facebook: string; instagram: string; twitter: string };
  newsletter: { enabled: boolean; title: string; description: string };
  copyright: { text: string };
};

const defaultConfig: FooterConfig = {
  columns: [
    { id: "1", title: "روابط سريعة", enabled: true, editing: false },
    { id: "2", title: "خدمة العملاء", enabled: true, editing: false },
    { id: "3", title: "المساعدة", enabled: true, editing: false },
  ],
  storeInfo: { name: "متجرنا", description: "وجهتك الأولى للتسوق الإلكتروني في المملكة العربية السعودية.", address: "الرياض، المملكة العربية السعودية", phone: "+966 50 123 4567", email: "info@store.com" },
  social: { facebook: "https://facebook.com/store", instagram: "https://instagram.com/store", twitter: "https://twitter.com/store" },
  newsletter: { enabled: true, title: "اشترك في نشرتنا البريدية", description: "احصل على أحدث العروض والمنتجات مباشرة في بريدك الإلكتروني" },
  copyright: { text: "© 2026 متجرنا. جميع الحقوق محفوظة." },
};

export default function FooterBuilderPage() {
  const { success, error: showError } = useToast();
  const [config, setConfig] = useState<FooterConfig>(defaultConfig);

  const toggleColumnEdit = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, columns: prev.columns.map((col) => col.id === id ? { ...col, editing: !col.editing } : col) }));
  }, []);

  const toggleColumnEnabled = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, columns: prev.columns.map((col) => col.id === id ? { ...col, enabled: !col.enabled } : col) }));
  }, []);

  const addColumn = useCallback(() => {
    setConfig((prev) => ({ ...prev, columns: [...prev.columns, { id: generateId(), title: "عمود جديد", enabled: true, editing: false }] }));
    success("تمت الإضافة", "تم إضافة عمود جديد");
  }, [success]);

  const removeColumn = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, columns: prev.columns.filter((col) => col.id !== id) }));
    success("تم الحذف", "تم حذف العمود");
  }, [success]);

  const updateStoreInfo = useCallback((key: keyof FooterConfig["storeInfo"], value: string) => {
    setConfig((prev) => ({ ...prev, storeInfo: { ...prev.storeInfo, [key]: value } }));
  }, []);

  const updateSocial = useCallback((key: keyof FooterConfig["social"], value: string) => {
    setConfig((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
  }, []);

  const updateNewsletter = useCallback((key: keyof FooterConfig["newsletter"], value: string | boolean) => {
    setConfig((prev) => ({ ...prev, newsletter: { ...prev.newsletter, [key]: value } }));
  }, []);

  const updateCopyright = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, copyright: { ...prev.copyright, text: value } }));
  }, []);

  const handleSave = useCallback(() => {
    success("تم الحفظ", "تم حفظ إعدادات الفوتر بنجاح");
  }, [success]);

  return (
    <div className="space-y-6">
      <PageHeader title="بناء الفوتر" subtitle="تخصيص تذييل الموقع" actions={<Button icon={<Save size={16} />} onClick={handleSave}>حفظ</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><span className="font-medium text-text">الأعمدة</span></div>} padding="md">
            <div className="space-y-3">
              {config.columns.map((col) => (
                <div key={col.id} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-bg/50">
                    <div className="flex items-center gap-3">
                      <GripVertical size={14} className="text-text-muted cursor-grab" />
                      <span className={cn("text-sm font-medium", col.enabled ? "text-text" : "text-text-muted")}>{col.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleColumnEnabled(col.id)} className={cn("relative w-8 h-5 rounded-full transition-colors cursor-pointer", col.enabled ? "bg-primary" : "bg-border")}><span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", col.enabled ? "right-3.5" : "right-0.5")} /></button>
                      <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => toggleColumnEdit(col.id)} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} className="text-danger hover:text-danger" onClick={() => removeColumn(col.id)} />
                    </div>
                  </div>
                  {col.editing && (
                    <div className="px-4 py-3 border-t border-border space-y-3">
                      <Input label="اسم العمود" value={col.title} onChange={(e) => setConfig((prev) => ({ ...prev, columns: prev.columns.map((c) => c.id === col.id ? { ...c, title: e.target.value } : c) }))} />
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addColumn}>إضافة عمود</Button>
            </div>
          </Card>

          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><span className="font-medium text-text">معلومات المتجر</span></div>} padding="md">
            <div className="space-y-4">
              <Input label="اسم المتجر" value={config.storeInfo.name} onChange={(e) => updateStoreInfo("name", e.target.value)} />
              <Textarea label="وصف المتجر" rows={3} value={config.storeInfo.description} onChange={(e) => updateStoreInfo("description", e.target.value)} />
              <Input label="العنوان" icon={<MapPin size={16} />} value={config.storeInfo.address} onChange={(e) => updateStoreInfo("address", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="الهاتف" icon={<Phone size={16} />} value={config.storeInfo.phone} onChange={(e) => updateStoreInfo("phone", e.target.value)} />
                <Input label="البريد الإلكتروني" icon={<Mail size={16} />} value={config.storeInfo.email} onChange={(e) => updateStoreInfo("email", e.target.value)} />
              </div>
            </div>
          </Card>

          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><span className="font-medium text-text">وسائل التواصل</span></div>} padding="md">
            <div className="space-y-4">
              <Input label="فيسبوك" icon={<Globe size={16} />} value={config.social.facebook} onChange={(e) => updateSocial("facebook", e.target.value)} />
              <Input label="إنستغرام" icon={<Share2 size={16} />} value={config.social.instagram} onChange={(e) => updateSocial("instagram", e.target.value)} />
              <Input label="تويتر" icon={<MessageCircle size={16} />} value={config.social.twitter} onChange={(e) => updateSocial("twitter", e.target.value)} />
            </div>
          </Card>

          <Card header={<div className="flex items-center justify-between"><div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><span className="font-medium text-text">النشرة البريدية</span></div><button onClick={() => updateNewsletter("enabled", !config.newsletter.enabled)} className={cn("relative w-10 h-6 rounded-full transition-colors cursor-pointer", config.newsletter.enabled ? "bg-primary" : "bg-border")}><span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", config.newsletter.enabled ? "right-5" : "right-1")} /></button></div>} padding="md">
            <div className={cn("space-y-4", !config.newsletter.enabled && "opacity-40 pointer-events-none")}>
              <Input label="العنوان" value={config.newsletter.title} onChange={(e) => updateNewsletter("title", e.target.value)} />
              <Textarea label="الوصف" rows={2} value={config.newsletter.description} onChange={(e) => updateNewsletter("description", e.target.value)} />
            </div>
          </Card>

          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><span className="font-medium text-text">حقوق النشر</span></div>} padding="md">
            <Input label="نص حقوق النشر" value={config.copyright.text} onChange={(e) => updateCopyright(e.target.value)} />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card padding="none" className="sticky top-6 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-bg/50"><span className="text-sm font-medium text-text">معاينة مباشرة</span></div>
            <div className="bg-gray-900 text-white">
              <div className="px-6 pt-10 pb-8 grid grid-cols-3 gap-6">
                {config.columns.filter((col) => col.enabled).map((col) => (
                  <div key={col.id}>
                    <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                    <ul className="space-y-2">
                      {["الرئيسية", "المنتجات", "العروض", "المدونة"].map((item) => <li key={item}><span className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">{item}</span></li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-8 border-t border-gray-800 pt-8">
                <h4 className="font-semibold text-sm mb-2">{config.storeInfo.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{config.storeInfo.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin size={12} /><span>{config.storeInfo.address}</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-400"><Phone size={12} /><span>{config.storeInfo.phone}</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-400"><Mail size={12} /><span>{config.storeInfo.email}</span></div>
                </div>
              </div>
              <div className="px-6 pb-8">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Globe size={14} /></a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Share2 size={14} /></a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><MessageCircle size={14} /></a>
                </div>
              </div>
              {config.newsletter.enabled && (
                <div className="px-6 pb-8 border-t border-gray-800 pt-8">
                  <h4 className="font-semibold text-sm mb-1">{config.newsletter.title}</h4>
                  <p className="text-xs text-gray-400 mb-3">{config.newsletter.description}</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 h-8 px-3 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white placeholder:text-gray-500" />
                    <button className="h-8 px-4 rounded-lg bg-primary text-white text-xs font-medium">اشترك</button>
                  </div>
                </div>
              )}
              <div className="px-6 py-4 border-t border-gray-800 text-center"><p className="text-xs text-gray-500">{config.copyright.text}</p></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
