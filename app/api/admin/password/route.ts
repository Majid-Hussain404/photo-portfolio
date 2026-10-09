import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedOwner } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { newPassword } = await request.json();

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wpkerstuzvbtrqsjklpq.supabase.co";
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Vyc3R1enZidHJxc2prbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1MzkwMiwiZXhwIjoyMTA3MDI5OTAyfQ.7JdOHUW7PwLmpsky97Iu1jn6dLaXuu6ZPA_aiqSEcdY";

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(owner.id, {
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err: unknown) {
    console.error("Password change error:", err);
    const msg = err instanceof Error ? err.message : "Failed to change password.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
