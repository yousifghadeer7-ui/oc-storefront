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

const STANDARDS = [
  ["Natural cloth only", "Wool, silk, cotton, cashmere and leather – traceable and chosen to age well."],
  ["Finished by hand", "Seams, hems and closures completed by makers we know by name."],
  ["Made to outlast", "Patterns cut for a decade of wear, with repairs offered for life."],
] as const;

export default async function HomePage() {
  const all = (await getProducts()) || [];
  const featured = all.slice(0, 4);

  return (
    <>
      {/* Hero */}
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
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/80 md:text-base">
              A capsule of heavy outerwear, razor-sharp tailoring, and traceably sourced cashmere.
            </p>
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

      {/* Philosophy */}
      <section className="bg-ink border-b border-paper/10 py-12 text-paper">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STANDARDS.map(([title, body]) => (
              <div key={title} className="border-l border-gold/40 pl-6">
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-paper/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="bg-sand/30 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between border-b border-sand pb-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">Departments</p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-ink hover:text-gold">
              All Categories &rarr;
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((t) => (
              <Link key={t.label} href={t.href} className="group relative h-[420px] overflow-hidden bg-ink">
                <img
                  src={t.img}
                  alt={t.label}
                  className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-2xl text-paper">{t.label}</h3>
                  <p className="mt-1 text-xs text-paper/70 transition group-hover:text-gold">
                    Shop collection &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products from Shopify */}
      {featured.length > 0 && (
        <section className="bg-paper py-20 px-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between border-b border-sand pb-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-taupe">Curated Selection</p>
                <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Featured Pieces</h2>
              </div>
              <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-ink hover:text-gold">
                View All ({all.length})
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
