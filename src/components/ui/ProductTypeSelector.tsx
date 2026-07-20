"use client";

import { Package, Download, Wrench, RefreshCw, Layers, Hash, Coffee, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ProductType {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface ProductTypeSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

const productTypes: ProductType[] = [
  { type: "physical", label: "منتج فيزيائي", description: "منتجات ملموكة مثل ملابس وإلكترونيات", icon: Package },
  { type: "digital", label: "منتج رقمي", description: "ملفات تحميل مثل كتب ودورات وبرامج", icon: Download },
  { type: "service", label: "خدمة", description: "خدمات مثل التصميم والاستشارات", icon: Wrench },
  { type: "subscription", label: "اشتراك", description: "باقات شهرية أو سنوية", icon: RefreshCw },
  { type: "bundle", label: "حزمة منتجات", description: "مجموعة منتجات بسعر واحد", icon: Layers },
  { type: "codes", label: "أكواد / رواتب", description: "بطاقات وأكواد رقمية مثل بطاقات الهدايا", icon: Hash },
  { type: "food", label: "منتج غذائي", description: "أطعمة ومشروبات تحتاج شحن خاص", icon: Coffee },
  { type: "booking", label: "حجز / مواعيد", description: "حجوزات ومواعيد مثل الاستشارات والسياحة", icon: Calendar },
];

export function ProductTypeSelector({ selected, onSelect }: ProductTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {productTypes.map((productType, index) => {
        const Icon = productType.icon;
        const isSelected = selected === productType.type;

        return (
          <motion.button
            key={productType.type}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelect(productType.type)}
            className={cn(
              "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer",
              "hover:border-primary/40 hover:bg-primary/5",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-surface"
            )}
          >
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 start-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
              >
                <Check size={12} strokeWidth={3} />
              </motion.span>
            )}
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
                isSelected
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-text-secondary"
              )}
            >
              <Icon size={24} />
            </span>
            <div>
              <p className={cn(
                "text-sm font-semibold",
                isSelected ? "text-primary" : "text-text"
              )}>
                {productType.label}
              </p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {productType.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
