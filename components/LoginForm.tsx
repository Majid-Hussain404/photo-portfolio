"use client";

import Link from "next/link";
import { useState } from "react";

// While this is true, the login is only a design preview (nothing is checked).
// When the real login is connected, we will switch it off.
const DEMO = true;

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/10";

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(
      "Design preview only. The real login will be connected in the next step. Nothing was checked or saved."
    );
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setMessage(
      "Design preview only. Later, a reset link will be sent to your registered email and expire after a short time."
    );
  }

  return (
    <div>
      {DEMO && (
        <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          Design preview: the login is not connected yet.
        </p>
      )}

      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm text-white/70">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`${field} mt-1`}
            />
          </label>

          <label className="block text-sm text-white/70">
            Password
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className={`${field} pr-20`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-white/50 hover:text-accent"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white"
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setMessage(null);
            }}
            className="block w-full text-center text-sm text-white/60 hover:text-accent"
          >
            Forgot password?
          </button>
        </form>
      ) : (
        <form onSubmit={handleForgot} className="space-y-4">
          <p className="text-sm text-white/70">
            Enter your registered email address. We&apos;ll send you a link to
            choose a new password.
          </p>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Registered email"
            className={field}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white"
          >
            Send reset link
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage(null);
            }}
            className="block w-full text-center text-sm text-white/60 hover:text-accent"
          >
            ← Back to login
          </button>
        </form>
      )}

      {message && (
        <p className="mt-5 rounded-lg border border-sky-400/40 bg-sky-500/10 p-3 text-sm text-sky-200">
          {message}
        </p>
      )}

      {DEMO && (
        <Link
          href="/admin"
          className="mt-6 block text-center text-sm text-accent hover:underline"
        >
          Preview the dashboard design →
        </Link>
      )}
    </div>
  );
}