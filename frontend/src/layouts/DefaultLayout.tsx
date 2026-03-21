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
    <div className="flex h-screen w-full bg-brand-dark overflow-hidden">
      <aside className="w-64 bg-brand-card border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Wallet className="text-brand-accent" size={24} />
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">
            GastoResidencial
          </h1>
        </div>

        <nav className="flex-1 py-4">
          <Link
            to="/"
            className="flex items-center px-6 py-4 text-slate-400 hover:bg-brand-purple hover:text-white transition-all"
          >
            <LayoutDashboard className="mr-3" size={20} /> Dashboard
          </Link>
          <Link
            to="/pessoas"
            className="flex items-center px-6 py-4 text-slate-400 hover:bg-brand-purple hover:text-white transition-all"
          >
            <Users className="mr-3" size={20} /> Pessoas
          </Link>
          <Link
            to="/categorias"
            className="flex items-center px-6 py-4 text-slate-400 hover:bg-brand-purple hover:text-white transition-all"
          >
            <Tag className="mr-3" size={20} /> Categorias
          </Link>
          <Link
            to="/transacoes"
            className="flex items-center px-6 py-4 text-slate-400 hover:bg-brand-purple hover:text-white transition-all"
          >
            <ArrowRightLeft className="mr-3" size={20} /> Transações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
