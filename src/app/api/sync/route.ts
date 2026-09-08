import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";

export async function GET() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Shopify environment variables missing" },
        { status: 500 }
      );
    }

    // جلب المنتجات من Shopify Storefront GraphQL API
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

    if (shopifyProducts.length === 0) {
      return NextResponse.json({ message: "No products found in Shopify", raw: json });
    }

    // مسح المنتجات القديمة وإعادة تعبئة قاعدة البيانات
    await db.delete(products);

    for (const edge of shopifyProducts) {
      const node = edge.node;
      const priceAmount = parseFloat(node.variants?.edges[0]?.node?.price?.amount || "0");
      const imageUrl = node.images?.edges[0]?.node?.url || "";

      await db.insert(products).values({
        id: node.id.split("/").pop() || Math.random().toString(),
        name: node.title,
        slug: node.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: node.description || "",
        category: node.productType || "Dresses",
        tags: node.tags || [],
        priceCents: Math.round(priceAmount * 100),
        featured: true,
        createdAt: new Date(node.createdAt || Date.now()),
      });
    }

    return NextResponse.json({
      success: true,
      syncedCount: shopifyProducts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
