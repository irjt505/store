"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  Save,
  Upload,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilder } from "./BuilderContext";
import type { DeviceType } from "./types";

export function Toolbar() {
  const {
    pageName,
    setPageName,
    pageStatus,
    isDirty,
    device,
    setDevice,
    zoom,
    setZoom,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDraft,
    publish,
  } = useBuilder();

  const [editingName, setEditingName] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  const handleSave = useCallback(() => {
    setSaving(true);
    saveDraft();
    setTimeout(() => setSaving(false), 800);
  }, [saveDraft]);

  const handlePublish = useCallback(() => {
    setPublishing(true);
    publish();
    setTimeout(() => setPublishing(false), 1000);
  }, [publish]);

  const devices: { type: DeviceType; icon: React.ReactNode; label: string }[] = [
    { type: "desktop", icon: <Monitor size={16} />, label: "سطح المكتب" },
    { type: "tablet", icon: <Tablet size={16} />, label: "لوحي" },
    { type: "mobile", icon: <Smartphone size={16} />, label: "محمول" },
  ];

  const zoomPresets = [50, 75, 100, 125, 150, 200];

  return (
    <>
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="/admin/content/pages"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={18} />
          </a>
          <div className="h-6 w-px bg-gray-200" />
          {editingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditingName(false);
              }}
              className="text-sm font-semibold text-gray-900 border-b-2 border-indigo-500 outline-none bg-transparent px-1 py-0.5"
            />
          ) : (
            <button
              className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors"
              onClick={() => setEditingName(true)}
            >
              {pageName}
            </button>
          )}
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              pageStatus === "published"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {pageStatus === "published" ? "منشور" : "مسودة"}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {devices.map((d) => (
              <button
                key={d.type}
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  device === d.type
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setDevice(d.type)}
                title={d.label}
              >
                {d.icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
            >
              <Minus size={14} />
            </button>
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="text-xs text-gray-600 bg-transparent border-none cursor-pointer focus:outline-none text-center font-medium w-12"
            >
              {zoomPresets.map((z) => (
                <option key={z} value={z}>
                  {z}%
                </option>
              ))}
            </select>
            <button
              className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-amber-500 font-medium ml-2">
              تغييرات غير محفوظة
            </span>
          )}
          {!isDirty && !saving && !publishing && pageStatus === "draft" && (
            <span className="text-xs text-gray-400 font-medium ml-2">
              محفوظ
            </span>
          )}

          <button
            className={cn(
              "p-2 rounded-lg transition-colors cursor-pointer",
              canUndo
                ? "text-gray-600 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            )}
            onClick={undo}
            disabled={!canUndo}
            title="تراجع"
          >
            <Undo2 size={16} />
          </button>
          <button
            className={cn(
              "p-2 rounded-lg transition-colors cursor-pointer",
              canRedo
                ? "text-gray-600 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            )}
            onClick={redo}
            disabled={!canRedo}
            title="إعادة"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye size={15} />
            معاينة
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle className="opacity-25" cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
                <path className="opacity-75" fill="currentColor" d="M14 8a6 6 0 01-1.08 3.38l-.87.5A7 7 0 1015 8h-1z" />
              </svg>
            ) : (
              <Save size={14} />
            )}
            حفظ
          </button>

          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer font-medium"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle className="opacity-25" cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
                <path className="opacity-75" fill="currentColor" d="M14 8a6 6 0 01-1.08 3.38l-.87.5A7 7 0 1015 8h-1z" />
              </svg>
            ) : (
              <Upload size={14} />
            )}
            نشر
          </button>
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-8" onClick={() => setPreviewOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">معاينة الصفحة</span>
              <button onClick={() => setPreviewOpen(false)} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-0">
              <PreviewContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PreviewContent() {
  const { elements } = useBuilder();
  return (
    <div className="bg-white min-h-[500px]">
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          لا يوجد محتوى للمعاينة
        </div>
      ) : (
        elements
          .filter((el) => el.visible !== false)
          .map((el) => (
            <div key={el.id} style={{ position: "relative", width: "100%", height: el.size.height }}>
              <PreviewElement element={el} />
            </div>
          ))
      )}
    </div>
  );
}

function PreviewElement({ element }: { element: import("./types").PageElement }) {
  const { props, type } = element;

  switch (type) {
    case "hero":
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center text-center px-8"
          style={{ background: (props.backgroundImage as string) ? `url(${props.backgroundImage}) center/cover` : (props.backgroundColor as string) || "#6366f1", position: "relative" }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${((props.overlayOpacity as number) || 40) / 100})` }} />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4" style={{ color: (props.textColor as string) || "#fff" }}>{props.title as string}</h1>
            <p className="text-lg mb-6 opacity-90" style={{ color: (props.textColor as string) || "#fff" }}>{props.subtitle as string}</p>
            {(props.ctaText as string) && (
              <button className="px-8 py-3 bg-white rounded-lg font-semibold text-indigo-600 hover:bg-gray-100 cursor-pointer">{props.ctaText as string}</button>
            )}
          </div>
        </div>
      );
    case "heading":
      return (
        <div className="flex items-center justify-center h-full px-4">
          <span style={{ color: (props.color as string) || "#111827", fontSize: `${props.fontSize || 32}px`, textAlign: (props.alignment as "center" | "right" | "left") || "center" }} className="font-bold">{props.text as string}</span>
        </div>
      );
    case "text":
      return (
        <div className="flex items-center justify-center h-full px-4">
          <p style={{ color: (props.color as string) || "#6b7280", fontSize: `${props.fontSize || 16}px`, textAlign: (props.alignment as "center" | "right" | "left") || "center", lineHeight: 1.7 }} className="m-0">{props.text as string}</p>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
          {type}
        </div>
      );
  }
}
