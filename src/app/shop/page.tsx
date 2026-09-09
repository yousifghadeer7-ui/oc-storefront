import Link from "next/link";
import { getProducts } from "@/lib/catalog";

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

// دالة فحص واستخراج السعر الحقيقي بدقة من كافة الهياكل الممكنة
function extractRealPrice(item: any): number {
  if (!item) return 0;

  // 1. فحص الحقول المباشرة
  if (typeof item.price === "number" && item.price > 0) return item.price;
  if (typeof item.price === "string" && !isNaN(parseFloat(item.price)) && parseFloat(item.price) > 0) {
    return parseFloat(item.price);
  }

  // 2. فحص مصفوفة Variants (Shopify & Custom APIs)
  if (Array.isArray(item.variants) && item.variants.length > 0) {
    const v = item.variants[0];
    if (v?.price) {
      const vp = typeof v.price === "number" ? v.price : parseFloat(v.price);
      if (!isNaN(vp) && vp > 0) return vp;
    }
    if (v?.price_amount) {
      const vpa = typeof v.price_amount === "number" ? v.price_amount : parseFloat(v.price_amount);
      if (!isNaN(vpa) && vpa > 0) return vpa;
    }
  }

  // 3. فحص كائنات الأسعار المتداخلة (GraphQL / Shopify API)
  if (item.priceRange?.minVariantPrice?.amount) {
    const p = parseFloat(item.priceRange.minVariantPrice.amount);
    if (!isNaN(p) && p > 0) return p;
  }

  // 4. فحص حقول AliExpress المخصصة
  const altFields = [
    item.price_amount,
    item.original_price,
    item.sale_price,
    item.target_sale_price,
    item.app_sale_price,
  ];

  for (const field of altFields) {
    if (field !== undefined && field !== null) {
      const parsed = typeof field === "number" ? field : parseFloat(String(field));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  return 0;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = params.cat?.toLowerCase() || "all";
  const queryParam = params.q?.toLowerCase() || "";

  let productsList: any[] = [];
  try {
    const data = await getProducts();
    productsList = Array.isArray(data) ? data : data?.products || [];
  } catch (error) {
    console.error("Failed to load catalog products:", error);
  }

  const filteredProducts = productsList.filter((product: any) => {
    if (categoryParam !== "all" && categoryParam !== "new") {
      const pCat = (product.category || product.productType || "").toLowerCase();
      const tags = Array.isArray(product.tags)
        ? product.tags.join(" ").toLowerCase()
        : (product.tags || "").toLowerCase();
      if (!pCat.includes(categoryParam) && !tags.includes(categoryParam)) return false;
    }
    if (queryParam) {
      const title = (product.title || product.name || "").toLowerCase();
      if (!title.includes(queryParam)) return false;
    }
    return true;
  });

  const titleMap: Record<string, string> = {
    all: "All Products",
    new: "New Arrivals",
    outerwear: "Outerwear",
    tailoring: "Tailoring",
    knitwear: "Knitwear",
    dresses: "Dresses",
  };

  const pageTitle = titleMap[categoryParam] || "Collection";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="border-b border-sand/40 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-taupe font-semibold">
            COLLECTION
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-ink mt-1">
            {pageTitle} ({filteredProducts.length})
          </h1>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-sm text-taupe">
          No products found in this collection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product: any, idx: number) => {
            const productSlug = product.slug || product.handle || product.id || `item-${idx}`;
            const price = extractRealPrice(product);

            const imageUrl =
              product.image ||
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
              product.featuredImage?.url ||
              "";

            return (
              <Link
                key={product.id || productSlug}
                href={`/product/${encodeURIComponent(String(productSlug))}`}
                className="group block cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/20 mb-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title || "Product Image"}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="text-[10px] tracking-widest uppercase text-taupe mb-1">
                  {product.category || product.productType || "COLLECTION"}
                </div>
                <h3 className="text-sm font-medium text-ink mb-1 line-clamp-1">
                  {product.title || product.name}
                </h3>
                <p className="text-sm font-semibold text-ink">
                  {price > 0 ? `$${price.toFixed(2)}` : "Contact for Price"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
