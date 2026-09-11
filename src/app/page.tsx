import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { IconArrow } from "@/components/Icons";

export const dynamic = "force-dynamic";

const px = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

const STANDARDS = [
  {
    title: "Natural cloth only",
    desc: "Wool, silk, cotton, cashmere and leather — traceable and chosen to age well.",
  },
  {
    title: "Finished by hand",
    desc: "Seams, hems and closures completed by makers we know by name.",
  },
];

export default async function HomePage() {
  // جلب المنتجات المباشرة من شوبي فاي
  const all = await getProducts();
  const featured = all.slice(0, 4);
  const newArrivals = all.length >= 8 ? all.slice(4, 8) : all.slice(0, 4);

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* 1. Hero Section المطابق لصورتك الأولى */}
      <section className="relative h-[85vh] min-h-[580px] w-full overflow-hidden bg-ink text-paper">
        <img
          src={px(20231996, 1800, 1000)}
          alt="OC Studio Model"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16 md:p-16">
          <div className="mx-auto max-w-7xl w-full">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-sand/80">
              Autumn — Winter 2026
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-7xl md:text-8xl max-w-2xl font-light leading-[1.05]">
              Dressed in <br />
              <span className="italic font-serif">quiet power.</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-paper text-ink px-7 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-sand transition-colors"
              >
                Shop the collection
              </Link>
              <Link
                href="/shop?category=Tailoring"
                className="border border-paper/40 text-paper px-7 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-paper hover:bg-paper/10 transition-colors"
              >
                Explore tailoring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Pieces المطابق لصورتك الثانية */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted">
              The Edit
            </p>
            <h2 className="font-display text-3xl md:text-4xl mt-1">Featured pieces</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:text-muted flex items-center gap-1"
          >
            View All <IconArrow className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* 3. The OC Standard Section المطابق لصورتك الثانية من الأسفل */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden bg-sand/30 border border-line">
          <div className="relative aspect-[4/5] md:aspect-auto w-full min-h-[400px]">
            <img
              src={px(20231996, 1000, 1200)}
              alt="The OC Standard"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-16 bg-[#eae7df]">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted">
              The OC Standard
            </p>
            <h2 className="font-display text-3xl md:text-5xl mt-2 leading-tight">
              Made to outlast <br />
              <span className="italic font-serif">the season.</span>
            </h2>

            <div className="mt-10 space-y-8 border-t border-line/60 pt-8">
              {STANDARDS.map((s) => (
                <div key={s.title} className="space-y-1.5">
                  <h3 className="font-medium text-sm text-ink">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-muted max-w-md">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. New Arrivals Section المطابق لصورتك الثالثة */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted">
              Just Landed
            </p>
            <h2 className="font-display text-3xl md:text-4xl mt-1">New arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 hover:text-muted flex items-center gap-1"
          >
            View All <IconArrow className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* 5. Newsletter Section المطابق لصورتك الرابعة */}
      <Newsletter />
    </main>
  );
}
