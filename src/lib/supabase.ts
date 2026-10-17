import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = Boolean(url && anonKey && !url.includes("YOUR_PROJECT") && !anonKey.includes("YOUR_SUPABASE"));
export const supabase = createClient(
  url || "https://example.supabase.co",
  anonKey || "example-anon-key",
);
