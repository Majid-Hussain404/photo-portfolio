"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { clearOwnerCookie } from "../../lib/session";

export async function signOut() {
  try {
    await clearOwnerCookie();
  } catch (err) {
    console.warn("Failed to clear owner cookie:", err);
  }

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Failed to sign out supabase session:", err);
  }

  redirect("/login");
}
