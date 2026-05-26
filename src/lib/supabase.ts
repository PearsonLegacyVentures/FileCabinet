import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[Supabase] Missing Cloudflare Pages environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. Public pages will render, but /app routes require these variables.",
  );
}

const fallbackUrl = "https://placeholder.supabase.co";
const fallbackAnonKey = "placeholder-anon-key";

export const supabase = createClient(
  supabaseUrl ?? fallbackUrl,
  supabaseAnonKey ?? fallbackAnonKey,
  {
    auth: { persistSession: true, autoRefreshToken: true },
  },
);

export const SUPABASE_SETUP_ERROR =
  "Supabase is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages environment variables, then redeploy.";

export const PRIVATE_BUCKET = "vault-documents";
