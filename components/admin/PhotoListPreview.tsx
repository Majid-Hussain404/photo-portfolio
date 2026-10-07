"use client";

import Image from "next/image";
import { useState } from "react";
import { categories } from "../../lib/categories";

type Item = {
  id: number;
  title: string;
  category: string;
  published: boolean;
  date: string;
};

// Sample entries only, so you can see how the list will look.
const sample: Item[] = [
  { id: 1, title: "Golden hour over the lake", category: "sunset", published: true, date: "12 Oct 2026" },
  { id: 2, title: "Old bridge at dusk", category: "architecture", published: true, date: "10 Oct 2026" },
  { id: 3, title: "Morning mist in the valley", category: "landscape", published: true, date: "08 Oct 2026" },
  { id: 4, title: "Kingfisher on a branch", category: "wildlife", published: false, date: "05 Oct 2026" },
  { id: 5, title: "Market at sunrise", category: "street", published: true, date: "02 Oct 2026" },
  { id: 6, title: "Stars above the mountains", category: "night", published: false, date: "29 Sep 2026" },
];

export default function PhotoListPreview() {
  const [items, setItems] = useState<Item[]>(sample);
  const [filter, setFilter] = useState("all");

  const posted = items.filter((i) => i.published).length;
  const visible = items.filter((i) => filter === "all" || i.category === filter);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Your photographs</h2>
          <p className="mt-1 text-sm text-white/60">
            {items.length} total · {posted} published · {items.length - posted}{" "}
            hidden (sample data)
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm outline-none"
        >
          <option value="all" className="text-black">
            All categories
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug} className="text-black">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-white/60">No photographs here.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src="/hero.jpg"
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${item.published ? "" : "opacity-40"}`}
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                    item.published
                      ? "bg-emerald-500/90 text-black"
                      : "bg-black/70 text-white"
                  }`}
                >
                  {item.published ? "Published" : "Hidden"}
                </span>
              </div>
              <div className="p-4">
                <p className="truncate font-serif text-lg">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  {categories.find((c) => c.slug === item.category)?.name} ·{" "}
                  {item.date}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      setItems((list) =>
                        list.map((i) =>
                          i.id === item.id ? { ...i, published: !i.published } : i
                        )
                      )
                    }
                    className="rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-widest transition hover:border-accent hover:text-accent"
                  >
                    {item.published ? "Hide" : "Publish"}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}"?`)) {
                        setItems((list) => list.filter((i) => i.id !== item.id));
                      }
                    }}
                    className="rounded-full border border-red-400/50 px-4 py-1 text-xs uppercase tracking-widest text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}