import { activity, businesses, documents, workspace } from "@/lib/demo-data";

export default function Dashboard() {
  const needingReview = documents.filter((d) => d.status === "Needs Review" || d.status === "In Review").length;
  return <div className="space-y-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div><p className="text-sm text-zinc-400">Workspace</p><h1 className="text-3xl font-semibold">{workspace.name}</h1></div>
      <div className="flex gap-3"><select className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"><option>All Businesses</option>{businesses.map(b=><option key={b.id}>{b.name}</option>)}</select><button className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-300" title="Supabase required" disabled>Upload Document</button></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
      ["Total Documents", documents.length],
      ["Total Businesses", businesses.length],
      ["Needing Review", needingReview],
      ["Recent Uploads", 3],
    ].map(([label,val])=><div key={String(label)} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"><p className="text-sm text-zinc-400">{label}</p><p className="mt-2 text-2xl font-semibold">{val}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"><h2 className="font-medium">Documents by Category</h2><ul className="mt-3 space-y-2 text-sm text-zinc-300"><li>Compliance · 1</li><li>HR · 1</li><li>Legal · 1</li><li>Operations · 1</li></ul></section>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"><h2 className="font-medium">Recent Uploads</h2><ul className="mt-3 space-y-2 text-sm">{documents.slice(0,3).map(d=><li key={d.id} className="flex justify-between"><span>{d.title}</span><span className="text-zinc-400">{d.uploadedAt}</span></li>)}</ul></section>
    </div>
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"><h2 className="font-medium">Recent Activity</h2><ul className="mt-3 space-y-2 text-sm">{activity.map(a=><li key={a.id} className="flex flex-col md:flex-row md:justify-between"><span>{a.action} · {a.document}</span><span className="text-zinc-400">{a.timestamp}</span></li>)}</ul></section>
  </div>;
}
