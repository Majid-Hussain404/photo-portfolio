import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "../../../components/ResetPasswordForm";
import { site } from "../../../lib/site";

export const metadata: Metadata = {
  title: `Reset password | ${site.brand}`,
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">
          Owner area
        </p>
        <h1 className="mt-2 font-serif text-4xl">Choose a new password</h1>
        <p className="mb-8 mt-2 text-white/60">
          Set a new password for your owner account.
        </p>
        <ResetPasswordForm />
        <Link
          href="/login"
          className="mt-8 block text-center text-xs uppercase tracking-widest text-white/40 hover:text-white"
        >
          ← Back to login
        </Link>
      </div>
    </main>
  );
}
