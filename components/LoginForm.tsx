"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "../lib/site";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

type Mode = "login" | "setup" | "forgot";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/10 text-white";
const primary =
  "w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white shadow-lg cursor-pointer";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState(site.email);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [pending, setPending] = useState(false);
  const configured = isSupabaseConfigured();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!configured) {
      setMessage("Owner sign-in is not configured yet. Check Supabase environment settings.");
      setIsError(true);
      return;
    }

    if (email.trim().toLowerCase() !== site.email.toLowerCase()) {
      setMessage(
        "Access Denied: Only the portfolio owner is authorized to log in. Visitors can freely explore the website without an account."
      );
      setIsError(true);
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage("Invalid email or password. If you need to set your password, click 'Set / Reset Owner Password' below.");
        setIsError(true);
        return;
      }

      if (data.user.email?.toLowerCase() !== site.email.toLowerCase()) {
        await supabase.auth.signOut();
        setMessage("Access Denied: Only the portfolio owner can access the admin panel.");
        setIsError(true);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Owner sign-in failed:", error);
      setMessage("Sign-in could not be completed. Please try again.");
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  async function handleDirectPasswordSetup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/owner-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          setupCode: setupCode.trim(),
          newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message || "Failed to configure password.");
        setIsError(true);
        return;
      }

      setMessage("Owner password configured successfully! You can now log in below.");
      setIsError(false);
      setPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setSetupCode("");
      setMode("login");
    } catch (error) {
      console.error("Owner password setup failed:", error);
      setMessage("Could not connect to the server. Please try again.");
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  async function handleEmailResetLink() {
    setMessage(null);
    setIsError(false);

    if (!configured) {
      setMessage("Supabase is not configured yet.");
      setIsError(true);
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(site.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=%2Flogin%2Freset`,
      });
      if (error) throw error;
      setMessage(`If configured, a reset link was sent to ${site.email}. You can also use the direct Setup Code tab above.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password reset email failed.";
      setMessage(`Email error: ${msg}. Tip: Use the 'Set / Reset Owner Password' tab with your private setup code for instant password setup.`);
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full">
      {!configured && (
        <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Supabase environment variables are missing. Add them to .env.local to enable login.
        </div>
      )}

      {/* Mode switcher */}
      <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setMessage(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs uppercase tracking-wider font-medium transition ${
            mode === "login"
              ? "bg-accent text-black shadow"
              : "text-white/60 hover:text-white"
          }`}
        >
          Owner Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("setup");
            setMessage(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs uppercase tracking-wider font-medium transition ${
            mode === "setup"
              ? "bg-accent text-black shadow"
              : "text-white/60 hover:text-white"
          }`}
        >
          Set / Reset Password
        </button>
      </div>

      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Owner Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="majidhussainmir239@gmail.com"
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Owner Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={field}
            />
          </div>

          <button
            type="submit"
            disabled={!configured || pending}
            className={`${primary} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pending ? "Signing in..." : "Enter Owner Panel"}
          </button>

          <button
            type="button"
            onClick={handleEmailResetLink}
            disabled={pending}
            className="w-full text-center text-xs uppercase tracking-widest text-white/40 hover:text-accent pt-2"
          >
            Forgot password? Send email reset link
          </button>
        </form>
      )}

      {mode === "setup" && (
        <form onSubmit={handleDirectPasswordSetup} className="space-y-4">
          <p className="text-xs text-white/60 leading-relaxed">
            Configure or change your owner password instantly using your private setup code (defined in your project configuration).
          </p>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Owner Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={site.email}
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Private Setup Code
            </label>
            <input
              type="password"
              required
              value={setupCode}
              onChange={(e) => setSetupCode(e.target.value)}
              placeholder="Enter your private setup code"
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className={field}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`${primary} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pending ? "Saving password..." : "Set Password & Proceed"}
          </button>
        </form>
      )}

      {message && (
        <div
          role="status"
          className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed ${
            isError
              ? "border-red-400/30 bg-red-500/10 text-red-200"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-8 border-t border-white/10 pt-6 text-center">
        <p className="text-xs text-white/40">
          Only the site owner ({site.email}) can log in.
        </p>
        <p className="mt-1 text-xs text-white/40">
          All other visitors can freely browse without credentials.
        </p>
      </div>
    </div>
  );
}