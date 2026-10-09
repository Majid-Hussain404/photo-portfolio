// Reads the folders in public/photos/ and builds the photo list for the website.
// Folder name = category. File name = photo title.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "photos");
const targetFile = path.join(process.cwd(), "lib", "photos.generated.json");
const categories = [
  "landscape",
  "sunset",
  "nature",
  "wildlife",
  "portrait",
  "street",
  "architecture",
  "travel",
  "night",
];
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

let existingMap = new Map();
if (fs.existsSync(targetFile)) {
  try {
    const existing = JSON.parse(fs.readFileSync(targetFile, "utf8"));
    if (Array.isArray(existing)) {
      for (const item of existing) {
        if (item.src) existingMap.set(item.src, item);
      }
    }
  } catch {
    // ignore parse error
  }
}

const photos = [];

for (const slug of categories) {
  const dir = path.join(root, slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    continue;
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => extensions.has(path.extname(f).toLowerCase()))
    .sort();

  for (const file of files) {
    const src = `/photos/${slug}/${encodeURI(file)}`;
    const base = path.basename(file, path.extname(file));
    const words = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    const defaultTitle = words.charAt(0).toUpperCase() + words.slice(1);

    const existingItem = existingMap.get(src);
    photos.push({
      id: existingItem?.id || `ph_${Math.random().toString(36).substring(2, 9)}`,
      src,
      title: existingItem?.title || defaultTitle,
      category: slug,
      published: existingItem?.published !== undefined ? existingItem.published : true,
      date: existingItem?.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    });
  }
}

fs.writeFileSync(targetFile, JSON.stringify(photos, null, 2));
console.log(`Found ${photos.length} photos in ${categories.length} categories.`);