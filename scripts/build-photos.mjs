// Reads the folders in public/photos/ and builds the photo list for the website.
// Folder name = category. File name = photo title.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "photos");
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
    const base = path.basename(file, path.extname(file));
    const words = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    const title = words.charAt(0).toUpperCase() + words.slice(1);
    photos.push({
      src: `/photos/${slug}/${encodeURI(file)}`,
      title,
      category: slug,
    });
  }
}

fs.writeFileSync(
  path.join(process.cwd(), "lib", "photos.generated.json"),
  JSON.stringify(photos, null, 2)
);
console.log(`Found ${photos.length} photos in ${categories.length} categories.`);