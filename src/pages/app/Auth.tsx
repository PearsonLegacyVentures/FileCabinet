import { useState } from "react";
import { isSupabaseConfigured, SUPABASE_SETUP_ERROR, supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-100 px-4">
      <form
        className="w-full max-w-sm space-y-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isSupabaseConfigured) return;
          await supabase.auth.signInWithPassword({ email, password });
        }}
      >
        <h1 className="text-xl font-semibold">Sign in</h1>
        {!isSupabaseConfigured && (
          <p className="text-sm text-amber-300 leading-relaxed">{SUPABASE_SETUP_ERROR}</p>
        )}
        <input className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button disabled={!isSupabaseConfigured} className="w-full bg-white text-zinc-900 rounded px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed">Sign in</button>
        <button type="button" disabled={!isSupabaseConfigured} onClick={()=>supabase.auth.signUp({email,password})} className="w-full border border-zinc-700 rounded px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed">Create account</button>
      </form>
    </div>
  );
}
