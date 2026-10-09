"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOwner } from "../lib/useOwner";

interface Props {
  categorySlug: string;
  categoryName: string;
}

export default function OwnerCategoryUpload({ categorySlug, categoryName }: Props) {
  const { isOwner, loading } = useOwner();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  // If not logged in as the owner, render NOTHING so visitors only explore
  if (loading || !isOwner) {
    return null;
  }

  function addFiles(list: FileList | File[]) {
    const images = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setMessage(null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setMessage({ text: "Please select at least one photograph.", error: true });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("category", categorySlug);
      if (title.trim()) {
        formData.append("title", title.trim());
      }
      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/admin/photos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage({
        text: `Successfully uploaded to ${categoryName}!`,
        error: false,
      });
      setFiles([]);
      setTitle("");

      // Refresh the page so the new photos appear live immediately
      router.refresh();

      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setMessage({ text: msg, error: true });
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {/* Sleek Owner Action Bar at the top of the category */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-3 backdrop-blur shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Owner Mode Active
          </span>
          <span className="hidden sm:inline text-xs text-white/50">·</span>
          <span className="hidden sm:inline text-xs text-white/70">
            You are managing the <strong className="text-white">{categoryName}</strong> collection
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:scale-105 hover:bg-white shadow cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span>Upload to {categoryName}</span>
          </button>

          <Link
            href={`/admin?category=${categorySlug}`}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-white/60 hover:text-accent transition"
          >
            <span>Admin</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0f1118] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
                  Owner Quick Upload
                </p>
                <h3 className="mt-1 font-serif text-2xl text-white">
                  Add to {categoryName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setFiles([]);
                  setMessage(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
                  Photo Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Glow (auto-generated if blank)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:bg-white/10 placeholder-white/30"
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
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
                  dragging
                    ? "border-accent bg-accent/10"
                    : "border-white/15 hover:border-accent/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </div>
                <span className="mt-2 font-serif text-base text-white">
                  Drop photographs here
                </span>
                <span className="mt-1 text-xs text-white/50">
                  Click or drag files (JPG, PNG, WebP)
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
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                    Selected photos ({previews.length}):
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {previews.map((url, i) => (
                      <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-white/15"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFiles((f) => f.filter((_, idx) => idx !== i))}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message && (
                <div
                  className={`rounded-xl border p-3 text-xs ${
                    message.error
                      ? "border-red-400/40 bg-red-500/10 text-red-200"
                      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-5 py-2 text-xs uppercase tracking-wider text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || files.length === 0}
                  className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? "Uploading..." : `Upload to ${categoryName}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
