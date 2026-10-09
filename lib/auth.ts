import "server-only";
import { redirect } from "next/navigation";
import { site } from "./site";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import { getOwnerSessionFromCookie } from "./session";

export interface OwnerUser {
  id: string;
  email: string;
}

export async function getAuthenticatedOwner(): Promise<OwnerUser | null> {
  // 1. Check secure first-party owner cookie (immune to Instagram webview/third-party cookie blocking)
  try {
    const session = await getOwnerSessionFromCookie();
    if (session && session.email.toLowerCase() === site.email.toLowerCase()) {
      return {
        id: session.id,
        email: site.email,
      };
    }
  } catch (err) {
    console.warn("Cookie auth error:", err);
  }

  // 2. Check Supabase session
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && error.name !== "AuthSessionMissingError") {
      return null;
    }
    if (!user) {
      return null;
    }
    if (user.email?.toLowerCase() !== site.email.toLowerCase()) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || site.email,
    };
  } catch {
    return null;
  }
}

export async function requireOwner(): Promise<OwnerUser> {
  const user = await getAuthenticatedOwner();
  if (!user) {
    redirect("/login");
  }
  return user;
}
