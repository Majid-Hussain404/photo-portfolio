import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { signOut } from "../actions/auth";
import { requireOwner } from "../../lib/auth";
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
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 text-white/60">
          Verifying owner access...
        </div>
      }
    >
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}

async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  await requireOwner();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
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
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-white/40 px-5 py-2 text-sm uppercase tracking-widest transition hover:border-accent hover:text-accent"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
}