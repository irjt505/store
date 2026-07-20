"use client";

import { useState, useCallback, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const mockProducts: Record<string, {
  name: string;
  type: ProductType;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number;
  costPrice: number;
  currency: string;
  status: string;
  category: string;
  brand: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  stock: number;
  showStock: boolean;
  lowStockThreshold: number;
  sku: string;
  mpn: string;
  gtin: string;
  weight: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
  requiresShipping: boolean;
  downloadLimit: string;
  linkExpiration: string;
  subscriptionPeriod: string;
  autoRenew: boolean;
  bookingDuration: string;
  availabilitySchedule: string;
}> = {
  "1": {
    name: "قميص رجالي قطني",
    type: "physical",
    slug: "men-cotton-shirt",
    shortDescription: "قميص رجالي قطني عالي الجودة بتصميم عصري",
    description: "قميص رجالي مصنوع من القطن 100%، مريح للارتداء اليومي. تصميم عصري يناسب جميع المناسبات.",
    price: 149,
    salePrice: 129,
    costPrice: 60,
    currency: "ر.س",
    status: "published",
    category: "أزياء رجالية",
    brand: "Nike",
    tags: ["قميص", "رجالي", "قطني"],
    metaTitle: "قميص رجالي قطني - متجرنا",
    metaDescription: "قميص رجالي قطني عالي الجودة بتصميم عصري",
    stock: 250,
    showStock: true,
    lowStockThreshold: 20,
    sku: "PHS-001",
    mpn: "",
    gtin: "",
    weight: "0.3",
    weightUnit: "kg",
    length: "30",
    width: "22",
    height: "3",
    requiresShipping: true,
    downloadLimit: "10",
    linkExpiration: "",
    subscriptionPeriod: "monthly",
    autoRenew: true,
    bookingDuration: "60",
    availabilitySchedule: "أحد - خميس: 9 صباحاً - 5 مساءً",
  },
  "4": {
    name: "كتاب البرمجة بلغة TypeScript",
    type: "digital",
    slug: "typescript-programming-book",
    shortDescription: "كتاب شامل لتعلم TypeScript من الصفر للمحترفين",
    description: "كتاب إلكتروني شامل يغطي جميع مفاهيم TypeScript من الأساسيات إلى المتقدمات.",
    price: 49,
    salePrice: 0,
    costPrice: 10,
    currency: "ر.س",
    status: "published",
    category: "كتب رقمية",
    brand: "TechBooks",
    tags: ["typescript", "برمجة", "كتاب"],
    metaTitle: "كتاب TypeScript - متجرنا",
    metaDescription: "كتاب شامل لتعلم TypeScript",
    stock: 9999,
    showStock: false,
    lowStockThreshold: 0,
    sku: "DIG-001",
    mpn: "",
    gtin: "",
    weight: "",
    weightUnit: "kg",
    length: "",
    width: "",
    height: "",
    requiresShipping: false,
    downloadLimit: "10",
    linkExpiration: "",
    subscriptionPeriod: "monthly",
    autoRenew: true,
    bookingDuration: "60",
    availabilitySchedule: "أحد - خميس: 9 صباحاً - 5 مساءً",
  },
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { success, error: showError } = useToast();

  const mockData = mockProducts[id] || mockProducts["1"];

  const [name, setName] = useState(mockData.name);
  const [slug, setSlug] = useState(mockData.slug);
  const [shortDescription, setShortDescription] = useState(mockData.shortDescription);
  const [description, setDescription] = useState(mockData.description);
  const [price, setPrice] = useState(String(mockData.price));
  const [salePrice, setSalePrice] = useState(mockData.salePrice ? String(mockData.salePrice) : "");
  const [costPrice, setCostPrice] = useState(mockData.costPrice ? String(mockData.costPrice) : "");
  const [currency, setCurrency] = useState(mockData.currency);
  const [status, setStatus] = useState(mockData.status);
  const [category, setCategory] = useState(mockData.category);
  const [brand, setBrand] = useState(mockData.brand);
  const [tags, setTags] = useState<string[]>(mockData.tags);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState(mockData.metaTitle);
  const [metaDescription, setMetaDescription] = useState(mockData.metaDescription);
  const [images, setImages] = useState<{ id: string; url: string; alt: string }[]>([]);

  const [stock, setStock] = useState(String(mockData.stock));
  const [showStock, setShowStock] = useState(mockData.showStock);
  const [lowStockThreshold, setLowStockThreshold] = useState(String(mockData.lowStockThreshold));
  const [sku, setSku] = useState(mockData.sku);
  const [mpn, setMpn] = useState(mockData.mpn);
  const [gtin, setGtin] = useState(mockData.gtin);

  const [weight, setWeight] = useState(mockData.weight);
  const [weightUnit, setWeightUnit] = useState(mockData.weightUnit);
  const [length, setLength] = useState(mockData.length);
  const [width, setWidth] = useState(mockData.width);
  const [height, setHeight] = useState(mockData.height);
  const [requiresShipping, setRequiresShipping] = useState(mockData.requiresShipping);

  const [digitalFiles, setDigitalFiles] = useState<{ name: string; size: number }[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [downloadLimit, setDownloadLimit] = useState(mockData.downloadLimit);
  const [linkExpiration, setLinkExpiration] = useState(mockData.linkExpiration);

  const [subscriptionPeriod, setSubscriptionPeriod] = useState(mockData.subscriptionPeriod);
  const [autoRenew, setAutoRenew] = useState(mockData.autoRenew);

  const [bookingDuration, setBookingDuration] = useState(mockData.bookingDuration);
  const [availabilitySchedule, setAvailabilitySchedule] = useState(mockData.availabilitySchedule);

  const selectedType = mockData.type;
  const showStockSection = stockTypes.includes(selectedType as typeof stockTypes[number]);
  const showDimensionSection = dimensionTypes.includes(selectedType as typeof dimensionTypes[number]);
  const showDigitalSection = digitalTypes.includes(selectedType as typeof digitalTypes[number]);

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
  }, [name, price, showStockSection, sku, showError]);

  const handleSave = useCallback(
    (saveStatus: "published" | "draft") => {
      if (!validate()) return;
      setStatus(saveStatus);
      const label = saveStatus === "published" ? "تم التحديث" : "تم الحفظ";
      const detail = saveStatus === "published" ? "تم تحديث المنتج ونشره بنجاح" : "تم حفظ التغييرات كمسودة";
      success(label, detail);
      setTimeout(() => router.push("/admin/products"), 800);
    },
    [validate, success, router]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`تعديل: ${name}`}
        subtitle={`النوع: ${typeLabels[selectedType]}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/products">
              <Button variant="ghost" icon={<ArrowRight size={16} />}>
                العودة
              </Button>
            </Link>
            <Button variant="secondary" icon={<Eye size={16} />}>
              معاينة
            </Button>
            <Button variant="secondary" icon={<Save size={16} />} onClick={() => handleSave("draft")}>
              حفظ كمسودة
            </Button>
            <Button icon={<Save size={16} />} onClick={() => handleSave("published")}>
              حفظ ونشر
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card header={<h3 className="text-base font-semibold flex items-center gap-2">المنتج <Badge variant="info">{typeLabels[selectedType]}</Badge></h3>}>
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
                placeholder="وصف مختصر للمنتج..."
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
                    <Input label="الطول" type="number" placeholder="0" value={length} onChange={(e) => setLength(e.target.value)} />
                    <Input label="العرض" type="number" placeholder="0" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <Input label="الارتفاع" type="number" placeholder="0" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div>
                    <Input label="الوزن" type="number" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    <Select options={weightUnitOptions} value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} />
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
                        <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setDigitalFiles((prev) => prev.filter((_, idx) => idx !== i))} />
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
                  <Input label="حد التحميلات" type="number" placeholder="10" value={downloadLimit} onChange={(e) => setDownloadLimit(e.target.value)} />
                  <Input label="انتهاء صلاحية الرابط" type="date" value={linkExpiration} onChange={(e) => setLinkExpiration(e.target.value)} />
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
    </div>
  );
}
