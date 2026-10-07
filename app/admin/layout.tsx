import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Dashboard | ${site.brand}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Preview only: hidden on the live website until the real login is connected.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="mb-8 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-200">
        Design preview: nothing here is saved yet, and this page is not
        protected yet. It is hidden on the live website.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">
            Private dashboard
          </p>
          <p className="mt-1 font-serif text-2xl">{site.brand}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-sm uppercase tracking-widest text-white/60 hover:text-accent"
          >
            View website
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/40 px-5 py-2 text-sm uppercase tracking-widest transition hover:border-accent hover:text-accent"
          >
            Log out
          </Link>
        </div>
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
}