"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  FolderTree,
  Star,
  Warehouse,
  ShoppingCart,
  ShoppingBag,
  Users,
  Users2,
  Percent,
  Megaphone,
  UserPlus,
  FileText,
  BookOpen,
  Menu,
  FileImage,
  Receipt,
  Palette,
  PanelTop,
  PanelBottom,
  CreditCard,
  Globe,
  Settings,
  Store,
  Ship,
  Search,
  Code,
  Key,
  Webhook,
  Activity,
  Plug,
  Terminal,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  Hexagon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry && "title" in entry;
}

const navigation: NavEntry[] = [
  {
    title: "الرئيسية",
    items: [{ label: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "الكتالوج",
    items: [
      { label: "المنتجات", href: "/admin/products", icon: Package },
      { label: "الفئات", href: "/admin/products/categories", icon: FolderTree },
      { label: "المجموعات", href: "/admin/products/collections", icon: FolderTree },
      { label: "العلامات التجارية", href: "/admin/products/brands", icon: Star },
      { label: "الوسوم", href: "/admin/products/tags", icon: Tags },
      { label: "المخزون", href: "/admin/inventory", icon: Warehouse },
    ],
  },
  {
    title: "الطلبيات",
    items: [
      { label: "الطلبيات", href: "/admin/orders", icon: ShoppingCart },
      { label: "السلال المهجورة", href: "/admin/abandoned-carts", icon: ShoppingBag },
    ],
  },
  {
    title: "العملاء",
    items: [
      { label: "العملاء", href: "/admin/customers", icon: Users },
      { label: "مجموعات العملاء", href: "/admin/customer-groups", icon: Users2 },
    ],
  },
  {
    title: "التسويق",
    items: [
      { label: "الكوبونات", href: "/admin/marketing/coupons", icon: Percent },
      { label: "الحملات", href: "/admin/marketing/campaigns", icon: Megaphone },
      { label: "الخصومات", href: "/admin/discounts", icon: Percent },
      { label: "التسويق بالعمولة", href: "/admin/affiliates", icon: UserPlus },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { label: "الصفحات", href: "/admin/content/pages", icon: FileText },
      { label: "المدونة", href: "/admin/content/blog", icon: BookOpen },
      { label: "القوائم", href: "/admin/content/menus", icon: Menu },
      { label: "صفحات الهبوط", href: "/admin/landing-pages", icon: FileImage },
      { label: "الفواتير", href: "/admin/invoices", icon: Receipt },
    ],
  },
  {
    title: "المتجر",
    items: [
      { label: "المظهر", href: "/admin/appearance/theme-editor", icon: Palette },
      { label: "بناء الرأس", href: "/admin/appearance/header-builder", icon: PanelTop },
      { label: "بناء التذييل", href: "/admin/appearance/footer-builder", icon: PanelBottom },
      { label: "بناء الدفع", href: "/admin/checkout-builder", icon: CreditCard },
      { label: "بناء الصفحات", href: "/admin/page-builder/new", icon: Globe },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      { label: "عام", href: "/admin/settings/general", icon: Settings },
      { label: "المتجر", href: "/admin/settings/store", icon: Store },
      { label: "الدفع", href: "/admin/settings/payment", icon: CreditCard },
      { label: "الشحن", href: "/admin/settings/shipping", icon: Ship },
      { label: "SEO", href: "/admin/settings/seo", icon: Search },
      { label: "المستخدمين", href: "/admin/settings/users", icon: Users },
      { label: "API", href: "/admin/settings/api", icon: Code },
    ],
  },
  {
    title: "النظام",
    items: [
      { label: "النظام", href: "/admin/system", icon: Terminal },
      { label: "الإضافات", href: "/admin/system/plugins", icon: Plug },
      { label: "السجلات", href: "/admin/system/logs", icon: Activity },
      { label: "مدير API", href: "/admin/system/api-manager", icon: Key },
      { label: "Webhooks", href: "/admin/system/webhooks", icon: Webhook },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  const clean = href.split("?")[0];
  if (clean === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === clean || pathname.startsWith(clean + "/");
}

function NavItemComponent({
  item,
  pathname,
  collapsed,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150",
          collapsed ? "h-9 justify-center px-0 mx-1" : "h-9 gap-3 px-3 mx-1",
          active
            ? "bg-primary-light text-primary"
            : "text-text-secondary hover:bg-surface-hover hover:text-text"
        )}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}

        {collapsed && (
          <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-text px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {item.label}
            <div className="absolute left-full top-1/2 -translate-y-1/2 -ms-1 border-4 border-transparent border-l-text" />
          </div>
        )}
      </Link>
    </li>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const entry of navigation) {
      if (isGroup(entry) && entry.items.some((item) => isActive(pathname, item.href))) {
        initial[entry.title] = true;
      }
    }
    return initial;
  });

  const toggleGroup = useCallback((title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-border-light px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Hexagon size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden text-lg font-bold text-text"
              >
                متجر
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        <ul className="space-y-1">
          {navigation.map((entry) => {
            if (!isGroup(entry)) {
              const item = entry as NavItem;
              return (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  onClick={() => setMobileOpen(false)}
                />
              );
            }

            const group = entry as NavGroup;
            const isOpen = collapsed || openGroups[group.title] || false;
            const hasActive = group.items.some((item) => isActive(pathname, item.href));

            if (collapsed) {
              return (
                <li key={group.title} className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavItemComponent
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      collapsed
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </li>
              );
            }

            return (
              <li key={group.title}>
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer",
                    hasActive
                      ? "text-text"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden space-y-0.5"
                    >
                      {group.items.map((item) => (
                        <NavItemComponent
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          collapsed={false}
                          onClick={() => setMobileOpen(false)}
                        />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden lg:block shrink-0 border-t border-border-light p-2">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text cursor-pointer"
        >
          {collapsed ? (
            <PanelRightOpen size={18} />
          ) : (
            <>
              <PanelRightClose size={18} />
              <span className="text-xs font-medium">طي القائمة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 right-3 z-[60] flex h-10 w-10 items-center justify-center rounded-lg bg-surface border border-border shadow-sm text-text-secondary lg:hidden cursor-pointer"
        aria-label="فتح القائمة"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[70] w-64 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-40 hidden border-l border-border-light bg-sidebar lg:block"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
