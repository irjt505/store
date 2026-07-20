"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Eye, Send, Mail, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchInput } from "@/components/ui/SearchInput";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatDate, generateId } from "@/lib/utils";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  lastEdited: string;
  status: "active" | "inactive";
  [key: string]: unknown;
};

const initialTemplates: EmailTemplate[] = [
  { id: "1", name: "تأكيد الطلب", subject: "تم استلام طلبك #{{order_id}}", body: "مرحباً {{customer_name}},\n\nشكراً لك! تم استلام طلبك بنجاح.\n\nرقم الطلب: {{order_id}}\n\nمع تحياتنا،\n{{store_name}}", category: "طلبات", lastEdited: "2026-04-15", status: "active" },
  { id: "2", name: "رابط التحميل", subject: "ملفاتك جاهزة للتحميل", body: "مرحباً {{customer_name}},\n\nيمكنك تحميل الملفات من الرابط التالي:\n{{download_url}}\n\nمع تحياتنا،\n{{store_name}}", category: "منتجات رقمية", lastEdited: "2026-04-14", status: "active" },
  { id: "3", name: "ترحيب بالعميل", subject: "مرحباً بك في {{store_name}}", body: "مرحباً {{customer_name}}!\n\nيسعدنا انضمامك إلى {{store_name}}.\n\nمع تحياتنا،\n{{store_name}}", category: "حساب", lastEdited: "2026-04-10", status: "active" },
  { id: "4", name: "فاتورة الطلب", subject: "فاتورة طلبك #{{order_id}}", body: "مرحباً {{customer_name}},\n\nإليك فاتورة طلبك #{{order_id}}.\n\nمع تحياتنا،\n{{store_name}}", category: "طلبات", lastEdited: "2026-04-08", status: "active" },
  { id: "5", name: "تجديد الاشتراك", subject: "تجديد اشتراكك {{plan_name}}", body: "مرحباً {{customer_name}},\n\nاشتراكك في {{plan_name}} على وشك الانتهاء.\n\nمع تحياتنا،\n{{store_name}}", category: "اشتراكات", lastEdited: "2026-04-05", status: "active" },
  { id: "6", name: "إعادة تعيين كلمة المرور", subject: "طلب إعادة تعيين كلمة المرور", body: "مرحباً {{customer_name}},\n\nتلقينا طلباً لإعادة تعيين كلمة المرور.\n\n{{reset_url}}\n\nمع تحياتنا،\n{{store_name}}", category: "حساب", lastEdited: "2026-03-20", status: "active" },
  { id: "7", name: "عرض خاص", subject: "عرض حصري خاص بك — خصم {{discount}}%", body: "مرحباً {{customer_name}},\n\nلدينا عرض خاص لك: خصم {{discount}}%!\n\n{{coupon_code}}\n\nمع تحياتنا،\n{{store_name}}", category: "تسويق", lastEdited: "2026-03-15", status: "inactive" },
  { id: "8", name: "تقييم المنتج", subject: "كيف كانت تجربتك مع {{product_name}}؟", body: "مرحباً {{customer_name}},\n\nنود أن نعرف رأيك في {{product_name}}.\n\n{{review_url}}\n\nمع تحياتنا،\n{{store_name}}", category: "متابعة", lastEdited: "2026-03-10", status: "inactive" },
];

const categoryColors: Record<string, "default" | "info" | "success" | "warning" | "purple" | "danger"> = {
  "طلبات": "info", "منتجات رقمية": "success", "حساب": "default", "اشتراكات": "warning", "تسويق": "purple", "متابعة": "danger",
};

export default function EmailTemplatesPage() {
  const { success, error: showError, info } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewModal, setPreviewModal] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testModal, setTestModal] = useState<EmailTemplate | null>(null);
  const [deleteModal, setDeleteModal] = useState<EmailTemplate | null>(null);
  const [editModal, setEditModal] = useState<EmailTemplate | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", subject: "", body: "", category: "طلبات" });

  const {
    data: templates,
    filteredData,
    search,
    setSearch,
    add,
    update,
    remove,
  } = useCrud<EmailTemplate>({
    initialData: initialTemplates,
    searchFields: ["name", "subject", "category"],
    itemsPerPage: 100,
    defaultSortKey: "lastEdited",
    defaultSortDir: "desc",
  });

  const openEdit = useCallback((t: EmailTemplate) => {
    setEditModal(t);
    setEditForm({ name: t.name, subject: t.subject, body: t.body, category: t.category });
  }, []);

  const openCreate = useCallback(() => {
    setEditModal(null);
    setEditForm({ name: "", subject: "", body: "", category: "طلبات" });
    setCreateModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editForm.name.trim() || !editForm.subject.trim()) {
      showError("خطأ", "يرجى إدخال اسم القالب والموضوع");
      return;
    }
    if (editModal) {
      update(editModal.id, { name: editForm.name, subject: editForm.subject, body: editForm.body, category: editForm.category, lastEdited: new Date().toISOString().split("T")[0] });
      success("تم التحديث", `تم تحديث قالب "${editForm.name}" بنجاح`);
    } else {
      add({ id: generateId(), name: editForm.name, subject: editForm.subject, body: editForm.body, category: editForm.category, lastEdited: new Date().toISOString().split("T")[0], status: "active" });
      success("تمت الإضافة", `تم إنشاء قالب "${editForm.name}" بنجاح`);
    }
    setEditModal(null);
    setCreateModal(false);
    setEditForm({ name: "", subject: "", body: "", category: "طلبات" });
  }, [editForm, editModal, add, update, success, showError]);

  const handleDelete = useCallback(() => {
    if (!deleteModal) return;
    remove(deleteModal.id);
    if (selectedTemplate?.id === deleteModal.id) setSelectedTemplate(null);
    success("تم الحذف", `تم حذف قالب "${deleteModal.name}" بنجاح`);
    setDeleteModal(null);
  }, [deleteModal, selectedTemplate, remove, success]);

  const handleTestSend = useCallback(() => {
    if (!testEmail.trim()) {
      showError("خطأ", "يرجى إدخال البريد الإلكتروني");
      return;
    }
    info("تم الإرسال", `تم إرسال بريد اختباري إلى ${testEmail}`);
    setTestModal(null);
    setTestEmail("");
  }, [testEmail, info, showError]);

  const handleCopyVar = useCallback((v: string) => {
    navigator.clipboard.writeText(v);
    info("تم النسخ", `تم نسخ المتغير ${v}`);
  }, [info]);

  const toggleStatus = useCallback((t: EmailTemplate) => {
    update(t.id, { status: t.status === "active" ? "inactive" : "active" });
    success("تم التغيير", `تم ${t.status === "active" ? "تعطيل" : "تفعيل"} قالب "${t.name}"`);
  }, [update, success]);

  const tabs = [
    { key: "templates", label: "القوالب", icon: <Mail size={16} /> },
    { key: "editor", label: "محرر القالب", icon: <Pencil size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="قوالب البريد الإلكتروني" subtitle="إدارة قوالب الرسائل التلقائية" actions={<Button icon={<Plus size={16} />} onClick={openCreate}>قالب جديد</Button>} />

      <SearchInput placeholder="بحث بالاسم أو الموضوع..." value={search} onChange={setSearch} className="w-72" />

      <Tabs tabs={tabs} defaultKey="templates">
        {(activeKey: string) => {
          if (activeKey === "templates") {
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map((t) => (
                    <Card key={t.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate?.id === t.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedTemplate(t)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-text">{t.name}</h3>
                          <p className="text-xs text-text-muted mt-1" dir="ltr">{t.subject}</p>
                        </div>
                        <Badge variant={categoryColors[t.category] || "default"}>{t.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>آخر تعديل: {t.lastEdited}</span>
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(t); }}>
                          <Badge variant={t.status === "active" ? "success" : "default"} dot className="cursor-pointer">{t.status === "active" ? "نشط" : "غير نشط"}</Badge>
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" icon={<Pencil size={12} />} onClick={() => openEdit(t)}>تعديل</Button>
                        <Button variant="ghost" size="sm" icon={<Eye size={12} />} onClick={() => setPreviewModal(t)}>معاينة</Button>
                        <Button variant="ghost" size="sm" icon={<Send size={12} />} onClick={() => setTestModal(t)}>اختبار</Button>
                        <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} className="text-danger hover:text-danger" onClick={() => setDeleteModal(t)} />
                      </div>
                    </Card>
                  ))}
                </div>
                {filteredData.length === 0 && <p className="text-center text-text-muted py-8">لا توجد قوالب تطابق البحث</p>}
              </div>
            );
          }
          return (
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text">محرر القالب</h3>
                <p className="text-sm text-text-muted">اختر قالباً من القائمة لتعديله هنا</p>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <Input label="اسم القالب" value={selectedTemplate.name} readOnly />
                    <Input label="الموضوع" value={selectedTemplate.subject} readOnly />
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">المتغيرات المتاحة</label>
                      <div className="flex flex-wrap gap-2">
                        {["{{customer_name}}", "{{order_id}}", "{{store_name}}", "{{download_url}}", "{{product_name}}", "{{plan_name}}", "{{discount}}", "{{coupon_code}}", "{{reset_url}}", "{{review_url}}"].map((v) => (
                          <code key={v} className="text-xs bg-bg px-2 py-1 rounded border border-border font-mono cursor-pointer hover:bg-primary/10" onClick={() => handleCopyVar(v)}>{v}</code>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-bg p-4">
                      <p className="text-sm text-text-secondary whitespace-pre-line">{selectedTemplate.body}</p>
                    </div>
                    <Button onClick={() => setPreviewModal(selectedTemplate)} icon={<Eye size={14} />}>معاينة القالب</Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-muted">اختر قالباً من تبويب القوالب</div>
                )}
              </div>
            </Card>
          );
        }}
      </Tabs>

      {previewModal && (
        <Modal open onClose={() => setPreviewModal(null)} title={`معاينة — ${previewModal.name}`} size="lg">
          <div className="bg-white rounded-lg border border-border p-6 text-center">
            <div className="mb-4"><Mail size={48} className="mx-auto text-primary" /></div>
            <h2 className="text-xl font-bold text-text mb-2">{previewModal.subject}</h2>
            <div className="border-t border-border pt-4 mt-4 text-sm text-text-secondary text-right">
              <p className="whitespace-pre-line">{previewModal.body.replace(/\{\{customer_name}\}/g, "أحمد").replace(/\{\{store_name}\}/g, "متجرنا").replace(/\{\{order_id}\}/g, "#12345").replace(/\{\{download_url}\}/g, "https://example.com/download").replace(/\{\{product_name}\}/g, "المنتج").replace(/\{\{plan_name}\}/g, "الخطة").replace(/\{\{discount}\}/g, "20").replace(/\{\{coupon_code}\}/g, "CODE20").replace(/\{\{reset_url}\}/g, "https://example.com/reset").replace(/\{\{review_url}\}/g, "https://example.com/review")}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4"><Button variant="secondary" onClick={() => setPreviewModal(null)}>إغلاق</Button></div>
        </Modal>
      )}

      {testModal && (
        <Modal open onClose={() => setTestModal(null)} title={`اختبار إرسال — ${testModal.name}`} size="sm">
          <div className="space-y-4">
            <Input label="البريد الإلكتروني للاختبار" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" dir="ltr" />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setTestModal(null)}>إلغاء</Button>
              <Button onClick={handleTestSend} icon={<Send size={14} />}>إرسال اختباري</Button>
            </div>
          </div>
        </Modal>
      )}

      {(editModal || createModal) && (
        <Modal open onClose={() => { setEditModal(null); setCreateModal(false); }} title={editModal ? `تعديل — ${editModal.name}` : "قالب جديد"} size="lg">
          <div className="space-y-4">
            <Input label="اسم القالب" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            <Input label="الموضوع" value={editForm.subject} onChange={(e) => setEditForm((p) => ({ ...p, subject: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">التصنيف</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(categoryColors).map((cat) => (
                  <button key={cat} onClick={() => setEditForm((p) => ({ ...p, category: cat }))} className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${editForm.category === cat ? "bg-primary text-white border-primary" : "bg-surface text-text border-border hover:border-primary/50"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <Textarea label="محتوى الرسالة" value={editForm.body} onChange={(e) => setEditForm((p) => ({ ...p, body: e.target.value }))} rows={12} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setEditModal(null); setCreateModal(false); }}>إلغاء</Button>
              <Button onClick={handleSaveEdit} icon={<CheckCircle size={14} />}>{editModal ? "حفظ التعديلات" : "إنشاء القالب"}</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title="حذف القالب" message={`هل أنت متأكد من حذف القالب "${deleteModal?.name}"؟ لا يمكن التراجع.`} confirmLabel="حذف" cancelLabel="إلغاء" variant="danger" />
    </div>
  );
}
