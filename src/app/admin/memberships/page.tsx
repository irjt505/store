"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Crown,
  Users,
  DollarSign,
  Eye,
  Pencil,
  Trash2,
  Plus,
  XCircle,
  Check,
  Shield,
  Clock,
  Mail,
  User,
  Tag,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { StatCard } from "@/components/ui/StatCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useCrud } from "@/lib/hooks/useCrud";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";

type MembershipTier = {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  memberCount: number;
  features: string[];
  status: "active" | "inactive";
  color: string;
};

type MembershipMember = {
  id: string;
  name: string;
  email: string;
  tier: string;
  joinDate: string;
  expiresAt: string;
  status: "active" | "expired" | "cancelled";
  totalPaid: number;
};

const initialTiers: MembershipTier[] = [
  { id: "tier-1", name: "باقة أساسية", price: 29, interval: "monthly", memberCount: 142, features: ["وصول للمحتوى الأساسي", "دعم فني عبر البريد", "تحديثات شهرية"], status: "active", color: "#6366f1" },
  { id: "tier-2", name: "باقة احترافية", price: 79, interval: "monthly", memberCount: 89, features: ["جميع مميزات الباقة الأساسية", "وصول حصري للمحتوى", "دعم فني مباشر", "شهادات إتمام"], status: "active", color: "#8b5cf6" },
  { id: "tier-3", name: "باقة مؤسسات", price: 199, interval: "monthly", memberCount: 34, features: ["جميع مميزات الباقة الاحترافية", "حسابات متعددة", "تخصيص كامل", "مدير حساب مخصص"], status: "active", color: "#ec4899" },
  { id: "tier-4", name: "باقة سنوية", price: 249, interval: "yearly", memberCount: 67, features: ["جميع مميزات الباقة الاحترافية", "خصم 25%", "وصول مبكر للتحديثات", "دعم أولوية"], status: "active", color: "#f59e0b" },
  { id: "tier-5", name: "باقة تجريبية", price: 0, interval: "monthly", memberCount: 210, features: ["وصول محدود للمحتوى", "دعم عبر المجتمع"], status: "inactive", color: "#64748b" },
];

const initialMembers: MembershipMember[] = [
  { id: "mem-001", name: "أحمد بن محمد", email: "ahmed@example.com", tier: "باقة احترافية", joinDate: "2024-01-15", expiresAt: "2024-02-15", status: "active", totalPaid: 948 },
  { id: "mem-002", name: "سارة العلي", email: "sara@example.com", tier: "باقة مؤسسات", joinDate: "2023-06-20", expiresAt: "2024-06-20", status: "active", totalPaid: 2388 },
  { id: "mem-003", name: "محمد الفهد", email: "mohammed@example.com", tier: "باقة أساسية", joinDate: "2023-09-10", expiresAt: "2023-12-10", status: "expired", totalPaid: 87 },
  { id: "mem-004", name: "فاطمة الزهراء", email: "fatima@example.com", tier: "باقة احترافية", joinDate: "2023-11-01", expiresAt: "2024-02-01", status: "active", totalPaid: 632 },
  { id: "mem-005", name: "خالد العمري", email: "khalid@example.com", tier: "باقة مؤسسات", joinDate: "2023-03-15", expiresAt: "2024-03-15", status: "active", totalPaid: 1791 },
  { id: "mem-006", name: "نورة السعيد", email: "noura@example.com", tier: "باقة أساسية", joinDate: "2024-01-20", expiresAt: "2024-02-20", status: "active", totalPaid: 29 },
  { id: "mem-007", name: "عبدالله الحربي", email: "abdullah@example.com", tier: "باقة احترافية", joinDate: "2023-08-05", expiresAt: "2024-01-05", status: "cancelled", totalPaid: 474 },
  { id: "mem-008", name: "ريم الشمري", email: "reem@example.com", tier: "باقة سنوية", joinDate: "2023-04-10", expiresAt: "2024-04-10", status: "active", totalPaid: 249 },
  { id: "mem-009", name: "ياسر القحطاني", email: "yasser@example.com", tier: "باقة أساسية", joinDate: "2023-12-01", expiresAt: "2024-01-01", status: "expired", totalPaid: 29 },
  { id: "mem-010", name: "هند المطيري", email: "hnd@example.com", tier: "باقة احترافية", joinDate: "2023-07-20", expiresAt: "2024-01-20", status: "expired", totalPaid: 553 },
  { id: "mem-011", name: "سعد الدوسري", email: "saad@example.com", tier: "باقة سنوية", joinDate: "2023-10-12", expiresAt: "2024-10-12", status: "active", totalPaid: 249 },
  { id: "mem-012", name: "منال العنزي", email: "manal@example.com", tier: "باقة مؤسسات", joinDate: "2024-01-05", expiresAt: "2024-02-05", status: "active", totalPaid: 199 },
  { id: "mem-013", name: "عمر البلوشي", email: "omar@example.com", tier: "باقة أساسية", joinDate: "2023-05-22", expiresAt: "2023-06-22", status: "cancelled", totalPaid: 29 },
  { id: "mem-014", name: "لينا الحارثي", email: "lina@example.com", tier: "باقة احترافية", joinDate: "2023-11-18", expiresAt: "2024-02-18", status: "active", totalPaid: 237 },
];

const tierColorOptions = [
  { value: "#6366f1", label: "نيلي" },
  { value: "#8b5cf6", label: "بنفسجي" },
  { value: "#ec4899", label: "وردي" },
  { value: "#f59e0b", label: "ذهبي" },
  { value: "#64748b", label: "رمادي" },
  { value: "#10b981", label: "أخضر" },
];

const tierIntervalOptions = [
  { value: "monthly", label: "شهري" },
  { value: "yearly", label: "سنوي" },
];

const memberStatusConfig: Record<MembershipMember["status"], { label: string; variant: "success" | "warning" | "danger" }> = {
  active: { label: "نشط", variant: "success" },
  expired: { label: "منتهي", variant: "warning" },
  cancelled: { label: "ملغي", variant: "danger" },
};

const memberStatusFilterOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "active", label: "نشط" },
  { value: "expired", label: "منتهي" },
  { value: "cancelled", label: "ملغي" },
];

export default function MembershipsPage() {
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState("members");

  const {
    data: tiers,
    filteredData: filteredTiers,
    search: tierSearch,
    setSearch: setTierSearch,
    add: addTier,
    update: updateTier,
    remove: removeTier,
  } = useCrud<MembershipTier>({
    initialData: initialTiers,
    searchFields: ["name"],
    itemsPerPage: 100,
  });

  const {
    data: members,
    filteredData: filteredMembers,
    paginatedData: paginatedMembers,
    search: memberSearch,
    setSearch: setMemberSearch,
    filters: memberFilters,
    setFilter: setMemberFilter,
    sortKey: memberSortKey,
    sortDir: memberSortDir,
    setSort: setMemberSort,
    page: memberPage,
    setPage: setMemberPage,
    perPage: memberPerPage,
    setPerPage: setMemberPerPage,
    update: updateMember,
    totalItems: memberTotalItems,
    totalPages: memberTotalPages,
  } = useCrud<MembershipMember>({
    initialData: initialMembers,
    searchFields: ["name", "email", "tier", "id"],
    itemsPerPage: 8,
    defaultSortKey: "joinDate",
    defaultSortDir: "desc",
  });

  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
  const [tierFormName, setTierFormName] = useState("");
  const [tierFormPrice, setTierFormPrice] = useState(0);
  const [tierFormInterval, setTierFormInterval] = useState<"monthly" | "yearly">("monthly");
  const [tierFormFeatures, setTierFormFeatures] = useState("");
  const [tierFormColor, setTierFormColor] = useState("#6366f1");
  const [tierFormStatus, setTierFormStatus] = useState<"active" | "inactive">("active");

  const [deleteTierTarget, setDeleteTierTarget] = useState<MembershipTier | null>(null);
  const [selectedMember, setSelectedMember] = useState<MembershipMember | null>(null);
  const [cancelMemberTarget, setCancelMemberTarget] = useState<MembershipMember | null>(null);

  const totalMembers = members.length;
  const activeMembers = useMemo(() => members.filter((m) => m.status === "active").length, [members]);
  const totalRevenue = useMemo(() => members.reduce((sum, m) => sum + m.totalPaid, 0), [members]);

  const openCreateTier = useCallback(() => {
    setEditingTier(null);
    setTierFormName("");
    setTierFormPrice(0);
    setTierFormInterval("monthly");
    setTierFormFeatures("");
    setTierFormColor("#6366f1");
    setTierFormStatus("active");
    setTierModalOpen(true);
  }, []);

  const openEditTier = useCallback((tier: MembershipTier) => {
    setEditingTier(tier);
    setTierFormName(tier.name);
    setTierFormPrice(tier.price);
    setTierFormInterval(tier.interval);
    setTierFormFeatures(tier.features.join("\n"));
    setTierFormColor(tier.color);
    setTierFormStatus(tier.status);
    setTierModalOpen(true);
  }, []);

  const handleSaveTier = useCallback(() => {
    const featuresList = tierFormFeatures.split("\n").map((f) => f.trim()).filter((f) => f.length > 0);
    if (!tierFormName.trim()) {
      showError("خطأ", "يرجى إدخال اسم المنصة");
      return;
    }
    if (editingTier) {
      updateTier(editingTier.id, { name: tierFormName, price: tierFormPrice, interval: tierFormInterval, features: featuresList, color: tierFormColor, status: tierFormStatus });
      success("تم التحديث", `تم تحديث منصة "${tierFormName}" بنجاح`);
    } else {
      addTier({ id: `tier-${generateId()}`, name: tierFormName, price: tierFormPrice, interval: tierFormInterval, memberCount: 0, features: featuresList, color: tierFormColor, status: tierFormStatus });
      success("تمت الإضافة", `تم إنشاء منصة "${tierFormName}" بنجاح`);
    }
    setTierModalOpen(false);
    setEditingTier(null);
  }, [tierFormName, tierFormPrice, tierFormInterval, tierFormFeatures, tierFormColor, tierFormStatus, editingTier, addTier, updateTier, success, showError]);

  const handleDeleteTier = useCallback(() => {
    if (!deleteTierTarget) return;
    removeTier(deleteTierTarget.id);
    success("تم الحذف", `تم حذف منصة "${deleteTierTarget.name}" بنجاح`);
    setDeleteTierTarget(null);
  }, [deleteTierTarget, removeTier, success]);

  const handleCancelMember = useCallback(() => {
    if (!cancelMemberTarget) return;
    updateMember(cancelMemberTarget.id, { status: "cancelled" });
    success("تم الإلغاء", `تم إلغاء عضوية "${cancelMemberTarget.name}" بنجاح`);
    setCancelMemberTarget(null);
  }, [cancelMemberTarget, updateMember, success]);

  const memberColumns = useMemo(() => [
    {
      key: "name" as const,
      label: "العضو",
      sortable: true,
      render: (value: unknown, row: MembershipMember) => (
        <div className="flex flex-col">
          <span className="font-medium text-text">{String(value)}</span>
          <span className="text-xs text-text-muted">{row.email}</span>
        </div>
      ),
    },
    { key: "tier" as const, label: "الباقة", sortable: true, render: (value: unknown) => <Badge variant="purple">{String(value)}</Badge> },
    { key: "joinDate" as const, label: "تاريخ الانضمام", sortable: true, render: (value: unknown) => <span>{formatDate(String(value))}</span> },
    { key: "expiresAt" as const, label: "تاريخ الانتهاء", sortable: true, render: (value: unknown) => <span>{formatDate(String(value))}</span> },
    {
      key: "status" as const,
      label: "الحالة",
      sortable: true,
      render: (value: unknown) => {
        const config = memberStatusConfig[value as MembershipMember["status"]];
        return <Badge variant={config.variant} dot>{config.label}</Badge>;
      },
    },
    { key: "totalPaid" as const, label: "إجمالي المدفوع", sortable: true, render: (value: unknown) => <span className="font-semibold">{formatCurrency(Number(value))}</span> },
    {
      key: "id" as const,
      label: "الإجراءات",
      className: "w-24",
      render: (_value: unknown, row: MembershipMember) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setSelectedMember(row)} />
          {row.status !== "cancelled" && (
            <Button variant="ghost" size="sm" icon={<XCircle size={14} />} className="text-danger hover:text-danger" onClick={() => setCancelMemberTarget(row)} />
          )}
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="العضويات"
        subtitle="إدارة منصات العضوية والأعضاء المشتركين"
        actions={activeTab === "tiers" ? <Button icon={<Plus size={16} />} onClick={openCreateTier}>إنشاء منصة جديدة</Button> : undefined}
      />

      <div className="flex gap-1 border-b border-border">
        <button onClick={() => setActiveTab("members")} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "members" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text hover:border-border"}`}>
          <Users size={16} /> العضويات
        </button>
        <button onClick={() => setActiveTab("tiers")} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "tiers" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text hover:border-border"}`}>
          <Crown size={16} /> المنصات
        </button>
      </div>

      {activeTab === "members" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={<Users size={20} />} label="إجمالي الأعضاء" value={memberTotalItems.toLocaleString("ar-SA")} change="" changeType="up" color="primary" />
            <StatCard icon={<Check size={20} />} label="الأعضاء النشطون" value={activeMembers.toLocaleString("ar-SA")} change="" changeType="up" color="success" />
            <StatCard icon={<DollarSign size={20} />} label="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} change="" changeType="up" color="info" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SearchInput placeholder="بحث بالاسم أو البريد أو الباقة..." value={memberSearch} onChange={setMemberSearch} className="w-80" />
            <Select options={memberStatusFilterOptions} value={memberFilters.status || ""} onChange={(e) => setMemberFilter("status", e.target.value)} />
          </div>

          <DataTable
            columns={memberColumns}
            data={paginatedMembers}
            emptyMessage="لا يوجد أعضاء"
            rowKey="id"
            sortable
            pagination={{
              currentPage: memberPage,
              totalPages: memberTotalPages,
              totalItems: memberTotalItems,
              itemsPerPage: memberPerPage,
              onPageChange: setMemberPage,
              onItemsPerPageChange: setMemberPerPage,
            }}
            striped
          />
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="space-y-6">
          <SearchInput placeholder="بحث في المنصات..." value={tierSearch} onChange={setTierSearch} className="w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTiers.map((tier) => (
              <Card key={tier.id} className="flex flex-col">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tier.color}20` }}>
                        <Crown size={20} style={{ color: tier.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text">{tier.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                          <span className="text-xs text-text-muted">{tier.interval === "monthly" ? "شهري" : "سنوي"}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={tier.status === "active" ? "success" : "default"} dot>{tier.status === "active" ? "نشط" : "غير نشط"}</Badge>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-text">{tier.price === 0 ? "مجاني" : formatCurrency(tier.price)}</span>
                      {tier.price > 0 && <span className="text-sm text-text-muted">/ {tier.interval === "monthly" ? "شهر" : "سنة"}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-surface-hover">
                    <Users size={14} className="text-text-muted" />
                    <span className="text-sm text-text-secondary"><span className="font-semibold text-text">{tier.memberCount}</span> عضو مشترك</span>
                  </div>
                  <div className="flex-1 mb-4">
                    <p className="text-xs font-medium text-text-secondary mb-2">المميزات:</p>
                    <ul className="space-y-1.5">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <Check size={14} className="shrink-0 mt-0.5" style={{ color: tier.color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" icon={<Pencil size={14} />} onClick={() => openEditTier(tier)}>تعديل</Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-danger hover:text-danger" onClick={() => setDeleteTierTarget(tier)}>حذف</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTierTarget}
        onClose={() => setDeleteTierTarget(null)}
        onConfirm={handleDeleteTier}
        title="تأكيد حذف المنصة"
        message={`هل أنت متأكد من حذف منصة "${deleteTierTarget?.name}"؟ ${deleteTierTarget && deleteTierTarget.memberCount > 0 ? `يوجد ${deleteTierTarget.memberCount} عضو مشترك. سيتم إلغاء عضويتهم.` : ""}`}
        confirmLabel="نعم، حذف المنصة"
        cancelLabel="تراجع"
        variant="danger"
      />

      <ConfirmDialog
        open={!!cancelMemberTarget}
        onClose={() => setCancelMemberTarget(null)}
        onConfirm={handleCancelMember}
        title="تأكيد إلغاء العضوية"
        message={`هل أنت متأكد من إلغاء عضوية "${cancelMemberTarget?.name}" في الباقة "${cancelMemberTarget?.tier}"؟ سيتم إلغاء العضوية فوراً.`}
        confirmLabel="نعم، إلغاء العضوية"
        cancelLabel="تراجع"
        variant="danger"
      />

      {tierModalOpen && (
        <Modal open onClose={() => { setTierModalOpen(false); setEditingTier(null); }} title={editingTier ? "تعديل المنصة" : "إنشاء منصة جديدة"} size="lg">
          <div className="space-y-4">
            <Input label="اسم المنصة" value={tierFormName} onChange={(e) => setTierFormName(e.target.value)} placeholder="أدخل اسم المنصة" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="السعر" type="number" value={tierFormPrice} onChange={(e) => setTierFormPrice(Number(e.target.value))} placeholder="0" />
              <Select label="الفترة" options={tierIntervalOptions} value={tierFormInterval} onChange={(e) => setTierFormInterval(e.target.value as "monthly" | "yearly")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">اللون</label>
              <div className="flex gap-2">
                {tierColorOptions.map((c) => (
                  <button key={c.value} onClick={() => setTierFormColor(c.value)} className={`h-8 w-8 rounded-lg cursor-pointer transition-all ${tierFormColor === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c.value }} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">المميزات (كل ميزة في سطر)</label>
              <textarea className="w-full h-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" value={tierFormFeatures} onChange={(e) => setTierFormFeatures(e.target.value)} placeholder={"مميزة 1\nمميزة 2\nمميزة 3"} />
            </div>
            <div className="flex items-center justify-between">
              <Toggle checked={tierFormStatus === "active"} onChange={(checked) => setTierFormStatus(checked ? "active" : "inactive")} label="تفعيل المنصة" description={tierFormStatus === "active" ? "المنصة متاحة حالياً" : "المنصة غير متاحة"} />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => { setTierModalOpen(false); setEditingTier(null); }}>إلغاء</Button>
              <Button size="sm" onClick={handleSaveTier}>{editingTier ? "حفظ التعديلات" : "إنشاء المنصة"}</Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedMember && (
        <Modal open onClose={() => setSelectedMember(null)} title="تفاصيل العضوية" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <User size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">العضو</p><p className="text-sm font-medium text-text">{selectedMember.name}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Mail size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">البريد الإلكتروني</p><p className="text-sm font-medium text-text">{selectedMember.email}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Tag size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">رقم العضوية</p><p className="text-sm font-medium text-primary">{selectedMember.id}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Shield size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">الباقة</p><p className="text-sm font-medium text-text">{selectedMember.tier}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Calendar size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">تاريخ الانضمام</p><p className="text-sm font-medium text-text">{formatDate(selectedMember.joinDate)}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-hover p-3">
                <Clock size={18} className="text-text-muted shrink-0" />
                <div><p className="text-xs text-text-muted">تاريخ الانتهاء</p><p className="text-sm font-medium text-text">{formatDate(selectedMember.expiresAt)}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-text-muted" /><span className="text-sm text-text-secondary">إجمالي المدفوع</span></div>
              <span className="text-lg font-bold text-text">{formatCurrency(selectedMember.totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">الحالة:</span>
                <Badge variant={memberStatusConfig[selectedMember.status].variant} dot>{memberStatusConfig[selectedMember.status].label}</Badge>
              </div>
              {selectedMember.status !== "cancelled" && (
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => { setSelectedMember(null); setCancelMemberTarget(selectedMember); }}>إلغاء العضوية</Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
