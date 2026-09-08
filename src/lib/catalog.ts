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
  return [
    {
      id: "1",
      name: "Classic Tailored Coat",
      slug: "classic-tailored-coat",
      description: "A timeless dark coat cut from premium wool.",
      category: "Outerwear",
      tags: ["Outerwear"],
      priceCents: 45000,
      images: ["https://images.pexels.com/photos/19169191/pexels-photo-19169191.jpeg"],
      featured: true,
    },
    {
      id: "2",
      name: "Silk Evening Dress",
      slug: "silk-evening-dress",
      description: "Elegant silk dress designed for evening wear.",
      category: "Dresses",
      tags: ["Dresses"],
      priceCents: 32000,
      images: ["https://images.pexels.com/photos/17871655/pexels-photo-17871655.jpeg"],
      featured: true,
    }
  ];
}
