"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "../lib/site";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

type Mode = "login" | "setup";

const field =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/10";
const primary =
  "w-full rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition hover:scale-[1.02] hover:bg-white";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setMessage("Owner sign-in is not configured yet. Add the Supabase settings to the site environment.");
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
        setMessage("Email or password is incorrect.");
        setIsError(true);
        return;
      }

      if (data.user.email?.toLowerCase() !== site.email.toLowerCase()) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          throw signOutError;
        }
        setMessage("This account is not authorized to access the owner area.");
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

  async function handleForgotPassword() {
    setMessage(null);
    setIsError(false);
    if (!configured) {
      setMessage("Password reset is not configured yet.");
      setIsError(true);
      return;
    }

    if (email.trim().toLowerCase() !== site.email.toLowerCase()) {
      setMessage(`Enter the owner email address (${site.email}) to request a reset.`);
      setIsError(true);
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        site.email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=%2Flogin%2Freset`,
        }
      );
      if (error) {
        throw error;
      }
      setMessage("If the owner account exists, a password reset link has been sent to its email.");
    } catch (error) {
      console.error("Password reset request failed:", error);
      setMessage("The password reset email could not be sent. Please try again.");
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  async function handleOwnerSetup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);
    setPending(true);

    try {
      const response = await fetch("/api/auth/owner-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), setupCode }),
      });
      const result: { message: string } = await response.json();
      if (!response.ok) {
        setMessage(result.message);
        setIsError(true);
        return;
      }
      setMessage(result.message);
      setSetupCode("");
      setMode("login");
    } catch (error) {
      console.error("Owner account setup request failed:", error);
      setMessage("The owner setup request could not be completed. Please try again.");
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {!configured && (
        <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          Owner sign-in needs Supabase project settings before it can be used.
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
              placeholder="Owner email"
              className={`${field} mt-1`}
            />
          </label>
          <label className="block text-sm text-white/70">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={`${field} mt-1`}
            />
          </label>
          <button
            type="submit"
            disabled={!configured || pending}
            className={`${primary} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {pending ? "Please wait..." : "Log in"}
          </button>
          <button
            type="button"
            disabled={!configured || pending}
            onClick={handleForgotPassword}
            className="block w-full text-center text-sm text-white/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Forgot password? Send reset link to owner email
          </button>
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setIsError(false);
                setMode("setup");
              }}
              className="block w-full text-center text-sm text-white/60 hover:text-accent"
            >
              First time? Set up the owner account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOwnerSetup} className="space-y-4">
          <p className="text-sm text-white/70">
            One-time setup for {site.email}. A secure invitation will be sent
            to the owner email so you can choose your password.
          </p>
          <label className="block text-sm text-white/70">
            Owner email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={site.email}
              className={`${field} mt-1`}
            />
          </label>
          <label className="block text-sm text-white/70">
            Private setup code
            <input
              type="password"
              required
              autoComplete="off"
              value={setupCode}
              onChange={(event) => setSetupCode(event.target.value)}
              placeholder="Enter the code from your private setup"
              className={`${field} mt-1`}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className={`${primary} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {pending ? "Sending invitation..." : "Send owner invitation"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setIsError(false);
              setMode("login");
            }}
            className="block w-full text-center text-sm text-white/60 hover:text-accent"
          >
            ← Back to login
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