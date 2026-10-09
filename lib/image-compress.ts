/**
 * Client-side photo compression utility for mobile and high-resolution camera images.
 * Reduces 10MB-25MB camera RAW/JPEG images down to crisp ~800KB-1.5MB web photographs,
 * preventing cellular data bloat and HTTP 413 (Request Entity Too Large) errors.
 */

export async function compressImageForWeb(file: File): Promise<File> {
  // If not an image or is SVG/GIF, return original
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If already under 1.2 MB, return as-is
  if (file.size <= 1.2 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const MAX_DIM = 2560; // Max width/height for 4K/retina displays
          let { width, height } = img;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Use WebP if supported, fallback to JPEG at 0.86 quality
          const outputType = file.type === "image/png" ? "image/jpeg" : file.type;
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
                return;
              }

              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              const optimizedFile = new File([blob], newFileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(optimizedFile);
            },
            outputType,
            0.86
          );
        } catch (err) {
          console.warn("Canvas compression fallback:", err);
          resolve(file);
        }
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
