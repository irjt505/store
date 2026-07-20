"use client";

import { useState, useMemo } from "react";
import {
  Database,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  HardDrive,
  Clock,
  AlertTriangle,
  FileText,
  Settings,
  ServerCrash,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";

type Backup = {
  id: string;
  name: string;
  size: string;
  type: "full" | "database" | "files" | "settings";
  status: "completed" | "in_progress" | "failed";
  createdAt: string;
  downloadUrl: string;
  [key: string]: unknown;
};

const initialBackups: Backup[] = [
  { id: "b1", name: "نسخة كاملة - 18 يوليو 2026", size: "2.4 GB", type: "full", status: "completed", createdAt: "2026-07-18T08:00:00", downloadUrl: "#" },
  { id: "b2", name: "نسخة قاعدة البيانات الليلية", size: "890 MB", type: "database", status: "completed", createdAt: "2026-07-18T02:00:00", downloadUrl: "#" },
  { id: "b3", name: "نسخة ملفات الموقع", size: "1.1 GB", type: "files", status: "completed", createdAt: "2026-07-17T14:30:00", downloadUrl: "#" },
  { id: "b4", name: "نسخة إعدادات البريد", size: "12 KB", type: "settings", status: "completed", createdAt: "2026-07-17T10:00:00", downloadUrl: "#" },
  { id: "b5", name: "نسخة كاملة - 17 يوليو 2026", size: "2.3 GB", type: "full", status: "completed", createdAt: "2026-07-17T08:00:00", downloadUrl: "#" },
  { id: "b6", name: "نسخة قاعدة البيانات - فاشلة", size: "—", type: "database", status: "failed", createdAt: "2026-07-16T02:00:00", downloadUrl: "#" },
  { id: "b7", name: "نسخة ملفات الموقع قيد التنفيذ", size: "—", type: "files", status: "in_progress", createdAt: "2026-07-16T16:45:00", downloadUrl: "#" },
  { id: "b8", name: "نسخة إعدادات النظام", size: "18 KB", type: "settings", status: "completed", createdAt: "2026-07-15T09:00:00", downloadUrl: "#" },
];

const typeLabels: Record<string, string> = {
  full: "كاملة",
  database: "قاعدة البيانات",
  files: "ملفات",
  settings: "إعدادات",
};

const typeIcons: Record<string, typeof Database> = {
  full: Database,
  database: Database,
  files: FileText,
  settings: Settings,
};

const typeBadgeVariant: Record<string, "success" | "info" | "purple" | "warning"> = {
  full: "success",
  database: "info",
  files: "purple",
  settings: "warning",
};

const statusLabels: Record<string, string> = {
  completed: "مكتملة",
  in_progress: "قيد التنفيذ",
  failed: "فاشلة",
};

const statusBadgeVariant: Record<string, "success" | "info" | "danger"> = {
  completed: "success",
  in_progress: "info",
  failed: "danger",
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Loader2,
  failed: XCircle,
};

const typeOptions = [
  { value: "", label: "جميع الأنواع" },
  { value: "full", label: "كاملة" },
  { value: "database", label: "قاعدة البيانات" },
  { value: "files", label: "ملفات" },
  { value: "settings", label: "إعدادات" },
];

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [typeFilter, setTypeFilter] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [createType, setCreateType] = useState<string>("full");
  const [createName, setCreateName] = useState("");
  const [deleteModal, setDeleteModal] = useState<Backup | null>(null);
  const [restoreModal, setRestoreModal] = useState<Backup | null>(null);
  const [autoBackup, setAutoBackup] = useState(true);

  const filtered = useMemo(() => {
    if (!typeFilter) return backups;
    return backups.filter((b) => b.type === typeFilter);
  }, [backups, typeFilter]);

  const totalSize = "3.3 GB";
  const lastBackup = backups.find((b) => b.status === "completed");

  const handleCreate = () => {
    if (!createName.trim()) return;
    const newBackup: Backup = {
      id: Date.now().toString(),
      name: createName,
      size: "—",
      type: createType as Backup["type"],
      status: "completed",
      createdAt: new Date().toISOString(),
      downloadUrl: "#",
    };
    setBackups((prev) => [newBackup, ...prev]);
    setCreateModal(false);
    setCreateName("");
    setCreateType("full");
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setBackups((prev) => prev.filter((b) => b.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const handleRestore = () => {
    if (!restoreModal) return;
    setBackups((prev) =>
      prev.map((b) =>
        b.id === restoreModal.id
          ? { ...b, status: "in_progress" as const }
          : b
      )
    );
    setTimeout(() => {
      setBackups((prev) =>
        prev.map((b) =>
          b.id === restoreModal.id
            ? { ...b, status: "completed" as const }
            : b
        )
      );
    }, 2000);
    setRestoreModal(null);
  };

  const columns = [
    {
      key: "name" as const,
      label: "اسم النسخة",
      render: (_: unknown, row: Backup) => {
        const Icon = typeIcons[row.type] || Database;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={14} className="text-primary" />
            </div>
            <span className="font-medium text-text">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: "type" as const,
      label: "النوع",
      render: (v: unknown) => (
        <Badge variant={typeBadgeVariant[String(v)]}>{typeLabels[String(v)]}</Badge>
      ),
    },
    {
      key: "size" as const,
      label: "الحجم",
      render: (v: unknown) => <span className="text-text-secondary">{String(v)}</span>,
    },
    {
      key: "status" as const,
      label: "الحالة",
      render: (v: unknown) => {
        const StatusIcon = statusIcons[String(v)] || CheckCircle2;
        return (
          <Badge variant={statusBadgeVariant[String(v)]} dot>
            <StatusIcon
              size={12}
              className={String(v) === "in_progress" ? "animate-spin" : ""}
            />
            {statusLabels[String(v)]}
          </Badge>
        );
      },
    },
    {
      key: "createdAt" as const,
      label: "التاريخ",
      render: (v: unknown) => {
        const d = new Date(String(v));
        return (
          <span className="text-xs text-text-secondary whitespace-nowrap">
            {d.toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {" "}
            {d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
          </span>
        );
      },
    },
    {
      key: "actions" as const,
      label: "الإجراءات",
      className: "w-28",
      render: (_: unknown, row: Backup) => (
        <div className="flex items-center gap-1">
          {row.status === "completed" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<Download size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`جاري تحميل: ${row.name}`);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setRestoreModal(row);
                }}
              />
            </>
          )}
          {row.status === "in_progress" && (
            <Badge variant="info">
              <Loader2 size={12} className="animate-spin" />
              جاري...
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} />}
            className="text-danger hover:text-danger"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal(row);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="النسخ الاحتياطية"
        subtitle="إنشاء وإدارة النسخ الاحتياطية للنظام"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setCreateModal(true)}>
            إنشاء نسخة احتياطية
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HardDrive size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{backups.length}</p>
              <p className="text-xs text-text-muted">إجمالي النسخ</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Database size={20} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{totalSize}</p>
              <p className="text-xs text-text-muted">الحجم الإجمالي</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Clock size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                {lastBackup
                  ? new Date(lastBackup.createdAt).toLocaleDateString("ar-SA", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
              <p className="text-xs text-text-muted">آخر نسخة احتياطية</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="md">
        <Toggle
          checked={autoBackup}
          onChange={setAutoBackup}
          label="النسخ الاحتياطي التلقائي"
          description="إنشاء نسخة احتياطية تلقائياً كل يوم الساعة 2:00 صباحاً"
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <Badge variant="info">{filtered.length} نسخة</Badge>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="لا توجد نسخ احتياطية" rowKey="id" />

      {createModal && (
        <Modal
          open
          onClose={() => setCreateModal(false)}
          title="إنشاء نسخة احتياطية جديدة"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="اسم النسخة"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="مثال: نسخة ما قبل التحديث"
            />
            <Select
              label="نوع النسخة"
              options={[
                { value: "full", label: "كاملة (قاعدة البيانات + الملفات + الإعدادات)" },
                { value: "database", label: "قاعدة البيانات فقط" },
                { value: "files", label: "الملفات فقط" },
                { value: "settings", label: "الإعدادات فقط" },
              ]}
              value={createType}
              onChange={(e) => setCreateType(e.target.value)}
            />
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
              <AlertTriangle size={16} className="text-info shrink-0" />
              <p className="text-xs text-info">
                قد يستغرق إنشاء النسخة الكاملة بضع دقائق حسب حجم البيانات
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setCreateModal(false)}>
                إلغاء
              </Button>
              <Button icon={<Database size={14} />} onClick={handleCreate}>
                إنشاء النسخة
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteModal && (
        <Modal
          open
          onClose={() => setDeleteModal(null)}
          title="حذف النسخة الاحتياطية"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              هل أنت متأكد من حذف النسخة &quot;{deleteModal.name}&quot;؟ لا يمكن استرجاع هذه النسخة بعد الحذف.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteModal(null)}>
                إلغاء
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                حذف
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {restoreModal && (
        <Modal
          open
          onClose={() => setRestoreModal(null)}
          title="استرجاع النسخة الاحتياطية"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-warning" />
                <p className="text-sm font-semibold text-warning">تحذير مهم</p>
              </div>
              <p className="text-sm text-text-secondary">
                سيتم استرجاع البيانات من النسخة &quot;{restoreModal.name}&quot; بتاريخ{" "}
                {new Date(restoreModal.createdAt).toLocaleDateString("ar-SA")}.
                سيتم <span className="font-bold text-danger">استبدال جميع البيانات الحالية</span> بالبيانات المحفوظة في هذه النسخة.
              </p>
            </div>
            <p className="text-xs text-text-muted">
              يُنصح بإنشاء نسخة احتياطية من البيانات الحالية قبل المتابعة.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setRestoreModal(null)}>
                إلغاء
              </Button>
              <Button
                variant="danger"
                icon={<RefreshCw size={14} />}
                onClick={handleRestore}
              >
                استرجاع الآن
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
