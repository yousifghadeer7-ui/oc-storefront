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
    // جلب منتجات أزياء وملابس فقط (Womens Dresses & Apparel)
    const res = await fetch("https://dummyjson.com/products/category/womens-dresses", {
      next: { revalidate: 60 },
    });
    
    let items: any[] = [];
    if (res.ok) {
      const data = await res.json();
      items = data.products || [];
    }

    return items.map((item: any, idx: number) => ({
      id: item.id || `prod-${idx}`,
      slug: `product-${item.id || idx}`,
      title: item.title || "Luxury Apparel Item",
      price: item.price || 120,
      category: "dresses",
      image: item.thumbnail || item.images?.[0] || "",
      description: item.description || "High quality apparel crafted with premium materials.",
    }));
  } catch (error) {
    console.error("Error loading products catalog:", error);
    return [];
  }
}
