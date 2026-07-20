"use client";

import { Bell, ChevronDown, User, Settings, LogOut, Search } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

export default function AdminTopbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      {/* Right side (RTL): Search */}
      <div className="flex items-center gap-3">
        <SearchInput placeholder="بحث..." className="w-64 hidden sm:block" />
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-border cursor-pointer"
        >
          <Search size={14} />
          <span className="text-xs">بحث متقدم</span>
          <kbd className="mr-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Left side (RTL): Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover cursor-pointer">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User dropdown */}
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
