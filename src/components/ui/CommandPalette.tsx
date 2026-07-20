"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Download,
  Key,
  CreditCard,
  Crown,
  Percent,
  Share2,
  Tag,
  Megaphone,
  Mail,
  FileText,
  PenTool,
  Palette,
  PanelTop,
  PanelBottom,
  BarChart3,
  FileBarChart,
  Image,
  FolderOpen,
  Settings,
  Shield,
  Receipt,
  DollarSign,
  Globe,
  Bell,
  Server,
  Code,
  HardDrive,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  Compass,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  shortcut?: string;
  group: "navigation" | "actions" | "recent";
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const MAX_RECENT = 5;

const navigationItems: Omit<CommandItem, "group">[] = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "products", label: "المنتجات", icon: Package, href: "/admin/products" },
  { id: "orders", label: "الطلبات", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", label: "العملاء", icon: Users, href: "/admin/customers" },
  { id: "downloads", label: "التحميلات", icon: Download, href: "/admin/downloads" },
  { id: "license-keys", label: "مفاتيح الترخيص", icon: Key, href: "/admin/license-keys" },
  { id: "subscriptions", label: "الاشتراكات", icon: CreditCard, href: "/admin/subscriptions" },
  { id: "memberships", label: "العضويات", icon: Crown, href: "/admin/memberships" },
  { id: "discounts", label: "الخصومات", icon: Percent, href: "/admin/discounts" },
  { id: "affiliates", label: "الأفلييت", icon: Share2, href: "/admin/affiliates" },
  { id: "coupons", label: "الكوبونات", icon: Tag, href: "/admin/marketing/coupons" },
  { id: "campaigns", label: "الحملات", icon: Megaphone, href: "/admin/marketing/campaigns" },
  { id: "email-templates", label: "قوالب البريد", icon: Mail, href: "/admin/email-templates" },
  { id: "pages", label: "الصفحات", icon: FileText, href: "/admin/content/pages" },
  { id: "blog", label: "المدونة", icon: PenTool, href: "/admin/content/blog" },
  { id: "page-builder", label: "المحرر البصري", icon: Palette, href: "/admin/page-builder/new" },
  { id: "theme-editor", label: "محرر السمة", icon: Paintbrush, href: "/admin/appearance/theme-editor" },
  { id: "header-builder", label: "بناء الهيدر", icon: PanelTop, href: "/admin/appearance/header-builder" },
  { id: "footer-builder", label: "بناء الفوتر", icon: PanelBottom, href: "/admin/appearance/footer-builder" },
  { id: "checkout-builder", label: "بناء الدفع", icon: CreditCard, href: "/admin/checkout-builder" },
  { id: "analytics", label: "التحليلات", icon: BarChart3, href: "/admin/analytics" },
  { id: "reports", label: "التقارير", icon: FileBarChart, href: "/admin/reports" },
  { id: "media", label: "الوسائط", icon: Image, href: "/admin/media" },
  { id: "file-manager", label: "مدير الملفات", icon: FolderOpen, href: "/admin/file-manager" },
  { id: "settings", label: "الإعدادات", icon: Settings, href: "/admin/settings/general" },
  { id: "users", label: "إدارة المستخدمين", icon: Users, href: "/admin/settings/users" },
  { id: "roles", label: "الأدوار", icon: Shield, href: "/admin/roles" },
  { id: "taxes", label: "الضرائب", icon: Receipt, href: "/admin/taxes" },
  { id: "currencies", label: "العملات", icon: DollarSign, href: "/admin/currencies" },
  { id: "languages", label: "اللغات", icon: Globe, href: "/admin/languages" },
  { id: "notifications", label: "الإشعارات", icon: Bell, href: "/admin/notifications" },
  { id: "system", label: "نظام", icon: Server, href: "/admin/system" },
  { id: "api", label: "الإعدادات API", icon: Code, href: "/admin/settings/api" },
  { id: "backups", label: "النسخ الاحتياطي", icon: HardDrive, href: "/admin/backups" },
];

const actionItems: Omit<CommandItem, "group">[] = [
  { id: "create-product", label: "إضافة منتج جديد", icon: Package, href: "/admin/products/new", shortcut: "Ctrl+N" },
  { id: "create-coupon", label: "إنشاء كوبون جديد", icon: Tag, href: "/admin/marketing/coupons", shortcut: "Ctrl+Shift+C" },
  { id: "create-campaign", label: "إضافة حملة جديدة", icon: Megaphone, href: "/admin/marketing/campaigns", shortcut: "Ctrl+Shift+M" },
];

function Paintbrush(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m14.622 17.897-10.68-2.913" />
      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
      <path d="M9 8c-1.804 2.71-3.97 3.46-6.28 3.588" />
    </svg>
  );
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentPages, setRecentPages] = useState<string[]>([]);

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems: CommandItem[] = useMemo(() => {
    const navItems = navigationItems.map((item) => ({ ...item, group: "navigation" as const }));
    const actItems = actionItems.map((item) => ({ ...item, group: "actions" as const }));
    const recItems = recentPages
      .map((href) => {
        const match = navigationItems.find((n) => n.href === href);
        if (!match) return null;
        return { ...match, group: "recent" as const };
      })
      .filter(Boolean) as CommandItem[];
    return [...recItems, ...navItems, ...actItems];
  }, [recentPages]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  const grouped = useMemo(() => {
    const groups: { title: string; key: string; items: CommandItem[] }[] = [];
    const recent = filtered.filter((i) => i.group === "recent");
    const navigation = filtered.filter((i) => i.group === "navigation");
    const actions = filtered.filter((i) => i.group === "actions");

    if (recent.length > 0) groups.push({ title: "الأخيرة", key: "recent", items: recent });
    if (navigation.length > 0) groups.push({ title: "التنقل", key: "navigation", items: navigation });
    if (actions.length > 0) groups.push({ title: "الإجراءات", key: "actions", items: actions });

    return groups;
  }, [filtered]);

  const flatItems = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const executeItem = useCallback(
    (item: CommandItem) => {
      handleClose();
      if (item.href) {
        router.push(item.href);
      } else if (item.action) {
        item.action();
      }
    },
    [handleClose, router]
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flatItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatItems[activeIndex]) {
          executeItem(flatItems[activeIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, flatItems, activeIndex, executeItem]);

  useEffect(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          const event = new CustomEvent("command-palette:toggle");
          window.dispatchEvent(event);
        }
      }
    };
    document.addEventListener("keydown", handleGlobal);
    return () => document.removeEventListener("keydown", handleGlobal);
  }, [open, handleClose]);

  let currentIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl mx-4 bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search size={20} className="shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                placeholder="ابحث عن صفحة، إجراء، أو أمر..."
                className="flex-1 bg-transparent text-lg text-text placeholder:text-text-muted outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-surface-hover px-2 py-0.5 text-xs font-medium text-text-muted">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
              {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <Search size={32} className="mb-3 opacity-40" />
                  <p className="text-sm">لا توجد نتائج</p>
                </div>
              ) : (
                grouped.map((group) => (
                  <div key={group.key} className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {group.title === "الأخيرة" && (
                        <Clock size={12} className="inline ml-1.5 -mt-0.5" />
                      )}
                      {group.title === "التنقل" && (
                        <Compass size={12} className="inline ml-1.5 -mt-0.5" />
                      )}
                      {group.title === "الإجراءات" && (
                        <Zap size={12} className="inline ml-1.5 -mt-0.5" />
                      )}
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      currentIndex++;
                      const idx = currentIndex;
                      const isActive = idx === activeIndex;
                      const Icon = item.icon;
                      const isMac =
                        typeof navigator !== "undefined" &&
                        navigator.platform?.includes("Mac");
                      const shortcutLabel = item.shortcut
                        ? item.shortcut.replace("Ctrl", isMac ? "⌘" : "Ctrl")
                        : undefined;

                      return (
                        <button
                          key={item.id}
                          data-index={idx}
                          onClick={() => executeItem(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors cursor-pointer text-start",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-text hover:bg-surface-hover"
                          )}
                        >
                          <Icon
                            size={18}
                            className={cn(
                              "shrink-0",
                              isActive ? "text-primary" : "text-text-secondary"
                            )}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {shortcutLabel && (
                            <kbd
                              className={cn(
                                "hidden sm:inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[11px] font-medium",
                                isActive
                                  ? "border-primary/30 text-primary/70"
                                  : "border-border text-text-muted"
                              )}
                            >
                              {shortcutLabel}
                            </kbd>
                          )}
                          {isActive && (
                            <CornerDownLeft
                              size={14}
                              className="shrink-0 text-primary/60"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-5 py-2.5 text-xs text-text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ArrowUp size={12} />
                  <ArrowDown size={12} />
                  <span className="mr-0.5">للتنقل</span>
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft size={12} />
                  <span>لاختيار</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">Esc</kbd>
                  <span>للإغلاق</span>
                </span>
              </div>
              <span className="text-[11px] opacity-60">Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
