"use client";

import Link from "next/link";
import { useOwner } from "../lib/useOwner";

export default function OwnerPortfolioBar() {
  const { isOwner, loading } = useOwner();

  if (loading || !isOwner) {
    return null;
  }

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 backdrop-blur shadow-lg">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Owner Mode Active
        </span>
        <span className="text-xs text-white/60 hidden sm:inline">· Click into any collection or use the dashboard to upload</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white shadow"
        >
          + Upload in Owner Panel
        </Link>
      </div>
    </div>
  );
}
