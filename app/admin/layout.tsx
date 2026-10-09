import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { signOut } from "../actions/auth";
import { requireOwner } from "../../lib/auth";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Owner Panel | ${site.brand}`,
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
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 text-center text-white/60">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4" />
          <p className="text-xs uppercase tracking-widest">Verifying owner access...</p>
        </div>
      }
    >
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}

async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const user = await requireOwner();

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">
                Owner Portal
              </p>
            </div>
            <p className="mt-1 font-serif text-2xl text-white">{site.brand}</p>
            <p className="text-xs text-white/40 mt-0.5">
              Logged in as <span className="text-white/80 font-mono">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/80 transition hover:border-accent hover:text-accent hover:bg-white/10"
            >
              <span>View Website</span>
              <span>↗</span>
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-widest text-red-300 transition hover:border-red-500 hover:bg-red-500 hover:text-black cursor-pointer"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}