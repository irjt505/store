"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, Undo2, Palette, Type, Layout, Sliders } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type ThemeConfig = {
  colors: { primary: string; background: string; text: string; card: string; accent: string };
  typography: { fontFamily: string; headingSize: number; bodySize: number };
  borders: { radius: string; style: string; color: string };
  layout: { maxWidth: string; sidebarPosition: string; contentWidth: string };
};

const defaultConfig: ThemeConfig = {
  colors: { primary: "#2563EB", background: "#FFFFFF", text: "#111827", card: "#F9FAFB", accent: "#7C3AED" },
  typography: { fontFamily: "Cairo", headingSize: 32, bodySize: 16 },
  borders: { radius: "0.75rem", style: "solid", color: "#E5E7EB" },
  layout: { maxWidth: "1280px", sidebarPosition: "right", contentWidth: "full" },
};

const fontOptions = [
  { value: "Cairo", label: "Cairo (القاهرة)" },
  { value: "Tajawal", label: "Tajawal (تجوال)" },
  { value: "Noto Sans Arabic", label: "Noto Sans Arabic" },
  { value: "Almarai", label: "Almarai (المرعي)" },
  { value: "IBM Plex Sans Arabic", label: "IBM Plex Sans Arabic" },
];

const colorFields = [
  { key: "primary" as const, label: "اللون الأساسي" },
  { key: "background" as const, label: "لون الخلفية" },
  { key: "text" as const, label: "لون النص" },
  { key: "card" as const, label: "لون البطاقات" },
  { key: "accent" as const, label: "لون التمييز" },
];

export default function ThemeEditorPage() {
  const { success } = useToast();
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [original] = useState<ThemeConfig>(defaultConfig);

  const updateColor = useCallback((key: keyof ThemeConfig["colors"], value: string) => {
    setConfig((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  }, []);

  const updateTypography = useCallback((key: keyof ThemeConfig["typography"], value: string | number) => {
    setConfig((prev) => ({ ...prev, typography: { ...prev.typography, [key]: value } }));
  }, []);

  const updateBorders = useCallback((key: keyof ThemeConfig["borders"], value: string) => {
    setConfig((prev) => ({ ...prev, borders: { ...prev.borders, [key]: value } }));
  }, []);

  const updateLayout = useCallback((key: keyof ThemeConfig["layout"], value: string) => {
    setConfig((prev) => ({ ...prev, layout: { ...prev.layout, [key]: value } }));
  }, []);

  const handleSave = useCallback(() => {
    success("تم الحفظ", "تم حفظ إعدادات السمة بنجاح");
  }, [success]);

  const handleReset = useCallback(() => {
    setConfig(original);
    success("تمت إعادة التعيين", "تمت إعادة تعيين السمة للإعدادات الافتراضية");
  }, [original, success]);

  const tabs = [
    { key: "colors", label: "الألوان", icon: <Palette size={16} /> },
    { key: "typography", label: "الخطوط", icon: <Type size={16} /> },
    { key: "borders", label: "الحواف", icon: <Sliders size={16} /> },
    { key: "layout", label: "التخطيط", icon: <Layout size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="محرر السمة" subtitle="تخصيص مظهر المتجر" actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Undo2 size={16} />} onClick={handleReset}>إعادة تعيين</Button>
          <Button icon={<Save size={16} />} onClick={handleSave}>حفظ</Button>
        </div>
      } />

      <div className="flex gap-6 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-[3] rounded-xl border border-border overflow-hidden"
        >
          <div className="h-8 bg-bg border-b border-border flex items-center px-4 gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="flex-1 text-center text-xs text-text-muted">معاينة الموقع</span>
          </div>
          <div className="relative h-full min-h-[550px]" style={{ backgroundColor: config.colors.background }}>
            <div className="h-16 flex items-center justify-between px-8 border-b" style={{ borderColor: config.colors.card, backgroundColor: config.colors.card }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: config.colors.primary }} />
                <span className="font-bold" style={{ color: config.colors.text, fontSize: `${config.typography.headingSize * 0.5}px` }}>متجرنا</span>
              </div>
              <div className="flex items-center gap-6">
                {["الرئيسية", "المنتجات", "المدونة", "تواصل معنا"].map((item) => (
                  <span key={item} className="text-sm" style={{ color: config.colors.text, fontFamily: config.typography.fontFamily }}>{item}</span>
                ))}
              </div>
            </div>
            <div className="px-8 py-16 text-center">
              <h1 className="font-bold mb-4" style={{ color: config.colors.text, fontSize: `${config.typography.headingSize}px`, fontFamily: config.typography.fontFamily }}>مرحباً بكم في متجرنا</h1>
              <p className="mb-6" style={{ color: config.colors.text, fontSize: `${config.typography.bodySize}px`, fontFamily: config.typography.fontFamily, opacity: 0.7 }}>اكتشف أفضل المنتجات بأفضل الأسعار</p>
              <div className="inline-block px-6 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: config.colors.primary }}>تصفح المنتجات</div>
            </div>
            <div className="px-8 pb-12">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: config.colors.card, borderColor: config.colors.card }}>
                    <div className="h-32 rounded-lg mb-3" style={{ backgroundColor: config.colors.background }} />
                    <h3 className="font-semibold text-sm mb-1" style={{ color: config.colors.text, fontFamily: config.typography.fontFamily }}>منتج تجريبي {i}</h3>
                    <p className="text-sm font-bold" style={{ color: config.colors.primary }}>199 ر.س</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
              <span className="bg-white/90 px-6 py-3 rounded-lg text-sm font-medium text-text-secondary shadow-lg">معاينة مباشرة</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-[2]"
        >
          <Card padding="none">
            <Tabs tabs={tabs} defaultKey="colors">
              {((key: string) => (
                <div className="px-6 py-4 space-y-5">
                  {key === "colors" && colorFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text">{field.label}</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={config.colors[field.key]} onChange={(e) => updateColor(field.key, e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5" />
                        <input type="text" value={config.colors[field.key]} onChange={(e) => updateColor(field.key, e.target.value)} className="w-24 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text font-mono text-center" />
                      </div>
                    </div>
                  ))}
                  {key === "typography" && (
                    <>
                      <Select label="الخط الأساسي" options={fontOptions} value={config.typography.fontFamily} onChange={(e) => updateTypography("fontFamily", e.target.value)} />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-text">حجم خط العناوين</label>
                          <span className="text-sm text-text-muted font-mono">{config.typography.headingSize}px</span>
                        </div>
                        <input type="range" min={16} max={48} value={config.typography.headingSize} onChange={(e) => updateTypography("headingSize", Number(e.target.value))} className="w-full h-2 bg-bg rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-text">حجم خط النص</label>
                          <span className="text-sm text-text-muted font-mono">{config.typography.bodySize}px</span>
                        </div>
                        <input type="range" min={12} max={24} value={config.typography.bodySize} onChange={(e) => updateTypography("bodySize", Number(e.target.value))} className="w-full h-2 bg-bg rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                      <div className="pt-2">
                        <label className="text-sm font-medium text-text mb-2 block">معاينة الخط</label>
                        <div className="p-4 rounded-lg bg-bg border border-border" style={{ fontFamily: config.typography.fontFamily }}>
                          <h3 style={{ fontSize: `${config.typography.headingSize}px` }} className="font-bold mb-2">عنوان تجريبي</h3>
                          <p style={{ fontSize: `${config.typography.bodySize}px` }} className="text-text-secondary">هذا نص تجريبي للتحقق من شكل الخط في الموقع.</p>
                        </div>
                      </div>
                    </>
                  )}
                  {key === "borders" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-text block mb-1.5">نصف قطر الحواف</label>
                        <div className="flex items-center gap-3">
                          {["0rem", "0.25rem", "0.5rem", "0.75rem", "1rem", "9999px"].map((r) => (
                            <button key={r} onClick={() => updateBorders("radius", r)} className={cn("w-10 h-10 rounded-lg border-2 transition-colors cursor-pointer flex items-center justify-center", config.borders.radius === r ? "border-primary bg-primary/5" : "border-border hover:border-border")} style={{ borderRadius: r }}>
                              <div className="w-5 h-5 bg-primary" style={{ borderRadius: r }} />
                            </button>
                          ))}
                        </div>
                        <Input value={config.borders.radius} onChange={(e) => updateBorders("radius", e.target.value)} className="mt-2" dir="ltr" />
                      </div>
                      <Select label="نمط الحواف" options={[{ value: "solid", label: "خط مستقيم" }, { value: "dashed", label: "خط متقطع" }, { value: "dotted", label: "خط منقط" }]} value={config.borders.style} onChange={(e) => updateBorders("style", e.target.value)} />
                      <div>
                        <label className="text-sm font-medium text-text block mb-1.5">لون الحواف</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={config.borders.color} onChange={(e) => updateBorders("color", e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5" />
                          <input type="text" value={config.borders.color} onChange={(e) => updateBorders("color", e.target.value)} className="w-24 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text font-mono text-center" />
                        </div>
                      </div>
                    </>
                  )}
                  {key === "layout" && (
                    <>
                      <Select label="العرض الأقصى للمحتوى" options={[{ value: "960px", label: "960px (ضيق)" }, { value: "1024px", label: "1024px" }, { value: "1280px", label: "1280px (افتراضي)" }, { value: "1440px", label: "1440px" }, { value: "100%", label: "عرض كامل" }]} value={config.layout.maxWidth} onChange={(e) => updateLayout("maxWidth", e.target.value)} />
                      <Select label="موضع الشريط الجانبي" options={[{ value: "right", label: "يمين" }, { value: "left", label: "يسار" }, { value: "none", label: "بدون" }]} value={config.layout.sidebarPosition} onChange={(e) => updateLayout("sidebarPosition", e.target.value)} />
                      <Select label="عرض المحتوى" options={[{ value: "full", label: "عرض كامل" }, { value: "narrow", label: "ضيق (أفضل للقراءة)" }, { value: "boxed", label: "إطاري" }]} value={config.layout.contentWidth} onChange={(e) => updateLayout("contentWidth", e.target.value)} />
                    </>
                  )}
                </div>
              )) as unknown as React.ReactNode}
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
