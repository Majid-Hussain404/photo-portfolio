import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Owner login | ${site.brand}`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  // Preview only: hidden on the live website until the real login is connected.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-serif text-4xl leading-snug">{site.quote}</p>
          <p className="mt-4 text-sm uppercase tracking-[0.4em] text-accent">
            {site.brand}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 pb-16 pt-32 lg:pt-16">
        <div className="w-full max-w-md">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">
            Owner area
          </p>
          <h1 className="mt-2 font-serif text-4xl">Welcome back</h1>
          <p className="mb-8 mt-2 text-white/60">
            Sign in to manage the photographs on {site.brand}.
          </p>
          <LoginForm />
          <Link
            href="/"
            className="mt-8 block text-center text-xs uppercase tracking-widest text-white/40 hover:text-white"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}