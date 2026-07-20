"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  LayoutGrid,
  Columns3,
  Minus,
  ArrowUpDown,
  Type,
  AlignLeft,
  MousePointerClick,
  Image as ImageIcon,
  HelpCircle,
  CreditCard,
  Timer,
  Users,
  Megaphone,
  Quote,
  Play,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilder } from "./BuilderContext";
import { BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from "./blocks";
import type { ElementType } from "./types";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate size={16} />,
  LayoutGrid: <LayoutGrid size={16} />,
  Columns3: <Columns3 size={16} />,
  Minus: <Minus size={16} />,
  ArrowUpDown: <ArrowUpDown size={16} />,
  Type: <Type size={16} />,
  AlignLeft: <AlignLeft size={16} />,
  MousePointerClick: <MousePointerClick size={16} />,
  Image: <ImageIcon size={16} />,
  HelpCircle: <HelpCircle size={16} />,
  CreditCard: <CreditCard size={16} />,
  Timer: <Timer size={16} />,
  Users: <Users size={16} />,
  Megaphone: <Megaphone size={16} />,
  Quote: <Quote size={16} />,
  Play: <Play size={16} />,
};

const TYPE_ICON: Record<ElementType, React.ReactNode> = {
  heading: <Type size={14} />,
  text: <AlignLeft size={14} />,
  image: <ImageIcon size={14} />,
  button: <MousePointerClick size={14} />,
  columns: <Columns3 size={14} />,
  hero: <LayoutTemplate size={14} />,
  features: <LayoutGrid size={14} />,
  testimonials: <Quote size={14} />,
  pricing: <CreditCard size={14} />,
  faq: <HelpCircle size={14} />,
  cta: <Megaphone size={14} />,
  divider: <Minus size={14} />,
  spacer: <ArrowUpDown size={14} />,
  video: <Play size={14} />,
  countdown: <Timer size={14} />,
  "social-proof": <Users size={14} />,
};

export function LayersPanel() {
  const {
    elements,
    selectedId,
    selectElement,
    removeElement,
    updateElement,
    addElement,
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<"blocks" | "layers">("blocks");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("layout");

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData("block-type", blockType);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleBlockClick = (blockType: string) => {
    addElement(blockType);
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shrink-0">
      <div className="flex border-b border-gray-200">
        <button
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            activeTab === "blocks"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("blocks")}
        >
          الكتل
        </button>
        <button
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            activeTab === "layers"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("layers")}
        >
          الطبقات ({elements.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "blocks" ? (
          <div className="p-3 space-y-1">
            {BLOCK_CATEGORIES.map((cat) => {
              const blocks = BLOCK_DEFINITIONS.filter(
                (b) => b.category === cat.id
              );
              const isExpanded = expandedCategory === cat.id;
              return (
                <div key={cat.id}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : cat.id)
                    }
                  >
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        "transition-transform text-gray-400",
                        isExpanded && "rotate-180"
                      )}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="grid grid-cols-2 gap-1.5 pb-2 px-1">
                      {blocks.map((block) => (
                        <div
                          key={block.type}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, block.type)
                          }
                          onClick={() => handleBlockClick(block.type)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-grab active:cursor-grabbing transition-all group"
                        >
                          <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                            {ICON_MAP[block.icon] || (
                              <LayoutGrid size={16} />
                            )}
                          </div>
                          <span className="text-xs text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                            {block.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2">
            {elements.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">لا توجد عناصر بعد</p>
                <p className="text-xs mt-1">اسحب عنصراً من الكتل إلى اللوحة</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {[...elements].reverse().map((element) => (
                  <div
                    key={element.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all group",
                      selectedId === element.id
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50 border border-transparent"
                    )}
                    onClick={() => selectElement(element.id)}
                  >
                    <GripVertical
                      size={14}
                      className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-gray-400 shrink-0">
                      {TYPE_ICON[element.type] || (
                        <LayoutGrid size={14} />
                      )}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {element.name || element.type}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateElement(element.id, {
                            visible: element.visible === false ? true : false,
                          });
                        }}
                        title={element.visible === false ? "إظهار" : "إخفاء"}
                      >
                        {element.visible === false ? (
                          <EyeOff size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                      </button>
                      <button
                        className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateElement(element.id, {
                            locked: !element.locked,
                          });
                        }}
                        title={element.locked ? "إلغاء القفل" : "قفل"}
                      >
                        {element.locked ? (
                          <Lock size={12} />
                        ) : (
                          <Unlock size={12} />
                        )}
                      </button>
                      <button
                        className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(element.id);
                        }}
                        title="حذف"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
