import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let productsList: any[] = [];
  try {
    const data = await getProducts();
    productsList = Array.isArray(data) ? data : data?.products || [];
  } catch (error) {
    console.error("Failed to load catalog product:", error);
  }

  // البحث بالـ slug أو handle أو id لتجنب الـ 404
  const product = productsList.find((p: any) => {
    const pSlug = String(p.slug || "").toLowerCase();
    const pHandle = String(p.handle || "").toLowerCase();
    const pId = String(p.id || "").toLowerCase();
    const target = String(slug || "").toLowerCase();

    return pSlug === target || pHandle === target || pId === target;
  });

  if (!product) {
    notFound();
  }

  // معالجة السعر والصورة لضمان عدم وجود أخطاء
  const rawPrice =
    product.price ??
    product.price_amount ??
    product.amount ??
    product.priceRange?.minVariantPrice?.amount ??
    "290";
  const parsedPrice = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice);
  const displayPrice = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : 290;

  const imageUrl =
    product.image ||
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
    product.featuredImage?.url ||
    "";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="aspect-[3/4] w-full overflow-hidden bg-sand/20 rounded-md">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || product.name || "Product"}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-taupe">
              No Image Available
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-xs tracking-[0.2em] uppercase text-taupe font-semibold">
            {product.category || product.productType || "COLLECTION"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-ink">
            {product.title || product.name}
          </h1>
          <p className="text-2xl font-semibold text-ink">${displayPrice}</p>
          
          <p className="text-sm text-taupe leading-relaxed">
            {product.description || "High quality luxury apparel crafted with premium materials."}
          </p>

          <button className="w-full py-4 bg-ink text-white font-medium hover:bg-ink/90 transition">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
