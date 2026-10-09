import { compressImageForWeb } from "./image-compress";

export interface UploadOptions {
  files: File[];
  category: string;
  title?: string;
  onProgress?: (status: string) => void;
}

export async function uploadPhotosDirect({
  files,
  category,
  title,
  onProgress,
}: UploadOptions): Promise<{ success: boolean; count: number }> {
  if (!files || files.length === 0) {
    throw new Error("Please select at least one photograph to upload.");
  }

  let uploaded = 0;

  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i];
    if (!rawFile.type.startsWith("image/")) continue;

    const currentNum = i + 1;
    const total = files.length;

    onProgress?.(`Optimizing photo ${currentNum} of ${total}...`);
    const optimized = await compressImageForWeb(rawFile);

    onProgress?.(`Uploading photo ${currentNum} of ${total}...`);

    let uploadedDirectly = false;
    let finalSrc = "";

    // 1. Try direct upload to Supabase Storage via signed URL (bypasses Vercel's 4.5MB request limit)
    try {
      const urlRes = await fetch("/api/admin/photos/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category,
          filename: optimized.name,
        }),
      });

      if (urlRes.ok) {
        const urlData = await urlRes.json();
        if (urlData.signedUrl && urlData.publicUrl) {
          const directRes = await fetch(urlData.signedUrl, {
            method: "PUT",
            headers: {
              "Content-Type": optimized.type || "image/jpeg",
            },
            body: optimized,
          });

          if (directRes.ok) {
            uploadedDirectly = true;
            finalSrc = urlData.publicUrl;

            // Register photo metadata
            const cleanName = rawFile.name.replace(/\.[^/.]+$/, "");
            const photoTitle =
              files.length === 1 && title && title.trim()
                ? title.trim()
                : cleanName
                ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
                : "Photograph";

            const metaRes = await fetch("/api/admin/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                src: finalSrc,
                title: photoTitle,
                category,
              }),
            });

            if (!metaRes.ok) {
              const text = await metaRes.text();
              throw new Error(`Failed to save photo record: ${text}`);
            }

            uploaded++;
          }
        }
      }
    } catch (directErr) {
      console.warn("Direct upload fallback to server:", directErr);
    }

    // 2. Fallback to server route if direct upload failed
    if (!uploadedDirectly) {
      const formData = new FormData();
      formData.append("category", category);
      if (title && title.trim()) {
        formData.append("title", title.trim());
      }
      formData.append("files", optimized);

      const serverRes = await fetch("/api/admin/photos/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const resText = await serverRes.text();
      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch {
        if (serverRes.status === 413) {
          throw new Error(
            "Photograph file size exceeds allowed limits. Try selecting fewer photos or smaller files."
          );
        }
        throw new Error(
          resText || `Upload failed with status ${serverRes.status}`
        );
      }

      if (!serverRes.ok) {
        throw new Error(resJson.error || "Upload failed");
      }

      uploaded++;
    }
  }

  return { success: true, count: uploaded };
}
