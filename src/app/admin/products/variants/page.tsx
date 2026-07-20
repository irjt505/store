"use client";

import { useState, useCallback } from "react";
import { Package, Plus, Trash2, Edit, X, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type VariantOption = {
  id: string;
  name: string;
  options: string[];
};

type VariantCombination = {
  id: string;
  optionValues: Record<string, string>;
  price: number;
  stock: number;
  sku: string;
  enabled: boolean;
};

const productOptions = [
  { value: "", label: "اختر المنتج" },
  { value: "1", label: "قميص رجالي قطني" },
  { value: "2", label: "حذاء رياضي آير ماكس" },
  { value: "3", label: "سماعات لاسلكية بلوتوث" },
  { value: "8", label: "حزمة المطور الشاملة" },
];

const mockVariants: Record<string, { options: VariantOption[]; combinations: VariantCombination[] }> = {
  "1": {
    options: [
      { id: "v1", name: "اللون", options: ["أبيض", "أسود", "أزرق"] },
      { id: "v2", name: "المقاس", options: ["S", "M", "L", "XL"] },
    ],
    combinations: [
      { id: "c1", optionValues: { "اللون": "أبيض", "المقاس": "S" }, price: 149, stock: 30, sku: "PHS-001-WHT-S", enabled: true },
      { id: "c2", optionValues: { "اللون": "أبيض", "المقاس": "M" }, price: 149, stock: 45, sku: "PHS-001-WHT-M", enabled: true },
      { id: "c3", optionValues: { "اللون": "أسود", "المقاس": "M" }, price: 149, stock: 25, sku: "PHS-001-BLK-M", enabled: true },
      { id: "c4", optionValues: { "اللون": "أزرق", "المقاس": "L" }, price: 159, stock: 0, sku: "PHS-001-BLU-L", enabled: false },
    ],
  },
};

export default function VariantsPage() {
  const { success, error: showError } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValues, setNewOptionValues] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<VariantOption | null>(null);
  const [deleteComboTarget, setDeleteComboTarget] = useState<VariantCombination | null>(null);
  const [editingCombo, setEditingCombo] = useState<VariantCombination | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editSku, setEditSku] = useState("");

  const handleProductSelect = useCallback((productId: string) => {
    setSelectedProduct(productId);
    if (productId && mockVariants[productId]) {
      setVariantOptions(mockVariants[productId].options);
      setCombinations(mockVariants[productId].combinations);
    } else {
      setVariantOptions([]);
      setCombinations([]);
    }
  }, []);

  const handleAddOption = useCallback(() => {
    if (!newOptionName.trim()) {
      showError("خطأ", "يرجى إدخال اسم الخيار");
      return;
    }
    const values = newOptionValues.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length === 0) {
      showError("خطأ", "يرجى إدخال قيمة واحدة على الأقل");
      return;
    }
    const newOption: VariantOption = {
      id: `v${Date.now()}`,
      name: newOptionName.trim(),
      options: values,
    };
    setVariantOptions((prev) => [...prev, newOption]);
    setAddOptionOpen(false);
    setNewOptionName("");
    setNewOptionValues("");
    success("تمت الإضافة", `تمت إضافة خيار "${newOption.name}" بنجاح`);
  }, [newOptionName, newOptionValues, showError, success]);

  const handleDeleteOption = useCallback(() => {
    if (!deleteTarget) return;
    setVariantOptions((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    success("تم الحذف", `تم حذف خيار "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  }, [deleteTarget, success]);

  const handleDeleteCombo = useCallback(() => {
    if (!deleteComboTarget) return;
    setCombinations((prev) => prev.filter((c) => c.id !== deleteComboTarget.id));
    success("تم الحذف", "تم حذف التوليفة بنجاح");
    setDeleteComboTarget(null);
  }, [deleteComboTarget, success]);

  const handleEditCombo = useCallback((combo: VariantCombination) => {
    setEditingCombo(combo);
    setEditPrice(String(combo.price));
    setEditStock(String(combo.stock));
    setEditSku(combo.sku);
  }, []);

  const handleSaveCombo = useCallback(() => {
    if (!editingCombo) return;
    setCombinations((prev) =>
      prev.map((c) =>
        c.id === editingCombo.id
          ? { ...c, price: Number(editPrice), stock: Number(editStock), sku: editSku }
          : c
      )
    );
    setEditingCombo(null);
    success("تم التحديث", "تم تحديث التوليفة بنجاح");
  }, [editingCombo, editPrice, editStock, editSku, success]);

  const handleGenerateCombinations = useCallback(() => {
    if (variantOptions.length === 0) {
      showError("خطأ", "يرجى إضافة خيارات أولاً");
      return;
    }
    const allCombos: string[][] = [[]];
    for (const opt of variantOptions) {
      const newCombos: string[][] = [];
      for (const existing of allCombos) {
        for (const value of opt.options) {
          newCombos.push([...existing, value]);
        }
      }
      allCombos.length = 0;
      allCombos.push(...newCombos);
    }
    const newCombinations: VariantCombination[] = allCombos.map((values, i) => {
      const optionValues: Record<string, string> = {};
      variantOptions.forEach((opt, idx) => {
        optionValues[opt.name] = values[idx];
      });
      return {
        id: `c${Date.now()}-${i}`,
        optionValues,
        price: 0,
        stock: 0,
        sku: "",
        enabled: true,
      };
    });
    setCombinations(newCombinations);
    success("تم التوليد", `تم إنشاء ${newCombinations.length} توليفة بنجاح`);
  }, [variantOptions, showError, success]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة المتغيرات"
        subtitle="إضافة وإدارة خيارات المتغيرات للمنتجات"
      />

      <Card>
        <div className="space-y-4">
          <Select
            label="اختر المنتج"
            options={productOptions}
            value={selectedProduct}
            onChange={(e) => handleProductSelect(e.target.value)}
          />
        </div>
      </Card>

      {selectedProduct && (
        <>
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">خيارات المتغيرات</h3>
                <Button size="sm" icon={<Plus size={14} />} onClick={() => setAddOptionOpen(true)}>
                  إضافة خيار
                </Button>
              </div>
            }
          >
            {variantOptions.length === 0 ? (
              <p className="text-text-muted text-center py-8">لا توجد خيارات بعد. أضف خياراً للبدء.</p>
            ) : (
              <div className="space-y-4">
                {variantOptions.map((option) => (
                  <div key={option.id} className="flex items-start justify-between p-4 bg-surface-hover rounded-xl">
                    <div>
                      <p className="font-medium text-text">{option.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {option.options.map((val) => (
                          <Badge key={val} variant="default">{val}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      className="text-danger hover:text-danger"
                      onClick={() => setDeleteTarget(option)}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Package size={14} />}
                  onClick={handleGenerateCombinations}
                >
                  توليد التوليفات
                </Button>
              </div>
            )}
          </Card>

          {combinations.length > 0 && (
            <Card
              header={
                <h3 className="text-base font-semibold">التوليفات ({combinations.length})</h3>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {variantOptions.map((opt) => (
                        <th key={opt.id} className="px-4 py-3 text-right font-medium text-text-secondary">
                          {opt.name}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right font-medium text-text-secondary">السعر</th>
                      <th className="px-4 py-3 text-right font-medium text-text-secondary">المخزون</th>
                      <th className="px-4 py-3 text-right font-medium text-text-secondary">SKU</th>
                      <th className="px-4 py-3 text-right font-medium text-text-secondary">الحالة</th>
                      <th className="px-4 py-3 text-right font-medium text-text-secondary">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinations.map((combo) => (
                      <tr key={combo.id} className="border-b border-border-light">
                        {variantOptions.map((opt) => (
                          <td key={opt.id} className="px-4 py-3">
                            <Badge variant="default">{combo.optionValues[opt.name] || "—"}</Badge>
                          </td>
                        ))}
                        <td className="px-4 py-3 font-semibold">{combo.price > 0 ? `${combo.price} ر.س` : "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={combo.stock === 0 ? "danger" : combo.stock <= 5 ? "warning" : "success"}>
                            {combo.stock}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-text-muted" dir="ltr">{combo.sku || "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={combo.enabled ? "success" : "default"} dot>
                            {combo.enabled ? "مفعّل" : "معطّل"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => handleEditCombo(combo)} />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 size={14} />}
                              className="text-danger hover:text-danger"
                              onClick={() => setDeleteComboTarget(combo)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      <Modal open={addOptionOpen} onClose={() => setAddOptionOpen(false)} title="إضافة خيار متغير" size="md">
        <div className="space-y-4">
          <Input
            label="اسم الخيار (مثل: اللون، المقاس)"
            placeholder="اللون"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
          />
          <Input
            label="القيم (مفصولة بفاصلة)"
            placeholder="أبيض, أسود, أزرق"
            value={newOptionValues}
            onChange={(e) => setNewOptionValues(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAddOptionOpen(false)}>إلغاء</Button>
            <Button icon={<Save size={14} />} onClick={handleAddOption}>إضافة</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editingCombo} onClose={() => setEditingCombo(null)} title="تعديل التوليفة" size="md">
        <div className="space-y-4">
          {editingCombo && (
            <>
              <div className="flex flex-wrap gap-2">
                {Object.entries(editingCombo.optionValues).map(([key, val]) => (
                  <Badge key={key} variant="info">{key}: {val}</Badge>
                ))}
              </div>
              <Input
                label="السعر (ر.س)"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
              <Input
                label="المخزون"
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
              />
              <Input
                label="SKU"
                value={editSku}
                onChange={(e) => setEditSku(e.target.value)}
                dir="ltr"
              />
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setEditingCombo(null)}>إلغاء</Button>
                <Button icon={<Save size={14} />} onClick={handleSaveCombo}>حفظ</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteOption}
        title="حذف الخيار"
        message={`هل أنت متأكد من حذف خيار "${deleteTarget?.name}"؟ سيتم حذف جميع التوليفات المرتبطة.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />

      <ConfirmDialog
        open={!!deleteComboTarget}
        onClose={() => setDeleteComboTarget(null)}
        onConfirm={handleDeleteCombo}
        title="حذف التوليفة"
        message="هل أنت متأكد من حذف هذه التوليفة؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
      />
    </div>
  );
}
