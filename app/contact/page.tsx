import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import CopyEmail from "../../components/CopyEmail";
import Reveal from "../../components/Reveal";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Contact | ${site.brand}`,
  description: `Get in touch with ${site.name} for photography projects and collaborations.`,
};

export default function ContactPage() {
  const socials = [
    { label: "Instagram", url: site.instagram },
    { label: "Facebook", url: site.facebook },
    { label: "YouTube", url: site.youtube },
  ].filter((s) => s.url);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <Reveal>
        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
          Contact
        </p>
        <h1 className="font-serif text-5xl leading-tight sm:text-7xl">
          Let&apos;s create something together
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/70">
          For projects, collaborations or prints, write to me and I&apos;ll
          get back to you.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <Reveal className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block break-all font-serif text-2xl hover:text-accent sm:text-3xl"
            >
              {site.email}
            </a>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}`}
                className="rounded-full bg-accent px-6 py-2 text-sm font-medium uppercase tracking-widest text-black transition hover:bg-white"
              >
                Write an email
              </a>
              <CopyEmail email={site.email} />
            </div>
          </div>

          {site.phone && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Phone
              </p>
              <a
                href={`tel:${site.phone}`}
                className="mt-2 block text-2xl hover:text-accent"
              >
                {site.phone}
              </a>
            </div>
          )}

          {site.location && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Based in
              </p>
              <p className="mt-2 text-2xl">{site.location}</p>
            </div>
          )}

          {socials.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Follow
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/30 px-5 py-2 text-sm transition hover:border-accent hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        <Reveal delay={150}>
          <ContactForm email={site.email} />
        </Reveal>
      </div>
    </main>
  );
}