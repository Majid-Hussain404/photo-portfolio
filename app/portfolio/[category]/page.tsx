import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBackdrop from "../../../components/CategoryBackdrop";
import Gallery from "../../../components/Gallery";
import OwnerCategoryUpload from "../../../components/OwnerCategoryUpload";
import { categories } from "../../../lib/categories";
import { getDynamicPhotos } from "../../../lib/photos";
import { themes } from "../../../lib/themes";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) return {};
  return {
    title: `${c.name} Photography | Majid Hussain Mir`,
    description: c.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) notFound();

  const theme = themes[c.slug] ?? themes.landscape;
  const allList = await getDynamicPhotos();
  const items = allList.filter(
    (p) => p.category === c.slug && p.published !== false
  );

  return (
    <>
      <CategoryBackdrop slug={c.slug} />
      <main className={`mx-auto ${theme.wrap} px-6 pb-24 pt-36`}>
        <Link
          href="/portfolio"
          className="text-sm uppercase tracking-widest text-white/60 hover:text-white"
        >
          ← All collections
        </Link>
        <p
          className="mt-8 text-sm uppercase tracking-[0.4em]"
          style={{ color: theme.accent }}
        >
          {theme.tagline}
        </p>
        <h1 className={`mt-2 text-5xl sm:text-7xl ${theme.titleClass}`}>
          {c.name}
        </h1>
        <p className="mt-4 max-w-xl text-white/70">{c.description}</p>

        <OwnerCategoryUpload categorySlug={c.slug} categoryName={c.name} />

        <div className="mt-14">
          <Gallery photos={items} layout={theme.layout} />
        </div>
      </main>
    </>
  );
}