"use client";

import Link from "next/link";
import { useState } from "react";

// While this is true, the login is only a design preview (nothing is checked).
// When the real login is connected, we will switch it off.
const DEMO = true;

type Mode = "login" | "forgot" | "create";

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/10";
const primary =
  "w-full rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white";
const linkButton =
  "block w-full text-center text-sm text-white/60 hover:text-accent";

const strengthLabels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
const strengthColors = [
  "bg-white/10",
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-emerald-400",
];

function strengthOf(pw: string) {
  let score = 0;
  if (pw.length >= 10) score++;
  if (pw.length >= 14) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-sm text-white/70">
      {label}
      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
  );
}

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  function go(next: Mode) {
    setMode(next);
    setMessage(null);
    setPassword("");
    setConfirm("");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage({
      text: "Design preview only. The real login will be connected in the next step. Nothing was checked or saved.",
      error: false,
    });
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setMessage({
      text: "Design preview only. Later, a reset link will be sent to your registered email and expire after a short time.",
      error: false,
    });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 10) {
      setMessage({ text: "Use at least 10 characters.", error: true });
      return;
    }
    if (password !== confirm) {
      setMessage({ text: "The two passwords do not match.", error: true });
      return;
    }
    setMessage({
      text: "Design preview only. No account was created. In the real version this works once, only for the owner's email and private setup code, and then locks for good.",
      error: false,
    });
  }

  const strength = strengthOf(password);

  return (
    <div>
      {DEMO && (
        <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          Design preview: the login is not connected yet.
        </p>
      )}

      {mode === "login" && (
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
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button type="submit" className={primary}>
            Log in
          </button>
          <button type="button" onClick={() => go("forgot")} className={linkButton}>
            Forgot password?
          </button>
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => go("create")}
              className={linkButton}
            >
              First time? Create the owner account
            </button>
          </div>
        </form>
      )}

      {mode === "forgot" && (
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
          <button type="submit" className={primary}>
            Send reset link
          </button>
          <button type="button" onClick={() => go("login")} className={linkButton}>
            ← Back to login
          </button>
        </form>
      )}

      {mode === "create" && (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <h2 className="font-serif text-2xl">Create the owner account</h2>
            <p className="mt-1 text-sm text-white/60">
              One-time setup for the website owner. It cannot be used to create
              any other account.
            </p>
          </div>

          <label className="block text-sm text-white/70">
            Owner email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={`${field} mt-1`}
            />
          </label>

          <label className="block text-sm text-white/70">
            Private setup code
            <input
              type="password"
              required
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Known only to the owner"
              className={`${field} mt-1`}
            />
          </label>

          <PasswordField
            label="Choose a password"
            value={password}
            onChange={setPassword}
            placeholder="At least 10 characters"
            autoComplete="new-password"
          />

          {password.length > 0 && (
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i <= strength ? strengthColors[strength] : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-white/50">
                {strengthLabels[strength]}
              </p>
            </div>
          )}

          <PasswordField
            label="Repeat password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Type it again"
            autoComplete="new-password"
          />

          <button type="submit" className={primary}>
            Create owner account
          </button>
          <button type="button" onClick={() => go("login")} className={linkButton}>
            ← Back to login
          </button>
        </form>
      )}

      {message && (
        <p
          className={`mt-5 rounded-lg border p-3 text-sm ${
            message.error
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-sky-400/40 bg-sky-500/10 text-sky-200"
          }`}
        >
          {message.text}
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