import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getAuthenticatedOwner } from "../../../../lib/auth";
import type { Photo } from "../../../../lib/photos";

const photosFilePath = path.join(process.cwd(), "lib", "photos.generated.json");

function readPhotos(): Photo[] {
  try {
    if (!fs.existsSync(photosFilePath)) return [];
    const raw = fs.readFileSync(photosFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read photos file:", err);
    return [];
  }
}

function writePhotos(photos: Photo[]) {
  fs.writeFileSync(photosFilePath, JSON.stringify(photos, null, 2), "utf8");
}

export async function GET() {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = readPhotos();
  return NextResponse.json({ photos: list });
}

export async function PATCH(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, published, category } = body;

    if (!id) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    const list = readPhotos();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (typeof title === "string" && title.trim()) {
      list[index].title = title.trim();
    }
    if (typeof published === "boolean") {
      list[index].published = published;
    }
    if (typeof category === "string" && category.trim()) {
      list[index].category = category.trim();
    }

    writePhotos(list);
    return NextResponse.json({ success: true, photo: list[index] });
  } catch (err) {
    console.error("Failed to update photo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    const list = readPhotos();
    const photo = list.find((p) => p.id === id);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Try deleting physical file if it starts with /photos/
    if (photo.src.startsWith("/photos/")) {
      const decoded = decodeURI(photo.src.replace(/^\/photos\//, ""));
      const filePath = path.join(process.cwd(), "public", "photos", decoded);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn("Could not delete physical file:", unlinkErr);
        }
      }
    }

    const updated = list.filter((p) => p.id !== id);
    writePhotos(updated);

    return NextResponse.json({ success: true, removedId: id });
  } catch (err) {
    console.error("Failed to delete photo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
