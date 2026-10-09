"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "../../lib/categories";

import { uploadPhotosDirect } from "../../lib/client-upload";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent focus:bg-white/10";

interface Props {
  defaultCategory?: string;
  onPhotoUploaded?: () => void;
}

export default function PhotoUpload({ defaultCategory, onPhotoUploaded }: Props) {
  const [category, setCategory] = useState(defaultCategory || categories[0].slug);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setMessage({ text: "Please select at least one photograph to upload.", error: true });
      return;
    }

    setUploading(true);
    setMessage(null);
    setUploadStatus("Preparing photographs...");

    try {
      const res = await uploadPhotosDirect({
        files,
        category,
        title,
        onProgress: (status) => setUploadStatus(status),
      });

      const selectedCategoryName = categories.find((c) => c.slug === category)?.name || category;

      setMessage({
        text: `Success! Added ${res.count} photograph${res.count === 1 ? "" : "s"} to the ${selectedCategoryName} collection.`,
        error: false,
      });
      setFiles([]);
      setTitle("");

      if (onPhotoUploaded) {
        onPhotoUploaded();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setMessage({ text: msg, error: true });
    } finally {
      setUploading(false);
      setUploadStatus(null);
    }
  }

  const currentCategoryObj = categories.find((c) => c.slug === category);

  return (
    <form
      onSubmit={handleUpload}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-white">Upload to Section</h2>
          <p className="mt-1 text-xs text-white/50">
            Select the section/collection below, pick your photos, and publish them directly to your website.
          </p>
        </div>
        <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-semibold text-accent">
          Target: {currentCategoryObj?.name}
        </span>
      </div>

      {/* Visual Section / Category Selector Buttons */}
      <div className="mt-6">
        <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">
          Choose Section / Collection:
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                className={`rounded-xl px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-accent text-black font-semibold shadow-lg scale-105"
                    : "border border-white/15 bg-white/5 text-white/70 hover:border-accent hover:text-white hover:bg-white/10"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
          Custom Title (Optional — leave empty to auto-title from filename)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`e.g. Golden sunset in ${currentCategoryObj?.name || "collection"}`}
          className={field}
        />
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
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-accent bg-accent/10"
            : "border-white/15 hover:border-accent/50 hover:bg-white/[0.02]"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>
        <span className="mt-3 font-serif text-lg text-white">
          Drop photographs for {currentCategoryObj?.name} here
        </span>
        <span className="mt-1 text-xs text-white/50">
          Supports JPG, PNG, WebP (multiple files allowed)
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
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-white/60 mb-3">
            Ready to upload into <strong className="text-accent">{currentCategoryObj?.name}</strong> ({previews.length} photos):
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {previews.map((url, i) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={files[i]?.name ?? "Selected"}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() =>
                    setFiles((f) => f.filter((_, idx) => idx !== i))
                  }
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {uploading
            ? uploadStatus || `Uploading to ${currentCategoryObj?.name}...`
            : `Publish ${files.length ? `${files.length} ` : ""}to ${currentCategoryObj?.name}`}
        </button>

        {files.length > 0 && (
          <button
            type="button"
            onClick={() => setFiles([])}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white"
          >
            Clear selection
          </button>
        )}
      </div>

      {message && (
        <div
          role="status"
          className={`mt-4 rounded-xl border p-4 text-xs leading-relaxed ${
            message.error
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
