import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { IconArrow } from "@/components/Icons";

export const dynamic = "force-dynamic";

const px = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

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
  const all = await getProducts();
  const featured = all.slice(0, 4);

  return (
    <>
      {/* 1. Hero الأصلي */}
      <section className="relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-ink">
        <img
          src={px(20231996, 1800, 1000)}
          alt="Model in a dark tailored coat"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-14 md:p-12 md:pb-20">
          <div className="mx-auto max-w-7xl w-full">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-sand">
              Autumn / Winter 2026
            </p>
            <h1 className="mt-3 font-display text-4xl text-paper sm:text-6xl md:text-7xl max-w-2xl leading-[1.05]">
              Considered clothing, made to outlast seasons.
            </h1>
            <p className="mt-4 max-w-md text-sm text-sand/80">
              Quiet silhouettes, honest materials, and pieces cut to age with grace rather than expire.
            </p>
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-paper px-8 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-ink transition-colors hover:bg-sand"
              >
                Explore the collection <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Tiles الأصلي */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted">
              Categories
            </p>
            <h2 className="font-display text-2xl md:text-3xl">Shop by edit</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:text-muted"
          >
            All pieces ({all.length})
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TILES.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group relative aspect-[3/4] overflow-hidden bg-sand/20"
            >
              <img
                src={t.img}
                alt={t.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-paper">
                <span className="font-display text-lg">{t.label}</span>
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured New Arrivals الأصلي */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted">
              Selection
            </p>
            <h2 className="font-display text-2xl md:text-3xl">New arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:text-muted"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* 4. Standards الأصلي */}
      <section className="border-t border-line bg-sand/20 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted">
            Our standard
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">
            How we build a wardrobe that lasts.
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STANDARDS.map(([title, desc]) => (
              <div key={title} className="border-l border-line pl-6">
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
