import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_KEY = "admin_session";

function getSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret-do-not-use";
}

async function verifyToken(token: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf-8");

  const enc = new TextEncoder();
  const keyData = enc.encode(getSecret());
  const msgData = enc.encode(payloadStr);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = new Uint8Array(
    signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  try {
    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, msgData);
    if (!isValid) return false;

    const payload = JSON.parse(payloadStr);
    if (payload.role !== "admin") return false;
    const age = Date.now() - payload.ts;
    if (age > 60 * 60 * 4 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_KEY)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
