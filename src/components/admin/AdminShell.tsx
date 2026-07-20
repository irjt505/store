"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import CommandPalette from "@/components/ui/CommandPalette";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = () => setCommandOpen((prev) => !prev);
    window.addEventListener("command-palette:toggle", handler);
    return () => window.removeEventListener("command-palette:toggle", handler);
  }, []);

  const sidebarWidth = isDesktop ? (sidebarCollapsed ? 72 : 260) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-bg" dir="rtl" lang="ar">
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((p) => !p)} />
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ marginRight: sidebarWidth, transition: "margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-6">{children}</div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
