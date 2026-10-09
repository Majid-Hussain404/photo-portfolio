import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { site } from "../../../../lib/site";

const MAX_REQUEST_BYTES = 4096;

function matchesSetupCode(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { message: "The owner setup request is too large." },
      { status: 413 }
    );
  }

  let body: { email?: string; setupCode?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.email !== "string" ||
    typeof body.setupCode !== "string" ||
    body.email.length > 320 ||
    body.setupCode.length > 512
  ) {
    return NextResponse.json(
      { message: "Enter the owner email and private setup code." },
      { status: 400 }
    );
  }

  const email = body.email.trim().toLowerCase();
  if (email !== site.email.toLowerCase()) {
    return NextResponse.json(
      { message: `Only the configured owner email (${site.email}) is authorized.` },
      { status: 403 }
    );
  }

  const setupCode = process.env.OWNER_SETUP_CODE || "MHN-Owner-Setup-2026-K7vP9xQ4Lm82Zr";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wpkerstuzvbtrqsjklpq.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Vyc3R1enZidHJxc2prbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1MzkwMiwiZXhwIjoyMTA3MDI5OTAyfQ.7JdOHUW7PwLmpsky97Iu1jn6dLaXuu6ZPA_aiqSEcdY";

  if (!matchesSetupCode(body.setupCode, setupCode)) {
    return NextResponse.json(
      { message: "The private setup code is incorrect." },
      { status: 403 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // If a direct newPassword was provided, set it immediately
  if (body.newPassword && typeof body.newPassword === "string") {
    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    try {
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      const existingUser = usersData.users.find(
        (u) => u.email?.toLowerCase() === email
      );

      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: body.newPassword, email_confirm: true }
        );
        if (updateError) throw updateError;
      } else {
        const { error: createError } = await supabase.auth.admin.createUser({
          email,
          password: body.newPassword,
          email_confirm: true,
        });
        if (createError) throw createError;
      }

      return NextResponse.json({
        message: "Owner password successfully configured! You can now log in below.",
        success: true,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Password setup failed.";
      return NextResponse.json(
        { message: `Could not set password: ${errMsg}` },
        { status: 500 }
      );
    }
  }

  // Otherwise fallback to sending invitation or reset email
  const redirectTo = new URL(
    "/auth/callback?next=%2Flogin%2Freset",
    request.nextUrl.origin
  ).toString();

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  if (error) {
    if (error.code === "email_exists") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo }
      );
      if (resetError) {
        return NextResponse.json(
          { message: "The owner password setup email could not be sent. You can set your password directly with the setup code." },
          { status: 502 }
        );
      }

      return NextResponse.json({
        message: `An owner account already exists. A password setup link was sent to ${site.email}.`,
      });
    }

    return NextResponse.json(
      {
        message: "The owner invitation could not be sent. You can set your password directly with the setup code.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    message: `An invitation was sent to ${site.email}. Open the email link to set your owner password.`,
  });
}
