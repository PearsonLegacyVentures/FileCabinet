import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { WorkspaceMember, WorkspaceRole } from "@/lib/types";

const roles: WorkspaceRole[] = ["owner", "admin", "manager", "viewer", "external"];

export default function Settings(){
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("viewer");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  async function loadMembers(){
    const { data } = await supabase.from("workspace_members").select("*").order("created_at", { ascending: false }).limit(50);
    setMembers((data ?? []) as WorkspaceMember[]);
  }

  async function invite(){
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user?.id || !email) return;
    const { data: ws } = await supabase.from("workspaces").select("id").limit(1).single();
    if (!ws?.id) return;
    await supabase.from("workspace_members").insert({ workspace_id: ws.id, invited_email: email.toLowerCase(), role, status: "invited", invited_by: auth.user.id });
    setEmail("");
    await loadMembers();
  }

  return <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Settings</h1>
    <div className="grid gap-4 md:grid-cols-5 text-sm">
      {['Workspace','Members','Permissions','Businesses','Security'].map(s => <div key={s} className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">{s}</div>)}
    </div>
    <section className="rounded-xl border border-zinc-800 p-4 space-y-3">
      <h2 className="text-lg font-medium">Members</h2>
      <div className="grid gap-3 md:grid-cols-4">
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder="Invite by email" value={email} onChange={e=>setEmail(e.target.value)} />
        <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value as WorkspaceRole)}>{roles.map(r=><option key={r}>{r}</option>)}</select>
        <button onClick={invite} className="bg-white text-zinc-900 rounded px-3 py-2">Invite Member</button>
        <button onClick={loadMembers} className="border border-zinc-700 rounded px-3 py-2">Refresh</button>
      </div>
      <div className="space-y-2">
        {members.map(m => <div key={m.id} className="border border-zinc-800 rounded p-3 flex items-center justify-between"><div><p className="font-medium">{m.invited_email}</p><p className="text-xs text-zinc-500">{m.status}</p></div><span className="text-xs uppercase bg-zinc-800 px-2 py-1 rounded">{m.role}</span></div>)}
        {!members.length && <p className="text-zinc-500">No members yet. Invite people to start assigning business access.</p>}
      </div>
    </section>
  </div>;
}
