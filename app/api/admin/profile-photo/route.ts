import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedOwner } from "../../../../lib/auth";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import fs from "node:fs";
import type { SiteConfig } from "../../../../lib/site";
import rawLocalSettings from "../../../../lib/site-settings.json";

const DEFAULT_URL = "https://wpkerstuzvbtrqsjklpq.supabase.co";
const DEFAULT_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Vyc3R1enZidHJxc2prbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1MzkwMiwiZXhwIjoyMTA3MDI5OTAyfQ.7JdOHUW7PwLmpsky97Iu1jn6dLaXuu6ZPA_aiqSEcdY";
const BUCKET = "portfolio";
const SETTINGS_KEY = "metadata/site-settings.json";
const settingsFilePath = path.join(process.cwd(), "lib", "site-settings.json");

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    let finalPhotoUrl = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = path.extname(file.name) || ".jpg";
      const filePath = `profile/majid_avatar_${Date.now()}${rawExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload to Supabase");
      }

      const { data: pubData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      finalPhotoUrl = pubData.publicUrl;
    } else {
      const body = await request.json();
      finalPhotoUrl = body.photoUrl;
      if (!finalPhotoUrl) {
        return NextResponse.json(
          { error: "photoUrl is required" },
          { status: 400 }
        );
      }
    }

    // Load existing settings
    let current: Partial<SiteConfig> = {};
    try {
      const { data } = await supabase.storage
        .from(BUCKET)
        .download(SETTINGS_KEY);
      if (data) {
        current = JSON.parse(await data.text());
      }
    } catch {}

    if (!current.name && fs.existsSync(settingsFilePath)) {
      try {
        current = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
      } catch {}
    }

    const updated: SiteConfig = {
      ...(rawLocalSettings as SiteConfig),
      ...current,
      photo: finalPhotoUrl,
    };

    // Save to Supabase Storage
    const json = JSON.stringify(updated, null, 2);
    await supabase.storage.from(BUCKET).upload(SETTINGS_KEY, json, {
      contentType: "application/json",
      upsert: true,
    });

    // Save locally if writable
    try {
      if (fs.existsSync(settingsFilePath)) {
        fs.writeFileSync(settingsFilePath, json, "utf8");
      }
    } catch {}

    return NextResponse.json({
      success: true,
      photoUrl: finalPhotoUrl,
      message: "Profile photo updated successfully!",
    });
  } catch (err: unknown) {
    console.error("Profile photo upload error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to update profile photo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
