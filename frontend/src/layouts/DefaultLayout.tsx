import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Tag,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";

export function DefaultLayout() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Wallet className="text-sky-400" size={28} />
          <span className="font-bold text-xl tracking-tighter">
            GASTO RESIDENCIAL
          </span>
        </div>
        <nav className="flex-1 py-6">
          <NavLink
            to="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavLink to="/pessoas" icon={<Users size={20} />} label="Pessoas" />
          <NavLink
            to="/categorias"
            icon={<Tag size={20} />}
            label="Categorias"
          />
          <NavLink
            to="/transacoes"
            icon={<ArrowRightLeft size={20} />}
            label="Transações"
          />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="text-slate-400 font-medium">Bem-vindo ao Sistema</div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#0f172a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }: any) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 border-l-4 border-transparent hover:border-sky-400 transition-all"
    >
      {icon} <span className="font-medium">{label}</span>
    </Link>
  );
}
