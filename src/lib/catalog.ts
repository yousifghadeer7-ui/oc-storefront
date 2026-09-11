// src/lib/catalog.ts

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING = 15;
export const SHOPIFY_DOMAIN = "kw8nk1-ix.myshopify.com";

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
  if (Array.isArray(tags)) return tags.map(String).map((t) => t.trim()).filter(Boolean);
  if (typeof tags === "string")
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function pickCategory(product: any): string {
  const pt = (product?.product_type || "").trim();
  if (pt) return pt;

  const rawTags = normalizeTags(product?.tags);
  const tagsLower = rawTags.map((t) => t.toLowerCase());

  const known = [
    { key: "new arrivals", label: "New Arrivals" },
    { key: "new in", label: "New Arrivals" },
    { key: "outerwear", label: "Outerwear" },
    { key: "tailoring", label: "Tailoring" },
    { key: "knitwear", label: "Knitwear" },
    { key: "dresses", label: "Dresses" },
  ];

  for (const k of known) {
    if (tagsLower.includes(k.key)) return k.label;
  }

  return rawTags[0] || "COLLECTION";
}

export async function getProducts() {
  try {
    const url = `https://${SHOPIFY_DOMAIN}/products.json?limit=250`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = Array.isArray(data) ? data : data?.products || [];

    return items.map((item: any, idx: number) => {
      const firstVariant = item?.variants?.[0];
      
      // تحويل السعر إلى رقم صافي لمنع NaN
      let rawPrice = firstVariant?.price || item?.price || "120";
      let priceVal = parseFloat(String(rawPrice));
      if (isNaN(priceVal) || priceVal <= 0) priceVal = 120;

      const img =
        item?.image?.src ||
        item?.images?.[0]?.src ||
        firstVariant?.featured_image?.src ||
        "";

      // variantId هو الرقم المطلوب بالظبط لصفحة دفع شوبيفاي
      const vId = String(firstVariant?.id || item.id);

      return {
        id: String(item.id || `prod-${idx}`),
        variantId: vId,
        slug: item.handle || `product-${item.id || idx}`,
        title: item.title || "Luxury Item",
        price: priceVal, // رقم مضمون
        category: pickCategory(item),
        image: img,
        description: stripHtml(item.body_html) || "Premium quality product.",
        tags: normalizeTags(item.tags),
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
