import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const otpType = request.nextUrl.searchParams.get("type");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const next = requestedNext === "/login/reset" ? "/login/reset" : "/admin";

  if (!code && (!tokenHash || !isEmailOtpType(otpType))) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  const supabase = await createClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: otpType!,
      });

  if (error) {
    console.error("Supabase auth callback failed:", error);
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.redirect(new URL(next, request.nextUrl));
}

function isEmailOtpType(
  type: string | null
): type is "invite" | "recovery" | "signup" | "email" | "magiclink" | "email_change" {
  return (
    type === "invite" ||
    type === "recovery" ||
    type === "signup" ||
    type === "email" ||
    type === "magiclink" ||
    type === "email_change"
  );
}
