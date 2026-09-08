export const CATEGORIES = [
  "Outerwear",
  "Tailoring",
  "Knitwear",
  "Shirts",
  "Trousers",
  "Dresses",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const FREE_SHIPPING_THRESHOLD = 30000;
export const FLAT_SHIPPING = 1500;

export function matchesCategory(
  productCategory: string | null | undefined,
  productTags: string[] = [],
  targetCategory: string
): boolean {
  if (!targetCategory) return true;

  const target = targetCategory.toLowerCase().trim();

  if (productCategory && productCategory.toLowerCase().trim() === target) {
    return true;
  }

  return productTags.some(
    (tag) => tag.toLowerCase().trim() === target
  );
}

export async function getProducts() {
  try {
    const res = await fetch("https://oc-storefront.vercel.app/api/sync", {
      next: { revalidate: 60 },
    });
    const data = await res.json();

    return (data.products || []).map((product: any) => ({
      id: product.id?.split("/").pop() || product.id,
      name: product.title,
      slug: product.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: product.description || "",
      category: product.productType || "Dresses",
      tags: product.tags || [],
      priceCents: Math.round(
        parseFloat(product.variants?.edges[0]?.node?.price?.amount || "0") * 100
      ),
      images: [product.images?.edges[0]?.node?.url || ""],
      featured: true,
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
