"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { categories } from "../../lib/categories";
import type { Photo } from "../../lib/photos";

export default function PhotoManager({
  refreshKey,
  onListChanged,
}: {
  refreshKey?: number;
  onListChanged?: () => void;
}) {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [, startTransition] = useTransition();

  async function loadPhotos() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/photos");
      if (res.ok) {
        const data = await res.json();
        setItems(data.photos || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin photos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, [refreshKey]);

  async function togglePublish(photo: Photo) {
    const updatedStatus = !photo.published;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, published: updatedStatus } : p))
    );

    try {
      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id, published: updatedStatus }),
      });
      if (!res.ok) {
        // Revert on error
        setItems((prev) =>
          prev.map((p) => (p.id === photo.id ? { ...p, published: !updatedStatus } : p))
        );
      } else if (onListChanged) {
        onListChanged();
      }
    } catch {
      setItems((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, published: !updatedStatus } : p))
      );
    }
  }

  async function saveTitle(id: string) {
    if (!editTitle.trim()) return;

    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: editTitle.trim() } : p))
    );
    setEditingId(null);

    try {
      await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle.trim() }),
      });
      if (onListChanged) onListChanged();
    } catch (err) {
      console.error("Failed to save title:", err);
    }
  }

  async function deletePhoto(photo: Photo) {
    if (!window.confirm(`Delete photograph "${photo.title}" permanently?`)) {
      return;
    }

    setItems((prev) => prev.filter((p) => p.id !== photo.id));

    try {
      await fetch(`/api/admin/photos?id=${encodeURIComponent(photo.id)}`, {
        method: "DELETE",
      });
      if (onListChanged) onListChanged();
    } catch (err) {
      console.error("Failed to delete photo:", err);
      loadPhotos();
    }
  }

  const filtered = items.filter((item) => {
    const matchesCat = filter === "all" || item.category === filter;
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCount = items.length;
  const publishedCount = items.filter((p) => p.published).length;
  const hiddenCount = totalCount - publishedCount;

  return (
    <section className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <p className="font-serif text-3xl sm:text-4xl text-accent">{totalCount}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
            Total Photos
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 backdrop-blur">
          <p className="font-serif text-3xl sm:text-4xl text-emerald-400">{publishedCount}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
            Live on Website
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <p className="font-serif text-3xl sm:text-4xl text-white/50">{hiddenCount}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
            Hidden / Drafts
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <p className="font-serif text-3xl sm:text-4xl text-accent">{categories.length}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
            Collections
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition shrink-0 ${
              filter === "all"
                ? "bg-accent text-black font-semibold"
                : "border border-white/15 bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          {categories.map((c) => {
            const count = items.filter((p) => p.category === c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition shrink-0 ${
                  filter === c.slug
                    ? "bg-accent text-black font-semibold"
                    : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {c.name} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-accent"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-white/50">
          Loading photographs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="font-serif text-xl text-white">No photographs found</p>
          <p className="mt-2 text-xs text-white/50">
            {search ? "No results match your search." : "Upload new photos above to populate this collection."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-2xl border transition ${
                item.published
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-white/5 bg-black/40 opacity-75"
              }`}
            >
              <div className="relative aspect-[4/3] bg-neutral-900">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover transition duration-500 group-hover:scale-105 ${
                    item.published ? "" : "grayscale"
                  }`}
                />
                
                {/* Status badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      item.published
                        ? "bg-emerald-500 text-black shadow-lg"
                        : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {item.published ? "Live / Published" : "Hidden"}
                  </span>
                </div>

                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/70 backdrop-blur">
                    {categories.find((c) => c.slug === item.category)?.name ?? item.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-lg border border-accent bg-black/60 px-3 py-1 text-sm text-white outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveTitle(item.id)}
                      className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-black"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-white/20 px-2 text-xs text-white/60"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-serif text-lg text-white" title={item.title}>
                      {item.title}
                    </p>
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditTitle(item.title);
                      }}
                      className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition hover:text-accent shrink-0"
                      title="Rename photo"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <p className="mt-1 text-[11px] uppercase tracking-wider text-white/40">
                  {item.date || "Added to gallery"}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <button
                    onClick={() => togglePublish(item)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                      item.published
                        ? "border border-white/20 text-white/70 hover:border-amber-400 hover:text-amber-300"
                        : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black"
                    }`}
                  >
                    {item.published ? "Hide from Visitors" : "Publish to Visitors"}
                  </button>

                  <button
                    onClick={() => deletePhoto(item)}
                    className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs uppercase tracking-wider text-red-300 transition hover:bg-red-500/20 hover:border-red-500"
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
