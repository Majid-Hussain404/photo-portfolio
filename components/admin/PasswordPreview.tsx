"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition focus:border-accent";

export default function PasswordPreview() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(
    null
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 10) {
      setStatus({ text: "Use at least 10 characters.", error: true });
    } else if (next !== confirm) {
      setStatus({ text: "The new passwords do not match.", error: true });
    } else if (next === current) {
      setStatus({
        text: "The new password must be different from the current one.",
        error: true,
      });
    } else {
      setStatus({
        text: "Design preview only: the checks passed, but nothing was changed. Real password change comes in the next step.",
        error: false,
      });
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="font-serif text-2xl">Change password</h3>
      <input
        type="password"
        required
        autoComplete="current-password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder="Current password"
        className={field}
      />
      <input
        type="password"
        required
        autoComplete="new-password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        placeholder="New password (10+ characters)"
        className={field}
      />
      <input
        type="password"
        required
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repeat new password"
        className={field}
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:bg-white"
      >
        Change password
      </button>
      {status && (
        <p
          className={`rounded-lg border p-3 text-sm ${
            status.error
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-sky-400/40 bg-sky-500/10 text-sky-200"
          }`}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}