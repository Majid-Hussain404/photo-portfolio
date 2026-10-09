import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "../../lib/categories";
import { photos } from "../../lib/photos";
import OwnerPortfolioBar from "../../components/OwnerPortfolioBar";

export const metadata: Metadata = {
  title: "Portfolio | Majid Hussain Mir",
  description:
    "Browse photography collections: landscape, sunset, nature, wildlife, portrait, street, architecture, travel and night.",
};

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36">
      <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
        Portfolio
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl mb-8">Collections</h1>

      <OwnerPortfolioBar />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const items = photos.filter((p) => p.category === c.slug);
          const cover = items[0]?.src;

          return (
            <Link
              key={c.slug}
              href={`/portfolio/${c.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10"
              style={{
                backgroundImage: `${cover ? `url("${cover}"), ` : ""}linear-gradient(135deg, ${c.from}, ${c.to})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition duration-500 group-hover:from-black/40" />
              <span className="absolute bottom-0 left-0 right-0 p-6">
                <span className="block font-serif text-3xl">{c.name}</span>
                <span className="mt-1 block text-sm text-white/70">
                  {c.description}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-widest text-white/50">
                  {items.length} {items.length === 1 ? "photo" : "photos"}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}