"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "../lib/site";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/10";
const primary =
  "w-full rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50";

export default function ResetPasswordForm() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(
    configured ? null : "Password reset is not configured yet."
  );
  const [isError, setIsError] = useState(!configured);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (
        error ||
        data.user?.email?.toLowerCase() !== site.email.toLowerCase()
      ) {
        setMessage("This password reset link is invalid or has expired. Request a new one.");
        setIsError(true);
      } else {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [configured]);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 10) {
      setMessage("Use at least 10 characters for the new password.");
      setIsError(true);
      return;
    }

    setPending(true);
    setMessage(null);
    setIsError(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Password update failed:", error);
      setMessage("The password could not be updated. Request a new reset link and try again.");
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {ready && (
        <form onSubmit={updatePassword} className="space-y-4">
          <label className="block text-sm text-white/70">
            New password
            <input
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 10 characters"
              className={`${field} mt-1`}
            />
          </label>
          <button type="submit" disabled={pending} className={primary}>
            {pending ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
      {message && (
        <p
          role="status"
          className={`mt-5 rounded-lg border p-3 text-sm ${
            isError
              ? "border-red-400/40 bg-red-500/10 text-red-200"
              : "border-sky-400/40 bg-sky-500/10 text-sky-200"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
