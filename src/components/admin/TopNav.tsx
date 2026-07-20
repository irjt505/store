"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  FileText,
  Palette,
  Settings,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Hexagon,
  Tag,
  Award,
  Ticket,
  Mail,
  PenTool,
  List,
  PanelTop,
  PanelBottom,
  CreditCard,
  Store,
  Shield,
  Key,
  Eye,
  LayoutDashboard,
  TrendingUp,
  Hash,
  Boxes,
  ClipboardList,
  ShoppingBag,
  Receipt,
  Globe,
  Languages,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

interface SubItem {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  items: SubItem[];
}

interface NavStandalone {
  label: string;
  href: string;
}

type NavEntry = NavDropdown | NavStandalone;

function isStandalone(entry: NavEntry): entry is NavStandalone {
  return "href" in entry && !("items" in entry);
}

const navigation: NavEntry[] = [
  { label: "الرئيسية", href: "/admin/dashboard" },
  {
    label: "المنتجات",
    items: [
      { label: "المنتجات", href: "/admin/products" },
      { label: "إضافة منتج", href: "/admin/products/new" },
      { label: "التصنيفات", href: "/admin/products/categories" },
      { label: "المجموعات", href: "/admin/products/collections" },
      { label: "العلامات التجارية", href: "/admin/products/brands" },
      { label: "الوسوم", href: "/admin/products/tags" },
      { label: "المتغيرات", href: "/admin/products/variants" },
      { label: "المخزون", href: "/admin/inventory" },
      { label: "سجل المخزون", href: "/admin/inventory/log" },
    ],
  },
  { label: "الطلبات", href: "/admin/orders" },
  { label: "العملاء", href: "/admin/customers" },
  {
    label: "التسويق",
    items: [
      { label: "الكوبونات", href: "/admin/marketing/coupons" },
      { label: "الحملات", href: "/admin/marketing/campaigns" },
      { label: "الخصومات", href: "/admin/discounts" },
      { label: "الأفلييت", href: "/admin/affiliates" },
      { label: "القوالب البريدية", href: "/admin/email-templates" },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { label: "الصفحات", href: "/admin/content/pages" },
      { label: "المدونة", href: "/admin/content/blog" },
      { label: "القوائم", href: "/admin/content/menus" },
      { label: "صفحات الهبوط", href: "/admin/landing-pages" },
      { label: "الفواتير", href: "/admin/invoices" },
    ],
  },
  {
    label: "التصميم",
    items: [
      { label: "محرر السمة", href: "/admin/appearance/theme-editor" },
      { label: "بناء الهيدر", href: "/admin/appearance/header-builder" },
      { label: "بناء الفوتر", href: "/admin/appearance/footer-builder" },
      { label: "بناء الدفع", href: "/admin/checkout-builder" },
      { label: "المحرر البصري", href: "/admin/page-builder/new" },
    ],
  },
  { label: "التقارير", href: "/admin/reports" },
  {
    label: "الإعدادات",
    items: [
      { label: "الإعدادات العامة", href: "/admin/settings/general" },
      { label: "المتجر", href: "/admin/settings/store" },
      { label: "الدفع", href: "/admin/settings/payment" },
      { label: "الشحن", href: "/admin/settings/shipping" },
      { label: "SEO", href: "/admin/settings/seo" },
      { label: "المستخدمين", href: "/admin/settings/users" },
      { label: "الأدوار", href: "/admin/roles" },
      { label: "الموظفين", href: "/admin/staff" },
      { label: "الضرائب", href: "/admin/taxes" },
      { label: "العملات", href: "/admin/currencies" },
      { label: "اللغات", href: "/admin/languages" },
      { label: "API", href: "/admin/settings/api" },
    ],
  },
];

const dropdownIcons: Record<string, React.ElementType> = {
  المنتجات: Package,
  التسويق: Megaphone,
  المحتوى: FileText,
  التصميم: Palette,
  الإعدادات: Settings,
};

function isActivePath(pathname: string, href: string): boolean {
  const clean = href.split("?")[0];
  if (clean === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === clean || pathname.startsWith(clean + "/");
}

function NavDropdownMenu({
  entry,
  pathname,
  onClose,
}: {
  entry: NavDropdown;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hasActive = entry.items.some((item) => isActivePath(pathname, item.href));
  const Icon = dropdownIcons[entry.label] || Package;

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer",
          hasActive || open
            ? "text-primary bg-primary-light/50"
            : "text-text-secondary hover:text-text hover:bg-surface-hover"
        )}
      >
        <Icon size={16} className="shrink-0" />
        <span>{entry.label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 z-50 mt-1 min-w-[220px] rounded-xl border border-border bg-surface py-1.5 shadow-xl"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {entry.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                  isActivePath(pathname, item.href)
                    ? "text-primary bg-primary-light/30 font-medium"
                    : "text-text hover:bg-surface-hover"
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Hexagon size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-primary">متجر</span>
        </Link>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navigation.map((entry) => {
          if (isStandalone(entry)) {
            const active = isActivePath(pathname, entry.href);
            return (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  active
                    ? "text-primary bg-primary-light/30"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text"
                )}
              >
                {entry.label}
              </Link>
            );
          }

          const isOpen = openSections[entry.label] || false;
          const hasActive = entry.items.some((item) =>
            isActivePath(pathname, item.href)
          );
          const Icon = dropdownIcons[entry.label] || Package;

          return (
            <div key={entry.label}>
              <button
                onClick={() => toggleSection(entry.label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors cursor-pointer",
                  hasActive
                    ? "text-primary bg-primary-light/30"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {entry.label}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mr-6 border-r-2 border-border pr-3 mt-1 space-y-0.5">
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm transition-colors",
                            isActivePath(pathname, item.href)
                              ? "text-primary bg-primary-light/30 font-medium"
                              : "text-text-secondary hover:bg-surface-hover hover:text-text"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default function TopNav({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex h-16 items-center gap-2 px-4 lg:px-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover lg:hidden cursor-pointer"
            aria-label="فتح القائمة"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Hexagon size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-primary hidden sm:block">متجر</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mr-4">
            {navigation.map((entry) => {
              if (isStandalone(entry)) {
                const active = isActivePath(pathname, entry.href);
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                      active
                        ? "text-primary bg-primary-light/50"
                        : "text-text-secondary hover:text-text hover:bg-surface-hover"
                    )}
                  >
                    {entry.label}
                  </Link>
                );
              }
              return (
                <NavDropdownMenu
                  key={entry.label}
                  entry={entry}
                  pathname={pathname}
                  onClose={() => {}}
                />
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="بحث..."
              className="w-48 xl:w-64 hidden sm:block"
            />
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-border cursor-pointer"
            >
              <Search size={14} />
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                ⌘K
              </kbd>
            </button>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover cursor-pointer">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <Dropdown
              align="start"
              trigger={
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover cursor-pointer">
                  <Avatar name="admin" size="sm" />
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-text leading-tight">
                      المدير
                    </p>
                    <p className="text-xs text-text-muted leading-tight">
                      admin@store.com
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className="hidden md:block text-text-muted"
                  />
                </div>
              }
            >
              <DropdownItem>
                <span>الملف الشخصي</span>
              </DropdownItem>
              <DropdownItem>
                <span>الإعدادات</span>
              </DropdownItem>
              <div className="my-1 border-t border-border" />
              <DropdownItem danger>
                <span>تسجيل الخروج</span>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-[70] h-full bg-surface lg:hidden"
          >
            <MobileNavMenu pathname={pathname} onClose={closeMobile} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
