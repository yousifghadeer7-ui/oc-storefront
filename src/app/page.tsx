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
  // جلب المنتجات المباشرة من متجر شوبي فاي
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* 1. قسم الواجهة الفخمة الأصلية (Hero Banner) */}
      <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-ink text-paper">
        <img
          src={px(20231996, 1800, 1000)}
          alt="OC Studio Coat"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full">
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-sand mb-2">
            Autumn / Winter 2026
          </p>
          <h1 className="font-display text-4xl md:text-6xl max-w-xl font-light leading-tight mb-6">
            Considered Clothing Made To Outlast
          </h1>
          <div>
            <Link
              href="/shop"
              className="inline-block bg-paper text-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-sand transition duration-300"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 2. أقسام التصفح المجهزة */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted">
              Categories
            </p>
            <h2 className="font-display text-2xl md:text-3xl mt-1">Explore Collections</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition"
          >
            All Pieces ({products.length})
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="font-display text-lg">{t.label}</span>
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. منتجات شوبي فاي الحقيقية */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex items-end justify-between border-b border-line pb-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted">
              Selection
            </p>
            <h2 className="font-display text-2xl md:text-3xl mt-1">New Arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition"
          >
            View Shop
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {featured.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. معايير البراند */}
      <section className="border-t border-line bg-sand/10 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {STANDARDS.map(([title, desc]) => (
              <div key={title} className="space-y-3">
                <h3 className="font-display text-xl">{title}</h3>
                <p className="text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. النشرة البريدية */}
      <Newsletter />
    </main>
  );
}
