"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Photo } from "../lib/photos";

export default function Lightbox({
  photos,
  active,
  onClose,
  onChange,
}: {
  photos: Photo[];
  active: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    if (active === null) return;
    const total = photos.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((active + 1) % total);
      if (e.key === "ArrowLeft") onChange((active - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, photos.length, onClose, onChange]);

  if (active === null) return null;
  const total = photos.length;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative h-[80vh] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[active].src}
          alt={photos[active].title}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/80">
        {photos[active].title} · {active + 1} / {total}
      </p>

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 text-3xl text-white/80 hover:text-accent"
      >
        ✕
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange((active - 1 + total) % total);
        }}
        aria-label="Previous photo"
        className="absolute left-4 text-5xl text-white/70 hover:text-accent"
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange((active + 1) % total);
        }}
        aria-label="Next photo"
        className="absolute right-4 text-5xl text-white/70 hover:text-accent"
      >
        ›
      </button>
    </div>
  );
}