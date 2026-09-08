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

export const FREE_SHIPPING_THRESHOLD = 30000; // cents
export const FLAT_SHIPPING = 1500; // cents

// دالة مرنة لمطابقة الفئات بغض النظر عن حالة الأحرف (Case-Insensitive)
export function matchesCategory(
  productCategory: string | null | undefined,
  productTags: string[] = [],
  targetCategory: string
): boolean {
  if (!targetCategory) return true;

  const target = targetCategory.toLowerCase().trim();

  // 1. الفحص حسب Product Type
  if (productCategory && productCategory.toLowerCase().trim() === target) {
    return true;
  }

  // 2. الفحص حسب Tags
  return productTags.some(
    (tag) => tag.toLowerCase().trim() === target
  );
}
