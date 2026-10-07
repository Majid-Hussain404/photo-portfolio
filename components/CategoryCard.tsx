"use client";

import Image from "next/image";
import type { Category } from "../lib/categories";
import type { Photo } from "../lib/photos";

type Props = {
  cat: Category;
  covers: Photo[];
  current: number;
  index: number;
  popping: boolean;
  onClick: () => void;
};

// Small glass bubbles that fly out when a card is clicked
const bubbles = Array.from({ length: 22 }, (_, k) => {
  const angle = (k / 22) * Math.PI * 2;
  const distance = 110 + (k % 4) * 40;
  return {
    size: 8 + (k % 5) * 7,
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance) - 60,
    delay: (k % 6) * 60,
  };
});

// The photos of a category, stacked on top of each other; the "current" one is visible
function Photos({
  covers,
  current,
  sizes,
  extra = "",
}: {
  covers: Photo[];
  current: number;
  sizes: string;
  extra?: string;
}) {
  return (
    <>
      {covers.map((p, i) => (
        <Image
          key={`${p.src}-${i}`}
          src={p.src}
          alt={p.title}
          fill
          sizes={sizes}
          className={`object-cover transition-all duration-1000 group-hover:scale-105 ${
            i === current ? "opacity-100" : "opacity-0"
          } ${extra}`}
        />
      ))}
    </>
  );
}

export default function CategoryCard({
  cat,
  covers,
  current,
  index,
  popping,
  onClick,
}: Props) {
  const bg = {
    background: `linear-gradient(135deg, ${cat.from}55, ${cat.to}55)`,
  };
  const num = String(index + 1).padStart(2, "0");
  const sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  function card() {
    switch (cat.slug) {
      case "landscape":
        return (
          <span
            className="relative block aspect-[16/10] overflow-hidden rounded-md border border-emerald-200/20 shadow-[0_10px_40px_rgba(16,185,129,0.25)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_rgba(16,185,129,0.45)]"
            style={bg}
          >
            <Photos covers={covers} current={current} sizes={sizes} />
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="absolute bottom-0 h-1/3 w-full"
            >
              <path
                d="M0,320 L0,200 L180,90 L320,180 L520,40 L720,190 L900,80 L1100,200 L1280,110 L1440,210 L1440,320 Z"
                fill="rgba(0,0,0,0.5)"
              />
            </svg>
            <span className="absolute bottom-4 left-5 font-serif text-3xl tracking-wide drop-shadow">
              {cat.name}
            </span>
          </span>
        );

      case "sunset":
        return (
          <span
            className="relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(255,140,60,0.35)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_90px_rgba(255,140,60,0.7)]"
            style={bg}
          >
            <Photos covers={covers} current={current} sizes={sizes} />
            <span className="absolute inset-0 bg-gradient-to-t from-orange-600/60 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 flex items-center gap-3 font-serif text-3xl italic">
              <span className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_20px_#fbbf24]" />
              {cat.name}
            </span>
          </span>
        );

      case "nature":
        return (
          <span
            className="relative block aspect-square overflow-hidden rounded-bl-lg rounded-br-[3.5rem] rounded-tl-[3.5rem] rounded-tr-lg border-2 border-emerald-200/30 shadow-[0_0_40px_rgba(110,231,160,0.25)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_70px_rgba(110,231,160,0.5)]"
            style={bg}
          >
            <Photos covers={covers} current={current} sizes={sizes} />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-950/80 to-transparent p-5 font-serif text-2xl">
              {cat.name}
            </span>
          </span>
        );

      case "wildlife":
        return (
          <span className="block border border-amber-200/20 bg-amber-950/70 p-3 shadow-xl transition duration-500 group-hover:-translate-y-2">
            <span className="relative block aspect-[4/3] overflow-hidden" style={bg}>
              <Photos
                covers={covers}
                current={current}
                sizes={sizes}
                extra="sepia-[.4] group-hover:sepia-0"
              />
            </span>
            <span className="mt-3 flex justify-between font-mono text-xs uppercase tracking-[0.25em] text-amber-200/80">
              <span>No. {num}</span>
              <span>{cat.name}</span>
            </span>
          </span>
        );

      case "portrait":
        return (
          <span className="block bg-white p-3 pb-4 text-black shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition duration-500 group-hover:-translate-y-2">
            <span className="relative block aspect-[2/3] overflow-hidden" style={bg}>
              <Photos
                covers={covers}
                current={current}
                sizes={sizes}
                extra="grayscale group-hover:grayscale-0"
              />
            </span>
            <span className="mt-3 block text-center font-serif text-lg italic tracking-wide">
              {cat.name}
            </span>
          </span>
        );

      case "street":
        return (
          <span
            className={`block bg-neutral-900 p-2 shadow-xl transition duration-300 group-hover:scale-105 ${
              index % 2 ? "rotate-1" : "-rotate-1"
            }`}
          >
            <span className="mb-1 flex justify-between font-mono text-[10px] text-amber-300/80">
              <span>▸ {index + 1}</span>
              <span>{index + 1}A</span>
            </span>
            <span className="relative block aspect-[3/2] overflow-hidden" style={bg}>
              <Photos
                covers={covers}
                current={current}
                sizes={sizes}
                extra="grayscale contrast-125 group-hover:grayscale-0"
              />
            </span>
            <span className="block py-1 font-mono text-xs uppercase tracking-widest text-white/80">
              {cat.name}
            </span>
            <span
              className="block h-2 w-full"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 16px)",
              }}
            />
          </span>
        );

      case "architecture":
        return (
          <span
            className="relative block aspect-square overflow-hidden border border-white/40 transition duration-500 group-hover:-translate-y-2"
            style={bg}
          >
            <Photos
              covers={covers}
              current={current}
              sizes={sizes}
              extra="grayscale group-hover:grayscale-0"
            />
            <span
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(147,197,253,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,0.25) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <span className="absolute left-3 top-3 font-mono text-xs tracking-widest">
              {num}
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-[#0a1c3a]/85 p-3 font-mono text-xs uppercase tracking-[0.3em]">
              {cat.name}
            </span>
          </span>
        );

      case "travel":
        return (
          <span
            className={`relative block bg-white p-3 pb-4 text-black shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition duration-500 group-hover:-translate-y-2 group-hover:rotate-0 ${
              index % 2 ? "rotate-2" : "-rotate-2"
            }`}
          >
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-amber-200/70" />
            <span className="relative block aspect-[5/4] overflow-hidden" style={bg}>
              <Photos covers={covers} current={current} sizes={sizes} />
            </span>
            <span className="mt-3 block text-center font-serif text-xl italic">
              {cat.name}
            </span>
          </span>
        );

      case "night":
        return (
          <span
            className="relative block aspect-[3/4] overflow-hidden rounded-xl border border-cyan-300/60 shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_25px_rgba(34,211,238,0.15)] transition duration-500 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_45px_rgba(232,121,249,0.8)]"
            style={bg}
          >
            <Photos
              covers={covers}
              current={current}
              sizes={sizes}
              extra="brightness-90 group-hover:brightness-110"
            />
            {Array.from({ length: 16 }, (_, k) => (
              <span
                key={k}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(k * 37) % 100}%`,
                  top: `${(k * 53) % 70}%`,
                  width: 2,
                  height: 2,
                  animation: `twinkle ${2 + (k % 3)}s ease-in-out ${(k % 5) * 0.4}s infinite`,
                }}
              />
            ))}
            <span className="absolute bottom-4 left-4 text-lg uppercase tracking-[0.35em] text-cyan-200 [text-shadow:0_0_12px_#22d3ee]">
              {cat.name}
            </span>
          </span>
        );

      default:
        return (
          <span
            className="relative block aspect-[4/3] overflow-hidden rounded-xl"
            style={bg}
          >
            <Photos covers={covers} current={current} sizes={sizes} />
            <span className="absolute bottom-4 left-4 font-serif text-2xl">
              {cat.name}
            </span>
          </span>
        );
    }
  }

  return (
    <div className="relative mb-10 break-inside-avoid">
      <button
        onClick={onClick}
        className={`group block w-full text-left ${popping ? "bubble-wobble" : ""}`}
        aria-label={`View ${cat.name} photography`}
      >
        {card()}
      </button>

      {popping && (
        <span className="pointer-events-none absolute inset-0">
          {bubbles.map((b, k) => (
            <span
              key={k}
              className="small-bubble absolute left-1/2 top-1/2 rounded-full"
              style={
                {
                  width: b.size,
                  height: b.size,
                  animationDelay: `${450 + b.delay}ms`,
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(212,165,116,0.3) 55%, rgba(255,255,255,0.05))",
                  border: "1px solid rgba(255,255,255,0.6)",
                  "--dx": `${b.dx}px`,
                  "--dy": `${b.dy}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      )}
    </div>
  );
}