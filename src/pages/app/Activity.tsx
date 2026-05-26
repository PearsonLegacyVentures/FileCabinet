import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity } from "@/lib/types";

export default function Activity(){
  const [rows, setRows] = useState<Activity[]>([]);
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");

  async function load(){
    let q = supabase.from("document_activity").select("*").order("created_at", { ascending: false }).limit(100);
    if (action) q = q.eq("action", action);
    if (search) q = q.ilike("description", `%${search}%`);
    const { data } = await q;
    setRows((data ?? []) as Activity[]);
  }

  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Activity</h1>
    <div className="grid gap-3 md:grid-cols-4">
      <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder="Search logs" value={search} onChange={e=>setSearch(e.target.value)} />
      <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder="Action (ex: document_shared)" value={action} onChange={e=>setAction(e.target.value)} />
      <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      <button className="bg-white text-zinc-900 rounded px-3 py-2" onClick={load}>Load Activity</button>
    </div>
    <div className="space-y-2">{rows.map(r=><div key={r.id} className="border border-zinc-800 rounded p-3"><p className="font-medium">{r.description}</p><p className="text-xs text-zinc-500">{r.action} • {new Date(r.created_at).toLocaleString()}</p></div>)}{!rows.length&&<p className="text-zinc-500">No activity loaded yet.</p>}</div>
  </div>;
}
