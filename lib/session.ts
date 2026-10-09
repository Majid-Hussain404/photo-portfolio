import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { site } from "./site";

const SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.OWNER_SETUP_CODE ||
  "FramesByMajidSecret2026KeyForOwnerAuthToken";
const COOKIE_NAME = "owner_auth_session";

export interface SessionPayload {
  email: string;
  userId: string;
  exp: number;
}

export function createSessionToken(
  email: string,
  userId: string = "5a83c9dc-c534-4fcc-a607-eca108d25e2e"
): string {
  const payload: SessionPayload = {
    email: email.toLowerCase(),
    userId,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(json).digest("base64url");
  return `${json}.${signature}`;
}

export function verifySessionToken(rawToken: string): SessionPayload | null {
  try {
    const token = decodeURIComponent(rawToken);
    const [json, signature] = token.split(".");
    if (!json || !signature) return null;

    const expected = createHmac("sha256", SECRET).update(json).digest("base64url");
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);

    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(json, "base64url").toString("utf8")
    );

    if (Date.now() > payload.exp) {
      return null;
    }

    if (payload.email?.toLowerCase() !== site.email.toLowerCase()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setOwnerCookie(
  email: string,
  userId: string = "5a83c9dc-c534-4fcc-a607-eca108d25e2e"
) {
  const token = createSessionToken(email, userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return token;
}

export async function clearOwnerCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {}
}

export async function getOwnerSessionFromCookie(): Promise<{
  email: string;
  id: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const verified = verifySessionToken(token);
    if (!verified) return null;
    return {
      email: verified.email,
      id: verified.userId || "5a83c9dc-c534-4fcc-a607-eca108d25e2e",
    };
  } catch {
    return null;
  }
}

export async function getOwnerFromCookie(): Promise<string | null> {
  const session = await getOwnerSessionFromCookie();
  return session ? session.email : null;
}
