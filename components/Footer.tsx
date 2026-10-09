"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "../lib/site";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const socials = [
    { label: "Instagram", url: site.instagram },
    { label: "Facebook", url: site.facebook },
    { label: "YouTube", url: site.youtube },
  ].filter((s) => s.url);

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 px-6 py-12 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-serif text-2xl">{site.name}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-1 block text-sm text-white/70 hover:text-accent"
          >
            {site.email}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-widest text-white/70">
          <Link href="/portfolio" className="hover:text-accent">
            Portfolio
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row">
        <p>© {year} {site.name}. All rights reserved.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 transition hover:text-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Owner Portal</span>
        </Link>
      </div>
    </footer>
  );
}