import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getAuthenticatedOwner } from "../../../../lib/auth";
import type { SiteConfig } from "../../../../lib/site";

const settingsFilePath = path.join(process.cwd(), "lib", "site-settings.json");

export async function GET() {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = fs.readFileSync(settingsFilePath, "utf8");
    const data = JSON.parse(raw);
    return NextResponse.json({ settings: data });
  } catch (err) {
    console.error("Failed to read settings:", err);
    return NextResponse.json({ error: "Could not read settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: Partial<SiteConfig> = await request.json();

    let current: Partial<SiteConfig> = {};
    if (fs.existsSync(settingsFilePath)) {
      try {
        current = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
      } catch {}
    }

    const updated: SiteConfig = {
      name: body.name ?? current.name ?? "Majid Hussain",
      brand: body.brand ?? current.brand ?? "Frames by Majid",
      title: body.title ?? current.title ?? "Photographer",
      tagline: body.tagline ?? current.tagline ?? "Capturing moments that last forever.",
      quote: body.quote ?? current.quote ?? "A photograph is a way of holding a feeling still.",
      email: body.email ?? current.email ?? "majidhussainmir239@gmail.com",
      phone: body.phone ?? current.phone ?? "",
      location: body.location ?? current.location ?? "",
      experience: body.experience ?? current.experience ?? "",
      instagram: body.instagram ?? current.instagram ?? "",
      facebook: body.facebook ?? current.facebook ?? "",
      youtube: body.youtube ?? current.youtube ?? "",
      bio: Array.isArray(body.bio) ? body.bio : (current.bio ?? []),
    };

    fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2), "utf8");

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    console.error("Failed to save settings:", err);
    const msg = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
