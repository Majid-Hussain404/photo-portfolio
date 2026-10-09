"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";
import { site } from "./site";

export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data, error }) => {
        if (!error && data?.user && data.user.email?.toLowerCase() === site.email.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.user.email?.toLowerCase() === site.email.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      setLoading(false);
    }
  }, []);

  return { isOwner, loading };
}
