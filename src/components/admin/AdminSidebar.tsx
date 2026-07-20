"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  Award,
  ShoppingCart,
  RotateCcw,
  Users,
  Ticket,
  Megaphone,
  FileText,
  PenTool,
  List,
  Palette,
  PanelTop,
  PanelBottom,
  Settings,
  Store,
  CreditCard,
  Search,
  Shield,
  Key,
  Image,
  BarChart3,
  Server,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Hexagon,
  Bell,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  type: "item";
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  type: "section";
  label: string;
  items: NavItem[];
}

interface Separator {
  type: "separator";
}

type NavEntry = NavItem | NavSection | Separator;

const navigation: NavEntry[] = [
  { type: "item", label: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
  { type: "separator" },
  {
    type: "section",
    label: "المنتجات الرقمية",
    items: [
      { type: "item", label: "المنتجات", href: "/admin/products", icon: Package },
      { type: "item", label: "المجموعات", href: "/admin/products/collections", icon: Hexagon },
      { type: "item", label: "التصنيفات", href: "/admin/products/categories", icon: Tag },
      { type: "item", label: "الوسوم", href: "/admin/products/tags", icon: Tag },
      { type: "item", label: "العلامات التجارية", href: "/admin/products/brands", icon: Award },
      { type: "item", label: "التحميلات", href: "/admin/downloads", icon: RotateCcw },
      { type: "item", label: "مفاتيح الترخيص", href: "/admin/license-keys", icon: Key },
    ],
  },
  {
    type: "section",
    label: "الطلبات والمبيعات",
    items: [
      { type: "item", label: "الطلبات", href: "/admin/orders", icon: ShoppingCart },
      { type: "item", label: "العملاء", href: "/admin/customers", icon: Users },
    ],
  },
  {
    type: "section",
    label: "الاشتراكات والعلاقات",
    items: [
      { type: "item", label: "الاشتراكات", href: "/admin/subscriptions", icon: RotateCcw },
      { type: "item", label: "العضويات", href: "/admin/memberships", icon: Users },
      { type: "item", label: "الخصومات", href: "/admin/discounts", icon: Ticket },
      { type: "item", label: "الأفلييت", href: "/admin/affiliates", icon: Megaphone },
    ],
  },
  {
    type: "section",
    label: "التسويق",
    items: [
      { type: "item", label: "الكوبونات", href: "/admin/marketing/coupons", icon: Ticket },
      { type: "item", label: "الحملات", href: "/admin/marketing/campaigns", icon: Megaphone },
      { type: "item", label: "قوالب البريد", href: "/admin/email-templates", icon: Mail },
      { type: "item", label: "الإشعارات", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    type: "section",
    label: "المحتوى",
    items: [
      { type: "item", label: "الصفحات", href: "/admin/content/pages", icon: FileText },
      { type: "item", label: "المدونة", href: "/admin/content/blog", icon: PenTool },
      { type: "item", label: "القوائم", href: "/admin/content/menus", icon: List },
    ],
  },
  {
    type: "section",
    label: "المظهر",
    items: [
      { type: "item", label: "محرر السمة", href: "/admin/appearance/theme-editor", icon: Palette },
      { type: "item", label: "بناء الهيدر", href: "/admin/appearance/header-builder", icon: PanelTop },
      { type: "item", label: "بناء الفوتر", href: "/admin/appearance/footer-builder", icon: PanelBottom },
      { type: "item", label: "-builder الدفع", href: "/admin/checkout-builder", icon: CreditCard },
    ],
  },
  { type: "separator" },
  { type: "item", label: "التحليلات", href: "/admin/analytics", icon: BarChart3 },
  { type: "item", label: "التقارير", href: "/admin/reports", icon: BarChart3 },
  { type: "item", label: "الوسائط", href: "/admin/media", icon: Image },
  { type: "item", label: "مدير الملفات", href: "/admin/file-manager", icon: FileText },
  { type: "separator" },
  {
    type: "section",
    label: "الإعدادات",
    items: [
      { type: "item", label: "الإعدادات العامة", href: "/admin/settings/general", icon: Settings },
      { type: "item", label: "المتجر", href: "/admin/settings/store", icon: Store },
      { type: "item", label: "الدفع", href: "/admin/settings/payment", icon: CreditCard },
      { type: "item", label: "الشحن", href: "/admin/settings/shipping", icon: Package },
      { type: "item", label: "SEO", href: "/admin/settings/seo", icon: Search },
      { type: "item", label: "المستخدمين", href: "/admin/settings/users", icon: Shield },
      { type: "item", label: "الأدوار والصلاحيات", href: "/admin/roles", icon: Shield },
      { type: "item", label: "الضرائب", href: "/admin/taxes", icon: Search },
      { type: "item", label: "العملات", href: "/admin/currencies", icon: Settings },
      { type: "item", label: "اللغات", href: "/admin/languages", icon: Settings },
      { type: "item", label: "API", href: "/admin/settings/api", icon: Key },
    ],
  },
  {
    type: "section",
    label: "النظام",
    items: [
      { type: "item", label: "نظرة عامة", href: "/admin/system", icon: Server },
      { type: "item", label: "الملحقات", href: "/admin/system/plugins", icon: Settings },
      { type: "item", label: "السجلات", href: "/admin/system/logs", icon: FileText },
      { type: "item", label: "مدير API", href: "/admin/system/api-manager", icon: Key },
      { type: "item", label: "Webhooks", href: "/admin/system/webhooks", icon: Settings },
      { type: "item", label: "النسخ الاحتياطية", href: "/admin/backups", icon: Settings },
      { type: "item", label: "سجل التدقيق", href: "/admin/audit-logs", icon: Shield },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  const cleanHref = href.split("?")[0];
  if (cleanHref === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
}

function getInitialOpenSections(pathname: string): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const entry of navigation) {
    if (entry.type === "section") {
      const hasActive = entry.items.some((item) => isActive(pathname, item.href));
      if (hasActive) initial[entry.label] = true;
    }
  }
  return initial;
}

function SidebarContent({
  pathname,
  collapsed,
  onCollapse,
  onCloseMobile,
}: {
  pathname: string;
  collapsed: boolean;
  onCollapse: () => void;
  onCloseMobile?: () => void;
}) {
  const initialOpen = useMemo(() => getInitialOpenSections(pathname), [pathname]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialOpen);

  const toggleSection = useCallback((label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-text">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Hexagon size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-text-active">
              DS Admin
            </span>
          )}
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active lg:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <ul className="space-y-1">
          {navigation.map((entry, idx) => {
            if (entry.type === "separator") {
              return (
                <li key={`sep-${idx}`}>
                  <div className="my-3 mx-2 border-t border-white/10" />
                </li>
              );
            }

            if (entry.type === "item") {
              const Icon = entry.icon;
              const active = isActive(pathname, entry.href);
              return (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-sidebar-text-active"
                        : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                    )}
                  >
                    <Icon size={19} className="shrink-0" />
                    {!collapsed && <span>{entry.label}</span>}
                  </Link>
                </li>
              );
            }

            const isOpen = collapsed || openSections[entry.label] || false;
            const hasActive = entry.items.some((item) =>
              isActive(pathname, item.href)
            );

            return (
              <li key={entry.label}>
                {!collapsed ? (
                  <>
                    <button
                      onClick={() => toggleSection(entry.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                        hasActive
                          ? "text-sidebar-text-active"
                          : "text-sidebar-text/70 hover:text-sidebar-text-active hover:bg-sidebar-hover"
                      )}
                    >
                      <span>{entry.label}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <ul className="mt-0.5 space-y-0.5">
                        {entry.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(pathname, item.href);
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onCloseMobile}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                  active
                                    ? "bg-primary text-sidebar-text-active"
                                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                                )}
                              >
                                <Icon size={18} className="shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <ul className="space-y-0.5">
                    {entry.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(pathname, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onCloseMobile}
                            title={item.label}
                            className={cn(
                              "flex items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                              active
                                ? "bg-primary text-sidebar-text-active"
                                : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                            )}
                          >
                            <Icon size={19} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden lg:block border-t border-white/10 p-3">
        <button
          onClick={onCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-text-active cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>طي القائمة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  collapsed: externalCollapsed,
  onToggleCollapse,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
} = {}) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const collapsed = externalCollapsed ?? internalCollapsed;
  const onCollapse = onToggleCollapse ?? (() => setInternalCollapsed((prev) => !prev));
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-white shadow-lg lg:hidden cursor-pointer"
        aria-label="فتح القائمة"
      >
        <LayoutDashboard size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          collapsed={false}
          onCollapse={onCollapse}
          onCloseMobile={closeMobile}
        />
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 hidden transition-all duration-300 ease-in-out lg:block",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent
          pathname={pathname}
          collapsed={collapsed}
          onCollapse={onCollapse}
        />
      </aside>
    </>
  );
}
