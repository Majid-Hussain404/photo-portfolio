"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "../lib/photos";
import type { Layout } from "../lib/themes";
import Lightbox from "./Lightbox";

const blobs = [
  "rounded-[60%_40%_55%_45%/50%_60%_40%_50%]",
  "rounded-[40%_60%_45%_55%/60%_40%_60%_40%]",
  "rounded-[55%_45%_60%_40%/45%_55%_45%_55%]",
];
const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3"];

export default function Gallery({
  photos,
  layout,
}: {
  photos: Photo[];
  layout: Layout;
}) {
  const [active, setActive] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="py-20 text-center text-white/60">
        Photos for this collection are coming soon.
      </p>
    );
  }

  const open = (i: number) => () => setActive(i);
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const img = (p: Photo, sizes: string, extra = "") => (
    <Image
      src={p.src}
      alt={p.title}
      fill
      sizes={sizes}
      className={`object-cover ${extra}`}
    />
  );

  function render() {
    switch (layout) {
      case "panorama":
        return (
          <div className="space-y-10">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className="group relative block aspect-[21/9] w-full overflow-hidden rounded-sm"
              >
                {img(p, "100vw", "transition duration-[1500ms] group-hover:scale-105")}
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-6 left-6 text-left font-serif text-2xl sm:text-4xl">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        );

      case "glow":
        return (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group relative mb-6 block w-full overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(255,140,60,0.3)] transition duration-500 hover:shadow-[0_0_80px_rgba(255,140,60,0.65)] ${
                  i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
              >
                {img(p, "33vw", "transition duration-700 group-hover:scale-105")}
                <span className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent" />
              </button>
            ))}
          </div>
        );

      case "organic":
        return (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group relative aspect-square overflow-hidden border-2 border-emerald-200/30 shadow-[0_0_40px_rgba(110,231,160,0.2)] transition duration-700 hover:scale-[1.04] ${blobs[i % 3]}`}
              >
                {img(p, "33vw", "transition duration-700 group-hover:scale-110")}
              </button>
            ))}
          </div>
        );

      case "safari":
        return (
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group text-left ${i === 0 ? "lg:col-span-2" : ""}`}
              >
                <span
                  className={`relative block w-full overflow-hidden border border-amber-200/20 ${
                    i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
                  }`}
                >
                  {img(p, "50vw", "sepia-[.4] transition duration-700 group-hover:scale-105 group-hover:sepia-0")}
                </span>
                <span className="mt-3 block font-mono text-xs uppercase tracking-[0.25em] text-amber-200/80">
                  No. {num(i)} — {p.title}
                </span>
              </button>
            ))}
          </div>
        );

      case "portrait":
        return (
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group text-center ${i % 2 ? "mt-12" : ""}`}
              >
                <span className="relative block aspect-[2/3] overflow-hidden border-[10px] border-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition duration-700 group-hover:-translate-y-2">
                  {img(p, "25vw", "grayscale transition duration-700 group-hover:grayscale-0")}
                </span>
                <span className="mt-4 block font-serif text-lg italic text-white/80">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        );

      case "film":
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group bg-neutral-900 p-2 shadow-xl transition duration-300 hover:z-10 hover:scale-105 ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <span className="mb-1 flex justify-between font-mono text-[10px] text-amber-300/80">
                  <span>▸ {i + 1}</span>
                  <span>{i + 1}A</span>
                </span>
                <span className="relative block aspect-[3/2] overflow-hidden">
                  {img(p, "25vw", "grayscale contrast-125 transition duration-500 group-hover:grayscale-0")}
                </span>
                <span
                  className="mt-2 block h-2 w-full"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 16px)",
                  }}
                />
              </button>
            ))}
          </div>
        );

      case "blueprint":
        return (
          <div className="grid grid-cols-1 gap-px border border-white/30 bg-white/30 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className="group relative aspect-square overflow-hidden bg-[#0a1c3a]"
              >
                {img(p, "33vw", "grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0")}
                <span className="absolute left-3 top-3 font-mono text-xs tracking-widest text-white/90">
                  {num(i)}
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[#0a1c3a]/90 p-3 text-left font-mono text-xs uppercase tracking-widest transition duration-500 group-hover:translate-y-0">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        );

      case "polaroid":
        return (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className={`group relative bg-white p-3 pb-5 text-black shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition duration-500 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-105 ${tilts[i % 4]}`}
              >
                <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-amber-200/70" />
                <span className="relative block aspect-square overflow-hidden">
                  {img(p, "33vw")}
                </span>
                <span className="mt-3 block text-center font-serif text-lg italic">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        );

      case "neon":
        return (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={open(i)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-cyan-300/60 shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_25px_rgba(34,211,238,0.15)] transition duration-500 hover:border-fuchsia-400 hover:shadow-[0_0_45px_rgba(232,121,249,0.8)]"
              >
                {img(p, "33vw", "brightness-90 transition duration-700 group-hover:scale-105 group-hover:brightness-110")}
                <span className="absolute bottom-4 left-4 text-sm uppercase tracking-[0.3em] text-cyan-200 [text-shadow:0_0_10px_#22d3ee]">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        );
    }
  }

  return (
    <>
      {render()}
      <Lightbox
        photos={photos}
        active={active}
        onClose={() => setActive(null)}
        onChange={setActive}
      />
    </>
  );
}