import Link from "next/link";
import { site } from "../lib/site";

export default function Footer() {
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
      <p className="mt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}