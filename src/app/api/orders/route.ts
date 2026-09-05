import { NextRequest, NextResponse } from "next/server";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";

interface CheckoutItem {
  productId: number;
  size: string;
  color: string;
  qty: number;
}

export async function GET() {
  const sid = await getSessionId(false);
  if (!sid) return NextResponse.json({ orders: [] });

  const mine = await db
    .select()
    .from(orders)
    .where(eq(orders.sessionId, sid))
    .orderBy(desc(orders.createdAt));

  if (mine.length === 0) return NextResponse.json({ orders: [] });

  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, mine.map((o) => o.id)));

  const grouped = new Map<number, typeof items>();
  for (const it of items) {
    const arr = grouped.get(it.orderId) ?? [];
    arr.push(it);
    grouped.set(it.orderId, arr);
  }

  const result = mine.map((o) => ({ ...o, items: grouped.get(o.id) ?? [] }));
  return NextResponse.json({ orders: result });
}

export async function POST(req: NextRequest) {
  const sid = await getSessionId(true);
  if (!sid)
    return NextResponse.json({ error: "Session error" }, { status: 500 });

  let body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    items?: CheckoutItem[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const required = [
    body.email,
    body.firstName,
    body.lastName,
    body.address,
    body.city,
    body.postalCode,
    body.country,
  ];
  if (required.some((v) => !v || typeof v !== "string" || !v.trim()))
    return NextResponse.json(
      { error: "Missing shipping details" },
      { status: 400 }
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email!))
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (!Array.isArray(body.items) || body.items.length === 0)
    return NextResponse.json({ error: "Bag is empty" }, { status: 400 });

  const ids = body.items.map((i) => i.productId);
  const prods = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(prods.map((p) => [p.id, p]));

  for (const item of body.items) {
    const p = byId.get(item.productId);
    if (!p)
      return NextResponse.json(
        { error: "A piece in your bag is no longer available" },
        { status: 409 }
      );
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 9)
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    if (p.stock < item.qty)
      return NextResponse.json(
        { error: `Only ${p.stock} left of ${p.name}` },
        { status: 409 }
      );
  }

  const subtotal = body.items.reduce(
    (s, i) => s + byId.get(i.productId)!.priceCents * i.qty,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const orderNumber = `OC-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.floor(
    Math.random() * 36 * 36
  )
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      sessionId: sid,
      email: body.email!.trim(),
      firstName: body.firstName!.trim(),
      lastName: body.lastName!.trim(),
      address: body.address!.trim(),
      city: body.city!.trim(),
      postalCode: body.postalCode!.trim(),
      country: body.country!.trim(),
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: total,
    })
    .returning();

  await db.insert(orderItems).values(
    body.items.map((i) => {
      const p = byId.get(i.productId)!;
      return {
        orderId: order.id,
        productId: p.id,
        name: p.name,
        image: p.images[0],
        priceCents: p.priceCents,
        size: i.size,
        color: i.color,
        qty: i.qty,
      };
    })
  );

  // decrement stock
  for (const i of body.items) {
    await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${i.qty}` })
      .where(eq(products.id, i.productId));
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: order.orderNumber,
    totalCents: order.totalCents,
    email: order.email,
  });
}
