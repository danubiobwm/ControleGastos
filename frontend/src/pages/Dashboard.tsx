import { useEffect, useState } from "react";
import api from "../api/api";

export function Dashboard() {
  const [detalhes, setDetalhes] = useState<any[]>([]);
  const [totaisGerais, setTotaisGerais] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        console.log("Chamando API...");
        const response = await api.get("/pessoas/totais");

        const data = response.data;

        if (data) {
          setDetalhes(data.detalhesPorPessoa || []);
          setTotaisGerais({
            receitas: data.totalGeralReceitas || 0,
            despesas: data.totalGeralDespesas || 0,
            saldo: data.saldoLiquidoGeral || 0,
          });
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-white text-2xl font-bold">CARREGANDO...</div>
    );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
        Dashboard Financeiro
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border-l-8 border-sky-500 shadow-2xl">
          <p className="text-slate-400 text-xs font-black uppercase mb-2">
            Saldo Geral
          </p>
          <h2 className="text-3xl font-bold text-white">
            R$ {totaisGerais.saldo.toFixed(2)}
          </h2>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border-l-8 border-green-500 shadow-2xl">
          <p className="text-slate-400 text-xs font-black uppercase mb-2">
            Total Receitas
          </p>
          <h2 className="text-3xl font-bold text-green-400">
            R$ {totaisGerais.receitas.toFixed(2)}
          </h2>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border-l-8 border-red-500 shadow-2xl">
          <p className="text-slate-400 text-xs font-black uppercase mb-2">
            Total Despesas
          </p>
          <h2 className="text-3xl font-bold text-red-400">
            R$ {totaisGerais.despesas.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-white uppercase text-xs tracking-widest">
          Resumo por Pessoa
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Receitas</th>
              <th className="p-4">Despesas</th>
              <th className="p-4">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {detalhes.map((p: any, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-white font-medium">{p.nome}</td>
                <td className="p-4 text-green-400 font-semibold">
                  R$ {p.totalReceitas.toFixed(2)}
                </td>
                <td className="p-4 text-red-400 font-semibold">
                  R$ {p.totalDespesas.toFixed(2)}
                </td>
                <td className="p-4 text-slate-300 font-bold">
                  R$ {p.saldo.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
