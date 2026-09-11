import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = (params.cat || "all").toLowerCase();
  const queryParam = (params.q || "").toLowerCase();

  let productsList: any[] = [];
  try {
    const data = await getProducts();
    productsList = Array.isArray(data) ? data : data?.products || [];
  } catch (error) {
    console.error("Failed to load catalog products:", error);
  }

  // فلترة المنتجات الذكية لتناسب بيانات Shopify
  const filteredProducts = productsList.filter((product: any) => {
    if (categoryParam !== "all" && categoryParam !== "shop all") {
      const pCat = (product.category || product.productType || product.product_type || "").toLowerCase();
      const title = (product.title || product.name || "").toLowerCase();
      const tags = Array.isArray(product.tags)
        ? product.tags.join(" ").toLowerCase()
        : (product.tags || "").toLowerCase();

      // إذا كان القسم "new" نعرض المنتجات
      if (categoryParam === "new" || categoryParam === "new arrivals") return true;

      // البحث عن المطابقة داخل النوع أو العنوان أو التاجات
      const isMatch = pCat.includes(categoryParam) || title.includes(categoryParam) || tags.includes(categoryParam);
      
      // إذا لم يجد مطابقة معينة، نرجع المنتجات بدلاً من إظهار صفحة فارغة
      if (!isMatch && productsList.length > 0) {
        // فحص مرن للمفرد والجمع (مثلاً dress vs dresses)
        const cleanParam = categoryParam.replace(/s$/, "");
        if (!pCat.includes(cleanParam) && !title.includes(cleanParam)) {
          return false;
        }
      }
    }

    if (queryParam) {
      const title = (product.title || product.name || "").toLowerCase();
      if (!title.includes(queryParam)) return false;
    }

    return true;
  });

  // إذا كانت الفلترة فارغة تماماً للقسم، نعرض كل المنتجات لضمان عدم ظهور الصفحة فارغة
  const finalDisplayProducts = filteredProducts.length > 0 ? filteredProducts : productsList;

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
            {pageTitle} ({finalDisplayProducts.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {finalDisplayProducts.map((product: any) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
