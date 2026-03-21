import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saídas: 0, total: 0 });

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransacoes(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 text-slate-900">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span>Entradas</span>
            <ArrowUpCircle className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold">R$ 1.700,00</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-red-500 text-slate-900">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span>Saídas</span>
            <ArrowDownCircle className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold">R$ 700,00</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-brand-accent text-slate-900">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span>Total</span>
            <span className="font-bold">$</span>
          </div>
          <h3 className="text-2xl font-bold">R$ 1.000,00</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden text-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-bold">Descrição</th>
              <th className="p-4 font-bold">Valor</th>
              <th className="p-4 font-bold">Tipo</th>
              <th className="p-4 font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transacoes.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4">{t.descricao}</td>
                <td className="p-4">R$ {t.valor.toFixed(2)}</td>
                <td className="p-4">
                  {t.tipo === "receita" ? (
                    <ArrowUpCircle className="text-green-500" size={20} />
                  ) : (
                    <ArrowDownCircle className="text-red-500" size={20} />
                  )}
                </td>
                <td className="p-4">
                  <button className="text-slate-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
