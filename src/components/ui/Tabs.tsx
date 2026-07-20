"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
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
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabBarRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const keys = tabs.map((t) => t.key);
      const currentIndex = keys.indexOf(activeKey);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % keys.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + keys.length) % keys.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = keys.length - 1;
      }

      if (nextIndex !== null) {
        const nextKey = keys[nextIndex];
        setActiveKey(nextKey);
        onChange?.(nextKey);
        tabRefs.current.get(nextKey)?.focus();
      }
    },
    [tabs, activeKey, onChange]
  );

  return (
    <div>
      <div
        ref={tabBarRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-0 border-b border-border overflow-x-auto scrollbar-none -mb-px"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.key, el);
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              id={`tab-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                isActive ? "text-primary" : "text-text-secondary hover:text-text"
              )}
            >
              {tab.icon}
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-4" role="tabpanel" id={`tabpanel-${activeKey}`} aria-labelledby={`tab-${activeKey}`}>
        {typeof children === "function"
          ? (children as (activeKey: string) => ReactNode)(activeKey)
          : children}
      </div>
    </div>
  );
}
