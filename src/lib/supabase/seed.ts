import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function seedDatabase() {
  const results: { table: string; count: number; error?: string }[] = [];

  // ===================== CATEGORIES =====================
  const { data: existingCategories } = await supabase.from("categories").select("id").limit(1);
  if (!existingCategories?.length) {
    const { data: categories, error } = await supabase
      .from("categories")
      .insert([
        {
          name: "إلكترونيات",
          slug: "electronics",
          description: "أجهزة إلكترونية ومعدات تقنية",
          sort_order: 1,
          is_active: true,
        },
        {
          name: "أزياء",
          slug: "fashion",
          description: "ملابس وأزياء عصرية",
          sort_order: 2,
          is_active: true,
        },
        {
          name: "منزل ومطبخ",
          slug: "home-kitchen",
          description: "أدوات منزلية ومطبخية",
          sort_order: 3,
          is_active: true,
        },
        {
          name: "رياضة",
          slug: "sports",
          description: "معدات رياضية وتمارين",
          sort_order: 4,
          is_active: true,
        },
        {
          name: "جمال وصحة",
          slug: "beauty-health",
          description: "منتجات العناية بالجمال والصحة",
          sort_order: 5,
          is_active: true,
        },
      ])
      .select();
    results.push({ table: "categories", count: categories?.length ?? 0, error: error?.message });

    // ===================== BRANDS =====================
    const { data: brands, error: brandError } = await supabase
      .from("brands")
      .insert([
        {
          name: "Apple",
          slug: "apple",
          description: "منتجات أبل الإلكترونية",
          is_active: true,
        },
        {
          name: "Samsung",
          slug: "samsung",
          description: "منتجات سامسونج الإلكترونية",
          is_active: true,
        },
        {
          name: "Nike",
          slug: "nike",
          description: "منتجات نايكي الرياضية",
          is_active: true,
        },
      ])
      .select();
    results.push({ table: "brands", count: brands?.length ?? 0, error: brandError?.message });

    // ===================== TAGS =====================
    const { data: tags, error: tagError } = await supabase
      .from("tags")
      .insert([
        { name: "جديد", color: "#10B981" },
        { name: "الأكثر مبيعاً", color: "#F59E0B" },
        { name: "تخفيض", color: "#EF4444" },
        { name: "مميز", color: "#6366F1" },
        { name: "حصري", color: "#8B5CF6" },
      ])
      .select();
    results.push({ table: "tags", count: tags?.length ?? 0, error: tagError?.message });

    // ===================== PRODUCTS =====================
    const electronicsCat = categories?.find((c) => c.slug === "electronics");
    const fashionCat = categories?.find((c) => c.slug === "fashion");
    const homeCat = categories?.find((c) => c.slug === "home-kitchen");
    const sportsCat = categories?.find((c) => c.slug === "sports");
    const appleBrand = brands?.find((b) => b.slug === "apple");
    const samsungBrand = brands?.find((b) => b.slug === "samsung");
    const nikeBrand = brands?.find((b) => b.slug === "nike");

    const { data: products, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name: "iPhone 15 Pro Max",
          slug: "iphone-15-pro-max",
          type: "physical",
          description: "هاتف أيفون 15 برو ماكس بأحدث المواصفات والتقنيات",
          short_description: "هاتف ذكي من أبل",
          price: 5499.00,
          sale_price: 5199.00,
          cost_price: 4200.00,
          currency: "SAR",
          sku: "APL-IP15PM-256",
          stock: 45,
          low_stock_threshold: 10,
          track_stock: true,
          status: "published",
          category_id: electronicsCat?.id,
          brand_id: appleBrand?.id,
          rating: 4.8,
          review_count: 124,
          sales_count: 356,
        },
        {
          name: "Samsung Galaxy S24 Ultra",
          slug: "samsung-galaxy-s24-ultra",
          type: "physical",
          description: "هاتف سامسونج جالكسي إس 24 ألترا بسعة 256 جيجابايت",
          short_description: "هاتف ذكي من سامسونج",
          price: 4999.00,
          cost_price: 3800.00,
          currency: "SAR",
          sku: "SAM-GS24U-256",
          stock: 32,
          low_stock_threshold: 10,
          track_stock: true,
          status: "published",
          category_id: electronicsCat?.id,
          brand_id: samsungBrand?.id,
          rating: 4.7,
          review_count: 89,
          sales_count: 278,
        },
        {
          name: " MacBook Air M3",
          slug: "macbook-air-m3",
          type: "physical",
          description: "ماك بوك إير بشريحة M3 للسرعة والأداء الفائق",
          short_description: "حاسوب ماك بوك من أبل",
          price: 4999.00,
          sale_price: 4699.00,
          cost_price: 3900.00,
          currency: "SAR",
          sku: "APL-MBA-M3-256",
          stock: 18,
          low_stock_threshold: 5,
          track_stock: true,
          status: "published",
          category_id: electronicsCat?.id,
          brand_id: appleBrand?.id,
          rating: 4.9,
          review_count: 67,
          sales_count: 145,
        },
        {
          name: "سماعات AirPods Pro 2",
          slug: "airpods-pro-2",
          type: "physical",
          description: "سماعات أبل أيربودز برو 2 مع خاصية إلغاء الضوضاء",
          short_description: "سماعات لاسلكية",
          price: 999.00,
          sale_price: 899.00,
          cost_price: 650.00,
          currency: "SAR",
          sku: "APL-APP2-USB",
          stock: 75,
          low_stock_threshold: 20,
          track_stock: true,
          status: "published",
          category_id: electronicsCat?.id,
          brand_id: appleBrand?.id,
          rating: 4.6,
          review_count: 203,
          sales_count: 512,
        },
        {
          name: "تيشيرت رياضي نايكي",
          slug: "nike-sports-tshirt",
          type: "physical",
          description: "تيشيرت رياضي من نايكي بقماش مريح ومتقن",
          short_description: "ملابس رياضية",
          price: 199.00,
          cost_price: 85.00,
          currency: "SAR",
          sku: "NIK-TS-BLK-M",
          stock: 120,
          low_stock_threshold: 20,
          track_stock: true,
          status: "published",
          category_id: fashionCat?.id,
          brand_id: nikeBrand?.id,
          rating: 4.3,
          review_count: 45,
          sales_count: 189,
        },
        {
          name: "شاحن لاسلكي سامسونج",
          slug: "samsung-wireless-charger",
          type: "physical",
          description: "شاحن لاسلكي سريع من سامسونج بقوة 15 واط",
          short_description: "شاحن لاسلكي",
          price: 149.00,
          sale_price: 119.00,
          cost_price: 60.00,
          currency: "SAR",
          sku: "SAM-WCH-15W",
          stock: 95,
          low_stock_threshold: 20,
          track_stock: true,
          status: "published",
          category_id: electronicsCat?.id,
          brand_id: samsungBrand?.id,
          rating: 4.2,
          review_count: 34,
          sales_count: 167,
        },
        {
          name: "طقم أواني مطبخ ستيل",
          slug: "stainless-steel-cookware",
          type: "physical",
          description: "طقم أواني مطبخ من الستانلس ستيل عالي الجودة",
          short_description: "أواني مطبخ",
          price: 899.00,
          cost_price: 450.00,
          currency: "SAR",
          sku: "HK-CW-STL-7P",
          stock: 25,
          low_stock_threshold: 5,
          track_stock: true,
          status: "published",
          category_id: homeCat?.id,
          rating: 4.5,
          review_count: 28,
          sales_count: 89,
        },
        {
          name: "حذاء رياضي نايكي اير ماكس",
          slug: "nike-air-max-shoes",
          type: "physical",
          description: "حذاء رياضي من نايكي بتصميم عصري وراحة مطلقة",
          short_description: "أحذية رياضية",
          price: 599.00,
          sale_price: 499.00,
          cost_price: 280.00,
          currency: "SAR",
          sku: "NIK-AM-90-BLK",
          stock: 60,
          low_stock_threshold: 15,
          track_stock: true,
          status: "published",
          category_id: sportsCat?.id,
          brand_id: nikeBrand?.id,
          rating: 4.4,
          review_count: 56,
          sales_count: 234,
        },
        {
          name: "حقيبة ظهر رياضية",
          slug: "sports-backpack",
          type: "physical",
          description: "حقيبة ظهر رياضية متعددة الاستخدامات",
          short_description: "حقائب رياضية",
          price: 249.00,
          cost_price: 110.00,
          currency: "SAR",
          sku: "SP-BP-60L",
          stock: 40,
          low_stock_threshold: 10,
          track_stock: true,
          status: "published",
          category_id: sportsCat?.id,
          rating: 4.1,
          review_count: 19,
          sales_count: 78,
        },
        {
          name: "دورة تسويق رقمي",
          slug: "digital-marketing-course",
          type: "digital",
          description: "دورة شاملة في التسويق الرقمي ووسائل التواصل الاجتماعي",
          short_description: "دورة إلكترونية",
          price: 399.00,
          sale_price: 299.00,
          is_digital: true,
          digital_files: JSON.stringify(["https://example.com/course.mp4"]),
          download_limit: 5,
          currency: "SAR",
          sku: "DIG-DM-001",
          stock: 999,
          track_stock: false,
          status: "published",
          category_id: electronicsCat?.id,
          rating: 4.7,
          review_count: 42,
          sales_count: 198,
        },
      ])
      .select();
    results.push({ table: "products", count: products?.length ?? 0, error: productError?.message });

    // ===================== PRODUCT TAGS =====================
    if (products?.length && tags?.length) {
      const newTag = tags.find((t) => t.name === "جديد");
      const bestTag = tags.find((t) => t.name === "الأكثر مبيعاً");
      const saleTag = tags.find((t) => t.name === "تخفيض");
      const featTag = tags.find((t) => t.name === "مميز");
      const exclusiveTag = tags.find((t) => t.name === "حصري");

      const productTags: { product_id: string; tag_id: string }[] = [];
      if (products[0] && newTag) productTags.push({ product_id: products[0].id, tag_id: newTag.id });
      if (products[0] && featTag) productTags.push({ product_id: products[0].id, tag_id: featTag.id });
      if (products[1] && newTag) productTags.push({ product_id: products[1].id, tag_id: newTag.id });
      if (products[2] && exclusiveTag) productTags.push({ product_id: products[2].id, tag_id: exclusiveTag.id });
      if (products[3] && bestTag) productTags.push({ product_id: products[3].id, tag_id: bestTag.id });
      if (products[4] && featTag) productTags.push({ product_id: products[4].id, tag_id: featTag.id });
      if (products[5] && saleTag) productTags.push({ product_id: products[5].id, tag_id: saleTag.id });
      if (products[9] && saleTag) productTags.push({ product_id: products[9].id, tag_id: saleTag.id });

      if (productTags.length) {
        await supabase.from("product_tags").insert(productTags);
      }
    }

    // ===================== CUSTOMERS =====================
    const { data: customers, error: customerError } = await supabase
      .from("customers")
      .insert([
        {
          name: "محمد العلي",
          email: "mohammed@example.com",
          phone: "+966501234567",
          status: "active",
          city: "الرياض",
          country: "SA",
          total_orders: 8,
          total_spent: 4250.00,
          tags: JSON.stringify(["vip"]),
        },
        {
          name: "فاطمة الزهراء",
          email: "fatima@example.com",
          phone: "+966509876543",
          status: "active",
          city: "جدة",
          country: "SA",
          total_orders: 5,
          total_spent: 1890.00,
          tags: JSON.stringify(["مكرر"]),
        },
        {
          name: "خالد الشمري",
          email: "khalid@example.com",
          phone: "+966551122334",
          status: "active",
          city: "الدمام",
          country: "SA",
          total_orders: 3,
          total_spent: 980.00,
          tags: JSON.stringify([]),
        },
        {
          name: "نورة السعيد",
          email: "noura@example.com",
          phone: "+966567788990",
          status: "active",
          city: "مكة المكرمة",
          country: "SA",
          total_orders: 12,
          total_spent: 8750.00,
          tags: JSON.stringify(["vip", "مكرر"]),
        },
        {
          name: "عبدالله الحربي",
          email: "abdullah@example.com",
          phone: "+966544455667",
          status: "blocked",
          city: "المدينة المنورة",
          country: "SA",
          total_orders: 1,
          total_spent: 150.00,
          tags: JSON.stringify([]),
          notes: "عميل محظورdue to refund abuse",
        },
      ])
      .select();
    results.push({ table: "customers", count: customers?.length ?? 0, error: customerError?.message });

    // ===================== ORDERS =====================
    const customer1 = customers?.find((c) => c.email === "mohammed@example.com");
    const customer2 = customers?.find((c) => c.email === "fatima@example.com");
    const customer3 = customers?.find((c) => c.email === "noura@example.com");

    const product1 = products?.[0]; // iPhone 15 Pro Max
    const product2 = products?.[3]; // AirPods Pro 2
    const product3 = products?.[4]; // Nike T-shirt
    const product4 = products?.[7]; // Nike Air Max

    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: "O00001",
          customer_id: customer1?.id,
          status: "completed",
          payment_status: "paid",
          payment_method: "credit_card",
          source: "online",
          subtotal: 6498.00,
          discount_amount: 300.00,
          shipping_amount: 0,
          tax_amount: 0,
          total: 6198.00,
          currency: "SAR",
          shipping_name: "محمد العلي",
          shipping_address: "حي النزهة، شارع الأمير سلطان",
          shipping_city: "الرياض",
          shipping_country: "SA",
          shipping_phone: "+966501234567",
          notes: "توصيل سريع لو سمحت",
        },
        {
          order_number: "O00002",
          customer_id: customer2?.id,
          status: "shipping",
          payment_status: "paid",
          payment_method: "apple_pay",
          source: "online",
          subtotal: 1098.00,
          discount_amount: 0,
          shipping_amount: 25.00,
          tax_amount: 0,
          total: 1123.00,
          currency: "SAR",
          shipping_name: "فاطمة الزهراء",
          shipping_address: "حي الروضة، شارع التحلية",
          shipping_city: "جدة",
          shipping_country: "SA",
          shipping_phone: "+966509876543",
          tracking_number: "SF123456789",
          tracking_url: "https://www.smsa.com/track/SF123456789",
        },
        {
          order_number: "O00003",
          customer_id: customer3?.id,
          status: "processing",
          payment_status: "paid",
          payment_method: "mada",
          source: "online",
          subtotal: 5499.00,
          discount_amount: 300.00,
          shipping_amount: 0,
          tax_amount: 0,
          total: 5199.00,
          currency: "SAR",
          shipping_name: "نورة السعيد",
          shipping_address: "حي العزيزية، شارع فلسطين",
          shipping_city: "مكة المكرمة",
          shipping_country: "SA",
          shipping_phone: "+966567788990",
          coupon_code: "SAVE300",
        },
      ])
      .select();
    results.push({ table: "orders", count: orders?.length ?? 0, error: orderError?.message });

    // ===================== ORDER ITEMS =====================
    if (orders?.length && product1 && product2 && product3 && product4) {
      const order1 = orders.find((o) => o.order_number === "O00001");
      const order2 = orders.find((o) => o.order_number === "O00002");
      const order3 = orders.find((o) => o.order_number === "O00003");

      const { error: itemError } = await supabase
        .from("order_items")
        .insert([
          // Order 1 items
          {
            order_id: order1?.id,
            product_id: product1.id,
            product_name: product1.name,
            quantity: 1,
            price: 5199.00,
            total: 5199.00,
          },
          {
            order_id: order1?.id,
            product_id: product2.id,
            product_name: product2.name,
            quantity: 1,
            price: 899.00,
            total: 899.00,
          },
          // Order 2 items
          {
            order_id: order2?.id,
            product_id: product2.id,
            product_name: product2.name,
            quantity: 1,
            price: 899.00,
            total: 899.00,
          },
          {
            order_id: order2?.id,
            product_id: product3.id,
            product_name: product3.name,
            quantity: 1,
            price: 199.00,
            total: 199.00,
          },
          // Order 3 items
          {
            order_id: order3?.id,
            product_id: product1.id,
            product_name: product1.name,
            quantity: 1,
            price: 5199.00,
            total: 5199.00,
          },
        ]);
      if (itemError) {
        results.push({ table: "order_items", count: 0, error: itemError.message });
      }
    }

    // ===================== ORDER STATUS HISTORY =====================
    if (orders?.length) {
      const { error: histError } = await supabase
        .from("order_status_history")
        .insert([
          {
            order_id: orders[0]?.id,
            status: "pending",
            note: "تم إنشاء الطلب",
          },
          {
            order_id: orders[0]?.id,
            status: "confirmed",
            note: "تم تأكيد الطلب",
          },
          {
            order_id: orders[0]?.id,
            status: "completed",
            note: "تم التوصيل بنجاح",
          },
          {
            order_id: orders[1]?.id,
            status: "pending",
            note: "تم إنشاء الطلب",
          },
          {
            order_id: orders[1]?.id,
            status: "shipping",
            note: "تم الشحن عبر SMSA",
          },
        ]);
      results.push({ table: "order_status_history", count: 5, error: histError?.message });
    }

    // ===================== COUPONS =====================
    const { data: coupons, error: couponError } = await supabase
      .from("coupons")
      .insert([
        {
          code: "SAVE300",
          type: "fixed",
          value: 300.00,
          minimum_order: 3000.00,
          maximum_discount: 300.00,
          usage_limit: 100,
          usage_count: 12,
          per_customer_limit: 1,
          is_active: true,
          starts_at: "2024-01-01T00:00:00Z",
          expires_at: "2025-12-31T23:59:59Z",
        },
        {
          code: "WELCOME10",
          type: "percentage",
          value: 10.00,
          minimum_order: 200.00,
          maximum_discount: 150.00,
          usage_limit: 500,
          usage_count: 234,
          per_customer_limit: 1,
          is_active: true,
          starts_at: "2024-01-01T00:00:00Z",
          expires_at: "2025-12-31T23:59:59Z",
        },
      ])
      .select();
    results.push({ table: "coupons", count: coupons?.length ?? 0, error: couponError?.message });
  } else {
    results.push({ table: "categories", count: 0, error: "Database already seeded" });
  }

  return results;
}
