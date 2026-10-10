import Image from "next/image";
import Link from "next/link";
import CategoryBubbles from "../components/CategoryBubbles";
import FeaturedStrip from "../components/FeaturedStrip";
import Reveal from "../components/Reveal";
import { site } from "../lib/site";

export default function Home() {
  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/photos/Newback.JPG"
          alt={`Featured photograph by ${site.name}`}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p
            className="animate-fade-up mb-5 text-sm uppercase tracking-[0.5em] text-accent"
            style={{ animationDelay: "0.1s" }}
          >
            {site.title}
          </p>
          <h1
            className="animate-fade-up font-serif text-6xl leading-tight sm:text-8xl"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="shimmer-text">{site.name}</span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg text-white/80"
            style={{ animationDelay: "0.5s" }}
          >
            {site.tagline}
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.7s" }}
          >
            <Link
              href="/portfolio"
              className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/60 px-8 py-3 text-sm uppercase tracking-widest transition hover:scale-105 hover:border-accent hover:text-accent"
            >
              Contact Me
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="animate-bounce text-xs uppercase tracking-[0.3em] text-white/60">
            Scroll ↓
          </div>
        </div>
      </section>

      <section className="py-24">
        <Reveal className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
            Featured work
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl">Latest frames</h2>
        </Reveal>
        <Reveal delay={200} className="mt-12">
          <FeaturedStrip />
        </Reveal>
      </section>

      <CategoryBubbles />
    </main>
  );
}