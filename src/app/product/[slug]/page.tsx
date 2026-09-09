"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

interface Props {
  params: Promise<{ slug: string }>;
}

function parseProductPrice(product: any): number {
  if (typeof product.price === "number") return product.price;
  if (typeof product.price === "string" && !isNaN(parseFloat(product.price))) {
    return parseFloat(product.price);
  }
  if (product.price?.value) return parseFloat(product.price.value);
  if (product.price_amount) return parseFloat(product.price_amount);
  if (product.original_price) return parseFloat(product.original_price);
  if (product.sale_price) return parseFloat(product.sale_price);
  
  if (typeof product.description === "string") {
    const match = product.description.match(/\$(\d+(\.\d+)?)/);
    if (match) return parseFloat(match[1]);
  }
  
  return 0;
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProducts();
        const productsList = Array.isArray(data) ? data : data?.products || [];
        
        const target = String(resolvedParams.slug || "").toLowerCase();
        const found = productsList.find((p: any) => {
          const pSlug = String(p.slug || "").toLowerCase();
          const pHandle = String(p.handle || "").toLowerCase();
          const pId = String(p.id || "").toLowerCase();

          return pSlug === target || pHandle === target || pId === target;
        });

        setProduct(found || null);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-sm text-taupe">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-sm text-taupe">
        Product not found.
      </div>
    );
  }

  const realPrice = parseProductPrice(product);

  const imageUrl =
    product.image ||
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
    product.featuredImage?.url ||
    "";

  const handleAddToCart = () => {
    addItem({
      id: product.id || product.handle || resolvedParams.slug,
      title: product.title || product.name || "Product",
      price: realPrice,
      image: imageUrl,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
          <p className="text-2xl font-semibold text-ink">${realPrice.toFixed(2)}</p>

          <p className="text-xs text-taupe leading-relaxed border-t border-b border-sand/40 py-4">
            {product.description || "High quality luxury apparel crafted with premium materials."}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-ink text-white font-medium hover:bg-ink/90 transition active:scale-[0.99]"
          >
            {added ? "Added to Bag ✓" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
