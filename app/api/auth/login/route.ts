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

    // 1. Try exact password as typed
    let authResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. If it failed and password has extra whitespace (common on mobile auto-correct), try trimmed
    if (authResult.error && password !== password.trim()) {
      const trimmedResult = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });
      if (!trimmedResult.error && trimmedResult.data.user) {
        authResult = trimmedResult;
      }
    }

    // 3. If still failed, try toggling first letter casing (Majid... vs majid...)
    if (authResult.error && password.length > 0) {
      const firstChar = password.charAt(0);
      const flipped =
        firstChar === firstChar.toUpperCase()
          ? firstChar.toLowerCase() + password.slice(1).trim()
          : firstChar.toUpperCase() + password.slice(1).trim();

      const altResult = await supabase.auth.signInWithPassword({
        email,
        password: flipped,
      });
      if (!altResult.error && altResult.data.user) {
        authResult = altResult;
      }
    }

    const { data, error } = authResult;

    if (error || !data.user) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password. Please verify spelling or use the Set / Reset Password tab.",
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
