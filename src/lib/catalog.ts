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
  if (productCategory && productCategory.toLowerCase().trim() === target) return true;
  return productTags.some((tag) => tag.toLowerCase().trim() === target);
}

export async function getProducts() {
  return [];
}
