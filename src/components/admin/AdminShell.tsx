"use client";

import { useState, useCallback, useEffect } from "react";
import TopNav from "./TopNav";
import CommandPalette from "@/components/ui/CommandPalette";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);

  useEffect(() => {
    const handleToggle = () => setCommandPaletteOpen((prev) => !prev);
    window.addEventListener("command-palette:toggle", handleToggle);
    return () => window.removeEventListener("command-palette:toggle", handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <TopNav onOpenCommandPalette={openCommandPalette} />
      <main className="p-4 lg:p-6">{children}</main>
      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
    </div>
  );
}
