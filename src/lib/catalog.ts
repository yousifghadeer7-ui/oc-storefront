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
  try {
    const res = await fetch("https://kw8nk1-ix.myshopify.com/api/2024-01/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "50af4161e6230c8bea6f3e4191448b33",
      },
      body: JSON.stringify({
        query: `{
          products(first: 50) {
            edges {
              node {
                id
                title
                description
                productType
                tags
                variants(first: 1) { edges { node { price { amount } } } }
                images(first: 1) { edges { node { url } } }
              }
            }
          }
        }`
      }),
      cache: "no-store"
    });

    const json = await res.json();
    const items = json?.data?.products?.edges || [];

    if (items.length > 0) {
      return items.map((edge: any) => {
        const p = edge.node;
        return {
          id: p.id.split("/").pop() || p.id,
          name: p.title,
          slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: p.description || "",
          category: p.productType || "Dresses",
          tags: p.tags || [],
          priceCents: Math.round(parseFloat(p.variants?.edges[0]?.node?.price?.amount || "100") * 100),
          images: [p.images?.edges[0]?.node?.url || "https://images.pexels.com/photos/17871655/pexels-photo-17871655.jpeg"],
          featured: true,
        };
      });
    }
  } catch (e) {
    console.error(e);
  }

  // ارجاع قيم افتراضية لضمان عمل الواجهة وعدم اختفائها أبداً
  return [
    {
      id: "1",
      name: "Silk Evening Dress",
      slug: "silk-evening-dress",
      description: "Elegant silk dress",
      category: "Dresses",
      tags: ["Dresses"],
      priceCents: 25000,
      images: ["https://images.pexels.com/photos/17871655/pexels-photo-17871655.jpeg"],
      featured: true,
    }
  ];
}
