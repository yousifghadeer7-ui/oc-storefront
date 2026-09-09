import { ProductCard } from "@/components/ProductCard";

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

const sampleProducts = Array.from({ length: 44 }).map((_, i) => {
  const categories = ["outerwear", "tailoring", "knitwear", "dresses"];
  const selectedCat = categories[i % 4];
  const imageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";

  return {
    id: `prod-${i + 1}`,
    title: `Classic Item ${i + 1}`,
    handle: `classic-item-${i + 1}`,
    // حقول السعر بكافة التسميات الممكنة
    price: "290",
    regularPrice: "290",
    originalPrice: "290",
    value: 290,
    cost: 290,
    priceRange: {
      minVariantPrice: {
        amount: "290",
        currencyCode: "USD",
      },
      maxVariantPrice: {
        amount: "290",
        currencyCode: "USD",
      },
    },
    // حقول الصور
    image: imageUrl,
    images: [{ url: imageUrl, altText: "Product Image" }],
    featuredImage: {
      url: imageUrl,
      altText: "Product Image",
    },
    category: selectedCat,
    productType: selectedCat,
    tags: [selectedCat],
  };
});

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = params.cat?.toLowerCase() || "all";
  const queryParam = params.q?.toLowerCase() || "";

  const filteredProducts = sampleProducts.filter((product) => {
    if (categoryParam !== "all" && categoryParam !== "new") {
      const pCat = product.category.toLowerCase();
      if (!pCat.includes(categoryParam)) return false;
    }
    if (queryParam) {
      const title = product.title.toLowerCase();
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
