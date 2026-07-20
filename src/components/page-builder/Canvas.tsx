"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type MouseEvent as ReactMouseEvent } from "react";
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  EyeOff,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilder } from "./BuilderContext";
import type { PageElement } from "./types";

function ElementRenderer({ element, onSelect }: {
  element: PageElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { props, type } = element;

  const handleClick = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const baseClasses = "w-full h-full overflow-hidden";

  switch (type) {
    case "heading": {
      const level = (props.level as string) || "h2";
      const color = (props.color as string) || "#111827";
      const fontSize = `${props.fontSize || 32}px`;
      const align = (props.alignment as string) || "center";
      const justifyContent = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
      const headingText = (props.text as string) || "عنوان";
      return (
        <div className={baseClasses} onClick={handleClick} style={{ display: "flex", alignItems: "center", justifyContent }}>
          {level === "h1" && <h1 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h1>}
          {level === "h2" && <h2 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h2>}
          {level === "h3" && <h3 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h3>}
          {level === "h4" && <h4 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h4>}
          {level === "h5" && <h5 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h5>}
          {level === "h6" && <h6 style={{ color, fontSize, textAlign: align as "center" | "right" | "left" }} className="font-bold m-0">{headingText}</h6>}
        </div>
      );
    }
    case "text":
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{
            color: (props.color as string) || "#6b7280",
            fontSize: `${props.fontSize || 16}px`,
            lineHeight: 1.7,
            display: "flex",
            alignItems: "center",
            justifyContent: (props.alignment as string) === "right" ? "flex-end" : (props.alignment as string) === "left" ? "flex-start" : "center",
            padding: "8px 16px",
          }}
        >
          <p className="m-0" style={{ textAlign: (props.alignment as string) as "center" | "right" | "left" }}>{(props.text as string) || "نص توضيحي"}</p>
        </div>
      );
    case "button": {
      const variant = (props.variant as string) || "primary";
      const size = (props.size as string) || "md";
      const variantMap: Record<string, string> = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
      };
      const sizeMap: Record<string, string> = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      };
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{ display: "flex", alignItems: "center", justifyContent: (props.alignment as string) === "right" ? "flex-end" : (props.alignment as string) === "left" ? "flex-start" : "center", padding: "8px" }}
        >
          <button className={cn("rounded-lg font-semibold transition-colors cursor-pointer", variantMap[variant] || variantMap.primary, sizeMap[size] || sizeMap.md)}>
            {(props.label as string) || "اضغط هنا"}
          </button>
        </div>
      );
    }
    case "image":
      return (
        <div className={baseClasses} onClick={handleClick}>
          {(props.url as string) ? (
            <img
              src={props.url as string}
              alt={(props.alt as string) || ""}
              className="w-full h-full"
              style={{ objectFit: (props.objectFit as "cover" | "contain" | "fill") || "cover", borderRadius: `${props.borderRadius || 0}px` }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
      );
    case "hero":
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{
            background: (props.backgroundImage as string)
              ? `url(${props.backgroundImage}) center/cover`
              : (props.backgroundColor as string) || "#6366f1",
            position: "relative",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${((props.overlayOpacity as number) || 40) / 100})` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 m-0" style={{ color: (props.textColor as string) || "#ffffff" }}>
              {(props.title as string) || "عنوان رئيسي"}
            </h1>
            <p className="text-lg mb-6 m-0 opacity-90" style={{ color: (props.textColor as string) || "#ffffff" }}>
              {(props.subtitle as string) || "نص توضيحي فرعي"}
            </p>
            {(props.ctaText as string) && (
              <button className="px-8 py-3 bg-white rounded-lg font-semibold text-indigo-600 hover:bg-gray-100 transition-colors cursor-pointer">
                {props.ctaText as string}
              </button>
            )}
          </div>
        </div>
      );
    case "features": {
      const features = (props.features as Array<{ icon: string; title: string; description: string }>) || [];
      const cols = (props.columns as number) || 3;
      return (
        <div className={baseClasses} onClick={handleClick} style={{ padding: "32px 24px" }}>
          {(props.title as string) && (
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 m-0">{props.title as string}</h2>
          )}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {features.map((f, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {(f.icon || "").charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 m-0">{f.title}</h3>
                <p className="text-sm text-gray-500 m-0">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "pricing": {
      const plans = (props.plans as Array<{ name: string; price: string; period: string; features: string[]; highlighted: boolean; cta: string }>) || [];
      return (
        <div className={baseClasses} onClick={handleClick} style={{ padding: "32px 24px" }}>
          {(props.title as string) && (
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 m-0">{props.title as string}</h2>
          )}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)` }}>
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl p-6 border-2 flex flex-col",
                  plan.highlighted ? "border-indigo-500 bg-indigo-50 shadow-lg scale-105" : "border-gray-200 bg-white"
                )}
              >
                <h3 className="font-bold text-lg text-gray-900 m-0">{plan.name}</h3>
                <div className="mt-3 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-500 mr-1">/ {plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1 m-0 p-0 list-none">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "mt-4 py-2.5 rounded-lg font-semibold text-center cursor-pointer w-full",
                    plan.highlighted ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "faq": {
      const items = (props.items as Array<{ question: string; answer: string }>) || [];
      return (
        <div className={baseClasses} onClick={handleClick} style={{ padding: "32px 24px" }}>
          {(props.title as string) && (
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 m-0">{props.title as string}</h2>
          )}
          <div className="max-w-2xl mx-auto space-y-3">
            {items.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 bg-gray-50 font-medium text-gray-900 text-sm">
                  {item.question}
                </div>
                <div className="px-5 py-3 text-sm text-gray-600 border-t border-gray-100">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "cta":
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{ background: (props.backgroundColor as string) || "#6366f1" }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <h2 className="text-3xl font-bold mb-3 m-0" style={{ color: (props.textColor as string) || "#ffffff" }}>
              {(props.title as string) || "دعوة للإجراء"}
            </h2>
            <p className="text-base mb-6 m-0 opacity-90" style={{ color: (props.textColor as string) || "#ffffff" }}>
              {(props.subtitle as string) || "نص توضيحي"}
            </p>
            {(props.buttonText as string) && (
              <button className="px-8 py-3 bg-white rounded-lg font-semibold text-indigo-600 hover:bg-gray-100 transition-colors cursor-pointer">
                {props.buttonText as string}
              </button>
            )}
          </div>
        </div>
      );
    case "testimonials": {
      const items = (props.items as Array<{ name: string; role: string; quote: string; avatar: string }>) || [];
      return (
        <div className={baseClasses} onClick={handleClick} style={{ padding: "32px 24px" }}>
          {(props.title as string) && (
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 m-0">{props.title as string}</h2>
          )}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}>
            {items.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-sm text-gray-600 mb-4 m-0 italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {item.avatar && (
                    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 m-0">{item.name}</p>
                    <p className="text-xs text-gray-500 m-0">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "countdown": {
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{ background: (props.backgroundColor as string) || "#1e1b4b" }}
        >
          <CountdownDisplay
            endDate={props.endDate as string}
            label={props.label as string}
            textColor={(props.textColor as string) || "#ffffff"}
          />
        </div>
      );
    }
    case "social-proof": {
      const count = (props.counterValue as number) || 0;
      const avatars = (props.avatars as string[]) || [];
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-center gap-4 h-full">
            <div className="flex -space-x-3 space-x-reverse">
              {avatars.slice(0, 5).map((src, i) => (
                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{count.toLocaleString("ar-SA")}</span>
              <span className="text-sm text-gray-500 mr-2">{(props.label as string) || "عميل سعيد"}</span>
            </div>
          </div>
        </div>
      );
    }
    case "video":
      return (
        <div className={baseClasses} onClick={handleClick}>
          {(props.url as string) ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <Play size={48} className="text-white/70" />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Play size={48} />
            </div>
          )}
        </div>
      );
    case "divider":
      return (
        <div className={baseClasses} onClick={handleClick} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0" }}>
          <hr
            className="m-0"
            style={{
              width: `${(props.width as number) || 100}%`,
              border: "none",
              borderTop: `${(props.thickness as number) || 1}px ${(props.style as string) || "solid"} ${(props.color as string) || "#e5e7eb"}`,
            }}
          />
        </div>
      );
    case "spacer":
      return (
        <div
          className={baseClasses}
          onClick={handleClick}
          style={{ height: (props.height as number) || 60 }}
        />
      );
    case "columns": {
      const cols = (props.columnCount as number) || 2;
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div
            className="grid h-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: `${props.gap || 24}px`,
            }}
          >
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                عمود {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }
    default:
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            {type}
          </div>
        </div>
      );
  }
}

function Play({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CountdownDisplay({ endDate, label, textColor }: { endDate: string; label: string; textColor: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetTime = endDate ? new Date(endDate).getTime() : 0;
  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <span className="text-sm font-medium opacity-80" style={{ color: textColor }}>
        {label || "العرض ينتهي خلال"}
      </span>
      <div className="flex items-center gap-3">
        {[{ v: days, l: "يوم" }, { v: hours, l: "ساعة" }, { v: minutes, l: "دقيقة" }, { v: seconds, l: "ثانية" }].map(({ v, l }, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold" style={{ color: textColor }}>
              {String(v).padStart(2, "0")}
            </div>
            <span className="text-xs mt-1 opacity-60" style={{ color: textColor }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ContextMenu {
  x: number;
  y: number;
  elementId: string;
}

export function Canvas() {
  const {
    elements,
    selectedId,
    device,
    zoom,
    selectElement,
    removeElement,
    duplicateElement,
    moveElement,
    updateElement,
    addElement,
  } = useBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const deviceWidth = device === "desktop" ? "100%" : device === "tablet" ? "768px" : "375px";

  const handleCanvasClick = useCallback(() => {
    selectElement(null);
    setContextMenu(null);
  }, [selectElement]);

  const handleContextMenu = useCallback(
    (e: ReactMouseEvent, elementId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY, elementId });
    },
    []
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const blockType = e.dataTransfer.getData("block-type");
      if (!blockType) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scrollTop = canvas.scrollTop;
      const scale = zoom / 100;

      const y = Math.max(0, (e.clientY - rect.top + scrollTop) / scale);

      addElement(blockType, { x: 0, y });
    },
    [zoom, addElement]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("block-type")) {
      setDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <div
      className="flex-1 overflow-auto bg-[#f0f0f0] relative"
      onClick={handleCanvasClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu(null);
      }}
    >
      <div className="min-h-full flex justify-center py-8 px-4">
        <div
          ref={canvasRef}
          className={cn(
            "bg-white shadow-2xl relative transition-all duration-300",
            dragOver && "ring-2 ring-indigo-400 ring-offset-2"
          )}
          style={{
            width: deviceWidth,
            maxWidth: "100%",
            minHeight: 600,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            backgroundImage:
              "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasClick();
          }}
        >
          {elements.length === 0 && !dragOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
              <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="mb-4 opacity-40">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
              <p className="text-lg font-medium">اسحب العناصر من اللوحة هنا</p>
              <p className="text-sm mt-1">أو اضغط على عنصر في اللوحة لإضافته</p>
            </div>
          )}

          {dragOver && elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-dashed border-indigo-400 rounded-xl p-12 text-indigo-500">
                أفلت العنصر هنا
              </div>
            </div>
          )}

          {elements
            .filter((el) => el.visible !== false)
            .map((element) => (
              <div
                key={element.id}
                className={cn(
                  "absolute cursor-pointer transition-all",
                  selectedId === element.id
                    ? "ring-2 ring-blue-500 ring-offset-1"
                    : "hover:ring-1 hover:ring-blue-300",
                  element.locked && "cursor-default"
                )}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu(null);
                  selectElement(element.id);
                }}
                onContextMenu={(e) => handleContextMenu(e, element.id)}
                draggable={!element.locked}
                onDragStart={(e) => {
                  if (element.locked) {
                    e.preventDefault();
                    return;
                  }
                  e.dataTransfer.setData("move-element", element.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <ElementRenderer
                  element={element}
                  isSelected={selectedId === element.id}
                  onSelect={selectElement}
                />
                {element.locked && (
                  <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded px-1.5 py-0.5 text-[10px] font-medium">
                    مقفل
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <ContextMenuItem
              icon={<Copy size={14} />}
              label="تكرار"
              onClick={() => {
                duplicateElement(contextMenu.elementId);
                setContextMenu(null);
              }}
            />
            <ContextMenuItem
              icon={<ArrowUp size={14} />}
              label="إحضار للأمام"
              onClick={() => {
                moveElement(contextMenu.elementId, "forward");
                setContextMenu(null);
              }}
            />
            <ContextMenuItem
              icon={<ArrowDown size={14} />}
              label="إرسال للخلف"
              onClick={() => {
                moveElement(contextMenu.elementId, "backward");
                setContextMenu(null);
              }}
            />
            {(() => {
              const el = elements.find((e) => e.id === contextMenu.elementId);
              return el?.locked ? (
                <ContextMenuItem
                  icon={<Unlock size={14} />}
                  label="إلغاء القفل"
                  onClick={() => {
                    updateElement(contextMenu.elementId, { locked: false });
                    setContextMenu(null);
                  }}
                />
              ) : (
                <ContextMenuItem
                  icon={<Lock size={14} />}
                  label="قفل"
                  onClick={() => {
                    updateElement(contextMenu.elementId, { locked: true });
                    setContextMenu(null);
                  }}
                />
              );
            })()}
            {(() => {
              const el = elements.find((e) => e.id === contextMenu.elementId);
              return el?.visible === false ? (
                <ContextMenuItem
                  icon={<Eye size={14} />}
                  label="إظهار"
                  onClick={() => {
                    updateElement(contextMenu.elementId, { visible: true });
                    setContextMenu(null);
                  }}
                />
              ) : (
                <ContextMenuItem
                  icon={<EyeOff size={14} />}
                  label="إخفاء"
                  onClick={() => {
                    updateElement(contextMenu.elementId, { visible: false });
                    setContextMenu(null);
                  }}
                />
              );
            })()}
            <div className="border-t border-gray-100 my-1" />
            <ContextMenuItem
              icon={<Trash2 size={14} className="text-red-500" />}
              label="حذف"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                removeElement(contextMenu.elementId);
                setContextMenu(null);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer text-right",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
