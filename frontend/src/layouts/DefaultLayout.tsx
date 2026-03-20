import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Tag,
  ArrowRightLeft,
  Target,
} from "lucide-react";

export function DefaultLayout() {
  return (
    <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden">
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-brand-blue-accent p-2 rounded-lg text-white">
            <Target size={20} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            GastoResidencial
          </h1>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          <SidebarLink to="/" icon={LayoutDashboard} text="Dashboard" />
          <SidebarLink to="/pessoas" icon={Users} text="Pessoas" />
          <SidebarLink to="/categorias" icon={Tag} text="Categorias" />
          <SidebarLink
            to="/transacoes"
            icon={ArrowRightLeft}
            text="Transações"
          />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  text: string;
}

function SidebarLink({ to, icon: Icon, text }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-6 py-3.5 text-slate-400 hover:bg-slate-800 hover:text-white group border-l-4 border-transparent hover:border-purple-600 transition-all duration-200"
    >
      <Icon className="w-5 h-5 group-hover:text-purple-400" />
      <span className="font-medium">{text}</span>
    </Link>
  );
}
