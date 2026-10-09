"use client";

import { useState } from "react";
import Image from "next/image";
import { useOwner } from "../lib/useOwner";
import { compressImageForWeb } from "../lib/image-compress";

interface Props {
  initialPhoto?: string;
  initials: string;
}

export default function ProfilePhotoCard({ initialPhoto, initials }: Props) {
  const { isOwner } = useOwner();
  const [photo, setPhoto] = useState(initialPhoto || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const optimized = await compressImageForWeb(file);

      const formData = new FormData();
      formData.append("file", optimized);

      const res = await fetch("/api/admin/profile-photo", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse response: " + text);
      }

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPhoto(data.photoUrl);
      setMessage({ text: "Profile photo updated successfully!", error: false });

      setTimeout(() => setMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo.";
      setMessage({ text: msg, error: true });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="relative mx-auto max-w-sm group">
      {/* Decorative Gold Accent Border Frame */}
      <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-accent/60 transition duration-500 group-hover:border-accent" />

      {/* Main Photo Card Container */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_0_60px_rgba(212,165,116,0.25)] bg-[#120d09]"
        style={{
          background: "linear-gradient(135deg, #1f1711 0%, #0d0a07 100%)",
        }}
      >
        {photo ? (
          <Image
            src={photo}
            alt="Majid Hussain"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            priority
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-7xl text-accent/80 tracking-widest font-light">
              {initials}
            </span>
            <span className="mt-3 text-[11px] uppercase tracking-[0.4em] text-white/40">
              Photographer
            </span>
          </div>
        )}

        {/* Subtle vignette gradient for photo polish */}
        {photo && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        )}

        {/* OWNER ONLY: Camera Overlay and Upload Trigger */}
        {isOwner && (
          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition duration-300 hover:opacity-100 cursor-pointer backdrop-blur-xs p-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-xl transition transform hover:scale-110">
              {uploading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7"
                >
                  <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                  <path
                    fillRule="evenodd"
                    d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71a48.847 48.847 0 014.28 1.056A3.75 3.75 0 0126 11.082v8.668a3.75 3.75 0 01-3.75 3.75H4.5A3.75 3.75 0 01.75 19.75v-8.668a3.75 3.75 0 012.802-3.538 48.84 48.84 0 014.28-1.056c.465-.067.87-.327 1.11-.71l.82-1.317a2.996 2.996 0 012.332-1.39zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-white drop-shadow">
              {uploading ? "Updating..." : "Change Profile Photo"}
            </span>
            <span className="mt-1 text-[11px] text-accent/90">
              (Owner Control Panel)
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* OWNER ONLY: Persistent Quick Action Button below the card */}
      {isOwner && (
        <div className="mt-3 flex flex-col items-center">
          <label className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent transition hover:bg-accent hover:text-black cursor-pointer shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
            <span>{uploading ? "Uploading..." : "Upload Your Photo"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* Status Toast */}
      {message && (
        <div
          role="status"
          className={`mt-3 rounded-xl border p-2.5 text-center text-xs leading-relaxed animate-fade-in ${
            message.error
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
