"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available, ignore
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded-full border border-white/40 px-6 py-2 text-sm uppercase tracking-widest transition hover:border-accent hover:text-accent"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}