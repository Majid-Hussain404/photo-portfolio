import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { categories } from "../../lib/categories";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `About | ${site.name}`,
  description: `About ${site.name}, ${site.title.toLowerCase()}. ${site.tagline}`,
};

const initials = site.name
  .split(" ")
  .map((w) => w[0])
  .join("")
  .slice(0, 2);

export default function AboutPage() {
  const details = [
    { label: "Location", value: site.location },
    { label: "Experience", value: site.experience },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Phone", value: site.phone, href: `tel:${site.phone}` },
  ].filter((d) => d.value);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <div className="grid items-center gap-14 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-accent/60" />
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_0_60px_rgba(212,165,116,0.25)]"
              style={{
                background: "linear-gradient(135deg,#d4a574,#3b2a1a)",
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-serif text-7xl text-white/70">
                {initials}
              </span>
              <span
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/profile.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-3">
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
            About me
          </p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">
            Hi, I&apos;m {site.name}
          </h1>
          <p className="mt-2 text-lg text-white/60">{site.title}</p>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-white/80">
            {site.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-accent pl-5 font-serif text-xl italic text-white/90">
            {site.quote}
          </blockquote>
        </Reveal>
      </div>

      <Reveal className="mt-24">
        <p className="mb-5 text-sm uppercase tracking-[0.4em] text-accent">
          What I shoot
        </p>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/portfolio/${c.slug}`}
              className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:border-accent hover:text-accent"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Reveal>

      {details.length > 0 && (
        <Reveal className="mt-16">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="bg-background p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {d.label}
                </p>
                {d.href ? (
                  <a
                    href={d.href}
                    className="mt-2 block break-all text-lg hover:text-accent"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg">{d.value}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/portfolio"
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:bg-white"
        >
          View Portfolio
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/60 px-8 py-3 text-sm uppercase tracking-widest transition hover:border-accent hover:text-accent"
        >
          Contact Me
        </Link>
      </Reveal>
    </main>
  );
}