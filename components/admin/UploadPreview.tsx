"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "../../lib/categories";

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition focus:border-accent";

export default function UploadPreview() {
  const [category, setCategory] = useState(categories[0].slug);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews]
  );

  function addFiles(list: FileList | File[]) {
    const images = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setMessage(null);
  }

  function upload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Choose at least one photograph first.");
      return;
    }
    const name = categories.find((c) => c.slug === category)?.name;
    setMessage(
      `Design preview only: ${files.length} photograph${
        files.length === 1 ? "" : "s"
      } would be published to "${name}". Real uploading comes in the next step.`
    );
  }

  return (
    <form
      onSubmit={upload}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h2 className="font-serif text-2xl">Upload photographs</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${field} mt-1`}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug} className="text-black">
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-white/70">
          Title (for a single photograph)
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Golden hour over the lake"
            className={`${field} mt-1`}
          />
        </label>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragging
            ? "border-accent bg-accent/10"
            : "border-white/20 hover:border-accent/60"
        }`}
      >
        <span className="font-serif text-xl">Drop photographs here</span>
        <span className="mt-1 text-sm text-white/50">
          or click to choose files (JPG, PNG, WebP)
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {previews.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {previews.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={files[i]?.name ?? "Selected photograph"}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() =>
                  setFiles((f) => f.filter((_, idx) => idx !== i))
                }
                className="absolute right-1 top-1 rounded-full bg-black/70 px-2 text-sm opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="mt-6 rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:bg-white"
      >
        Upload {files.length > 0 ? files.length : ""} photograph
        {files.length === 1 ? "" : "s"}
      </button>

      {message && (
        <p className="mt-5 rounded-lg border border-sky-400/40 bg-sky-500/10 p-3 text-sm text-sky-200">
          {message}
        </p>
      )}
    </form>
  );
}