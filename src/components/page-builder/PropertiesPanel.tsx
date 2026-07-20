"use client";

import { useCallback } from "react";
import { Settings2, Plus, Trash2 } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import type { PageElement } from "./types";

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-full h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
    </div>
  );
}

function PositionSection({ element, onUpdate }: { element: PageElement; onUpdate: (props: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">الموضع والحجم</h4>
      <div className="grid grid-cols-2 gap-2">
        <FieldGroup label="X">
          <NumberInput value={element.position.x} onChange={(v) => onUpdate({ position: { ...element.position, x: v } })} />
        </FieldGroup>
        <FieldGroup label="Y">
          <NumberInput value={element.position.y} onChange={(v) => onUpdate({ position: { ...element.position, y: v } })} />
        </FieldGroup>
        <FieldGroup label="العرض">
          <NumberInput value={element.size.width} min={20} onChange={(v) => onUpdate({ size: { ...element.size, width: v } })} />
        </FieldGroup>
        <FieldGroup label="الارتفاع">
          <NumberInput value={element.size.height} min={20} onChange={(v) => onUpdate({ size: { ...element.size, height: v } })} />
        </FieldGroup>
      </div>
    </div>
  );
}

function HeadingProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="النص">
        <TextInput value={(p.text as string) || ""} onChange={(v) => onUpdate({ props: { ...p, text: v } })} placeholder="أدخل العنوان" />
      </FieldGroup>
      <FieldGroup label="المستوى">
        <SelectInput value={(p.level as string) || "h2"} onChange={(v) => onUpdate({ props: { ...p, level: v } })} options={[
          { label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" },
          { label: "H4", value: "h4" }, { label: "H5", value: "h5" }, { label: "H6", value: "h6" },
        ]} />
      </FieldGroup>
      <FieldGroup label="المحاذاة">
        <SelectInput value={(p.alignment as string) || "center"} onChange={(v) => onUpdate({ props: { ...p, alignment: v } })} options={[
          { label: "يمين", value: "right" }, { label: "وسط", value: "center" }, { label: "يسار", value: "left" },
        ]} />
      </FieldGroup>
      <FieldGroup label="حجم الخط">
        <NumberInput value={(p.fontSize as number) || 32} min={12} max={120} onChange={(v) => onUpdate({ props: { ...p, fontSize: v } })} />
      </FieldGroup>
      <FieldGroup label="اللون">
        <ColorInput value={(p.color as string) || "#111827"} onChange={(v) => onUpdate({ props: { ...p, color: v } })} />
      </FieldGroup>
    </div>
  );
}

function TextProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="النص">
        <TextArea value={(p.text as string) || ""} onChange={(v) => onUpdate({ props: { ...p, text: v } })} rows={4} />
      </FieldGroup>
      <FieldGroup label="المحاذاة">
        <SelectInput value={(p.alignment as string) || "center"} onChange={(v) => onUpdate({ props: { ...p, alignment: v } })} options={[
          { label: "يمين", value: "right" }, { label: "وسط", value: "center" }, { label: "يسار", value: "left" },
        ]} />
      </FieldGroup>
      <FieldGroup label="حجم الخط">
        <NumberInput value={(p.fontSize as number) || 16} min={10} max={72} onChange={(v) => onUpdate({ props: { ...p, fontSize: v } })} />
      </FieldGroup>
      <FieldGroup label="اللون">
        <ColorInput value={(p.color as string) || "#6b7280"} onChange={(v) => onUpdate({ props: { ...p, color: v } })} />
      </FieldGroup>
    </div>
  );
}

function ButtonProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="التسمية">
        <TextInput value={(p.label as string) || ""} onChange={(v) => onUpdate({ props: { ...p, label: v } })} />
      </FieldGroup>
      <FieldGroup label="الرابط">
        <TextInput value={(p.url as string) || ""} onChange={(v) => onUpdate({ props: { ...p, url: v } })} placeholder="https://..." />
      </FieldGroup>
      <FieldGroup label="النمط">
        <SelectInput value={(p.variant as string) || "primary"} onChange={(v) => onUpdate({ props: { ...p, variant: v } })} options={[
          { label: "أساسي", value: "primary" }, { label: "ثانوي", value: "secondary" }, { label: "محدد", value: "outline" },
        ]} />
      </FieldGroup>
      <FieldGroup label="الحجم">
        <SelectInput value={(p.size as string) || "md"} onChange={(v) => onUpdate({ props: { ...p, size: v } })} options={[
          { label: "صغير", value: "sm" }, { label: "متوسط", value: "md" }, { label: "كبير", value: "lg" },
        ]} />
      </FieldGroup>
      <FieldGroup label="المحاذاة">
        <SelectInput value={(p.alignment as string) || "center"} onChange={(v) => onUpdate({ props: { ...p, alignment: v } })} options={[
          { label: "يمين", value: "right" }, { label: "وسط", value: "center" }, { label: "يسار", value: "left" },
        ]} />
      </FieldGroup>
    </div>
  );
}

function ImageProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="رابط الصورة">
        <TextInput value={(p.url as string) || ""} onChange={(v) => onUpdate({ props: { ...p, url: v } })} placeholder="https://..." />
      </FieldGroup>
      <FieldGroup label="النص البديل">
        <TextInput value={(p.alt as string) || ""} onChange={(v) => onUpdate({ props: { ...p, alt: v } })} />
      </FieldGroup>
      <FieldGroup label="ملاءمة الصورة">
        <SelectInput value={(p.objectFit as string) || "cover"} onChange={(v) => onUpdate({ props: { ...p, objectFit: v } })} options={[
          { label: "تغطية", value: "cover" }, { label: "احتواء", value: "contain" }, { label: "ملء", value: "fill" },
        ]} />
      </FieldGroup>
      <FieldGroup label="نصف قطر الحد">
        <NumberInput value={(p.borderRadius as number) || 0} min={0} max={100} onChange={(v) => onUpdate({ props: { ...p, borderRadius: v } })} />
      </FieldGroup>
    </div>
  );
}

function HeroProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <FieldGroup label="العنوان الفرعي">
        <TextInput value={(p.subtitle as string) || ""} onChange={(v) => onUpdate({ props: { ...p, subtitle: v } })} />
      </FieldGroup>
      <FieldGroup label="لون الخلفية">
        <ColorInput value={(p.backgroundColor as string) || "#6366f1"} onChange={(v) => onUpdate({ props: { ...p, backgroundColor: v } })} />
      </FieldGroup>
      <FieldGroup label="صورة الخلفية">
        <TextInput value={(p.backgroundImage as string) || ""} onChange={(v) => onUpdate({ props: { ...p, backgroundImage: v } })} placeholder="https://..." />
      </FieldGroup>
      <FieldGroup label="شفافية الطبقة">
        <NumberInput value={(p.overlayOpacity as number) || 40} min={0} max={100} onChange={(v) => onUpdate({ props: { ...p, overlayOpacity: v } })} />
      </FieldGroup>
      <FieldGroup label="لون النص">
        <ColorInput value={(p.textColor as string) || "#ffffff"} onChange={(v) => onUpdate({ props: { ...p, textColor: v } })} />
      </FieldGroup>
      <FieldGroup label="نص الزر">
        <TextInput value={(p.ctaText as string) || ""} onChange={(v) => onUpdate({ props: { ...p, ctaText: v } })} />
      </FieldGroup>
      <FieldGroup label="رابط الزر">
        <TextInput value={(p.ctaUrl as string) || ""} onChange={(v) => onUpdate({ props: { ...p, ctaUrl: v } })} placeholder="https://..." />
      </FieldGroup>
    </div>
  );
}

function FeaturesProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  const features = (p.features as Array<{ icon: string; title: string; description: string }>) || [];

  const updateFeature = (idx: number, key: string, value: string) => {
    const updated = [...features];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate({ props: { ...p, features: updated } });
  };

  const addFeature = () => {
    onUpdate({ props: { ...p, features: [...features, { icon: "Star", title: "ميزة جديدة", description: "وصف الميزة" }] } });
  };

  const removeFeature = (idx: number) => {
    onUpdate({ props: { ...p, features: features.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <FieldGroup label="عدد الأعمدة">
        <SelectInput value={String((p.columns as number) || 3)} onChange={(v) => onUpdate({ props: { ...p, columns: Number(v) } })} options={[
          { label: "عمودين", value: "2" }, { label: "3 أعمدة", value: "3" }, { label: "4 أعمدة", value: "4" },
        ]} />
      </FieldGroup>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">المميزات</span>
          <button onClick={addFeature} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            <Plus size={12} /> إضافة
          </button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="p-2.5 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">ميزة {i + 1}</span>
              <button onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
            <TextInput value={f.title} onChange={(v) => updateFeature(i, "title", v)} placeholder="العنوان" />
            <TextInput value={f.description} onChange={(v) => updateFeature(i, "description", v)} placeholder="الوصف" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  const plans = (p.plans as Array<{ name: string; price: string; period: string; features: string[]; highlighted: boolean; cta: string }>) || [];

  const updatePlan = (idx: number, key: string, value: unknown) => {
    const updated = [...plans];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate({ props: { ...p, plans: updated } });
  };

  const addPlan = () => {
    onUpdate({ props: { ...p, plans: [...plans, { name: "خطة جديدة", price: "0", period: "شهرياً", features: ["ميزة واحدة"], highlighted: false, cta: "اشترك" }] } });
  };

  const removePlan = (idx: number) => {
    onUpdate({ props: { ...p, plans: plans.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">الخطط</span>
          <button onClick={addPlan} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            <Plus size={12} /> إضافة
          </button>
        </div>
        {plans.map((plan, i) => (
          <div key={i} className="p-2.5 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">خطة {i + 1}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plan.highlighted}
                    onChange={(e) => updatePlan(i, "highlighted", e.target.checked)}
                    className="rounded"
                  />
                  مميزة
                </label>
                <button onClick={() => removePlan(i)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <TextInput value={plan.name} onChange={(v) => updatePlan(i, "name", v)} placeholder="اسم الخطة" />
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={plan.price} onChange={(v) => updatePlan(i, "price", v)} placeholder="السعر" />
              <TextInput value={plan.period} onChange={(v) => updatePlan(i, "period", v)} placeholder="الفترة" />
            </div>
            <TextInput value={plan.features.join(", ")} onChange={(v) => updatePlan(i, "features", v.split(", ").filter(Boolean))} placeholder="المميزات (مفصولة بـ ,)" />
            <TextInput value={plan.cta} onChange={(v) => updatePlan(i, "cta", v)} placeholder="نص الزر" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  const items = (p.items as Array<{ question: string; answer: string }>) || [];

  const updateItem = (idx: number, key: string, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate({ props: { ...p, items: updated } });
  };

  const addItem = () => {
    onUpdate({ props: { ...p, items: [...items, { question: "سؤال جديد؟", answer: "الإجابة هنا" }] } });
  };

  const removeItem = (idx: number) => {
    onUpdate({ props: { ...p, items: items.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">العناصر</span>
          <button onClick={addItem} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            <Plus size={12} /> إضافة
          </button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-2.5 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">سؤال {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
            <TextInput value={item.question} onChange={(v) => updateItem(i, "question", v)} placeholder="السؤال" />
            <TextArea value={item.answer} onChange={(v) => updateItem(i, "answer", v)} rows={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <FieldGroup label="العنوان الفرعي">
        <TextInput value={(p.subtitle as string) || ""} onChange={(v) => onUpdate({ props: { ...p, subtitle: v } })} />
      </FieldGroup>
      <FieldGroup label="نص الزر">
        <TextInput value={(p.buttonText as string) || ""} onChange={(v) => onUpdate({ props: { ...p, buttonText: v } })} />
      </FieldGroup>
      <FieldGroup label="رابط الزر">
        <TextInput value={(p.buttonUrl as string) || ""} onChange={(v) => onUpdate({ props: { ...p, buttonUrl: v } })} placeholder="https://..." />
      </FieldGroup>
      <FieldGroup label="لون الخلفية">
        <ColorInput value={(p.backgroundColor as string) || "#6366f1"} onChange={(v) => onUpdate({ props: { ...p, backgroundColor: v } })} />
      </FieldGroup>
      <FieldGroup label="لون النص">
        <ColorInput value={(p.textColor as string) || "#ffffff"} onChange={(v) => onUpdate({ props: { ...p, textColor: v } })} />
      </FieldGroup>
    </div>
  );
}

function TestimonialsProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  const items = (p.items as Array<{ name: string; role: string; quote: string; avatar: string }>) || [];

  const updateItem = (idx: number, key: string, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate({ props: { ...p, items: updated } });
  };

  const addItem = () => {
    onUpdate({ props: { ...p, items: [...items, { name: "اسم جديد", role: "المنصب", quote: "الاقتباس هنا", avatar: "" }] } });
  };

  const removeItem = (idx: number) => {
    onUpdate({ props: { ...p, items: items.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="space-y-3">
      <FieldGroup label="العنوان">
        <TextInput value={(p.title as string) || ""} onChange={(v) => onUpdate({ props: { ...p, title: v } })} />
      </FieldGroup>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">الشهادات</span>
          <button onClick={addItem} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            <Plus size={12} /> إضافة
          </button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-2.5 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">شهادة {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
            <TextInput value={item.name} onChange={(v) => updateItem(i, "name", v)} placeholder="الاسم" />
            <TextInput value={item.role} onChange={(v) => updateItem(i, "role", v)} placeholder="المنصب" />
            <TextArea value={item.quote} onChange={(v) => updateItem(i, "quote", v)} rows={2} />
            <TextInput value={item.avatar} onChange={(v) => updateItem(i, "avatar", v)} placeholder="رابط الصورة" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="تاريخ الانتهاء">
        <input type="date" value={(p.endDate as string) || ""} onChange={(e) => onUpdate({ props: { ...p, endDate: e.target.value } })} className="w-full h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
      </FieldGroup>
      <FieldGroup label="النص">
        <TextInput value={(p.label as string) || ""} onChange={(v) => onUpdate({ props: { ...p, label: v } })} />
      </FieldGroup>
      <FieldGroup label="لون الخلفية">
        <ColorInput value={(p.backgroundColor as string) || "#1e1b4b"} onChange={(v) => onUpdate({ props: { ...p, backgroundColor: v } })} />
      </FieldGroup>
      <FieldGroup label="لون النص">
        <ColorInput value={(p.textColor as string) || "#ffffff"} onChange={(v) => onUpdate({ props: { ...p, textColor: v } })} />
      </FieldGroup>
    </div>
  );
}

function VideoProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="رابط الفيديو">
        <TextInput value={(p.url as string) || ""} onChange={(v) => onUpdate({ props: { ...p, url: v } })} placeholder="https://..." />
      </FieldGroup>
      <FieldGroup label="نسبة العرض إلى الارتفاع">
        <SelectInput value={(p.aspectRatio as string) || "16/9"} onChange={(v) => onUpdate({ props: { ...p, aspectRatio: v } })} options={[
          { label: "16:9", value: "16/9" }, { label: "4:3", value: "4/3" }, { label: "1:1", value: "1/1" },
        ]} />
      </FieldGroup>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={(p.autoplay as boolean) || false} onChange={(e) => onUpdate({ props: { ...p, autoplay: e.target.checked } })} className="rounded" />
        تشغيل تلقائي
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={(p.muted as boolean) || true} onChange={(e) => onUpdate({ props: { ...p, muted: e.target.checked } })} className="rounded" />
        كتم الصوت
      </label>
    </div>
  );
}

function ColumnsProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="عدد الأعمدة">
        <SelectInput value={String((p.columnCount as number) || 2)} onChange={(v) => onUpdate({ props: { ...p, columnCount: Number(v) } })} options={[
          { label: "عمودين", value: "2" }, { label: "3 أعمدة", value: "3" }, { label: "4 أعمدة", value: "4" },
        ]} />
      </FieldGroup>
      <FieldGroup label="المسافة">
        <NumberInput value={(p.gap as number) || 24} min={0} max={100} onChange={(v) => onUpdate({ props: { ...p, gap: v } })} />
      </FieldGroup>
    </div>
  );
}

function DividerProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="النمط">
        <SelectInput value={(p.style as string) || "solid"} onChange={(v) => onUpdate({ props: { ...p, style: v } })} options={[
          { label: "خط متصل", value: "solid" }, { label: "خط متقطع", value: "dashed" }, { label: "خط منقط", value: "dotted" },
        ]} />
      </FieldGroup>
      <FieldGroup label="اللون">
        <ColorInput value={(p.color as string) || "#e5e7eb"} onChange={(v) => onUpdate({ props: { ...p, color: v } })} />
      </FieldGroup>
      <FieldGroup label="السمك">
        <NumberInput value={(p.thickness as number) || 1} min={1} max={10} onChange={(v) => onUpdate({ props: { ...p, thickness: v } })} />
      </FieldGroup>
      <FieldGroup label="العرض (%)">
        <NumberInput value={(p.width as number) || 100} min={10} max={100} onChange={(v) => onUpdate({ props: { ...p, width: v } })} />
      </FieldGroup>
    </div>
  );
}

function SpacerProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="الارتفاع (px)">
        <NumberInput value={(p.height as number) || 60} min={10} max={500} onChange={(v) => onUpdate({ props: { ...p, height: v } })} />
      </FieldGroup>
    </div>
  );
}

function SocialProofProps({ element, onUpdate }: { element: PageElement; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = element.props;
  return (
    <div className="space-y-3">
      <FieldGroup label="العدد">
        <NumberInput value={(p.counterValue as number) || 0} min={0} onChange={(v) => onUpdate({ props: { ...p, counterValue: v } })} />
      </FieldGroup>
      <FieldGroup label="التسمية">
        <TextInput value={(p.label as string) || ""} onChange={(v) => onUpdate({ props: { ...p, label: v } })} />
      </FieldGroup>
    </div>
  );
}

const PROP_EDITORS: Record<string, React.ComponentType<{ element: PageElement; onUpdate: (p: Record<string, unknown>) => void }>> = {
  heading: HeadingProps,
  text: TextProps,
  button: ButtonProps,
  image: ImageProps,
  hero: HeroProps,
  features: FeaturesProps,
  pricing: PricingProps,
  faq: FaqProps,
  cta: CtaProps,
  testimonials: TestimonialsProps,
  countdown: CountdownProps,
  video: VideoProps,
  columns: ColumnsProps,
  divider: DividerProps,
  spacer: SpacerProps,
  "social-proof": SocialProofProps,
};

const TYPE_LABELS: Record<string, string> = {
  heading: "عنوان",
  text: "نص",
  button: "زر",
  image: "صورة",
  columns: "أعمدة",
  hero: "قسم البطل",
  features: "المميزات",
  testimonials: "الشهادات",
  pricing: "التسعير",
  faq: "الأسئلة الشائعة",
  cta: "دعوة للإجراء",
  divider: "فاصل",
  spacer: "مسافة",
  video: "فيديو",
  countdown: "عد تنازلي",
  "social-proof": "الدليل الاجتماعي",
};

export function PropertiesPanel() {
  const { selectedElement, updateElement } = useBuilder();

  const handleUpdate = useCallback(
    (updates: Partial<PageElement>) => {
      if (!selectedElement) return;
      updateElement(selectedElement.id, updates);
    },
    [selectedElement, updateElement]
  );

  const handlePropsUpdate = useCallback(
    (newProps: Record<string, unknown>) => {
      if (!selectedElement) return;
      updateElement(selectedElement.id, { props: newProps });
    },
    [selectedElement, updateElement]
  );

  if (!selectedElement) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col items-center justify-center p-6 shrink-0">
        <Settings2 size={40} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 text-center">اختر عنصراً لتعديل خصائصه</p>
      </div>
    );
  }

  const PropEditor = PROP_EDITORS[selectedElement.type];

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shrink-0">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          {TYPE_LABELS[selectedElement.type] || selectedElement.type}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{selectedElement.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          <FieldGroup label="الاسم">
            <TextInput
              value={selectedElement.name || ""}
              onChange={(v) => handleUpdate({ name: v })}
              placeholder="اسم العنصر"
            />
          </FieldGroup>

          {PropEditor && <PropEditor element={selectedElement} onUpdate={handlePropsUpdate} />}

          <PositionSection element={selectedElement} onUpdate={(updates) => handleUpdate(updates as Partial<PageElement>)} />

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">الإعدادات</h4>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedElement.visible !== false}
                onChange={(e) => handleUpdate({ visible: e.target.checked })}
                className="rounded"
              />
              مرئي
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedElement.locked || false}
                onChange={(e) => handleUpdate({ locked: e.target.checked })}
                className="rounded"
              />
              مقفل
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
