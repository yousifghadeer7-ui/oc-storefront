// src/lib/catalog.ts

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING = 15;

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

function cleanDomain(input: string) {
  return (input || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .split("/")[0];
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
    const rawDomain =
      process.env.SHOPIFY_STORE_DOMAIN ||
      process.env.SHOPIFY_STORE_URL ||
      "kw8nk1-ix.myshopify.com";

    const domain = cleanDomain(rawDomain);
    const url = `https://${domain}/products.json?limit=250`;

    console.log("[catalog] fetching:", url);

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "oc-storefront/1.0",
      },
    });

    const text = await res.text();
    console.log("[catalog] status:", res.status);
    console.log("[catalog] preview:", text.slice(0, 200));

    if (!res.ok) {
      console.error("[catalog] failed:", res.status);
      return [];
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[catalog] not JSON:", text.slice(0, 300));
      return [];
    }

    const items = Array.isArray(data) ? data : data?.products || [];
    console.log("[catalog] count:", items.length);

    return items.map((item: any, idx: number) => {
      const priceStr = item?.variants?.[0]?.price;
      let priceVal = priceStr ? parseFloat(priceStr) : 120;
      if (isNaN(priceVal) || priceVal <= 0) priceVal = 120;

      const img =
        item?.image?.src ||
        item?.images?.[0]?.src ||
        item?.featured_image?.src ||
        "";

      const category = pickCategory(item);

      return {
        id: String(item.id || `prod-${idx}`),
        slug: item.handle || `product-${item.id || idx}`,
        title: item.title || "Item",
        price: priceVal,
        category,
        image: img,
        description: stripHtml(item.body_html) || "",
        tags: normalizeTags(item.tags),
      };
    });
  } catch (error) {
    console.error("[catalog] error:", error);
    return [];
  }
}
