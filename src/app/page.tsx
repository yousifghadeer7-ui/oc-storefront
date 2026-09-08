import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { IconArrow } from "@/components/Icons";

const px = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

const TILES = [
  { label: "Outerwear", href: "/shop?category=Outerwear", img: px(19169191, 700, 933) },
  { label: "Tailoring", href: "/shop?category=Tailoring", img: px(33401683, 700, 933) },
  { label: "Knitwear", href: "/shop?category=Knitwear", img: px(6995886, 700, 933) },
  { label: "Dresses", href: "/shop?category=Dresses", img: px(17871655, 700, 933) },
];

const STANDARDS = [
  ["Natural cloth only", "Wool, silk, cotton, cashmere and leather — traceable and chosen to age well."],
  ["Finished by hand", "Seams, hems and closures completed by makers we know by name."],
  ["Made to outlast", "Patterns cut for a decade of wear, with repairs offered for life."],
] as const;

export default async function HomePage() {
  const all = await db.select().from(products);
  const featured = all.filter((p) => p.featured).slice(0, 4);
  const fresh = [...all]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return (
    <>
      {/* hero */}
      <section className="relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-ink">
        <img
          src={px(20231996, 1800, 1000)}
          alt="Model in a dark tailored coat, studio shadow"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-paper/70 animate-fade-up">
              Autumn — Winter 2026
            </p>
            <h1
              className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] text-paper md:text-8xl animate-fade-up"
              style={{ animationDelay: "90ms" }}
            >
              Dressed in
              <br />
              <span className="italic">quiet power.</span>
            </h1>
            <div
              className="mt-8 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href="/shop"
                className="bg-paper px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-ink transition-colors hover:bg-cream"
              >
                Shop the collection
              </Link>
              <Link
                href="/shop?category=Tailoring"
                className="border border-paper/50 px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                Explore tailoring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* philosophy */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center md:py-32">
        <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
          The House of OC
        </p>
        <p className="mt-6 font-display text-2xl leading-snug md:text-[2.1rem] md:leading-[1.3]">
          We make few things, slowly. Each piece is cut from natural cloth,
          finished by hand, and designed to be worn for{" "}
          <span className="italic">decades</span> — not seasons.
        </p>
        <p className="mt-6 text-[10px] font-semibold tracking-[0.42em] uppercase text-muted">
          OC — Since 2026
        </p>
      </section>

      {/* category tiles */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {TILES.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group relative block aspect-[3/4] overflow-hidden bg-cream"
            >
              <img
                src={t.img}
                alt={t.label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 md:p-5">
                <span className="font-display text-xl text-paper md:text-2xl">
                  {t.label}
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/40 text-paper transition-all group-hover:bg-paper group-hover:text-ink">
                  <IconArrow className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
              The Edit
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-5xl">
              Featured pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:gap-3 transition-all md:flex"
          >
            View all <IconArrow className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* editorial split */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid overflow-hidden md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream md:aspect-auto">
            <img
              src={px(20235870, 1100, 1300)}
              alt="Monochrome studio portrait in OC tailoring"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-cream px-6 py-14 md:px-16 md:py-20">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
              The OC Standard
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
              Made to outlast
              <br />
              <span className="italic">the season.</span>
            </h2>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {STANDARDS.map(([t, d]) => (
                <li key={t} className="py-5">
                  <p className="font-display text-lg">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-10 inline-flex w-fit items-center gap-3 bg-ink px-8 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-paper transition-colors hover:bg-ink-soft"
            >
              Discover the collection <IconArrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* new arrivals */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted">
                Just Landed
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-5xl">
                New arrivals
              </h2>
            </div>
            <Link
              href="/shop?sort=new"
              className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4"
            >
              View all <IconArrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 md:px-8">
          {fresh.map((p) => (
            <div
              key={p.id}
              className="w-[260px] shrink-0 snap-start md:w-[300px]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
