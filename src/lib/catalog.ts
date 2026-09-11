// src/lib/catalog.ts

// الثوابت المطلوبة في السلة والطلبات
export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING = 15;

// تصدير القائمة بنوعين لدعم الـ Footer والـ Nav في نفس الوقت
export const CATEGORIES = [
  "All",
  "New Arrivals",
  "Outerwear",
  "Tailoring",
  "Knitwear",
  "Dresses",
];

export const CATEGORY_OBJECTS = [
  { slug: "all", label: "Shop All" },
  { slug: "new", label: "New In" },
  { slug: "outerwear", label: "Outerwear" },
  { slug: "tailoring", label: "Tailoring" },
  { slug: "knitwear", label: "Knitwear" },
  { slug: "dresses", label: "Dresses" },
];

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>?/gm, "").trim();
}

function normalizeTags(tags: any): string[] {
  // Shopify /products.json غالباً يرجع tags كسلسلة "tag1, tag2"
  if (Array.isArray(tags)) return tags.map(String).map((t) => t.trim()).filter(Boolean);
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

function pickCategory(product: any): string {
  // جرّب product_type أولاً
  const pt = (product?.product_type || "").trim();
  if (pt) return pt;

  // بعدها من tags (أقرب شيء للتصنيفات عندك)
  const tagsArr = normalizeTags(product?.tags).map((t) => t.toLowerCase());

  const known = [
    { key: "new arrivals", label: "New Arrivals" },
    { key: "new in", label: "New Arrivals" },
    { key: "outerwear", label: "Outerwear" },
    { key: "tailoring", label: "Tailoring" },
    { key: "knitwear", label: "Knitwear" },
    { key: "dresses", label: "Dresses" },
  ];

  for (const k of known) {
    if (tagsArr.includes(k.key)) return k.label;
  }

  // لو ما لقينا أي شيء معروف خذ أول tag (إن وجد)
  const rawTags = normalizeTags(product?.tags);
  if (rawTags[0]) return rawTags[0];

  return "COLLECTION";
}

export async function getProducts() {
  try {
    const STORE_DOMAIN =
      process.env.SHOPIFY_STORE_DOMAIN?.trim() || "kw8nk1-ix.myshopify.com";

    const res = await fetch(
      `https://${STORE_DOMAIN}/products.json?limit=250`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const data = await res.json();
    const items = Array.isArray(data) ? data : data?.products || [];

    return items.map((item: any, idx: number) => {
      // السعر
      let priceVal = 120;
      if (typeof item.price === "number" && item.price > 0) priceVal = item.price;
      else if (item.variants?.[0]?.price) priceVal = parseFloat(item.variants[0].price);
      else if (item.price_amount) priceVal = parseFloat(item.price_amount);

      // الصورة
      const img =
        item.image?.src ||
        item.images?.[0]?.src ||
        item.featured_image?.src ||
        (typeof item.images?.[0] === "string" ? item.images[0] : "") ||
        "";

      const category = pickCategory(item);

      return {
        id: item.id || `prod-${idx}`,
        slug: item.handle || item.slug || `product-${item.id || idx}`,
        title: item.title || item.name || "Luxury Apparel Item",
        price: isNaN(priceVal) || priceVal <= 0 ? 120 : priceVal,
        category, // مثال: "Outerwear" / "Dresses" ...
        image: img,
        description: stripHtml(item.body_html) || "High quality apparel crafted with premium materials.",
        // إضافي (اختياري) يفيد لو تحتاجه بالفلترة لاحقاً:
        tags: normalizeTags(item.tags),
      };
    });
  } catch (error) {
    console.error("Error loading products catalog:", error);
    return [];
  }
}
