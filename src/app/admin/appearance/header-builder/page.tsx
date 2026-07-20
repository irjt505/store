"use client";

import { useState, useCallback } from "react";
import { Save, Eye, GripVertical, Palette, Type, Layout } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type HeaderConfig = {
  topBar: { enabled: boolean; text: string; bgColor: string; textColor: string };
  main: { logoPosition: "left" | "center"; menuPosition: "right" | "left" };
  bottomBar: { enabled: boolean };
};

const defaultConfig: HeaderConfig = {
  topBar: { enabled: true, text: "شحن مجاني على الطلبات فوق 200 ر.س | استخدم كود SUMMER30 للخصم", bgColor: "#111827", textColor: "#FFFFFF" },
  main: { logoPosition: "left", menuPosition: "right" },
  bottomBar: { enabled: false },
};

export default function HeaderBuilderPage() {
  const { success } = useToast();
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);
  const [previewOpen, setPreviewOpen] = useState(false);

  const updateTopBar = useCallback((key: keyof HeaderConfig["topBar"], value: string | boolean) => {
    setConfig((prev) => ({ ...prev, topBar: { ...prev.topBar, [key]: value } }));
  }, []);

  const updateMain = useCallback((key: keyof HeaderConfig["main"], value: string) => {
    setConfig((prev) => ({ ...prev, main: { ...prev.main, [key]: value } }));
  }, []);

  const toggleBottomBar = useCallback(() => {
    setConfig((prev) => ({ ...prev, bottomBar: { ...prev.bottomBar, enabled: !prev.bottomBar.enabled } }));
  }, []);

  const handleSave = useCallback(() => {
    success("تم الحفظ", "تم حفظ إعدادات الهيدر بنجاح");
  }, [success]);

  return (
    <div className="space-y-6">
      <PageHeader title="بناء الهيدر" subtitle="تخصيص هيكل وتصميم رأس الموقع" actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Eye size={16} />} onClick={() => setPreviewOpen(true)}>معاينة</Button>
          <Button icon={<Save size={16} />} onClick={handleSave}>حفظ</Button>
        </div>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><div className="flex items-center gap-2 flex-1"><Type size={16} className="text-text-secondary" /><span className="font-medium text-text">الشريط العلوي</span></div><button onClick={() => updateTopBar("enabled", !config.topBar.enabled)} className={cn("relative w-10 h-6 rounded-full transition-colors cursor-pointer", config.topBar.enabled ? "bg-primary" : "bg-border")}><span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", config.topBar.enabled ? "right-5" : "right-1")} /></button></div>} padding="md">
            <div className={cn("space-y-4", !config.topBar.enabled && "opacity-40 pointer-events-none")}>
              <Input label="نص الإعلان" value={config.topBar.text} onChange={(e) => updateTopBar("text", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">لون الخلفية</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.topBar.bgColor} onChange={(e) => updateTopBar("bgColor", e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5" />
                    <input type="text" value={config.topBar.bgColor} onChange={(e) => updateTopBar("bgColor", e.target.value)} className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">لون النص</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.topBar.textColor} onChange={(e) => updateTopBar("textColor", e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5" />
                    <input type="text" value={config.topBar.textColor} onChange={(e) => updateTopBar("textColor", e.target.value)} className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><div className="flex items-center gap-2 flex-1"><Layout size={16} className="text-text-secondary" /><span className="font-medium text-text">الهيدر الرئيسي</span></div></div>} padding="md">
            <div className="space-y-4">
              <Select label="موضع الشعار" options={[{ value: "left", label: "يسار" }, { value: "center", label: "وسط" }]} value={config.main.logoPosition} onChange={(e) => updateMain("logoPosition", e.target.value)} />
              <Select label="موضع القائمة" options={[{ value: "right", label: "يمين" }, { value: "left", label: "يسار" }]} value={config.main.menuPosition} onChange={(e) => updateMain("menuPosition", e.target.value)} />
            </div>
          </Card>

          <Card header={<div className="flex items-center gap-3"><GripVertical size={16} className="text-text-muted cursor-grab" /><div className="flex items-center gap-2 flex-1"><Palette size={16} className="text-text-secondary" /><span className="font-medium text-text">الشريط السفلي</span></div><button onClick={toggleBottomBar} className={cn("relative w-10 h-6 rounded-full transition-colors cursor-pointer", config.bottomBar.enabled ? "bg-primary" : "bg-border")}><span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", config.bottomBar.enabled ? "right-5" : "right-1")} /></button></div>} padding="md">
            <div className={cn(!config.bottomBar.enabled && "opacity-40 pointer-events-none")}>
              <p className="text-sm text-text-muted text-center py-4">الشريط السفلي غير مفعّل حالياً</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card padding="none" className="sticky top-6 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-bg/50"><span className="text-sm font-medium text-text">معاينة مباشرة</span></div>
            <div className="bg-white">
              {config.topBar.enabled && <div className="px-4 py-2 text-center text-xs" style={{ backgroundColor: config.topBar.bgColor, color: config.topBar.textColor }}>{config.topBar.text}</div>}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2" style={{ order: config.main.logoPosition === "center" ? 2 : 1 }}>
                  <div className="w-8 h-8 bg-primary rounded-lg" />
                  <span className="font-bold text-gray-900 text-sm">متجرنا</span>
                </div>
                <div className="flex items-center gap-4" style={{ order: config.main.menuPosition === "left" ? 0 : 2, flexDirection: config.main.menuPosition === "left" ? "row-reverse" : "row" }}>
                  {["الرئيسية", "المنتجات", "المدونة", "تواصل"].map((item) => <span key={item} className="text-xs text-gray-600">{item}</span>)}
                </div>
              </div>
              <div className="px-6 py-12 text-center">
                <div className="h-4 bg-gray-100 rounded w-32 mx-auto mb-2" />
                <div className="h-3 bg-gray-50 rounded w-48 mx-auto" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {previewOpen && (
        <Modal open onClose={() => setPreviewOpen(false)} title="معاينة الهيدر" size="xl">
          <div className="bg-white rounded-lg overflow-hidden border border-border">
            {config.topBar.enabled && <div className="px-4 py-2 text-center text-xs" style={{ backgroundColor: config.topBar.bgColor, color: config.topBar.textColor }}>{config.topBar.text}</div>}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2" style={{ order: config.main.logoPosition === "center" ? 2 : 1 }}>
                <div className="w-8 h-8 bg-primary rounded-lg" />
                <span className="font-bold text-gray-900 text-sm">متجرنا</span>
              </div>
              <div className="flex items-center gap-4" style={{ order: config.main.menuPosition === "left" ? 0 : 2, flexDirection: config.main.menuPosition === "left" ? "row-reverse" : "row" }}>
                {["الرئيسية", "المنتجات", "المدونة", "تواصل"].map((item) => <span key={item} className="text-xs text-gray-600">{item}</span>)}
              </div>
            </div>
            <div className="px-6 py-12 text-center">
              <div className="h-4 bg-gray-100 rounded w-32 mx-auto mb-2" />
              <div className="h-3 bg-gray-50 rounded w-48 mx-auto" />
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
