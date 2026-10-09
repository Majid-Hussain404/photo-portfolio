import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedOwner } from "../../../../../lib/auth";
import { createSignedPhotoUploadUrl } from "../../../../../lib/supabase-photos";

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const category = body.category || "landscape";
    const filename = body.filename || "photo.jpg";

    const uploadInfo = await createSignedPhotoUploadUrl(category, filename);

    return NextResponse.json({
      success: true,
      ...uploadInfo,
    });
  } catch (err: unknown) {
    console.error("Signed URL creation error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to create upload URL";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
