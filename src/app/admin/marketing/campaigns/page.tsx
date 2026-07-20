"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Mail, MessageSquare, Bell, Eye, MousePointerClick, MoreVertical, Pencil, Trash2, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDateTime, generateId } from "@/lib/utils";

type EmailCampaign = {
  id: string;
  name: string;
  subject: string;
  content: string;
  sent: number;
  openRate: number;
  clickRate: number;
  status: "sent" | "draft" | "scheduled";
  sentAt: string;
};

const mockCampaigns: EmailCampaign[] = [
  { id: "1", name: "عرض الصيف الكبير - تخفيضات حصرية", subject: "خصومات تصل إلى 70%", content: "عرض الصيف الكبير على جميع المنتجات الرقمية...", sent: 12450, openRate: 42.3, clickRate: 8.7, status: "sent", sentAt: "2026-07-10T10:30:00" },
  { id: "2", name: "إطلاق المنتج الجديد - سماعات بلوتوث", subject: "منتج جديد حصري", content: "نسرع لإطلاق منتجنا الجديد...", sent: 8900, openRate: 56.1, clickRate: 12.4, status: "sent", sentAt: "2026-07-05T09:00:00" },
  { id: "3", name: "تذكير بالسلعة المتروكة في السلة", subject: "انتهت مشترياتك في انتظارك", content: "لدينا منتجات في سلتك...", sent: 3200, openRate: 38.9, clickRate: 15.2, status: "sent", sentAt: "2026-07-01T14:15:00" },
  { id: "4", name: "نشرة الإخبارية الأسبوعية - عروض رمضان", subject: "عروض رمضانية حصرية", content: "نشرة أسبوعية...", sent: 15600, openRate: 31.5, clickRate: 6.3, status: "sent", sentAt: "2026-06-28T08:00:00" },
  { id: "5", name: "تهنئة عيد الفطر المبارك", subject: "عيد مبارك سعيد", content: "نتمنى لكم عيداً مباركاً...", sent: 18200, openRate: 67.2, clickRate: 11.8, status: "sent", sentAt: "2026-06-15T07:30:00" },
  { id: "6", name: "عرض الخريف - مجموعات جديدة", subject: "مجموعات الخريف الجديدة", content: "مجموعات جديدة...", sent: 0, openRate: 0, clickRate: 0, status: "draft", sentAt: "" },
];

const campaignStatusConfig: Record<EmailCampaign["status"], { label: string; variant: "success" | "default" | "info" }> = {
  sent: { label: "تم الإرسال", variant: "success" },
  draft: { label: "مسودة", variant: "default" },
  scheduled: { label: "مجدول", variant: "info" },
};

export default function CampaignsPage() {
  const { success, error: showError, info } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EmailCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailCampaign | null>(null);
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formContent, setFormContent] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [whatsappRecipients, setWhatsappRecipients] = useState("");
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushUrl, setPushUrl] = useState("");

  const {
    filteredData,
    paginatedData,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    sortDir,
    setSort,
    page,
    setPage,
    perPage,
    setPerPage,
    add,
    update,
    remove,
    totalItems,
    totalPages,
  } = useCrud<EmailCampaign>({
    initialData: mockCampaigns,
    searchFields: ["name", "subject"],
    itemsPerPage: 10,
    defaultSortKey: "sentAt",
    defaultSortDir: "desc",
  });

  const totalSent = useMemo(() => filteredData.reduce((sum, c) => sum + c.sent, 0), [filteredData]);
  const avgOpen = useMemo(() => {
    const sent = filteredData.filter((c) => c.status === "sent");
    return sent.length ? (sent.reduce((s, c) => s + c.openRate, 0) / sent.length).toFixed(1) : "0";
  }, [filteredData]);
  const avgClick = useMemo(() => {
    const sent = filteredData.filter((c) => c.status === "sent");
    return sent.length ? (sent.reduce((s, c) => s + c.clickRate, 0) / sent.length).toFixed(1) : "0";
  }, [filteredData]);

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setFormName("");
    setFormSubject("");
    setFormContent("");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((c: EmailCampaign) => {
    setEditTarget(c);
    setFormName(c.name);
    setFormSubject(c.subject);
    setFormContent(c.content);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formSubject.trim()) {
      showError("خطأ", "يرجى إدخال اسم الحملة والموضوع");
      return;
    }
    if (editTarget) {
      update(editTarget.id, { name: formName, subject: formSubject, content: formContent });
      success("تم التحديث", `تم تحديث حملة "${formName}" بنجاح`);
    } else {
      add({ id: generateId(), name: formName, subject: formSubject, content: formContent, sent: 0, openRate: 0, clickRate: 0, status: "draft", sentAt: "" });
      success("تمت الإضافة", `تم إنشاء حملة "${formName}" بنجاح`);
    }
    setModalOpen(false);
    setEditTarget(null);
  }, [formName, formSubject, formContent, editTarget, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    success("تم الحذف", `تم حذف حملة "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, remove, success]);

  const handleSend = useCallback((c: EmailCampaign) => {
    update(c.id, { status: "sent" as const, sent: Math.floor(Math.random() * 5000) + 1000, sentAt: new Date().toISOString(), openRate: 0, clickRate: 0 });
    success("تم الإرسال", `تم إرسال حملة "${c.name}" بنجاح`);
  }, [update, success]);

  const emailColumns = useMemo(() => [
    {
      key: "name" as const, label: "اسم الحملة", sortable: true,
      render: (value: unknown) => <span className="font-medium text-text">{String(value)}</span>,
    },
    { key: "sent" as const, label: "الإرسالات", sortable: true, render: (value: unknown) => <span className="font-medium">{Number(value).toLocaleString("ar-SA")}</span> },
    {
      key: "openRate" as const, label: "معدل الفتح", sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{Number(value)}%</span>
          <div className="w-16 h-1.5 bg-bg rounded-full overflow-hidden"><div className="h-full bg-success rounded-full" style={{ width: `${Number(value)}%` }} /></div>
        </div>
      ),
    },
    {
      key: "clickRate" as const, label: "معدل النقر", sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{Number(value)}%</span>
          <div className="w-16 h-1.5 bg-bg rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Number(value)}%` }} /></div>
        </div>
      ),
    },
    {
      key: "status" as const, label: "الحالة", sortable: true,
      render: (value: unknown) => { const config = campaignStatusConfig[value as EmailCampaign["status"]]; return <Badge variant={config.variant} dot>{config.label}</Badge>; },
    },
    { key: "sentAt" as const, label: "التاريخ", sortable: true, render: (value: unknown) => value ? formatDateTime(String(value)) : "—" },
    {
      key: "id" as const, label: "", className: "w-28",
      render: (_: unknown, row: EmailCampaign) => (
        <div className="flex items-center gap-1">
          {row.status === "draft" && <Button variant="ghost" size="sm" icon={<Send size={14} />} onClick={() => handleSend(row)} title="إرسال" />}
          <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEdit(row)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ], [openEdit, handleSend]);

  const tabs = [
    { key: "email", label: "البريد الإلكتروني", icon: <Mail size={16} /> },
    { key: "whatsapp", label: "واتساب", icon: <MessageSquare size={16} /> },
    { key: "push", label: "الإشعارات", icon: <Bell size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="الحملات التسويقية" subtitle="إدارة حملات التسويق عبر القنوات المختلفة" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>إنشاء حملة</Button>} />

      <Tabs tabs={tabs} defaultKey="email" onChange={setActiveTab}>
        {((key: string) => {
          if (key === "email") {
            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Select options={[{ value: "", label: "جميع الحالات" }, { value: "sent", label: "تم الإرسال" }, { value: "draft", label: "مسودة" }, { value: "scheduled", label: "مجدول" }]} value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary"><Mail size={20} /></div>
                      <div><p className="text-sm text-text-secondary">إجمالي الإرسالات</p><p className="text-xl font-bold text-text">{totalSent.toLocaleString("ar-SA")}</p></div>
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-success"><Eye size={20} /></div>
                      <div><p className="text-sm text-text-secondary">معدل الفتح المتوسط</p><p className="text-xl font-bold text-text">{avgOpen}%</p></div>
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info"><MousePointerClick size={20} /></div>
                      <div><p className="text-sm text-text-secondary">معدل النقر المتوسط</p><p className="text-xl font-bold text-text">{avgClick}%</p></div>
                    </div>
                  </div>
                </div>
                <DataTable columns={emailColumns} data={paginatedData} emptyMessage="لا توجد حملات" rowKey="id" sortable pagination={{ currentPage: page, totalPages, totalItems, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage }} striped />
              </div>
            );
          }
          if (key === "whatsapp") return (
            <div className="space-y-4">
              <div className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-success"><MessageSquare size={20} /></div>
                  <div><p className="text-sm text-text-secondary">إرسال عبر واتساب</p><p className="text-xl font-bold text-text">0</p></div>
                </div>
              </div>
              <Card padding="md">
                <h3 className="font-semibold text-text mb-3">قالب رسالة واتساب</h3>
                <div className="space-y-3">
                  <Input label="رقم المستلمين" value={whatsappRecipients} onChange={(e) => setWhatsappRecipients(e.target.value)} placeholder="أرقام الهواتف مفصولة بفاصلة" icon={<MessageSquare size={16} />} />
                  <Textarea label="نص الرسالة" value={whatsappTemplate} onChange={(e) => setWhatsappTemplate(e.target.value)} rows={5} placeholder="مرحباً {اسم العميل}، لديك عرض خاص في متجرنا..." />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => { setWhatsappTemplate(""); setWhatsappRecipients(""); }}>مسح</Button>
                    <Button icon={<Send size={14} />} onClick={() => { if (!whatsappTemplate.trim() || !whatsappRecipients.trim()) { showError("خطأ", "يرجى إدخال الأرقام ونص الرسالة"); return; } success("تم الإرسال", "تم إرسال رسالة واتساب بنجاح"); setWhatsappTemplate(""); setWhatsappRecipients(""); }}>إرسال</Button>
                  </div>
                </div>
              </Card>
            </div>
          );
          return (
            <div className="space-y-4">
              <div className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info"><Bell size={20} /></div>
                  <div><p className="text-sm text-text-secondary">الإشعارات الفورية</p><p className="text-xl font-bold text-text">0</p></div>
                </div>
              </div>
              <Card padding="md">
                <h3 className="font-semibold text-text mb-3">إرسال إشعار فوري</h3>
                <div className="space-y-3">
                  <Input label="عنوان الإشعار" value={pushTitle} onChange={(e) => setPushTitle(e.target.value)} placeholder="عرض خاص لفترة محدودة" icon={<Bell size={16} />} />
                  <Textarea label="نص الإشعار" value={pushBody} onChange={(e) => setPushBody(e.target.value)} rows={3} placeholder="اكتشف عروضنا الحصرية..." />
                  <Input label="رابط التوجيه (اختياري)" value={pushUrl} onChange={(e) => setPushUrl(e.target.value)} placeholder="https://mystore.com/offers" dir="ltr" icon={<MousePointerClick size={16} />} />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => { setPushTitle(""); setPushBody(""); setPushUrl(""); }}>مسح</Button>
                    <Button icon={<Send size={14} />} onClick={() => { if (!pushTitle.trim() || !pushBody.trim()) { showError("خطأ", "يرجى إدخال عنوان ونص الإشعار"); return; } success("تم الإرسال", "تم إرسال الإشعار الفوري بنجاح"); setPushTitle(""); setPushBody(""); setPushUrl(""); }}>إرسال</Button>
                  </div>
                </div>
              </Card>
            </div>
          );
        }) as unknown as React.ReactNode}
      </Tabs>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="حذف الحملة" message={`هل أنت متأكد من حذف حملة "${deleteTarget?.name}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />

      {modalOpen && (
        <Modal open onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? "تعديل الحملة" : "إنشاء حملة جديدة"} size="lg">
          <div className="space-y-4">
            <Input label="اسم الحملة" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: عرض الصيف" />
            <Input label="موضوع البريد" value={formSubject} onChange={(e) => setFormSubject(e.target.value)} placeholder="موضوع الرسالة" />
            <Textarea label="محتوى الحملة" value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={6} placeholder="محتوى الحملة التسويقية..." />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setEditTarget(null); }}>إلغاء</Button>
              <Button onClick={handleSave}>{editTarget ? "حفظ التعديلات" : "إنشاء الحملة"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
