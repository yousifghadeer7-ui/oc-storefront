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

export async function getProducts() {
  try {
    // جلب المنتجات من مصدر البيانات الكامل (Shopify / DummyJSON Fallback لضمان ظهور 44+ منتج)
    const res = await fetch("https://dummyjson.com/products/category/womens-dresses?limit=50", {
      next: { revalidate: 60 },
    });
    
    let products = [];
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
    }

    // إذا لم تتوفر البيانات الخارجية يتم إرجاع المنتجات مباشرة
    const resShop = await fetch("https://dummyjson.com/products?limit=44", {
      next: { revalidate: 60 },
    });
    
    if (resShop.ok) {
      const dataShop = await resShop.json();
      products = dataShop.products || products;
    }

    return products.map((item: any, idx: number) => ({
      id: item.id || `prod-${idx}`,
      slug: `product-${item.id || idx}`,
      title: item.title || "Luxury Apparel Item",
      price: item.price || 120,
      category: item.category || "womens-dresses",
      image: item.thumbnail || item.images?.[0] || "",
      description: item.description || "High quality apparel crafted with premium materials.",
    }));
  } catch (error) {
    console.error("Error loading products catalog:", error);
    return [];
  }
}
