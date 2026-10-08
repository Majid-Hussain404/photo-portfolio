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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Enter the owner email and private setup code." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    !("setupCode" in body) ||
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
      { message: "Only the configured owner email can be invited." },
      { status: 403 }
    );
  }

  const setupCode = process.env.OWNER_SETUP_CODE;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!setupCode || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { message: "Owner setup is not configured on the server yet." },
      { status: 503 }
    );
  }

  if (!matchesSetupCode(body.setupCode, setupCode)) {
    return NextResponse.json(
      { message: "The private setup code is incorrect." },
      { status: 403 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: new URL(
      "/auth/callback?next=%2Flogin%2Freset",
      request.nextUrl.origin
    ).toString(),
  });

  if (error) {
    console.error("Owner invitation failed:", error);
    return NextResponse.json(
      {
        message:
          "The owner invitation could not be sent. Check the Supabase email provider and whether this account already exists.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    message: `An invitation was sent to ${site.email}. Open the email link to set your owner password.`,
  });
}
