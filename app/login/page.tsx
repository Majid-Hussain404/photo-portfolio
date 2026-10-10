import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../../components/LoginForm";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Owner Portal | ${site.brand}`,
  description: "Private administration portal for the portfolio owner.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <Image
          src="/photos/Newback.JPG"
          alt=""
          fill
          priority
          sizes="50vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <p className="font-serif text-3xl xl:text-4xl leading-relaxed text-white/90">
            &ldquo;{site.quote}&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-0.5 w-8 bg-accent" />
            <p className="text-xs uppercase tracking-[0.4em] text-accent font-medium">
              {site.brand} — {site.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 max-w-xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">
              Owner Administration
            </p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white">
            Welcome, Majid
          </h1>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">
            This panel is reserved for the site owner to manage photographs, collections, and portfolio details.
          </p>
          
          <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/50 flex items-center justify-between">
            <span>Are you a visitor exploring the portfolio?</span>
            <Link
              href="/"
              className="font-medium text-accent hover:underline uppercase tracking-wider ml-2 shrink-0"
            >
              Explore Website →
            </Link>
          </div>

          <LoginForm />

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition"
            >
              ← Back to public website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}