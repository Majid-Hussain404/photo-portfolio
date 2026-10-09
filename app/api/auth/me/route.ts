import { NextResponse } from "next/server";
import { getAuthenticatedOwner } from "../../../../lib/auth";

export async function GET() {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ authenticated: false, isOwner: false });
  }

  return NextResponse.json({
    authenticated: true,
    isOwner: true,
    email: owner.email,
  });
}
