"use client";

import { useState, useCallback } from "react";
import { Settings2, CreditCard, MessageCircle, BarChart3, Search, Archive, Zap, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type Plugin = {
  id: string; name: string; description: string; version: string; icon: typeof CreditCard; active: boolean; color: string; bg: string;
};

const defaultPlugins: Plugin[] = [
  { id: "stripe", name: "Stripe", description: "تكامل الدفع عبر البطاقات الائتمانية", version: "3.2.0", icon: CreditCard, active: true, color: "text-primary", bg: "bg-primary-light" },
  { id: "whatsapp", name: "WhatsApp Business", description: "إرسال إشعارات الطلبات عبر واتساب", version: "2.1.4", icon: MessageCircle, active: true, color: "text-success", bg: "bg-success-light" },
  { id: "analytics", name: "Google Analytics", description: "تتبع سلوك الزوار وتحليل حركة الموقع", version: "4.0.1", icon: BarChart3, active: true, color: "text-info", bg: "bg-info-light" },
  { id: "seo", name: "SEO Pro", description: "تحسين محركات البحث وتوليد البيانات الوصفية", version: "2.5.0", icon: Search, active: false, color: "text-text-secondary", bg: "bg-surface-hover" },
  { id: "backup", name: "Advanced Backup", description: "نسخ احتياطي تلقائي وتنقل بين السحوبات", version: "1.8.2", icon: Archive, active: true, color: "text-warning", bg: "bg-warning-light" },
  { id: "cache", name: "Speed Cache", description: "تسريع الأداء بتخزين الصفحات مؤقتاً", version: "3.0.5", icon: Zap, active: false, color: "text-text-secondary", bg: "bg-surface-hover" },
];

export default function PluginsPage() {
  const { success } = useToast();
  const [plugins, setPlugins] = useState(defaultPlugins);
  const [installModal, setInstallModal] = useState(false);
  const [pluginSearch, setPluginSearch] = useState("");
  const [installing, setInstalling] = useState(false);

  const availablePlugins = [
    { id: "new1", name: "Mailchimp", description: "تكامل التسويق عبر البريد الإلكتروني", version: "1.0.0" },
    { id: "new2", name: "PayPal", description: "بوابة دفع PayPal", version: "2.3.1" },
    { id: "new3", name: "Live Chat", description: "دردشة مباشرة مع العملاء", version: "1.5.0" },
    { id: "new4", name: "Social Login", description: "تسجيل الدخول عبر وسائل التواصل", version: "3.1.2" },
  ].filter((p) => !pluginSearch || p.name.toLowerCase().includes(pluginSearch.toLowerCase()) || p.description.includes(pluginSearch));

  const handleInstall = useCallback((name: string) => {
    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setInstallModal(false);
      setPluginSearch("");
      success("تم التثبيت", `تم تثبيت "${name}" بنجاح`);
    }, 1500);
  }, [success]);

  const togglePlugin = useCallback((id: string) => {
    setPlugins((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    const plugin = plugins.find((p) => p.id === id);
    success("تم التغيير", `تم ${plugin?.active ? "تعطيل" : "تفعيل"} ${plugin?.name}`);
  }, [plugins, success]);

  return (
    <div className="space-y-6">
      <PageHeader title="مدير الإضافات" subtitle="إدارة الإضافات والتكاملات" actions={<Button variant="secondary" icon={<Settings2 size={16} />} onClick={() => setInstallModal(true)}>تثبيت إضافة جديدة</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {plugins.map((plugin) => {
          const Icon = plugin.icon;
          return (
            <Card key={plugin.id} padding="md" className={cn("transition-all", !plugin.active && "opacity-70")}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", plugin.bg)}><span className={plugin.color}><Icon size={24} /></span></div>
                <Toggle checked={plugin.active} onChange={() => togglePlugin(plugin.id)} />
              </div>
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2"><h3 className="font-semibold text-text">{plugin.name}</h3><Badge variant="default">v{plugin.version}</Badge></div>
                <p className="text-sm text-text-secondary">{plugin.description}</p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Badge variant={plugin.active ? "success" : "default"} dot>{plugin.active ? "مفعّل" : "معطّل"}</Badge>
                <Button variant="ghost" size="sm" icon={<Settings2 size={14} />} onClick={() => success("تكوين", `تم فتح إعدادات ${plugin.name}`)}>تكوين</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {installModal && (
        <Modal open onClose={() => { setInstallModal(false); setPluginSearch(""); }} title="تثبيت إضافة جديدة" size="md">
          <div className="space-y-4">
            <Input label="بحث عن إضافة" value={pluginSearch} onChange={(e) => setPluginSearch(e.target.value)} placeholder="اكتب اسم الإضافة..." icon={<Search size={16} />} />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availablePlugins.map((plugin) => (
                <div key={plugin.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors">
                  <div>
                    <p className="text-sm font-medium text-text">{plugin.name}</p>
                    <p className="text-xs text-text-muted">{plugin.description}</p>
                  </div>
                  <Button size="sm" icon={<Download size={14} />} onClick={() => handleInstall(plugin.name)} loading={installing}>تثبيت</Button>
                </div>
              ))}
              {availablePlugins.length === 0 && <p className="text-sm text-text-muted text-center py-4">لا توجد إضافات مطابقة</p>}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => { setInstallModal(false); setPluginSearch(""); }}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
