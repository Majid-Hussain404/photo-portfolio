import "server-only";
import { redirect } from "next/navigation";
import { site } from "./site";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export async function getAuthenticatedOwner() {
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

    return user;
  } catch {
    return null;
  }
}

export async function requireOwner() {
  const user = await getAuthenticatedOwner();
  if (!user) {
    redirect("/login");
  }
  return user;
}
