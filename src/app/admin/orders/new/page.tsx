"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  User,
  ShoppingCart,
  Truck,
  Tag,
  CheckCircle,
  Plus,
  Trash2,
  Search,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
};

type CartItem = Product & { quantity: number };

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

const mockProducts: Product[] = [
  { id: "1", name: "سماعات لاسلكية بلوتوث", price: 450, stock: 25, image: "🎧" },
  { id: "2", name: "شاحن متنقل 20000 مللي أمبير", price: 180, stock: 50, image: "🔋" },
  { id: "3", name: "كابل شحن USB-C", price: 45, stock: 100, image: "🔌" },
  { id: "4", name: "حافظة هاتف سيليكون", price: 75, stock: 80, image: "📱" },
  { id: "5", name: "شاشة حماية زجاجية", price: 35, stock: 120, image: "🛡️" },
  { id: "6", name: "سماعات أذن سلكية", price: 25, stock: 200, image: "🎵" },
  { id: "7", name: "حامل هاتف سيارة", price: 95, stock: 40, image: "🚗" },
  { id: "8", name: "لوحة مفاتيح لاسلكية", price: 320, stock: 15, image: "⌨️" },
];

const steps = [
  { key: "customer", label: "العميل", icon: <User size={16} /> },
  { key: "products", label: "المنتجات", icon: <ShoppingCart size={16} /> },
  { key: "shipping", label: "الشحن", icon: <Truck size={16} /> },
  { key: "discount", label: "الخصم", icon: <Tag size={16} /> },
  { key: "review", label: "المراجعة", icon: <CheckCircle size={16} /> },
];

export default function NewOrderPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [newCustomer, setNewCustomer] = useState<CustomerInfo>({ name: "", email: "", phone: "" });
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingNote, setShippingNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");

  const filteredProducts = useMemo(() => {
    if (!productSearch) return mockProducts;
    return mockProducts.filter((p) =>
      p.name.includes(productSearch)
    );
  }, [productSearch]);

  const subtotal = useMemo(() => cart.reduce((s, item) => s + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => Math.round(subtotal * 0.15), [subtotal]);
  const shippingCost = subtotal > 500 ? 0 : 35;
  const total = subtotal + tax + shippingCost - discountAmount;

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.min(newQty, item.stock) };
      });
      return updated.filter((item) => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const applyDiscount = useCallback(() => {
    if (!discountCode.trim()) {
      showError("خطأ", "يرجى إدخال كود الخصم");
      return;
    }
    if (discountCode === "SAVE10") {
      setDiscountAmount(Math.round(subtotal * 0.1));
      success("تم تطبيق الخصم", "تم خصم 10% من المجموع");
    } else if (discountCode === "FREE50") {
      setDiscountAmount(50);
      success("تم تطبيق الخصم", "تم خصم 50 ر.س");
    } else {
      showError("خطأ", "كود الخصم غير صالح");
    }
  }, [discountCode, subtotal, success, showError]);

  const handleCreateOrder = useCallback(() => {
    if (!selectedCustomer && !isNewCustomer) {
      showError("خطأ", "يرجى اختيار عميل أو إنشاء عميل جديد");
      return;
    }
    if (isNewCustomer && (!newCustomer.name.trim() || !newCustomer.email.trim())) {
      showError("خطأ", "يرجى ملء بيانات العميل");
      return;
    }
    if (cart.length === 0) {
      showError("خطأ", "يرجى إضافة منتجات للطلب");
      return;
    }
    if (!shippingAddress.trim()) {
      showError("خطأ", "يرجى إدخال عنوان الشحن");
      return;
    }
    success("تم إنشاء الطلب", "تم إنشاء الطلب بنجاح");
    setTimeout(() => router.push("/admin/orders"), 1000);
  }, [selectedCustomer, isNewCustomer, newCustomer, cart, shippingAddress, showError, success, router]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return selectedCustomer || (isNewCustomer && newCustomer.name.trim() && newCustomer.email.trim());
      case 1:
        return cart.length > 0;
      case 2:
        return shippingAddress.trim().length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, selectedCustomer, isNewCustomer, newCustomer, cart, shippingAddress]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
        <Link href="/admin/orders" className="hover:text-primary transition-colors">
          الطلبات
        </Link>
        <ArrowRight size={14} />
        <span className="text-text">طلب جديد</span>
      </div>

      <PageHeader title="إنشاء طلب يدوي" subtitle="إنشاء طلب جديد للعميل" />

      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-2">
            <button
              onClick={() => index <= currentStep && setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                index === currentStep
                  ? "bg-primary text-white"
                  : index < currentStep
                  ? "bg-success-light text-success"
                  : "bg-surface-hover text-text-muted"
              }`}
            >
              {index < currentStep ? <CheckCircle size={14} /> : step.icon}
              {step.label}
            </button>
            {index < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant={!isNewCustomer ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setIsNewCustomer(false)}
                  >
                    عميل موجود
                  </Button>
                  <Button
                    variant={isNewCustomer ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setIsNewCustomer(true)}
                  >
                    عميل جديد
                  </Button>
                </div>

                {!isNewCustomer ? (
                  <div className="space-y-4">
                    <Input
                      label="بحث عن عميل"
                      placeholder="اكتب اسم العميل أو البريد الإلكتروني..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      icon={<Search size={16} />}
                    />
                    <div className="space-y-2">
                      {[
                        { name: "أحمد بن محمد", email: "ahmed@example.com", phone: "+966501234567" },
                        { name: "سارة العلي", email: "sara@example.com", phone: "+966509876543" },
                        { name: "محمد الفهد", email: "mohammed@example.com", phone: "+966505551234" },
                      ]
                        .filter((c) =>
                          !customerSearch ||
                          c.name.includes(customerSearch) ||
                          c.email.includes(customerSearch)
                        )
                        .map((c) => (
                          <button
                            key={c.email}
                            onClick={() => setSelectedCustomer(c)}
                            className={`w-full text-right p-3 rounded-lg border transition-colors cursor-pointer ${
                              selectedCustomer?.email === c.email
                                ? "border-primary bg-primary-light"
                                : "border-border hover:bg-surface-hover"
                            }`}
                          >
                            <p className="font-medium text-text">{c.name}</p>
                            <p className="text-xs text-text-muted">{c.email} | {c.phone}</p>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input label="اسم العميل" value={newCustomer.name} onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))} placeholder="أدخل اسم العميل" required />
                    <Input label="البريد الإلكتروني" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" dir="ltr" required />
                    <Input label="الهاتف" value={newCustomer.phone} onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))} placeholder="+966501234567" dir="ltr" />
                  </div>
                )}
              </div>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <div className="space-y-4">
                <Input
                  label="بحث عن منتج"
                  placeholder="اكتب اسم المنتج..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  icon={<Search size={16} />}
                />
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="text-right p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text text-sm truncate">{product.name}</p>
                          <p className="text-xs text-text-muted">المخزون: {product.stock}</p>
                          <p className="text-sm font-semibold text-primary">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <div className="space-y-4">
                <Textarea
                  label="عنوان الشحن"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="أدخل عنوان الشحن الكامل..."
                  rows={3}
                  required
                />
                <Textarea
                  label="ملاحظات الشحن"
                  value={shippingNote}
                  onChange={(e) => setShippingNote(e.target.value)}
                  placeholder="ملاحظات إضافية للتوصيل (اختياري)..."
                  rows={2}
                />
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <Input
                    label="كود الخصم"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="أدخل كود الخصم"
                    className="flex-1"
                  />
                  <Button onClick={applyDiscount}>تطبيق</Button>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-success-light rounded-lg">
                    <Tag size={16} className="text-success" />
                    <span className="text-sm text-success font-medium">تم تطبيق خصم {formatCurrency(discountAmount)}</span>
                    <button onClick={() => { setDiscountAmount(0); setDiscountCode(""); }} className="mr-auto text-text-muted hover:text-danger cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="p-4 bg-surface-hover rounded-lg">
                  <p className="text-sm text-text-muted mb-2">الأكواد المتاحة:</p>
                  <div className="flex gap-2">
                    <Badge variant="info">SAVE10 - خصم 10%</Badge>
                    <Badge variant="success">FREE50 - خصم 50 ر.س</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-text">مراجعة الطلب</h3>

                <div className="space-y-2">
                  <p className="text-sm text-text-muted">العميل:</p>
                  <p className="font-medium text-text">
                    {selectedCustomer?.name || newCustomer.name || "—"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-text-muted">المنتجات:</p>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1 text-sm">
                      <span className="text-text">{item.image} {item.name} × {item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-text-muted">عنوان الشحن:</p>
                  <p className="text-sm text-text">{shippingAddress || "—"}</p>
                </div>

                <Textarea
                  label="ملاحظات الطلب"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="ملاحظات داخلية للطلب (اختياري)..."
                  rows={2}
                />
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card header={<h3 className="font-semibold text-text">ملخص الطلب</h3>}>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">لا توجد منتجات في السلة</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-surface-hover cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-surface-hover cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-text-muted hover:text-danger cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">المجموع الفرعي</span>
                  <span className="text-text">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">الشحن</span>
                  <span className={shippingCost === 0 ? "text-success" : "text-text"}>
                    {shippingCost === 0 ? "مجاني" : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">الضريبة (15%)</span>
                  <span className="text-text">{formatCurrency(tax)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">الخصم</span>
                    <span className="text-danger">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-text">الإجمالي</span>
                    <span className="font-bold text-lg text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep((p) => p - 1)}
                    className="flex-1"
                  >
                    السابق
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep((p) => p + 1)}
                    disabled={!canProceed}
                    className="flex-1"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateOrder}
                    disabled={!canProceed}
                    className="flex-1"
                    icon={<CheckCircle size={16} />}
                  >
                    إنشاء الطلب
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
