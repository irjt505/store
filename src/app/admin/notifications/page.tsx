"use client";

import { useState, useCallback } from "react";
import { Bell, Check, CheckCheck, Trash2, Settings, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Toggle } from "@/components/ui/Toggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { generateId } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "order" | "download" | "payment" | "system" | "review" | "security";
  channel: "email" | "sms" | "push" | "in_app";
  read: boolean;
  createdAt: string;
};

const typeConfig: Record<string, { label: string; color: "info" | "success" | "warning" | "danger" | "purple" | "default" }> = {
  order: { label: "طلب", color: "info" },
  download: { label: "تحميل", color: "success" },
  payment: { label: "دفع", color: "warning" },
  system: { label: "نظام", color: "default" },
  review: { label: "تقييم", color: "purple" },
  security: { label: "أمان", color: "danger" },
};

const initialNotifications: Notification[] = [
  { id: "1", title: "طلب جديد #1234", message: "تم استلام طلب جديد من أحمد بقيمة 250﷼", type: "order", channel: "in_app", read: false, createdAt: "2026-04-16 14:30" },
  { id: "2", title: "تحميل جديد", message: "قام سارة بتحميل ملفات الدورة التعليمية", type: "download", channel: "in_app", read: false, createdAt: "2026-04-16 13:15" },
  { id: "3", title: "دفعة مستلمة", message: "تم استلام دفعة بقيمة 1,500﷼ عبر Stripe", type: "payment", channel: "email", read: false, createdAt: "2026-04-16 12:00" },
  { id: "4", title: "تحديث النظام", message: "تم تحديث النظام إلى الإصدار 2.5.0 بنجاح", type: "system", channel: "in_app", read: true, createdAt: "2026-04-16 10:00" },
  { id: "5", title: "تقييم جديدة", message: "أضاف خالد تقييم 5 نجوم لمنتج TypeScript المتقدم", type: "review", channel: "in_app", read: true, createdAt: "2026-04-15 18:30" },
  { id: "6", title: "تنبيه أمني", message: "تم اكتشاف 5 محاولات تسجيل دخول فاشلة من IP: 192.168.1.100", type: "security", channel: "email", read: false, createdAt: "2026-04-15 16:45" },
  { id: "7", title: "طلب جديد #1233", message: "تم استلام طلب من نورة بقيمة 199﷼", type: "order", channel: "push", read: true, createdAt: "2026-04-15 14:00" },
  { id: "8", title: "اشتراك جديد", message: "قام عمر بالاشتراك في الخطة الشهرية بقيمة 49﷼", type: "payment", channel: "in_app", read: true, createdAt: "2026-04-15 11:30" },
  { id: "9", title: "نفاذ المخزون", message: "المنتج 'حزمة المطور الشاملة' وصل لنهاية الترخيص", type: "system", channel: "email", read: false, createdAt: "2026-04-14 20:00" },
  { id: "10", title: "طلب جديد #1232", message: "تم استلام طلب من فاطمة بقيمة 129﷼", type: "order", channel: "in_app", read: true, createdAt: "2026-04-14 15:30" },
];

export default function NotificationsPage() {
  const { success, error: showError, info } = useToast();
  const [settingsModal, setSettingsModal] = useState(false);
  const [settings, setSettings] = useState({ email: true, sms: false, push: true, inApp: true });
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const {
    data: notifications,
    filteredData,
    filters,
    setFilter,
    sortKey,
    sortDir,
    setSort,
    page,
    setPage,
    perPage,
    setPerPage,
    update,
    remove,
    removeMany,
    totalItems,
    totalPages,
  } = useCrud<Notification>({
    initialData: initialNotifications,
    itemsPerPage: 10,
    defaultSortKey: "createdAt",
    defaultSortDir: "desc",
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    update(id, { read: true });
    info("تم", "تم تحديد الإشعار كمقروء");
  }, [update, info]);

  const markAllRead = useCallback(() => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    removeMany(unreadIds);
    unreadIds.forEach((id) => {
      const n = notifications.find((x) => x.id === id);
      if (n) remove(id);
    });
    notifications.forEach((n) => { if (!n.read) update(n.id, { read: true }); });
    success("تم", "تم تحديد جميع الإشعارات كمقروءة");
  }, [notifications, update, remove, removeMany, success]);

  const deleteNotification = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", "تم حذف الإشعار");
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const clearAll = useCallback(() => {
    const ids = notifications.map((n) => n.id);
    removeMany(ids);
    success("تم", "تم حذف جميع الإشعارات");
    setClearAllOpen(false);
  }, [notifications, removeMany, success]);

  const saveSettings = useCallback(() => {
    success("تم الحفظ", "تم حفظ إعدادات الإشعارات");
    setSettingsModal(false);
  }, [success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإشعارات"
        subtitle="إدارة إشعارات النظام والتنبيهات"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<CheckCheck size={16} />} onClick={markAllRead}>تحديد الكل كمقروء</Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setClearAllOpen(true)}>حذف الكل</Button>
            <Button variant="ghost" icon={<Settings size={16} />} onClick={() => setSettingsModal(true)}>الإعدادات</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Bell size={20} className="text-primary" /></div>
            <div><p className="text-2xl font-bold text-text">{notifications.length}</p><p className="text-xs text-text-muted">إجمالي الإشعارات</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10"><Badge variant="danger">{unreadCount}</Badge></div>
            <div><p className="text-2xl font-bold text-text">{unreadCount}</p><p className="text-xs text-text-muted">غير مقروءة</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><CheckCheck size={20} className="text-success" /></div>
            <div><p className="text-2xl font-bold text-text">{notifications.length - unreadCount}</p><p className="text-xs text-text-muted">مقروءة</p></div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><Bell size={20} className="text-warning" /></div>
            <div><p className="text-2xl font-bold text-text">{notifications.filter((n) => n.type === "security").length}</p><p className="text-xs text-text-muted">تنبيهات أمنية</p></div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={[{ value: "", label: "جميع الأنواع" }, ...Object.entries(typeConfig).map(([k, v]) => ({ value: k, label: v.label }))]}
          value={filters.type || ""}
          onChange={(e) => setFilter("type", e.target.value)}
        />
        <Select
          options={[{ value: "", label: "الكل" }, { value: "true", label: "غير مقروءة" }, { value: "false", label: "مقروءة" }]}
          value={filters.read || ""}
          onChange={(e) => setFilter("read", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-text-muted">لا توجد إشعارات</div>
        ) : (
          filteredData.map((n) => {
            const config = typeConfig[n.type] || typeConfig.system;
            return (
              <Card key={n.id} padding="sm" className={`${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-${config.color}/10`}>
                    <Bell size={18} className={`text-${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm ${!n.read ? "font-semibold" : "font-medium"} text-text`}>{n.title}</h4>
                      <Badge variant={config.color} className="text-[10px]">{config.label}</Badge>
                      {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{n.message}</p>
                    <p className="text-xs text-text-muted mt-1">{n.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <Button variant="ghost" size="sm" icon={<Check size={14} />} onClick={() => markAsRead(n.id)} title="تحديد كمقروء" />
                    )}
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(n)} />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
          onItemsPerPageChange={setPerPage}
        />
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteNotification} title="حذف الإشعار" message="هل أنت متأكد من حذف هذا الإشعار؟" confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
      <ConfirmDialog open={clearAllOpen} onClose={() => setClearAllOpen(false)} onConfirm={clearAll} title="حذف جميع الإشعارات" message="هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع." confirmLabel="حذف الكل" cancelLabel="إلغاء" variant="danger" />

      {settingsModal && (
        <Modal open onClose={() => setSettingsModal(false)} title="إعدادات الإشعارات" size="md">
          <div className="space-y-4">
            <Toggle checked={settings.email} onChange={(v) => setSettings((p) => ({ ...p, email: v }))} label="البريد الإلكتروني" description="استلام إشعارات عبر البريد" />
            <Toggle checked={settings.sms} onChange={(v) => setSettings((p) => ({ ...p, sms: v }))} label="رسائل SMS" description="استلام إشعارات عبر الرسائل النصية" />
            <Toggle checked={settings.push} onChange={(v) => setSettings((p) => ({ ...p, push: v }))} label="إشعارات الدفع" description="استلام إشعارات فورية على الجهاز" />
            <Toggle checked={settings.inApp} onChange={(v) => setSettings((p) => ({ ...p, inApp: v }))} label="إشعارات التطبيق" description="عرض الإشعارات داخل لوحة التحكم" />
            <div className="flex justify-end pt-2">
              <Button onClick={saveSettings}>حفظ</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
