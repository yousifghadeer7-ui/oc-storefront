import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: any[] = [];
  try {
    products = (await getProducts()) || [];
  } catch (e) {
    products = [];
  }

  return (
    <div className="bg-paper min-h-screen py-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-sand pb-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">
            Collection
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
            All Products ({products.length})
          </h1>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="aspect-[3/4] w-full overflow-hidden bg-sand/30">
                <img
                  src={p.images?.[0] || ""}
                  alt={p.name}
                  className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-display text-lg text-ink">{p.name}</h3>
              <p className="mt-1 text-sm font-semibold text-gold">
                ${((p.priceCents || 0) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
