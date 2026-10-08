import "server-only";
import { redirect } from "next/navigation";
import { site } from "./site";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export async function requireOwner() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }
  if (!user) {
    redirect("/login");
  }
  if (user.email?.toLowerCase() !== site.email.toLowerCase()) {
    redirect("/login");
  }

  return user;
}
