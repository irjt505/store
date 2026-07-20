"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultKey?: string;
  onChange?: (key: string) => void;
  children: ReactNode | ((activeKey: string) => ReactNode);
}

export function Tabs({ tabs, defaultKey, onChange, children }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultKey || tabs[0]?.key || "");

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px",
              activeKey === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text hover:border-border"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {typeof children === "function"
          ? (children as (activeKey: string) => ReactNode)(activeKey)
          : children}
      </div>
    </div>
  );
}
