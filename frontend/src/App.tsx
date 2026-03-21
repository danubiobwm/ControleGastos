import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Pessoas } from "./pages/Pessoas";
import { Categorias } from "./pages/Categorias";
import { Transacoes } from "./pages/Transacoes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout title="Sistema Financeiro" />}>
          <Route index element={<Dashboard />} />
          <Route path="pessoas" element={<Pessoas />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="transacoes" element={<Transacoes />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
