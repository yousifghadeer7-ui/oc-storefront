export const CATEGORIES = [
  "Outerwear",
  "Tailoring",
  "Knitwear",
  "Dresses",
  "Shirts",
  "Trousers",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function matchesCategory(
  productCategory: string | null | undefined,
  productTags: string[] = [],
  targetCategory: string
): boolean {
  if (!targetCategory) return true;
  const target = targetCategory.toLowerCase().trim();
  
  const categoryMatch = productCategory ? productCategory.toLowerCase().trim().includes(target) : false;
  const tagMatch = productTags.some((tag) => tag.toLowerCase().trim().includes(target));
  
  return categoryMatch || tagMatch;
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
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
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
      next: { revalidate: 10 }
    });

    if (!res.ok) return [];

    const json = await res.json();
    const items = json?.data?.products?.edges || [];

    return items.map((edge: any) => {
      const p = edge.node;
      return {
        id: p.id.split("/").pop() || p.id,
        name: p.title,
        handle: p.handle,
        description: p.description || "",
        category: p.productType || "",
        tags: p.tags || [],
        priceCents: Math.round(parseFloat(p.variants?.edges[0]?.node?.price?.amount || "0") * 100),
        images: [p.images?.edges[0]?.node?.url || ""],
        shopifyUrl: `https://kw8nk1-ix.myshopify.com/products/${p.handle}`
      };
    });
  } catch (e) {
    return [];
  }
}
