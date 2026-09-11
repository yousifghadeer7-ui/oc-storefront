// المتغيرات المطلوبة للـ Footer والسلة والطلبات
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

export async function getProducts() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/json-iterator/test-data/master/shopify-products.json",
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    const items = Array.isArray(data) ? data : data?.products || [];

    return items.map((item: any, idx: number) => {
      let priceVal = 120;
      if (typeof item.price === "number" && item.price > 0) priceVal = item.price;
      else if (item.variants?.[0]?.price) priceVal = parseFloat(item.variants[0].price);
      else if (item.price_amount) priceVal = parseFloat(item.price_amount);

      const img =
        item.image?.src ||
        item.images?.[0]?.src ||
        (typeof item.images?.[0] === "string" ? item.images[0] : "") ||
        "";

      return {
        id: item.id || `prod-${idx}`,
        slug: item.handle || item.slug || `product-${item.id || idx}`,
        title: item.title || item.name || "Luxury Apparel Item",
        price: isNaN(priceVal) || priceVal <= 0 ? 120 : priceVal,
        category: item.product_type || item.category || "COLLECTION",
        image: img,
        description:
          item.body_html?.replace(/<[^>]*>?/gm, "") ||
          "High quality apparel crafted with premium materials.",
      };
    });
  } catch (error) {
    console.error("Error loading products catalog:", error);
    return [];
  }
}
