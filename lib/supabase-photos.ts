import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import fallbackPhotos from "./photos.generated.json";
import type { Photo } from "./photos";

const DEFAULT_URL = "https://wpkerstuzvbtrqsjklpq.supabase.co";
const DEFAULT_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Vyc3R1enZidHJxc2prbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1MzkwMiwiZXhwIjoyMTA3MDI5OTAyfQ.7JdOHUW7PwLmpsky97Iu1jn6dLaXuu6ZPA_aiqSEcdY";
const BUCKET = "portfolio";
const METADATA_PATH = "metadata/photos.json";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getPhotosList(): Promise<Photo[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(METADATA_PATH);

    if (error || !data) {
      return (fallbackPhotos as Photo[]) || [];
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : (fallbackPhotos as Photo[]) || [];
  } catch (err) {
    console.warn("Storage fetch fallback to local photos:", err);
    return (fallbackPhotos as Photo[]) || [];
  }
}

export async function savePhotosList(list: Photo[]): Promise<boolean> {
  try {
    const supabase = getAdminClient();
    const json = JSON.stringify(list, null, 2);

    const { error } = await supabase.storage.from(BUCKET).upload(METADATA_PATH, json, {
      contentType: "application/json",
      upsert: true,
    });

    if (error) {
      console.error("Failed to save photos to Supabase Storage:", error);
    }

    // Also sync local file if filesystem is writable (e.g. dev)
    try {
      const localFile = path.join(process.cwd(), "lib", "photos.generated.json");
      if (fs.existsSync(localFile)) {
        fs.writeFileSync(localFile, json, "utf8");
      }
    } catch {}

    return !error;
  } catch (err) {
    console.error("savePhotosList error:", err);
    return false;
  }
}

export async function createSignedPhotoUploadUrl(
  category: string,
  fileName: string
) {
  const supabase = getAdminClient();
  const cleanExt = path.extname(fileName) || ".jpg";
  const rawBase = path.basename(fileName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${rawBase}_${Date.now()}${cleanExt}`;
  const filePath = `photos/${category}/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(filePath);

  if (error || !data) {
    throw new Error(error?.message || "Failed to create signed upload URL");
  }

  const { data: pubData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: filePath,
    publicUrl: pubData.publicUrl,
    fileName: uniqueName,
  };
}

export async function uploadPhotoBufferToStorage(
  category: string,
  fileName: string,
  buffer: Buffer,
  contentType: string = "image/jpeg"
): Promise<string> {
  const supabase = getAdminClient();
  const cleanExt = path.extname(fileName) || ".jpg";
  const rawBase = path.basename(fileName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${rawBase}_${Date.now()}${cleanExt}`;
  const filePath = `photos/${category}/${uniqueName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload buffer to Supabase storage");
  }

  const { data: pubData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return pubData.publicUrl;
}
