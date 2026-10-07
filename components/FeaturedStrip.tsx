import Image from "next/image";
import { categories } from "../lib/categories";
import { photos, type Photo } from "../lib/photos";

export default function FeaturedStrip() {
  if (photos.length === 0) return null;

  // Take one photo from each category in turn, so neighbours are different
  const byCategory = categories.map((c) =>
    photos.filter((p) => p.category === c.slug)
  );
  const longest = Math.max(...byCategory.map((list) => list.length));
  const mixed: Photo[] = [];
  for (let i = 0; i < longest; i++) {
    for (const list of byCategory) {
      if (list[i]) mixed.push(list[i]);
    }
  }

  // Repeat if there are only a few photos, then double for a seamless loop
  const base = Array.from(
    { length: Math.max(8, mixed.length) },
    (_, i) => mixed[i % mixed.length]
  );
  const items = [...base, ...base];

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="marquee-track">
        {items.map((photo, i) => (
          <div
            key={i}
            className={`group relative mr-5 h-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 ${
              i % 2 === 0 ? "w-52" : "w-80"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="320px"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm opacity-0 transition group-hover:opacity-100">
              {photo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}