import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { Pessoas } from "./pages/Pessoas";
import "./index.css";

const Dashboard = () => (
  <div className="text-gray-100">
    Dashboard Financeiro (Carregando totais...)
  </div>
);
const Categorias = () => (
  <div className="text-gray-100">Página de Categorias</div>
);
const Transacoes = () => (
  <div className="text-gray-100">Página de Transações</div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<Transacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
