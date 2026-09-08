import { getProducts, matchesCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category || "";
  let allProducts: any[] = [];
  try {
    allProducts = (await getProducts()) || [];
  } catch (e) {
    allProducts = [];
  }

  const products = selectedCategory
    ? allProducts.filter((p) => matchesCategory(p.category, p.tags, selectedCategory))
    : allProducts;

  return (
    <div className="bg-paper min-h-screen py-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-sand pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">
              Collection
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
              {selectedCategory || "All Products"} ({products.length})
            </h1>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <a
              key={p.id}
              href={p.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-sand/30 relative">
                <img
                  src={p.images?.[0] || ""}
                  alt={p.name}
                  className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-ink text-paper text-[10px] px-3 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition">
                  Buy Now
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg text-ink group-hover:text-gold transition">
                {p.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gold">
                ${((p.priceCents || 0) / 100).toFixed(2)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
