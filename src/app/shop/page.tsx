// src/app/shop/page.tsx
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>
        Shop All ({products.length})
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((p: any) => (
          <a
            key={p.id}
            href={`/product/${p.slug}`}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              padding: 12,
              textDecoration: "none",
              color: "inherit",
              borderRadius: 8,
            }}
          >
            {p.image ? (
              // استخدمت img بدل next/image حتى ما نعلق على إعدادات الصور
              <img
                src={p.image}
                alt={p.title}
                style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 6 }}
              />
            ) : null}

            <div style={{ marginTop: 10, fontWeight: 700 }}>{p.title}</div>
            <div style={{ opacity: 0.8 }}>{p.price}</div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>{p.category}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
