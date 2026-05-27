import { Link, Outlet, useLocation } from "react-router-dom";
import { demoModeMessage } from "@/lib/demo-data";

const links = [
  { label: "Dashboard", href: "/app" },
  { label: "Documents", href: "/app/documents" },
  { label: "Businesses", href: "/app/businesses" },
  { label: "Activity", href: "/app/activity" },
  { label: "Settings", href: "/app/settings" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/app" className="text-lg font-semibold tracking-tight">File Cabinet</Link>
            <p className="text-xs text-zinc-400">Document management for multi-business teams</p>
          </div>
          <nav className="flex gap-5 overflow-x-auto text-sm">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className={location.pathname === link.href ? "text-white" : "text-zinc-400 hover:text-zinc-200"}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{demoModeMessage}</div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
