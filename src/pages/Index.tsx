import { Link } from "react-router-dom";

const features = [
  {
    title: "Multi-business document vault",
    description: "Keep each company isolated while managing everything from one workspace.",
  },
  {
    title: "Secure file organization",
    description: "Structure files with folders, controlled access patterns, and clear ownership.",
  },
  {
    title: "Categories, tags, search, and statuses",
    description: "Find what you need quickly with practical filters built for daily operations.",
  },
  {
    title: "Activity tracking",
    description: "See who uploaded, edited, or archived documents with clear timestamps.",
  },
  {
    title: "Future-ready permissions and workflows",
    description: "Built to support approvals, role controls, and compliance workflows in upcoming phases.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">File Cabinet</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Your business documents, organized by company.</h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">File Cabinet helps teams store, find, and manage files across multiple businesses without losing control of structure, visibility, or accountability.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/app" className="rounded-lg bg-white px-5 py-3 text-center font-medium text-zinc-900">Open Demo Dashboard</Link>
          <a href="#features" className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-medium text-zinc-100">View Features</a>
        </div>
      </div>

      <section id="features" className="border-t border-zinc-800">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-xl font-medium">{feature.title}</h2>
              <p className="mt-2 text-zinc-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
