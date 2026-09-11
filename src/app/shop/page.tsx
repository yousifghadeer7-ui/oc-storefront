import { ProductCard } from "@/components/ProductCard";
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

  // تصفية المنتجات حسب القسم المحدد
  const filteredProducts = productsList.filter((product: any) => {
    if (categoryParam !== "all" && categoryParam !== "new") {
      const pCat = (product.category || product.productType || product.product_type || "").toLowerCase();
      const tags = Array.isArray(product.tags)
        ? product.tags.join(" ").toLowerCase()
        : (product.tags || "").toLowerCase();
      const title = (product.title || product.name || "").toLowerCase();

      // البحث عن التطابق في القسم أو التاجات أو العنوان
      const matchesCat = pCat.includes(categoryParam) || tags.includes(categoryParam) || title.includes(categoryParam);
      if (!matchesCat) return false;
    }

    if (queryParam) {
      const title = (product.title || product.name || "").toLowerCase();
      if (!title.includes(queryParam)) return false;
    }

    return true;
  });

  const titleMap: Record<string, string> = {
    all: "Shop All",
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
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id || product.handle} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
