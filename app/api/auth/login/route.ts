import { NextRequest, NextResponse } from "next/server";
import { site } from "../../../../lib/site";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (email !== site.email.toLowerCase()) {
      return NextResponse.json(
        {
          error:
            "Access Denied: Only the portfolio owner is authorized to log in.",
        },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password. You can configure your password with the setup code.",
        },
        { status: 401 }
      );
    }

    if (data.user.email?.toLowerCase() !== site.email.toLowerCase()) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Access Denied: Unauthorized account." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: unknown) {
    console.error("Server login error:", err);
    const msg = err instanceof Error ? err.message : "Login failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
