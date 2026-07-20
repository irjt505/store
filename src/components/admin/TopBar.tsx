"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Globe,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

const routeTitles: Record<string, string> = {
  "/admin/dashboard": "لوحة التحكم",
  "/admin/products": "المنتجات",
  "/admin/products/new": "إضافة منتج",
  "/admin/products/categories": "الفئات",
  "/admin/products/collections": "المجموعات",
  "/admin/products/brands": "العلامات التجارية",
  "/admin/products/tags": "الوسوم",
  "/admin/orders": "الطلبيات",
  "/admin/customers": "العملاء",
  "/admin/marketing/coupons": "الكوبونات",
  "/admin/marketing/campaigns": "الحملات",
  "/admin/discounts": "الخصومات",
  "/admin/affiliates": "التسويق بالعمولة",
  "/admin/content/pages": "الصفحات",
  "/admin/content/blog": "المدونة",
  "/admin/content/menus": "القوائم",
  "/admin/landing-pages": "صفحات الهبوط",
  "/admin/invoices": "الفواتير",
  "/admin/appearance/theme-editor": "المظهر",
  "/admin/appearance/header-builder": "بناء الرأس",
  "/admin/appearance/footer-builder": "بناء التذييل",
  "/admin/checkout-builder": "بناء الدفع",
  "/admin/page-builder/new": "بناء الصفحات",
  "/admin/settings/general": "الإعدادات العامة",
  "/admin/settings/store": "إعدادات المتجر",
  "/admin/settings/payment": "إعدادات الدفع",
  "/admin/settings/shipping": "إعدادات الشحن",
  "/admin/settings/seo": "SEO",
  "/admin/settings/users": "المستخدمين",
  "/admin/settings/api": "API",
  "/admin/system": "النظام",
  "/admin/inventory": "المخزون",
};

const mockNotifications = [
  { id: "1", title: "طلب جديد #1234", desc: "تم استلام طلب جديد بقيمة 250 ر.س", time: "منذ 5 دقائق" },
  { id: "2", title: "عميل جديد", desc: "تم تسجيل عميل جديد", time: "منذ 15 دقيقة" },
  { id: "3", title: " المنتج منخفض المخزون", desc: "المنتج X على وشك النفاد", time: "منذ ساعة" },
];

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const segments = pathname.split("/").filter(Boolean);
  for (const key of Object.keys(routeTitles)) {
    if (pathname.startsWith(key + "/")) return routeTitles[key];
  }
  return segments[segments.length - 1] || "لوحة التحكم";
}

export default function TopBar() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [notifOpen, setNotifOpen] = useState(false);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("command-palette:toggle"));
  };

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];
    let current = "";
    for (let i = 0; i < segments.length; i++) {
      current += "/" + segments[i];
      const label = routeTitles[current] || segments[i];
      crumbs.push({ label, href: current });
    }
    return crumbs;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      {/* Right side (RTL): Title + Breadcrumbs */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-sm font-semibold text-text leading-tight truncate">
          {pageTitle}
        </h1>
        <nav className="flex items-center gap-1 text-[11px] text-text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <span className="text-border">/</span>}
              <span
                className={cn(
                  "truncate",
                  i === breadcrumbs.length - 1 ? "text-text-secondary font-medium" : "text-text-muted"
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Left side (RTL): Actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          onClick={triggerSearch}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-border cursor-pointer"
        >
          <Search size={14} />
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Language switcher */}
        <button
          onClick={() => setLang((prev) => (prev === "ar" ? "en" : "ar"))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover cursor-pointer"
          title="تبديل اللغة"
        >
          <Globe size={18} />
          <span className="absolute text-[8px] font-bold text-text-muted mt-1.5">
            {lang.toUpperCase()}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute left-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-surface py-2 shadow-xl"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border-light">
                    <span className="text-sm font-semibold text-text">الإشعارات</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-text-muted hover:text-text cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-surface-hover cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text">{n.title}</span>
                          <span className="text-[10px] text-text-muted">{n.time}</span>
                        </div>
                        <p className="text-xs text-text-secondary">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border-light px-4 py-2">
                    <button className="w-full text-center text-xs font-medium text-primary hover:text-primary-hover cursor-pointer">
                      عرض جميع الإشعارات
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <Dropdown
          align="start"
          trigger={
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover cursor-pointer">
              <Avatar name="المدير" size="sm" />
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-text leading-tight">
                  المدير
                </p>
                <p className="text-[11px] text-text-muted leading-tight">
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
            <User size={16} />
            <span>الملف الشخصي</span>
          </DropdownItem>
          <DropdownItem>
            <Settings size={16} />
            <span>الإعدادات</span>
          </DropdownItem>
          <div className="my-1 border-t border-border" />
          <DropdownItem danger>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
