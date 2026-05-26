import { Link, Outlet, useLocation } from "react-router-dom";
import { navItems } from "@/features/app/constants";

export default function AppLayout() {
  const location = useLocation();
  const links = navItems.map((n) => ({ label: n, href: `/app/${n.toLowerCase()}`.replace("/app/dashboard", "/app") }));
  return <div className="min-h-screen bg-zinc-950 text-zinc-100"><header className="border-b border-zinc-800"><div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-6"><Link to="/app" className="font-semibold">FileCabinet Vault</Link><nav className="flex gap-4 overflow-auto">{links.map(l=><Link key={l.href} to={l.href} className={location.pathname===l.href?"text-white":"text-zinc-400"}>{l.label}</Link>)}</nav></div></header><main className="mx-auto max-w-7xl px-4 py-6"><Outlet/></main></div>;
}
