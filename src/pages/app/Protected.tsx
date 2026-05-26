import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/app/useAuth";
import { isSupabaseConfigured, SUPABASE_SETUP_ERROR } from "@/lib/supabase";

export default function Protected() {
  const { user, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12">
        <div className="max-w-xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Setup required</p>
          <h1 className="text-2xl font-semibold">This app environment is missing Supabase keys</h1>
          <p className="text-zinc-300 leading-relaxed">{SUPABASE_SETUP_ERROR}</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!user) return <Navigate to="/app/auth" replace />;
  return <Outlet />;
}
