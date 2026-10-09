import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getAuthenticatedOwner } from "../../../../../lib/auth";
import type { Photo } from "../../../../../lib/photos";

const photosFilePath = path.join(process.cwd(), "lib", "photos.generated.json");

function readPhotos(): Photo[] {
  try {
    if (!fs.existsSync(photosFilePath)) return [];
    const raw = fs.readFileSync(photosFilePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writePhotos(photos: Photo[]) {
  fs.writeFileSync(photosFilePath, JSON.stringify(photos, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const category = (formData.get("category") as string) || "landscape";
    const customTitle = formData.get("title") as string | null;
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided." },
        { status: 400 }
      );
    }

    const targetDir = path.join(process.cwd(), "public", "photos", category);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const currentPhotos = readPhotos();
    const addedPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = path.extname(file.name) || ".jpg";
      const cleanBaseName = path
        .basename(file.name, rawExt)
        .replace(/[^a-zA-Z0-9_-]/g, " ")
        .trim();

      // Formulate unique file name
      const uniqueSuffix = Date.now().toString().slice(-4);
      const fileName = `${cleanBaseName || "photo"}_${uniqueSuffix}${rawExt}`;
      const destPath = path.join(targetDir, fileName);

      fs.writeFileSync(destPath, buffer);

      const title =
        files.length === 1 && customTitle && customTitle.trim()
          ? customTitle.trim()
          : cleanBaseName
          ? cleanBaseName.charAt(0).toUpperCase() + cleanBaseName.slice(1)
          : "Photograph";

      const newPhoto: Photo = {
        id: `ph_${Math.random().toString(36).substring(2, 9)}`,
        src: `/photos/${category}/${encodeURI(fileName)}`,
        title,
        category,
        published: true,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      currentPhotos.unshift(newPhoto);
      addedPhotos.push(newPhoto);
    }

    writePhotos(currentPhotos);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${addedPhotos.length} photograph${
        addedPhotos.length === 1 ? "" : "s"
      }.`,
      addedPhotos,
    });
  } catch (err: unknown) {
    console.error("Photo upload error:", err);
    const msg = err instanceof Error ? err.message : "Failed to upload photos.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
