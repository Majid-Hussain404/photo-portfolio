"use client";

import { useState } from "react";
import { site } from "../../lib/site";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10";

export default function PasswordChanger() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ text: "Password must be at least 8 characters.", error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", error: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed.");

      setMessage({ text: "Owner password changed successfully!", error: false });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setMessage({ text: msg, error: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
    >
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-serif text-xl text-white">Owner Security</h3>
        <p className="mt-1 text-xs text-white/50">
          Account email: <strong className="text-white">{site.email}</strong>
        </p>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
          New Password
        </label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min 8 characters"
          className={field}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          className={field}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

      {message && (
        <div
          role="status"
          className={`rounded-xl border p-3 text-xs leading-relaxed ${
            message.error
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
