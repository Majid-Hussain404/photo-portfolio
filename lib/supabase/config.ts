const DEFAULT_URL = "https://wpkerstuzvbtrqsjklpq.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_yAX567H6Tfgtujp9bMIxGg_eb3UNAdp";

export function isSupabaseConfigured() {
  return true;
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

  return { url, anonKey };
}
