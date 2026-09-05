import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "oc_sid";

/** Read the anonymous session id; only route handlers may create one. */
export async function getSessionId(create: boolean): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  if (!create) return null;
  const sid = randomUUID();
  store.set(COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return sid;
}
