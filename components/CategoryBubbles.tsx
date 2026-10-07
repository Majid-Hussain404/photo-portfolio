"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "../lib/categories";
import { photos } from "../lib/photos";
import CategoryCard from "./CategoryCard";

export default function CategoryBubbles() {
  const router = useRouter();
  const [popping, setPopping] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Every 3.5 seconds, each card moves on to its next photo
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3500);
    return () => clearInterval(id);
  }, []);

  function handleClick(slug: string) {
    if (popping) return;
    setPopping(slug);
    setTimeout(() => router.push(`/portfolio/${slug}`), 900);
  }

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          style={{ animation: "float 9s ease-in-out infinite" }}
        />
        <span
          className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl"
          style={{ animation: "float 11s ease-in-out 1s infinite" }}
        />
        <span
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
          style={{ animation: "float 13s ease-in-out 2s infinite" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl columns-1 gap-8 sm:columns-2 lg:columns-3">
        {categories.map((cat, i) => {
          const covers = photos
            .filter((p) => p.category === cat.slug)
            .slice(0, 5);
          const current = covers.length ? (tick + i) % covers.length : -1;

          return (
            <CategoryCard
              key={cat.slug}
              cat={cat}
              covers={covers}
              current={current}
              index={i}
              popping={popping === cat.slug}
              onClick={() => handleClick(cat.slug)}
            />
          );
        })}
      </div>
    </section>
  );
}