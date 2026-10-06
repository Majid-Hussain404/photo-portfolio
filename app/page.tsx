import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Featured photograph by the photographer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p
            className="animate-fade-up mb-4 text-sm uppercase tracking-[0.4em] text-accent"
            style={{ animationDelay: "0.1s" }}
          >
            Photographer
          </p>
          <h1
            className="animate-fade-up font-serif text-5xl leading-tight sm:text-7xl"
            style={{ animationDelay: "0.3s" }}
          >
            Capturing moments that last forever
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg text-white/80"
            style={{ animationDelay: "0.5s" }}
          >
            Landscapes, portraits, and stories told through light.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.7s" }}
          >
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
          </div>
        </div>
      </section>
    </main>
  );
}