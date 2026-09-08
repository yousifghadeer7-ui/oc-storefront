import { db } from "@/db";
import { products } from "@/db/schema";

export async function GET() {
  try {
    await db.select().from(products).limit(1);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
