import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedOwner } from "../../../../lib/auth";
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

async function loadSettings(): Promise<Partial<SiteConfig>> {
  try {
    const supabase = getAdminClient();
    const { data } = await supabase.storage.from(BUCKET).download(SETTINGS_KEY);
    if (data) {
      const text = await data.text();
      return JSON.parse(text);
    }
  } catch {}

  try {
    if (fs.existsSync(settingsFilePath)) {
      return JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
    }
  } catch {}

  return rawLocalSettings as Partial<SiteConfig>;
}

async function persistSettings(settings: SiteConfig) {
  const json = JSON.stringify(settings, null, 2);

  // 1. Supabase Storage cloud persistence
  try {
    const supabase = getAdminClient();
    await supabase.storage.from(BUCKET).upload(SETTINGS_KEY, json, {
      contentType: "application/json",
      upsert: true,
    });
  } catch (e) {
    console.warn("Could not save settings to cloud storage:", e);
  }

  // 2. Local file sync (for development)
  try {
    if (fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, json, "utf8");
    }
  } catch {}
}

export async function GET() {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await loadSettings();
  return NextResponse.json({ settings: data });
}

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: Partial<SiteConfig> = await request.json();
    const current = await loadSettings();

    const updated: SiteConfig = {
      name: body.name ?? current.name ?? "Majid Hussain",
      brand: body.brand ?? current.brand ?? "Frames by Majid",
      title: body.title ?? current.title ?? "Photographer",
      tagline:
        body.tagline ?? current.tagline ?? "Capturing moments that last forever.",
      quote:
        body.quote ??
        current.quote ??
        "A photograph is a way of holding a feeling still.",
      email: body.email ?? current.email ?? "majidhussainmir239@gmail.com",
      phone: body.phone ?? current.phone ?? "",
      location: body.location ?? current.location ?? "",
      experience: body.experience ?? current.experience ?? "",
      instagram: body.instagram ?? current.instagram ?? "",
      facebook: body.facebook ?? current.facebook ?? "",
      youtube: body.youtube ?? current.youtube ?? "",
      photo: body.photo ?? current.photo ?? "",
      bio: Array.isArray(body.bio) ? body.bio : current.bio ?? [],
    };

    await persistSettings(updated);

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    console.error("Failed to save settings:", err);
    const msg = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
