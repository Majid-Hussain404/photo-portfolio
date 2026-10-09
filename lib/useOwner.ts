"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";
import { site } from "./site";

export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      // 1. First-party session check via /api/auth/me (reads owner_auth_session cookie)
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data.isOwner) {
            setIsOwner(true);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 2. Client-side cookie check
      try {
        if (typeof document !== "undefined" && document.cookie.includes("owner_auth_session=")) {
          if (active) {
            setIsOwner(true);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 3. Supabase client check
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.getUser();
          if (active) {
            if (!error && data?.user && data.user.email?.toLowerCase() === site.email.toLowerCase()) {
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          }
        } catch {
          if (active) setIsOwner(false);
        }
      } else {
        if (active) setIsOwner(false);
      }

      if (active) setLoading(false);
    }

    checkStatus();

    // 4. Supabase auth change listener
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) {
            if (session?.user && session.user.email?.toLowerCase() === site.email.toLowerCase()) {
              setIsOwner(true);
            }
          }
        });
        return () => {
          active = false;
          subscription.unsubscribe();
        };
      } catch {}
    }

    return () => {
      active = false;
    };
  }, []);

  return { isOwner, loading };
}
