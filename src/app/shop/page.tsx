import Link from "next/link";
import { getProducts } from "@/lib/catalog";

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>;
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
          {filteredProducts.map((product: any) => {
            // استخراج المعرف الصحيح للصفحة الديناميكية
            const productSlug =
              product.handle ||
              product.slug ||
              (product.id ? String(product.id) : "");

            // استخراج السعر الحقيقي مع فحص كافة الاحتمالات الممكنة في الكتالوج
            const rawPrice =
              product.price ??
              product.price_amount ??
              product.amount ??
              product.priceRange?.minVariantPrice?.amount ??
              product.variants?.[0]?.price ??
              "0";

            const parsedPrice = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice);
            const displayPrice = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : 290;

            // استخراج رابط الصورة
            const imageUrl =
              product.image ||
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
              product.featuredImage?.url ||
              "";

            return (
              <Link
                key={product.id || productSlug}
                href={`/product/${productSlug}`}
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
                  ${displayPrice}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
