import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Tag, ArrowRightLeft } from "lucide-react";

export function DefaultLayout() {
  return (
    <div className="flex h-screen bg-brand-dark-bg">
      <aside className="w-64 bg-brand-dark-card shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-brand-blue-accent flex items-center gap-2">
            <Tag className="w-6 h-6" /> GastoResidencial
          </h1>
        </div>

        <nav className="flex-1 mt-6">
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

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
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
      className="flex items-center px-6 py-3 text-gray-300 hover:bg-brand-purple-btn hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5 mr-3" />
      {text}
    </Link>
  );
}
