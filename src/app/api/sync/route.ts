import { NextResponse } from "next/server";

export async function GET() {
  try {
    const domain = "kw8nk1-ix.myshopify.com";
    const token = "50af4161e6230c8bea6f3e4191448b33";

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
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
                  createdAt
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
    });

    const json = await response.json();
    const shopifyProducts = json?.data?.products?.edges || [];

    return NextResponse.json({
      success: true,
      count: shopifyProducts.length,
      products: shopifyProducts.map((edge: any) => edge.node),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
