"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowRight, Upload, X, Plus, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { ProductTypeSelector } from "@/components/ui/ProductTypeSelector";

type ProductType = "physical" | "digital" | "service" | "subscription" | "bundle" | "codes" | "food" | "booking";

const typeLabels: Record<ProductType, string> = {
  physical: "منتج فيزيائي",
  digital: "منتج رقمي",
  service: "خدمة",
  subscription: "اشتراك",
  bundle: "حزمة منتجات",
  codes: "أكواد / رواتب",
  food: "منتج غذائي",
  booking: "حجز / مواعيد",
};

const statusOptions = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const categoryOptions = [
  { value: "", label: "اختر التصنيف" },
  { value: "أزياء رجالية", label: "أزياء رجالية" },
  { value: "أزياء نسائية", label: "أزياء نسائية" },
  { value: "أحذية رياضية", label: "أحذية رياضية" },
  { value: "إلكترونيات", label: "إلكترونيات" },
  { value: "كتب رقمية", label: "كتب رقمية" },
  { value: "دورات تعليمية", label: "دورات تعليمية" },
  { value: "تصميم", label: "تصميم" },
  { value: "برمجيات", label: "برمجيات" },
  { value: "اشتراكات", label: "اشتراكات" },
  { value: "حزم", label: "حزم" },
  { value: "أكواد رقمية", label: "أكواد رقمية" },
  { value: "وجبات", label: "وجبات" },
  { value: "مشروبات", label: "مشروبات" },
  { value: "خدمات قانونية", label: "خدمات قانونية" },
  { value: "خدمات طبية", label: "خدمات طبية" },
  { value: "إكسسوارات", label: "إكسسوارات" },
  { value: "رياضة", label: "رياضة" },
];

const brandOptions = [
  { value: "", label: "اختر العلامة التجارية" },
  { value: "Nike", label: "Nike" },
  { value: "Adidas", label: "Adidas" },
  { value: "Sony", label: "Sony" },
  { value: "Samsung", label: "Samsung" },
  { value: "Apple", label: "Apple" },
  { value: "Casio", label: "Casio" },
  { value: "LG", label: "LG" },
];

const currencyOptions = [
  { value: "ر.س", label: "ر.س - ريال سعودي" },
  { value: "د.إ", label: "د.إ - درهم إماراتي" },
  { value: "ج.م", label: "ج.م - جنيه مصري" },
  { value: "ك.د", label: "ك.د - دينار كويتي" },
];

const subscriptionPeriodOptions = [
  { value: "monthly", label: "شهري" },
  { value: "quarterly", label: "ربع سنوي" },
  { value: "semi-annual", label: "نصف سنوي" },
  { value: "annual", label: "سنوي" },
];

const weightUnitOptions = [
  { value: "kg", label: "كجم" },
  { value: "g", label: "غ" },
];

const stockTypes = ["physical", "food", "codes"] as const;
const dimensionTypes = ["physical", "food"] as const;
const digitalTypes = ["digital", "codes"] as const;

function NewProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();

  const [selectedType, setSelectedType] = useState<ProductType>(
    (searchParams.get("type") as ProductType) || ""
  );

  const handleTypeSelect = useCallback((type: string) => {
    setSelectedType(type as ProductType);
  }, []);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [currency, setCurrency] = useState("ر.س");
  const [status, setStatus] = useState("draft");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [images, setImages] = useState<{ id: string; url: string; alt: string }[]>([]);

  const [stock, setStock] = useState("0");
  const [showStock, setShowStock] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [sku, setSku] = useState("");
  const [mpn, setMpn] = useState("");
  const [gtin, setGtin] = useState("");

  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [requiresShipping, setRequiresShipping] = useState(true);

  const [digitalFiles, setDigitalFiles] = useState<{ name: string; size: number }[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [downloadLimit, setDownloadLimit] = useState("10");
  const [linkExpiration, setLinkExpiration] = useState("");

  const [subscriptionPeriod, setSubscriptionPeriod] = useState("monthly");
  const [autoRenew, setAutoRenew] = useState(true);

  const [bookingDuration, setBookingDuration] = useState("60");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("أحد - خميس: 9 صباحاً - 5 مساءً");

  const showStockSection = selectedType && stockTypes.includes(selectedType as typeof stockTypes[number]);
  const showDimensionSection = selectedType && dimensionTypes.includes(selectedType as typeof dimensionTypes[number]);
  const showDigitalSection = selectedType && digitalTypes.includes(selectedType as typeof digitalTypes[number]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u0600-\u06FF-]/g, "")
    );
  }, []);

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const validate = useCallback(() => {
    if (!selectedType) {
      showError("خطأ", "يرجى اختيار نوع المنتج");
      return false;
    }
    if (!name.trim()) {
      showError("خطأ", "يرجى إدخال اسم المنتج");
      return false;
    }
    if (!price || Number(price) < 0) {
      showError("خطأ", "يرجى إدخال سعر صحيح للمنتج");
      return false;
    }
    if (showStockSection && !sku.trim()) {
      showError("خطأ", "يرجى إدخال رمز المنتج (SKU)");
      return false;
    }
    return true;
  }, [selectedType, name, price, showStockSection, sku, showError]);

  const handleSave = useCallback(
    (saveStatus: "published" | "draft") => {
      if (!validate()) return;
      setStatus(saveStatus);
      const label = saveStatus === "published" ? "تم النشر" : "تم الحفظ";
      const detail = saveStatus === "published" ? "تم نشر المنتج بنجاح" : "تم حفظ المنتج كمسودة بنجاح";
      success(label, detail);
      setTimeout(() => router.push("/admin/products"), 800);
    },
    [validate, success, router]
  );

  const productTypeBadge = selectedType ? (
    <Badge variant="info">{typeLabels[selectedType]}</Badge>
  ) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة منتج جديد"
        subtitle={selectedType ? `النوع: ${typeLabels[selectedType]}` : "اختر نوع المنتج أولاً"}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/products">
              <Button variant="ghost" icon={<ArrowRight size={16} />}>
                العودة
              </Button>
            </Link>
            {selectedType && (
              <>
                <Button variant="secondary" icon={<Eye size={16} />}>
                  معاينة
                </Button>
                <Button variant="secondary" icon={<Save size={16} />} onClick={() => handleSave("draft")}>
                  حفظ كمسودة
                </Button>
                <Button icon={<Save size={16} />} onClick={() => handleSave("published")}>
                  نشر المنتج
                </Button>
              </>
            )}
          </div>
        }
      />

      {!selectedType ? (
        <Card>
          <div className="py-8">
            <ProductTypeSelector selected={selectedType} onSelect={handleTypeSelect} />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card header={<h3 className="text-base font-semibold flex items-center gap-2">المنتج {productTypeBadge}</h3>}>
              <div className="space-y-4">
                <Input
                  label="اسم المنتج"
                  placeholder="أدخل اسم المنتج"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
                <Input
                  label="الرابط المختصر"
                  placeholder="product-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  dir="ltr"
                />
                <Textarea
                  label="وصف مختصر"
                  placeholder="وصف مختصر للمنتج يظهر في قائمة المنتجات..."
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">الوصف التفصيلي</label>
                  <Textarea
                    placeholder="أدخل الوصف التفصيلي للمنتج..."
                    rows={8}
                    className="min-h-[200px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card header={<h3 className="text-base font-semibold">التسعير</h3>}>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="العملة"
                  options={currencyOptions}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
                <div />
                <Input
                  label={`السعر (${currency})`}
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <Input
                  label={`سعر التخفيض (${currency})`}
                  type="number"
                  placeholder="0.00"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  helperText="اتركه فارغاً إذا لا يوجد تخفيض"
                />
                <Input
                  label={`سعر التكلفة (${currency})`}
                  type="number"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  helperText="للحسابات الداخلية فقط"
                />
              </div>
            </Card>

            {showStockSection && (
              <Card header={<h3 className="text-base font-semibold">المخزون</h3>}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="الكمية المتوفرة"
                      type="number"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                    <Input
                      label="الحد الأدنى للمخزون"
                      type="number"
                      placeholder="10"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                    />
                  </div>
                  <Toggle
                    label="عرض المخزون"
                    description="إظهار الكمية المتوفرة للعملاء"
                    checked={showStock}
                    onChange={setShowStock}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="رقم المنتج الداخلي (SKU)"
                      placeholder="ABC-12345"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                    />
                    <Input
                      label="رمز المنتج (MPN)"
                      placeholder="اختياري"
                      value={mpn}
                      onChange={(e) => setMpn(e.target.value)}
                    />
                    <Input
                      label="باركود (GTIN/EAN)"
                      placeholder="اختياري"
                      value={gtin}
                      onChange={(e) => setGtin(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )}

            {showDimensionSection && (
              <Card header={<h3 className="text-base font-semibold">الأبعاد والشحن</h3>}>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                      <Input
                        label="الطول"
                        type="number"
                        placeholder="0"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                      <Input
                        label="العرض"
                        type="number"
                        placeholder="0"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                      <Input
                        label="الارتفاع"
                        type="number"
                        placeholder="0"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        label="الوزن"
                        type="number"
                        placeholder="0"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      <Select
                        options={weightUnitOptions}
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                      />
                    </div>
                  </div>
                  <Toggle
                    label="يتطلب شحن"
                    description="هل يحتاج هذا المنتج إلى شحن؟"
                    checked={requiresShipping}
                    onChange={setRequiresShipping}
                  />
                </div>
              </Card>
            )}

            {showDigitalSection && (
              <Card header={<h3 className="text-base font-semibold">الملفات الرقمية</h3>}>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-surface-hover flex items-center justify-center text-text-muted">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">اسحب وأفلت الملفات هنا</p>
                        <p className="text-xs text-text-muted mt-1">أو انقر لاختيار الملفات</p>
                      </div>
                      <p className="text-xs text-text-muted">PDF, ZIP, RAR حتى 100 ميجابايت</p>
                    </div>
                  </div>
                  {digitalFiles.length > 0 && (
                    <div className="space-y-2">
                      {digitalFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
                          <span className="text-sm text-text">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<X size={14} />}
                            onClick={() => setDigitalFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    label="رابط التحميل الخارجي"
                    placeholder="https://example.com/download"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    dir="ltr"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="حد التحميلات"
                      type="number"
                      placeholder="10"
                      value={downloadLimit}
                      onChange={(e) => setDownloadLimit(e.target.value)}
                    />
                    <Input
                      label="انتهاء صلاحية الرابط"
                      type="date"
                      value={linkExpiration}
                      onChange={(e) => setLinkExpiration(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )}

            {selectedType === "subscription" && (
              <Card header={<h3 className="text-base font-semibold">إعدادات الاشتراك</h3>}>
                <div className="space-y-4">
                  <Select
                    label="مدة الاشتراك"
                    options={subscriptionPeriodOptions}
                    value={subscriptionPeriod}
                    onChange={(e) => setSubscriptionPeriod(e.target.value)}
                  />
                  <Toggle
                    label="تجديد تلقائي"
                    description="تجديد الاشتراك تلقائياً عند انتهائه"
                    checked={autoRenew}
                    onChange={setAutoRenew}
                  />
                </div>
              </Card>
            )}

            {selectedType === "booking" && (
              <Card header={<h3 className="text-base font-semibold">إعدادات الحجز</h3>}>
                <div className="space-y-4">
                  <Input
                    label="مدة الحجز (دقيقة)"
                    type="number"
                    placeholder="60"
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                  />
                  <Textarea
                    label="مواعيد التوفر"
                    placeholder="أدخل مواعيد التوفر..."
                    rows={3}
                    value={availabilitySchedule}
                    onChange={(e) => setAvailabilitySchedule(e.target.value)}
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card header={<h3 className="text-base font-semibold">الحالة والتصنيف</h3>}>
              <div className="space-y-4">
                <Select
                  label="الحالة"
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Select
                  label="التصنيف"
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Select
                  label="العلامة التجارية"
                  options={brandOptions}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">الوسوم</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="أدخل وسم ثم اضغط Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addTag}>
                      إضافة
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="default" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-danger cursor-pointer">
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card header={<h3 className="text-base font-semibold">الصور</h3>}>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={20} className="text-text-muted" />
                    <p className="text-sm text-text-muted">اسحب الصور أو انقر للرفع</p>
                    <p className="text-xs text-text-muted">PNG, JPG, WEBP حتى 5 ميجابايت</p>
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-lg bg-surface-hover overflow-hidden">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                          className="absolute top-1 left-1 h-5 w-5 rounded-full bg-danger/80 flex items-center justify-center text-white cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card header={<h3 className="text-base font-semibold">إعدادات SEO</h3>}>
              <div className="space-y-4">
                <Input
                  label="الرابط المختصر (Slug)"
                  placeholder="product-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  dir="ltr"
                />
                <Input
                  label="عنوان SEO"
                  placeholder="عنوان الصفحة في نتائج البحث"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <Textarea
                  label="وصف SEO"
                  placeholder="وصف الصفحة في نتائج البحث (150-160 حرف)"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">جاري التحميل...</div>}>
      <NewProductForm />
    </Suspense>
  );
}
