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
    const domain = "kw8nk1-ix.myshopify.com";
    const token = "50af4161e6230c8bea6f3e4191448b33";

    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          {
            products(first: 250) {
              edges {
                node {
                  id
                  title
                  description
                  productType
                  tags
                  variants(first: 1) {
                    edges {
                      node {
                        price {
                          amount
                        }
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 60 },
    });

    const json = await res.json();
    const shopifyProducts = json?.data?.products?.edges || [];

    return shopifyProducts.map((edge: any) => {
      const product = edge.node;
      return {
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
      };
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
