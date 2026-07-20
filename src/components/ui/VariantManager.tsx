"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, X, Trash2, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

interface VariantGroup {
  id: string;
  name: string;
  values: string[];
}

interface VariantCombination {
  id: string;
  options: Record<string, string>;
  sku: string;
  price: number;
  stock: number;
  enabled: boolean;
}

interface VariantManagerProps {
  variants: VariantGroup[];
  onChange: (variants: VariantGroup[]) => void;
  products: VariantCombination[];
  onProductsChange: (products: VariantCombination[]) => void;
}

function generateCombinations(groups: VariantGroup[]): Record<string, string>[] {
  if (groups.length === 0) return [];
  const result: Record<string, string>[] = [{}];

  for (const group of groups) {
    const newResult: Record<string, string>[] = [];
    for (const combo of result) {
      for (const value of group.values) {
        newResult.push({ ...combo, [group.name]: value });
      }
    }
    result.length = 0;
    result.push(...newResult);
  }

  return result;
}

export function VariantManager({
  variants,
  onChange,
  products,
  onProductsChange,
}: VariantManagerProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupValues, setNewGroupValues] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const combinations = useMemo(() => generateCombinations(variants), [variants]);

  const syncProducts = useCallback(
    (updatedVariants: VariantGroup[]) => {
      const newCombos = generateCombinations(updatedVariants);
      const existingMap = new Map(products.map((p) => [JSON.stringify(p.options), p]));

      const updatedProducts: VariantCombination[] = newCombos.map((combo) => {
        const key = JSON.stringify(combo);
        const existing = existingMap.get(key);
        return (
          existing ?? {
            id: `var-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            options: combo,
            sku: "",
            price: 0,
            stock: 0,
            enabled: true,
          }
        );
      });

      onProductsChange(updatedProducts);
    },
    [products, onProductsChange]
  );

  const addGroup = () => {
    const name = newGroupName.trim();
    const values = newGroupValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!name || values.length === 0) return;

    const updated = [...variants, { id: `vg-${Date.now()}`, name, values }];
    onChange(updated);
    syncProducts(updated);
    setNewGroupName("");
    setNewGroupValues("");
  };

  const removeGroup = (id: string) => {
    const updated = variants.filter((g) => g.id !== id);
    onChange(updated);
    syncProducts(updated);
  };

  const removeValue = (groupId: string, value: string) => {
    const updated = variants.map((g) =>
      g.id === groupId
        ? { ...g, values: g.values.filter((v) => v !== value) }
        : g
    );
    const filtered = updated.filter((g) => g.values.length > 0);
    onChange(filtered);
    syncProducts(filtered);
  };

  const addValueToGroup = (groupId: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const updated = variants.map((g) =>
      g.id === groupId && !g.values.includes(trimmed)
        ? { ...g, values: [...g.values, trimmed] }
        : g
    );
    onChange(updated);
    syncProducts(updated);
  };

  const updateCombination = (
    id: string,
    field: keyof VariantCombination,
    value: string | number | boolean
  ) => {
    onProductsChange(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const applyBulkEdit = () => {
    const price = parseFloat(bulkPrice);
    const stock = parseInt(bulkStock, 10);

    onProductsChange(
      products.map((p) => ({
        ...p,
        ...(bulkPrice && !isNaN(price) ? { price } : {}),
        ...(bulkStock && !isNaN(stock) ? { stock } : {}),
      }))
    );
    setBulkPrice("");
    setBulkStock("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <AnimatePresence>
          {variants.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border bg-surface p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-text">{group.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  className="text-text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.values.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => removeValue(group.id, value)}
                      className="ms-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors cursor-pointer"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="قيمة جديدة..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addValueToGroup(group.id, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="h-7 w-24 rounded-lg border border-border bg-surface px-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="اسم المجموعة (مثال: اللون)"
          className="sm:flex-1"
        />
        <Input
          value={newGroupValues}
          onChange={(e) => setNewGroupValues(e.target.value)}
          placeholder="القيم مفصولة بفاصلة (مثال: أحمر, أزرق)"
          className="sm:flex-1"
        />
        <Button
          variant="outline"
          icon={<Plus size={16} />}
          onClick={addGroup}
        >
          إضافة
        </Button>
      </div>

      {products.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-text-secondary" />
              <span className="text-sm font-semibold text-text">
                المتغيرات ({combinations.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                placeholder="سعر جماعي"
                className="w-28"
              />
              <Input
                value={bulkStock}
                onChange={(e) => setBulkStock(e.target.value)}
                placeholder="مخزون جماعي"
                className="w-28"
              />
              <Button variant="ghost" size="sm" onClick={applyBulkEdit}>
                تطبيق
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary">
                    الخيارات
                  </th>
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary">
                    SKU
                  </th>
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary">
                    السعر
                  </th>
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary">
                    المخزون
                  </th>
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((combo) => (
                  <tr key={combo.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(combo.options).map(([key, value]) => (
                          <span
                            key={key}
                            className="rounded-md bg-surface-hover px-1.5 py-0.5 text-xs text-text-secondary"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={combo.sku}
                        onChange={(e) =>
                          updateCombination(combo.id, "sku", e.target.value)
                        }
                        className="w-24 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        value={combo.price || ""}
                        onChange={(e) =>
                          updateCombination(combo.id, "price", parseFloat(e.target.value) || 0)
                        }
                        className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        value={combo.stock || ""}
                        onChange={(e) =>
                          updateCombination(combo.id, "stock", parseInt(e.target.value) || 0)
                        }
                        className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={combo.enabled}
                          onChange={(e) =>
                            updateCombination(combo.id, "enabled", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
