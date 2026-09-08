import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { IconArrow } from "@/components/Icons";

export const dynamic = "force-dynamic";

const px = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const TILES = [
  { label: "Outerwear", href: "/shop?category=Outerwear", img: px(19169191, 700, 933) },
  { label: "Tailoring", href: "/shop?category=Tailoring", img: px(33401683, 700, 933) },
  { label: "Knitwear", href: "/shop?category=Knitwear", img: px(6995886, 700, 933) },
  { label: "Dresses", href: "/shop?category=Dresses", img: px(17871655, 700, 933) },
];

export default async function HomePage() {
  let all: any[] = [];
  try {
    all = await getProducts();
  } catch (e) {
    all = [];
  }

  const featured = all.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-ink">
        <img
          src={px(20231996, 1800, 1000)}
          alt="Model in a dark tailored coat"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-paper/70">
              Autumn – Winter 2026
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] text-paper md:text-8xl">
              Dressed in <br />
              <span className="italic">quiet power.</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition hover:bg-gold"
              >
                Explore Collection
                <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-paper py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between border-b border-sand pb-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">Curated Selection</p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Featured Pieces ({all.length})</h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-ink hover:text-gold">
              View All
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-sand/30 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">Categories</p>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Shop by Department</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((tile) => (
              <Link key={tile.label} href={tile.href} className="group relative h-[420px] overflow-hidden bg-ink">
                <img
                  src={tile.img}
                  alt={tile.label}
                  className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-2xl text-paper">{tile.label}</h3>
                  <p className="mt-1 text-xs text-paper/70">Shop collection &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
