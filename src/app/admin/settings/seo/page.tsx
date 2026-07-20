"use client";

import { useState, useCallback, useRef } from "react";
import { Save, Upload, RefreshCw, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";

export default function SEOSettingsPage() {
  const { success, info } = useToast();
  const [loading, setLoading] = useState(false);
  const [titleTemplate, setTitleTemplate] = useState("{product_name} | {store_name}");
  const [metaDesc, setMetaDesc] = useState("تسوّق من {store_name} - أفضل المنتجات بأسعار مميزة مع شحن سريع ودفع آمن");
  const [autoSitemap, setAutoSitemap] = useState(true);
  const [indexEnabled, setIndexEnabled] = useState(true);
  const [followEnabled, setFollowEnabled] = useState(true);
  const [robotsTxt, setRobotsTxt] = useState("User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /checkout/\nSitemap: https://mystore.com/sitemap.xml");
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  const handleOgImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setOgImagePreview(reader.result as string); success("تم الرفع", "تم رفع صورة OG بنجاح"); };
    reader.readAsDataURL(file);
  }, [success]);

  const handleSave = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setLoading(false); success("تم الحفظ", "تم حفظ إعدادات SEO بنجاح"); }, 500);
  }, [success]);

  const handleRefreshSitemap = useCallback(() => {
    info("تم التحديث", "جاري تحديث خريطة الموقع...");
  }, [info]);

  return (
    <div className="space-y-6">
      <PageHeader title="تحسين محركات البحث" subtitle="تحسين ظهور المتجر في نتائج البحث" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card header={<h3 className="font-semibold text-text">SEO عام</h3>} padding="md">
          <div className="space-y-4">
            <Input label="قالب العنوان (Meta Title)" value={titleTemplate} onChange={(e) => setTitleTemplate(e.target.value)} helperText="المتغيرات: {product_name}, {store_name}, {category}" />
            <Textarea label="الوصف الافتراضي (Meta Description)" rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} />
            <p className="text-xs text-text-muted">يُفضل أن يكون بين 150-160 حرفاً</p>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">صورة OG الافتراضية</label>
              <div className="flex items-center gap-4">
                <input ref={ogImageInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleOgImageUpload} />
                <div className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-hover overflow-hidden">
                  {ogImagePreview ? <img src={ogImagePreview} alt="صورة OG" className="h-full w-full object-cover" /> : <Upload size={20} className="text-text-muted" />}
                </div>
                <div><Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => ogImageInputRef.current?.click()}>رفع صورة</Button><p className="mt-1.5 text-xs text-text-muted">1200×630 بكسل، PNG أو JPG</p></div>
              </div>
            </div>
          </div>
        </Card>
        <Card header={<h3 className="font-semibold text-text">خريطة الموقع</h3>} padding="md">
          <div className="space-y-5">
            <Toggle checked={autoSitemap} onChange={setAutoSitemap} label="إنشاء خريطة الموقع تلقائياً" description="تحديث sitemap.xml تلقائياً عند تغيير المحتوى" />
            <div className="rounded-lg bg-surface-hover p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-text">آخر تحديث</p><p className="text-xs text-text-muted">18 يوليو 2026 - 10:30 ص</p></div>
                <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={handleRefreshSitemap}>تحديث</Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink size={14} className="text-primary" />
              <span className="text-primary hover:underline cursor-pointer">عرض sitemap.xml</span>
            </div>
          </div>
        </Card>
        <Card header={<h3 className="font-semibold text-text">الفهرسة</h3>} padding="md" className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-5">
              <Toggle checked={indexEnabled} onChange={setIndexEnabled} label="السماح بالفهرسة (Index)" description="السماح لمحركات البحث بفهرسة صفحات المتجر" />
              <Toggle checked={followEnabled} onChange={setFollowEnabled} label="السماح بالمتابعة (Follow)" description="السماح لمحركات البحث بمتابعة الروابط" />
            </div>
            <Textarea label="ملف robots.txt مخصص" rows={8} value={robotsTxt} onChange={(e) => setRobotsTxt(e.target.value)} className="font-mono text-xs" />
          </div>
        </Card>
      </div>
      <div className="flex justify-end"><Button onClick={handleSave} loading={loading} icon={<Save size={16} />}>حفظ التغييرات</Button></div>
    </div>
  );
}
