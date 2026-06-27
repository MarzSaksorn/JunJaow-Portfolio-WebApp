import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_KEY = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 4; // 4 hours

function getSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret-do-not-use";
}

function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return hmac.digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const payload = JSON.stringify({ role: "admin", ts: Date.now() });
  const signature = signToken(payload);
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;

  cookieStore.set(SESSION_KEY, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_KEY)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expectedSig = signToken(
    Buffer.from(encodedPayload, "base64url").toString("utf-8")
  );

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );
    if (payload.role !== "admin") return false;

    const age = Date.now() - payload.ts;
    if (age > COOKIE_MAX_AGE * 1000) return false;

    return true;
  } catch {
    return false;
  }
}
