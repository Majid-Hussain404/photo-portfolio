import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { site } from "../../../../lib/site";
import { createClient as createServerSupabase } from "../../../../lib/supabase/server";
import { createSessionToken } from "../../../../lib/session";

const DEFAULT_URL = "https://wpkerstuzvbtrqsjklpq.supabase.co";
const DEFAULT_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Vyc3R1enZidHJxc2prbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1MzkwMiwiZXhwIjoyMTA3MDI5OTAyfQ.7JdOHUW7PwLmpsky97Iu1jn6dLaXuu6ZPA_aiqSEcdY";
const DEFAULT_SETUP_CODE = "MHN-Owner-Setup-2026-K7vP9xQ4Lm82Zr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const rawPassword = body.password as string;

    if (!email || !rawPassword) {
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;
    const setupCode = process.env.OWNER_SETUP_CODE || DEFAULT_SETUP_CODE;

    const supabaseAdmin = createSupabaseAdminClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const passwordsToTry = [rawPassword, rawPassword.trim()];
    if (rawPassword.length > 0) {
      const first = rawPassword.charAt(0);
      const flipped =
        first === first.toUpperCase()
          ? first.toLowerCase() + rawPassword.slice(1).trim()
          : first.toUpperCase() + rawPassword.slice(1).trim();
      passwordsToTry.push(flipped);
    }

    let authenticatedSession = null;

    // 1. Try sign-in with admin credentials across password variations
    for (const p of passwordsToTry) {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: p,
      });
      if (!error && data.session) {
        authenticatedSession = data.session;
        break;
      }
    }

    // 2. Fallback: Check if user entered master setup code as password
    if (
      !authenticatedSession &&
      (rawPassword.trim() === setupCode || rawPassword === setupCode)
    ) {
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const ownerUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase() === email
      );
      if (ownerUser) {
        await supabaseAdmin.auth.admin.updateUserById(ownerUser.id, {
          password: "Majid@33hussain",
          email_confirm: true,
        });
        const { data: loginData } =
          await supabaseAdmin.auth.signInWithPassword({
            email,
            password: "Majid@33hussain",
          });
        if (loginData?.session) {
          authenticatedSession = loginData.session;
        }
      }
    }

    if (!authenticatedSession) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password. Please verify spelling or use the Set / Reset Password tab.",
        },
        { status: 401 }
      );
    }

    // 3. Persist session into Next.js cookies via server Supabase client
    try {
      const serverSupabase = await createServerSupabase();
      await serverSupabase.auth.setSession({
        access_token: authenticatedSession.access_token,
        refresh_token: authenticatedSession.refresh_token,
      });
    } catch (cookieErr) {
      console.warn("Server cookie set warning:", cookieErr);
    }

    // 4. Construct response and attach first-party owner cookie (works on Instagram webview)
    const sessionToken = createSessionToken(email, authenticatedSession.user.id);
    const response = NextResponse.json({
      success: true,
      token: sessionToken,
      session: {
        access_token: authenticatedSession.access_token,
        refresh_token: authenticatedSession.refresh_token,
      },
      user: authenticatedSession.user,
    });

    // Copy any Supabase auth cookies set into Next.js cookie store into response
    try {
      const { cookies: getCookies } = await import("next/headers");
      const cookieStore = await getCookies();
      for (const c of cookieStore.getAll()) {
        response.cookies.set(c.name, c.value, {
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    } catch (e) {
      console.warn("Could not copy server cookies:", e);
    }

    // Set owner_auth_session cookie (30 days, Lax, root path)
    response.cookies.set("owner_auth_session", sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: unknown) {
    console.error("Server login error:", err);
    const msg = err instanceof Error ? err.message : "Login failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
