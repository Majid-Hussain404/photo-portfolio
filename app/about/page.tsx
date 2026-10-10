import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import ProfilePhotoCard from "../../components/ProfilePhotoCard";
import { categories } from "../../lib/categories";
import { site, getDynamicSiteConfig } from "../../lib/site";

export const metadata: Metadata = {
  title: `About | ${site.name}`,
  description: `About ${site.name}, ${site.title.toLowerCase()}. ${site.tagline}`,
};

export default async function AboutPage() {
  const currentSite = await getDynamicSiteConfig();

  const initials = currentSite.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const details = [
    { label: "Location", value: currentSite.location },
    { label: "Experience", value: currentSite.experience },
    { label: "Email", value: currentSite.email, href: `mailto:${currentSite.email}` },
    { label: "Phone", value: currentSite.phone, href: `tel:${currentSite.phone}` },
  ].filter((d) => d.value);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <div className="grid items-center gap-14 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <ProfilePhotoCard
            initialPhoto={currentSite.photo}
            initials={initials}
          />
        </Reveal>

        <Reveal delay={150} className="lg:col-span-3">
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
            About me
          </p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">
            Hi, I&apos;m {currentSite.name}
          </h1>
          <p className="mt-2 text-lg text-white/60">{currentSite.title}</p>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-white/80">
            {currentSite.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-accent pl-5 font-serif text-xl italic text-white/90">
            {currentSite.quote}
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
              <div key={d.label} className="bg-white/5 backdrop-blur-xs p-6">
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