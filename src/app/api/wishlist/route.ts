import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products, wishlists } from "@/db/schema";
import { getSessionId } from "@/lib/session";

export async function GET() {
  const sid = await getSessionId(true);
  if (!sid) return NextResponse.json({ items: [] });

  const rows = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.sessionId, sid))
    .orderBy(desc(wishlists.createdAt));

  if (rows.length === 0) return NextResponse.json({ items: [] });

  const ids = rows.map((r) => r.productId);
  const prods = await db
    .select()
    .from(products)
    .where(inArray(products.id, ids));

  const byId = new Map(prods.map((p) => [p.id, p]));
  const items = ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const sid = await getSessionId(true);
  const productId = Number(req.nextUrl.searchParams.get("productId"));
  if (!sid || !Number.isInteger(productId) || productId <= 0)
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const [prod] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId));
  if (!prod)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db
    .insert(wishlists)
    .values({ sessionId: sid, productId })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const sid = await getSessionId(true);
  const productId = Number(req.nextUrl.searchParams.get("productId"));
  if (!sid || !Number.isInteger(productId) || productId <= 0)
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  await db
    .delete(wishlists)
    .where(and(eq(wishlists.sessionId, sid), eq(wishlists.productId, productId)));

  return NextResponse.json({ ok: true });
}
