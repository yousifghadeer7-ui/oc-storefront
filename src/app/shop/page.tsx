import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify";

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = params.cat?.toLowerCase() || "all";
  const queryParam = params.q?.toLowerCase() || "";

  // جلب المنتجات المباشر من خادم المباشر
  let products: any[] = [];
  try {
    products = (await getProducts()) || [];
  } catch (e) {
    console.error(e);
  }

  // التصفية والفلترة
  const filteredProducts = products.filter((product) => {
    if (categoryParam !== "all" && categoryParam !== "new") {
      const pCat = (product.category || product.productType || "").toLowerCase();
      const tags = Array.isArray(product.tags) ? product.tags.join(" ").toLowerCase() : "";
      if (!pCat.includes(categoryParam) && !tags.includes(categoryParam)) return false;
    }
    if (queryParam) {
      const title = (product.title || "").toLowerCase();
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
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.handle} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
